import supabase from '../config/supabase.js';
import crypto from 'crypto';
import {broadcastNewDrop} from '../services/notificationService.js';

export const createDrop = async (req, res) => {

  
  try {
    const { title, quantity, expiry_hours, image_url } = req.body;
    const donor_id = req.user.id;    
    const bName = req.user.business_name || "A Local Business";
    const qty = quantity || "Multiple items"; 
    const dropTitle = title || "Surplus Food Drop";

    const otp = crypto.randomInt(1000, 9999).toString();
    const expiry_time = new Date();
    expiry_time.setHours(expiry_time.getHours() + parseInt(expiry_hours || 0));
    const isoExpiry = expiry_time.toISOString();

    const payload = {
      donor_id,
      title: dropTitle,
      quantity: qty,
      expiry_time: isoExpiry,
      image_url,
      pickup_code: otp,
      status: 'AVAILABLE'
    };
    


    const { data, error } = await supabase
      .from('drops')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("SUPABASE DATABASE ERROR:", error.message);
      throw error;
    }



    broadcastNewDrop(dropTitle, bName, qty)
      .then(() => console.log("Broadcast process finished successfully."))
      .catch((err) => console.error("BROADCAST FUNCTION CRASHED:", err.message));

    res.status(201).json({
      success: true,
      message: "Drop created successfully",
      drop: data
    });

  } catch (error) {
    console.error("CRITICAL CONTROLLER ERROR:", error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {

  }
};

export const getDonorStats = async (req, res) => {

  res.status(200).json({ message: "Stats endpoint placeholder" });
};

export const updateStoreLocation = async (req, res) => {
  const { lat, lng } = req.body;
  const donor_id = req.user.id;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ lat, lng })
      .eq('id', donor_id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ 
      success: true, 
      message: "Store location updated successfully",
      profile: data 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};