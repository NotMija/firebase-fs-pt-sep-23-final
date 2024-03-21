import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { List } from '../components/GalleryList';

export const UserDetails = () => {
  const { docId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0); // Estado para forzar la actualización

  useEffect(() => {
    const fetchUserDataAndPosts = async () => {
      try {
        // Obtener datos de usuario
        const userDocRef = doc(db, 'users', docId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          setUserData(userDocSnapshot.data());
        } else {
          console.log('No se encontraron datos para el usuario con el docId:', docId);
          setUserData(null);
        }

        // Obtener posts del usuario
        const postsQuery = query(collection(db, 'photos'), where('userId', '==', docId));
        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserPosts(postsData);
      } catch (error) {
        console.error('Error al obtener los datos del usuario y los posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndPosts();
  }, [docId, likeCount]); // Agrega likeCount como dependencia

  const handleLike = async (photoId) => {
    const photoRef = doc(db, "photos", photoId);
    try {
      const likedPhoto = userPosts.find(item => item.id === photoId);
      if (likedPhoto.likes && likedPhoto.likes.includes(auth.currentUser.uid)) {
        // Si ya le ha dado like, quitar el like
        const updatedLikes = likedPhoto.likes.filter(like => like !== auth.currentUser.uid);
        await updateDoc(photoRef, { likes: updatedLikes });
      } else {
        // Si no le ha dado like, agregar el like
        await updateDoc(photoRef, { likes: [...(likedPhoto.likes || []), auth.currentUser.uid] });
      }
      setLikeCount(prev => prev + 1); // Actualiza el contador para forzar la actualización
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (!userData) {
    return <h1>No se encontraron datos para el usuario con el UID: {docId}</h1>;
  }

  return (
    <div>
      <div className="mt-5 col-10 col-sm-4 card card-body m-10 position-relative bg-light">
        <h2 className="p-3 text-center mb-0 fs-4 ">Información Personal</h2>
        {userData && (
          <ul className="list-group">
            <li className="list-group-item">
              <div className="row">
                <div className="col-md-3">
                  {userData.imgUrl && (
                    <img src={userData.imgUrl} alt="Imagen de perfil" className="img-fluid rounded" />
                  )}
                </div>
                <div className="col-md-9 p-2">
                  <div className="mb-3">
                    <strong className="fw-bold">Nombre: </strong> {userData.name} {userData.lastName}
                  </div>
                  <div className="mb-3">
                    <strong className="fw-bold">Ciudad: </strong> {userData.city}
                  </div>
                  <div className="mb-3">
                    <strong className="fw-bold">Estudios: </strong> {userData.studies}
                  </div>
                  {userData.showEmail && (
                    <div className="mb-3">
                      <strong className="fw-bold" >Email: </strong> {userData.email}
                    </div>
                  )}
                </div>
              </div>
            </li>
          </ul>
        )}
      </div>

      {/* Renderizar el componente List con los datos de los posts */}
      <List list={userPosts} showDeleteButton={false} />
    </div>
  );
};