import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import PostList from '../components/PostList';
import './ProfilePage.css';

const UserProfilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState({ user: null, posts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await userService.getUserById(id);
        // expects { user, posts }
        setData({ user: res.data.data.user, posts: res.data.data.posts });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div>Loading user profile...</div>;
  if (!data.user) return <div>User not found.</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>{data.user.username}</h2>
        <p className="profile-email">{data.user.email}</p>
        <p className="profile-bio">{data.user.bio || 'No bio yet.'}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ color: 'var(--honey-2)' }}>Posts by {data.user.username}</h3>
        <PostList posts={data.posts} />
      </div>
    </div>
  );
};

export default UserProfilePage;
