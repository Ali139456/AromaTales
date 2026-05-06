import express from 'express';
import { requireAuth, getProfile } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  try {
    const profile = await getProfile(req.user.id);
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email
      },
      profile: profile || { id: req.user.id, full_name: '', role: 'user' }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
