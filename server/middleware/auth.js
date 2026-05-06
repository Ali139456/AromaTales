import supabase, { isSupabaseEnabled } from '../config/supabase.js';

export const getProfile = async (userId) => {
  if (!isSupabaseEnabled() || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

const bearerToken = (req) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7).trim();
};

export const optionalAuth = async (req, res, next) => {
  req.user = null;
  if (!isSupabaseEnabled()) return next();
  const token = bearerToken(req);
  if (!token) return next();
  const { data, error } = await supabase.auth.getUser(token);
  if (!error && data?.user) req.user = data.user;
  next();
};

export const requireAuth = async (req, res, next) => {
  if (!isSupabaseEnabled()) {
    return res.status(503).json({ message: 'Authentication not available' });
  }
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ message: 'Sign in required' });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
  req.user = data.user;
  next();
};

export const requireAdmin = async (req, res, next) => {
  if (!isSupabaseEnabled()) {
    return res.status(503).json({ message: 'Authentication not available' });
  }
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ message: 'Sign in required' });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
  req.user = data.user;
  try {
    const profile = await getProfile(req.user.id);
    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }
    req.profile = profile;
    next();
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
