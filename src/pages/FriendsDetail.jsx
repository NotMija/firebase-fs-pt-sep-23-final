import { useEffect, useState } from 'react';
import { db } from '../config/firebase'; // Asegúrate de importar db desde tu archivo de configuración de Firebase
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

export const UserDetails = () => {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          setUserData(userDocSnapshot.data());
        } else {
          console.log('No se encontraron datos para el usuario con el UID:', uid);
          setUserData(null); // Reiniciamos los datos del usuario
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (!userData) {
    return <h1>No se encontraron datos para el usuario con el UID: {uid}</h1>;
  }

  return (
    <div>
      <h1>{userData.name} {userData.lastName}</h1>
      {/* Renderizar otros detalles del usuario aquí */}
    </div>
  );
};

