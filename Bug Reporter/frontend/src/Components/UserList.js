import React, {useEffect, useState} from 'react';

export default function UserList({role}) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (role === "ADMIN") {
            fetch("http://localhost:8080/admin/users", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
                .then(res => res.json())
                .then(data => setUsers(data))
                .catch(err => console.error("Eroare la preluarea utilizatorilor:", err));
        }
    }, [role]);

    const toggleBan = (username, currentStatus) => {
        const endpoint = currentStatus
            ? `http://localhost:8080/admin/unban/${username}`
            : `http://localhost:8080/admin/ban/${username}`;

        fetch(endpoint, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Eroare la schimbarea statusului");
                return res.text();
            })
            .then(msg => {
                alert(msg);
                setUsers(users.map(u =>
                    u.username === username ? {...u, banned: !currentStatus} : u
                ));
            })
            .catch(err => alert(err.message));
    };

    if (role !== "ADMIN") return null;

    return (
        <div
            style={{
                margin: '2rem',
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            <h2 style={{marginBottom: '1rem'}}>Lista utilizatorilor</h2>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                }}
            >
                <thead>
                <tr style={{backgroundColor: '#f0f0f0'}}>
                    <th style={{padding: '0.5rem', border: '1px solid #ccc'}}>ID</th>
                    <th style={{padding: '0.5rem', border: '1px solid #ccc'}}>Username</th>
                    <th style={{padding: '0.5rem', border: '1px solid #ccc'}}>Rol</th>
                    <th style={{padding: '0.5rem', border: '1px solid #ccc'}}>Status</th>
                    <th style={{padding: '0.5rem', border: '1px solid #ccc'}}>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.idUser}>
                        <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{user.idUser}</td>
                        <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{user.username}</td>
                        <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>{user.role}</td>
                        <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>
                            {user.banned ? 'Banat' : 'Activ'}
                        </td>
                        <td style={{padding: '0.5rem', border: '1px solid #ccc'}}>
                            <button onClick={() => toggleBan(user.username, user.banned)}>
                                {user.banned ? 'Unban' : 'Ban'}
                            </button>
                        </td>
                    </tr>
                ))}

                </tbody>
            </table>
        </div>
    );

}
