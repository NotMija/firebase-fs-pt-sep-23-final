import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, query, where, orderBy, startAt, endAt } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export const Friends = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersCollection = collection(db, 'users');
        let usersSnapshot;
        if (searchQuery.trim() !== '') {
          const q = query(usersCollection,
            orderBy('name'),
            where('name', '>=', searchQuery),
            where('name', '<=', searchQuery + '\uf8ff'));
          usersSnapshot = await getDocs(q);
        } else {
          usersSnapshot = await getDocs(usersCollection);
        }
        const usersData = usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
        setUserData(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="container">
      <h1 className="text-center my-4 fs-2">Lista de usuarios</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <ul className="list-group">
        {loading ? (
          <li className="list-group-item">Loading...</li>
        ) : (
          userData.map((user, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center fs-4">
              <Link to={`/user/${user.uid}`} style={{ textDecoration: 'none' }}>
                <div>
                  <span>{user.name} {user.lastName}</span>
                </div>
              </Link>
              <Link to={`/user/${user.uid}`} className="btn btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-badge" viewBox="0 0 16 16">
                  <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492z" />
                </svg>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
