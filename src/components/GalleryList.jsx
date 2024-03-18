import React, { useEffect, useState } from "react";
import { getDocs, collection, where, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";

export const List = () => {
  const [list, setList] = useState([]);
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const getList = async () => {
      try {
        const q = query(
          collection(db, "photos"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setList(docs);
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      getList();
    }
  }, [userId]);

  const handleLike = async (photoId) => {
    // Verificar si el usuario ya ha votado por esta foto
    const likedPhoto = list.find(item => item.id === photoId);
    if (likedPhoto.likes && likedPhoto.likes.includes(userId)) {
      alert("Ya has votado por esta foto.");
      return;
    }

    // Actualizar los likes en Firestore
    const photoRef = doc(db, "photos", photoId);
    try {
      await updateDoc(photoRef, {
        likes: [...(likedPhoto.likes || []), userId]
      });

      // Actualizar la lista después de votar
      const updatedList = list.map(item => {
        if (item.id === photoId) {
          return { ...item, likes: [...(item.likes || []), userId] };
        }
        return item;
      });
      setList(updatedList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (photoId, userId) => {
    // Verificar si el usuario actual es el propietario del post
    if (userId !== auth.currentUser.uid) {
      alert("No tienes permiso para eliminar este post.");
      return;
    }

    // Eliminar el post de Firestore
    try {
      await deleteDoc(doc(db, "photos", photoId));

      // Actualizar la lista después de eliminar
      const updatedList = list.filter(item => item.id !== photoId);
      setList(updatedList);
    } catch (error) {
      console.log(error);
      alert("Error al eliminar el post.");
    }
  };

  return (
    <div className="row">
      {list.map((item) => (
        <div key={item.id} className="col-md-4 mb-3">
          <div className="card mt-3 ml-5 mr-5">
            <h3 className="card-header m-2 pb-2 fs-2 row justify-content-center rounded position-relative bg-info text-white opacity-40 ">{item.title}</h3>
            <div className="card-body">
              <img className="card-img-top position-relative bottom-0 start-50 translate-middle-x"
                src={item.image}
                alt={item.title}
                style={{ height: "300px", width: "auto" }}
              />
              <p className="card-text mt-3 mb-2">{item.commentary}</p>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleLike(item.id)}
                disabled={item.likes && item.likes.includes(userId)}
              >
                Like
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(item.id, item.userId)}
              >
                Eliminar
              </button>
              {item.likes && (
                <p className="card-text mt-3">{item.likes.length} Likes</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
