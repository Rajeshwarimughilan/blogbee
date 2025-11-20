import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './SignupPage.css';

const SignupPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const googleButtonRef = useRef(null);

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    console.debug('SignupPage: REACT_APP_GOOGLE_CLIENT_ID=', clientId);
    if (!clientId) return;

    const onCredentialResponse = async (response) => {
      try {
        const idToken = response.credential;
        const res = await authService.googleSignIn(idToken);
        const { token, user } = res.data.data;
        login(user, token);
        navigate('/');
      } catch (err) {
        console.error('Google sign-in failed', err);
        alert('Google sign-in failed');
      }
    };

    console.debug('SignupPage: window.google present?', !!window.google);
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({ client_id: clientId, callback: onCredentialResponse });
      window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large' });
    }
  }, [login, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.register(form);
  const { token, user } = res.data.data;
  // use AuthContext to store auth state
  login(user, token);
  navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        <div ref={googleButtonRef} style={{ marginTop: 12 }} />
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default SignupPage;