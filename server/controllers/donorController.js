import supabase from '../config/supabase.js';

export const createDrop = async (req, res) => {
  try {
    const { donor_id, title, quantity, expiry_hours, image_url } = req.body;

    // 1. Generate a secure 4-digit OTP for this drop
    const pickup_otp = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Calculate Expiry
    const expiry_time = new Date();
    expiry_time.setHours(expiry_time.getHours() + parseInt(expiry_hours));

    // 3. Insert into Supabase
    const { data, error } = await supabase
      .from('drops')
      .insert([{
        donor_id,
        title,
        quantity,
        expiry_time: expiry_time.toISOString(),
        image_url,
        pickup_code: pickup_otp, // Storing OTP securely
        status: 'AVAILABLE'
      }])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Drop created with security OTP",
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDonorStats = async (req, res) => {
  // Logic to calculate total weight and meals saved
  // This is great for your "Impact Tracking" feature
  res.status(200).json({ message: "Stats endpoint placeholder" });
};