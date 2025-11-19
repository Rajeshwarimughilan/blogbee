import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import './SearchPage.css';

const SearchPage = () => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await userService.search(q.trim());
      setResults(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleSelectUser = (u) => {
    // navigate to public user profile page
    navigate(`/users/${u._id}`);
  };

  return (
    <div className="search-page">
      <form className="search-form" onSubmit={handleSearch}>
        <input placeholder="Search username or email" value={q} onChange={e => setQ(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      <div className="search-results">
        {loading && <div>Searching…</div>}
        {!loading && results.length === 0 && <div className="no-results">No results</div>}
        {results.map(u => (
          <div key={u._id} className="search-item" onClick={() => handleSelectUser(u)} style={{cursor: 'pointer'}}>
            <div className="search-username">{u.username}</div>
            <div className="search-email">{u.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;