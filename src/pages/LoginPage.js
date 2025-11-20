import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
import { useEffect, useRef } from 'react';

const LoginPage = () => {
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form);
  const { token, user } = res.data.data;
  // use AuthContext to store auth state (also syncs to localStorage)
  login(user, token);
  navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Identity initialization
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    console.debug('LoginPage: REACT_APP_GOOGLE_CLIENT_ID=', clientId);
    if (!clientId) return; // not configured

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

    console.debug('LoginPage: window.google present?', !!window.google);
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({ client_id: clientId, callback: onCredentialResponse });
      window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large' });
    }
  }, [login, navigate]);

  const handleGoogleClick = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      alert('Google Sign-In is not configured. Please set REACT_APP_GOOGLE_CLIENT_ID.');
      return;
    }
    if (window.google && window.google.accounts) {
      // prompt will show One Tap or credential chooser
      window.google.accounts.id.prompt();
    } else {
      alert('Google Identity script not loaded yet. Please try again in a moment.');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input name="emailOrUsername" placeholder="Email or username" value={form.emailOrUsername} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        {/* Google sign-in button (renders only if GOOGLE_CLIENT_ID provided) */}
        <div ref={googleButtonRef} style={{ marginTop: 12 }} />
        <button type="button" className="google-fallback-btn" onClick={handleGoogleClick} style={{ marginTop: 12 }}>
          Sign in with Google
        </button>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;