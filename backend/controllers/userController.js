import pool from '../config/database.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT id, email, username, created_at, is_premium, premium_expires_at, earnings FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.created_at,
        isPremium: user.is_premium,
        premiumExpiresAt: user.premium_expires_at,
        earnings: user.earnings,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Check if username is already taken by another user
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 AND id != $2',
      [username, userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Update username
    const result = await pool.query(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, email, username, is_premium, premium_expires_at, earnings',
      [username, userId]
    );

    const user = result.rows[0];

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isPremium: user.is_premium,
        premiumExpiresAt: user.premium_expires_at,
        earnings: user.earnings,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};
