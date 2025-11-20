import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import './AdminPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, pRes] = await Promise.all([adminService.getUsers(), adminService.getPosts()]);
      setUsers(uRes.data.data || []);
      setPosts(pRes.data.data || []);
    } catch (err) {
      console.error('Admin fetch error', err);
      alert('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const changeRole = async (id, role) => {
    try {
      await adminService.updateUserRole(id, role);
      fetchData();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm('Delete user and their posts?')) return;
    try { await adminService.deleteUser(id); fetchData(); } catch (e) { alert('Failed to delete user'); }
  };

  const removePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try { await adminService.deletePost(id); fetchData(); } catch (e) { alert('Failed to delete post'); }
  };

  if (loading) return <div className="admin-page">Loading admin data...</div>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <section className="admin-section">
        <h2>Users</h2>
        <table className="admin-table">
          <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.role !== 'admin' && <button onClick={() => changeRole(u._id, 'admin')}>Promote</button>}
                  {u.role === 'admin' && <button onClick={() => changeRole(u._id, 'user')}>Demote</button>}
                  <button onClick={() => removeUser(u._id)} style={{ marginLeft: 8 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-section">
        <h2>Posts</h2>
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Author</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>
            {posts.map(p => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.author}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
                <td><button onClick={() => removePost(p._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminPage;
