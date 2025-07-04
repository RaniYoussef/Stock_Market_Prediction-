import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import avatar from '../assets/avatar.jpeg';
import '../styles/Profile.css';
import { FaEdit, FaSave } from 'react-icons/fa';

const Profile = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const profileGetURL = 'http://localhost:3000/api/v1/profile';
  const profileUpdateURL = 'http://localhost:3000/api/v1/auth/update_profile';

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(profileGetURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          setFormData(data.user);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('jwt');

    try {
      const response = await fetch(profileUpdateURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to update user data');

      const updatedData = await response.json();
      alert('Profile updated successfully!');
      setUser(updatedData.user || formData);
      setFormData(updatedData.user || formData);
      setEditMode(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');

    try {
      const response = await fetch(profileUpdateURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: {
            password: password
          }
        }),
      });

      if (!response.ok) throw new Error('Password update failed');

      alert('Password updated successfully!');
      setPassword('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <Header 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)} 
      />
      <main className="profile-page">
        {loading ? (
          <p>Loading profile...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <section className="profile-header">
              <img src={avatar} alt="Profile Avatar" className="profile-avatar" />
              <h2 className="profile-username">
                @{`${user.first_name || ''}${user.last_name || ''}`.toLowerCase()}
              </h2>
              <p className="profile-role">Demo Account</p>
            </section>

            <section className="profile-section">
              <div className="profile-header-row">
                <h3>Account Information</h3>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="icon-btn"
                    title="Edit Info"
                  >
                    <FaEdit />
                  </button>
                ) : (
                  <button
                    onClick={handleSaveChanges}
                    className="icon-btn"
                    title="Save Changes"
                  >
                    <FaSave />
                  </button>
                )}
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-field">
                  <label>First Name</label>
                  {editMode ? (
                    <input
                      name="first_name"
                      value={formData.first_name || ''}
                      onChange={handleFieldChange}
                    />
                  ) : (
                    <span>{user.first_name}</span>
                  )}
                </div>

                <div className="profile-info-field">
                  <label>Last Name</label>
                  {editMode ? (
                    <input
                      name="last_name"
                      value={formData.last_name || ''}
                      onChange={handleFieldChange}
                    />
                  ) : (
                    <span>{user.last_name}</span>
                  )}
                </div>

                <div className="profile-info-field">
                  <label>Phone</label>
                  {editMode ? (
                    <input
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleFieldChange}
                    />
                  ) : (
                    <span>{user.phone}</span>
                  )}
                </div>

                <div className="profile-info-field">
                  <label>Email</label>
                  {editMode ? (
                    <input
                      name="email"
                      value={formData.email || ''}
                      onChange={handleFieldChange}
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>

                <div className="profile-info-field full-width">
                  <label>Demo Balance</label>
                  <span>
                    {user.balance
                      ? parseInt(user.balance).toLocaleString() + ' EGP'
                      : 'Not available'}
                  </span>
                </div>
              </div>
            </section>

            <section className="profile-section">
              <h3>Security</h3>
              <form onSubmit={handlePasswordUpdate} className="password-form">
                <label>Update Password</label>
                <div className="password-input-row">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <button type="submit" className="submit-btn">Update</button>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
