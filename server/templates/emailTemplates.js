export const getNewDropEmailTemplate = (dropTitle, businessName, quantity) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; border-radius: 24px; overflow: hidden; }
        .header { background-color: #16a34a; padding: 40px 20px; text-align: center; color: white; }
        .content { padding: 40px; text-align: center; color: #334155; }
        .badge { background: #f0fdf4; color: #16a34a; padding: 6px 12px; border-radius: 99px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .title { font-size: 28px; font-weight: 900; margin: 20px 0; color: #0f172a; }
        .button { background-color: #0f172a; color: white !important; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0; font-weight: 900; letter-spacing: -1px;">ClaimDrop</h1>
        </div>
        <div class="content">
          <span class="badge">New Surplus Available</span>
          <h2 class="title">${dropTitle}</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            <b>${businessName}</b> has just posted a new surplus drop of <b>${quantity}</b>. 
            Help us bridge the last mile and ensure this food doesn't go to waste.
          </p>
          <a href="${process.env.CLIENT_URL}/dashboard" class="button">Claim This Mission →</a>
        </div>
        <div class="footer">
          <p>You received this because you are a verified Volunteer or Organization on the ClaimDrop Network.</p>
          <p>© 2026 ClaimDrop | Zero Food Waste Infrastructure</p>
        </div>
      </div>
    </body>
    </html>
  `;
};