import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Supabase with the Service Role Key for server-side operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const checkAuth = async (req, res, next) => {
  try {
    // 1. Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    // 3. Attach the user object to the request
    // This allows your controllers to access req.user.id safely
    req.user = user;

    // 4. (Optional) Verification of Role from DB
    // We can also check if the user is actually a 'CLAIMER' or 'DONOR' here
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile) {
      req.user.role = profile.role;
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: "Authentication internal error" });
  }
};