import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const Profile = () => {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setUsername(user.username);
    }
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await api.updateProfile(token, username);

      if (data.error) {
        setError(data.error);
      } else {
        updateUser(data.user);
        setSuccess('Profile updated successfully!');
        setEditing(false);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToPremium = async () => {
    try {
      // For now, we'll use a placeholder price ID
      // You'll need to create this in your Stripe dashboard
      const priceId = 'price_placeholder';
      const data = await api.createCheckoutSession(token, priceId);

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('Failed to start checkout process');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-poker-blue-400 mb-8">Profile</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-poker-blue-500 text-white p-3 rounded-md mb-4">
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Account Information */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-poker-blue-400">
              Account Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Email
                </label>
                <p className="text-white">{user.email}</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Username
                </label>
                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-poker-blue-400 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-poker-blue-600 hover:bg-poker-blue-700 px-4 py-2 rounded-md transition disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setUsername(user.username);
                        }}
                        className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-md transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-white">{user.username}</p>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-poker-blue-400 hover:text-poker-blue-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Member Since
                </label>
                <p className="text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Premium Status */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-poker-blue-400">
              Premium Status
            </h2>

            {user.isPremium ? (
              <div className="space-y-4">
                <div className="bg-poker-blue-900 border border-poker-blue-600 rounded-md p-4">
                  <p className="text-poker-blue-400 font-bold mb-2">
                    ✓ Premium Member
                  </p>
                  <p className="text-gray-300 text-sm">
                    You have access to all premium features
                  </p>
                  {user.premiumExpiresAt && (
                    <p className="text-gray-400 text-xs mt-2">
                      Renews on:{' '}
                      {new Date(user.premiumExpiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-md p-4">
                  <p className="text-gray-300 mb-4">
                    Upgrade to Premium to unlock:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400 mb-4">
                    <li>✓ Advanced training exercises</li>
                    <li>✓ Unlimited game sessions</li>
                    <li>✓ Detailed analytics and insights</li>
                    <li>✓ Priority support</li>
                  </ul>
                  <button
                    onClick={handleUpgradeToPremium}
                    className="w-full bg-poker-blue-600 hover:bg-poker-blue-700 px-4 py-2 rounded-md font-semibold transition"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-gray-800 rounded-lg p-6 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-poker-blue-400">
              Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-md p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-poker-blue-400">
                  ${user.earnings || '0.00'}
                </p>
              </div>
              <div className="bg-gray-700 rounded-md p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Games Played</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <div className="bg-gray-700 rounded-md p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                <p className="text-2xl font-bold text-white">0%</p>
              </div>
              <div className="bg-gray-700 rounded-md p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Rank</p>
                <p className="text-2xl font-bold text-white">-</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4 text-center">
              Play games to see your statistics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
