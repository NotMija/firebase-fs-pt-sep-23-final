import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener el documento del usuario actual
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // Si existe, cargar los datos del usuario
          const userData = userDoc.data();
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
<div className="mt-2 col-10 col-sm-8 card card-body m-10 position-relative">
  <h2 className="p-3 text-center mb-0 fs-5">Información Personal</h2>
  <Link to="/form" className="btn btn-primary position-absolute top-0 end-0 m-3" style={{ width: "40px", height: "40px", borderRadius: "50%", paddingTop: "11px" }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
      <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
    </svg>
  </Link>
  {userData && (
    <ul className="list-group">
      <li className="list-group-item">
        <div className="row">
          <div className="col-md-3">
            {userData.imgUrl && (
              <img src={userData.imgUrl} alt="Imagen de perfil" className="img-fluid rounded" />
            )}
          </div>
          <div className="col-md-9">
            <strong className="fw-bold">Nombre: </strong> {userData.name} {userData.lastName}<br />
            <strong className="fw-bold">Ciudad: </strong> {userData.city}<br />
            <strong className="fw-bold">Estudios: </strong> {userData.studies}<br />
            {userData.showEmail && (
              <div>
                <strong >Email: </strong> {userData.email}<br />
              </div>
            )}
            {/* Agrega más campos según sea necesario */}

          </div>
        </div>
      </li>
    </ul>
  )}
</div>

  );
};
