import React, { useEffect, useState } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const fetchUsers = () => {
    fetch('http://localhost:8080/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setError('Nu s-au putut încărca utilizatorii.'));
  };

  useEffect(() => {
    if (role !== 'ADMIN') return;
    fetchUsers();
  }, [token, role]);

  const handleBan = (username) => {
    fetch(`http://localhost:8080/admin/ban/${username}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Eroare la banare');
        fetchUsers();
        alert('Utilizator banat și notificat pe email!');
      })
      .catch(() => setError('Eroare la banare.'));
  };

  const handleUnban = (username) => {
    fetch(`http://localhost:8080/admin/unban/${username}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Eroare la debanare');
        fetchUsers();
        alert('Utilizator debanat!');
      })
      .catch(() => setError('Eroare la debanare.'));
  };

  if (role !== 'ADMIN') return <div>Nu ai acces!</div>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Administrare utilizatori</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Banned</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.idUser}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td style={{ color: user.banned ? 'red' : 'green' }}>
                {user.banned ? 'BANAT' : 'ACTIV'}
              </td>
              <td>
                {!user.banned ? (
                  <button onClick={() => handleBan(user.username)}>Ban</button>
                ) : (
                  <button onClick={() => handleUnban(user.username)}>Unban</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 