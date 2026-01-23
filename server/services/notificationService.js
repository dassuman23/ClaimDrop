import supabase from '../config/supabase.js';
import { sendEmail, sendSMS } from './notificationProviders.js'; 
import { getNewDropEmailTemplate } from '../templates/emailTemplates.js';

export const broadcastNewDrop = async (title, businessName, quantity) => {

  try {

    const { data: receivers, error } = await supabase
      .from('profiles')
      .select('email')
      .in('role', ['CLAIMER', 'VOLUNTEER']);

    if (error) {
      console.error("BROADCAST DB ERROR:", error.message);
      return;
    }

    if (!receivers || receivers.length === 0) {
      console.warn("BROADCAST ABORTED: No users found with roles CLAIMER or VOLUNTEER in the database.");
      return;
    }

    const emailList = receivers.map(r => r.email);


    const htmlContent = getNewDropEmailTemplate(title, businessName, quantity);
    
    if (!htmlContent) {
      console.error("TEMPLATE ERROR: getNewDropEmailTemplate returned empty content.");
      return;
    }



    const result = await sendEmail(
      emailList, 
      `🚨 Urgent: New Drop from ${businessName}`,
      `New Food Available: ${title}`, 
      htmlContent
    );



  } catch (err) {
    console.error("BROADCAST SERVICE CRITICAL FAILURE:", err);
  } finally {

  }
};


export const notifyDonorOfClaim = async (donorProfile, dropTitle) => {
  
  const settings = donorProfile.notification_settings || { email: true, sms: false };
  const message = `Your drop "${dropTitle}" has been claimed and a rider is on the way!`;



  try {
    // Email Check
    if (settings.email && donorProfile.email) {

      const emailRes = await sendEmail(donorProfile.email, "Drop Claimed!", message);

    } else {

    }

    // SMS Check
    if (settings.sms && donorProfile.phone) {

      const smsRes = await sendSMS(donorProfile.phone, `ClaimDrop: ${message}`);

    } else {

    }
  } catch (err) {
    console.error("DONOR ALERT CRITICAL FAILURE:", err);
  } finally {

  }
};