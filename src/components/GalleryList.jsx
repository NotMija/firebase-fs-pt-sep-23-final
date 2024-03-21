import React, { useState, useEffect } from "react";
import { getDocs, collection, where, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";

export const List = ({ list, setImageUploaded, showDeleteButton = true }) => {
  const userId = auth.currentUser.uid;

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
      setImageUploaded(prev => !prev); // Invertir el estado de imageUploaded para forzar la actualización
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

    // Confirmar antes de eliminar
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este post?");
    if (!confirmDelete) {
      return;
    }

    // Eliminar el post de Firestore
    try {
      await deleteDoc(doc(db, "photos", photoId));

      // Actualizar la lista después de eliminar
      const updatedList = list.filter(item => item.id !== photoId);
      setImageUploaded(prev => !prev); // Invertir el estado de imageUploaded para forzar la actualización
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
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                  <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                </svg>
              </button>
              {showDeleteButton && (
                <button
                  className="btn btn-danger ml-20px"
                  onClick={() => handleDelete(item.id, item.userId)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                  </svg>
                </button>
              )}
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
