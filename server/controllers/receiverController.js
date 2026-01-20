import supabase from '../config/supabase.js';

export const getAvailableDrops = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('drops')
      .select(`
        *,
        profiles:donor_id (business_name, address)
      `)
      .eq('status', 'AVAILABLE')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Flattening the response for easier frontend consumption
    const formattedData = data.map(drop => ({
      ...drop,
      business_name: drop.profiles?.business_name || 'Verified Store',
      address: drop.profiles?.address || 'Location provided upon claim'
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
    // 1. EXECUTE THE ACTION: Call the RPC to lock the drop
    const { error: rpcError } = await supabase.rpc('claim_drop', {
      p_drop_id: drop_id,
      p_claimer_id: claimer_id
    });

    if (rpcError) throw new Error(rpcError.message);

    // 2. FETCH THE DATA: Now perform a standard select on the 'drops' table
    // PostgREST knows the relationship between 'drops' and 'profiles'
    const { data: dropData, error: fetchError } = await supabase
      .from('drops')
      .select(`
        *,
        profiles:donor_id (
          business_name,
          address,
          phone
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

export const verifyOTP = async (req, res) => {
  const { drop_id, otp } = req.body;

  try {
    const { data: drop, error: fetchError } = await supabase
      .from('drops')
      .select('pickup_code, status')
      .eq('id', drop_id)
      .single();

    if (fetchError || !drop) {
      return res.status(404).json({ success: false, error: "Resource not found." });
    }

    if (drop.status === 'COMPLETED') {
      return res.status(400).json({ success: false, error: "This handover is already complete." });
    }

    if (drop.pickup_code !== otp) {
      return res.status(401).json({ success: false, error: "Invalid verification code." });
    }

    const { error: updateError } = await supabase
      .from('drops')
      .update({ status: 'COMPLETED' })
      .eq('id', drop_id);

    if (updateError) throw updateError;

    res.status(200).json({ 
      success: true, 
      message: "Handover verified successfully!" 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};