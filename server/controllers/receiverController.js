import supabase from '../config/supabase.js';

export const getAvailableDrops = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('drops')
      .select(`
        *,
        profiles:donor_id (
          business_name, 
          address,
          lat,
          lng
        )
      `)
      .eq('status', 'AVAILABLE')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedData = data.map(drop => ({
      ...drop,
      business_name: drop.profiles?.business_name || 'Verified Store',
      address: drop.profiles?.address || 'Location provided upon claim',
      lat: drop.profiles?.lat,
      lng: drop.profiles?.lng
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const claimDrop = async (req, res) => {
  const { drop_id } = req.body;
  const claimer_id = req.user?.id;

  if (!claimer_id) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const { error: rpcError } = await supabase.rpc('claim_drop', {
      p_drop_id: drop_id,
      p_claimer_id: claimer_id
    });

    if (rpcError) throw new Error(rpcError.message);

    const { data: dropData, error: fetchError } = await supabase
      .from('drops')
      .select(`
        *,
        profiles:donor_id (
          business_name,
          address,
          phone,
          lat,
          lng
        )
      `)
      .eq('id', drop_id)
      .single();

    if (fetchError || !dropData) {
      throw new Error("Drop claimed, but failed to fetch details.");
    }

    res.status(200).json({ 
      success: true, 
      message: "Drop claimed successfully!",
      drop: dropData 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


export const verifyPickup = async (req, res) => {
  const { drop_id, otp } = req.body;
  const claimer_id = req.user?.id;

  if (!claimer_id) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  try {
    const { data: drop, error: fetchError } = await supabase
      .from('drops')
      .select('pickup_code, status, claimer_id')
      .eq('id', drop_id)
      .single();

    if (fetchError || !drop) {
      return res.status(404).json({ success: false, error: "Drop not found." });
    }

    if (drop.pickup_code !== otp) {
      return res.status(401).json({ success: false, error: "Invalid verification code." });
    }

    if (drop.claimer_id !== claimer_id) {
      return res.status(403).json({ success: false, error: "Unauthorized receiver mismatch." });
    }

    const { error: updateError } = await supabase
      .from('drops')
      .update({ status: 'COMPLETED' })
      .eq('id', drop_id);

    if (updateError) throw updateError;

    return res.status(200).json({ 
      success: true, 
      message: "Handover verified successfully!" 
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getImpactStats = async (req, res) => {
  const userId = req.user?.id;

  try {
    const { data, error } = await supabase
      .from('drops')
      .select('quantity')
      .eq('claimer_id', userId)
      .eq('status', 'COMPLETED');

    if (error) throw error;

    const totalDrops = data.length;
    const stats = {
      totalDrops,
      mealsSaved: totalDrops * 5,
      co2Saved: (totalDrops * 1.5).toFixed(1),
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};