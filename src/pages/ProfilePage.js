import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await userService.getProfile();
        setProfile(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Profile not found or you are not logged in.</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        {profile.picture && (
          <img src={profile.picture} alt={profile.username} className="profile-avatar" />
        )}
        <h2>{profile.username}</h2>
        <p className="profile-email">{profile.email}</p>
        <p className="profile-bio">{profile.bio || 'No bio yet.'}</p>
      </div>
    </div>
  );
};

export default ProfilePage;