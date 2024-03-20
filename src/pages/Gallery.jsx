import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { CircularProgress } from "@mui/material";
import { addDoc, collection, query, onSnapshot, where } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { List } from "../components/GalleryList";

export const Gallery = () => {
  const [list, setList] = useState([]);
  const [urlImgDesc, setUrlImgDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  const userId = auth.currentUser.uid;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "photos"), where("userId", "==", userId)),
      (snapshot) => {
        const docs = [];
        snapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setList(docs);
      },
      (error) => {
        console.error("Error al obtener fotos:", error);
      }
    );

    return () => unsubscribe();
  }, [userId, imageUploaded]); // Agregar imageUploaded como dependencia

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    const title = e.target.title.value.trim();
    const commentary = e.target.commentary.value.trim();

    if (!title || !commentary || !urlImgDesc) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "photos"), {
        title: title,
        commentary: commentary,
        image: urlImgDesc,
        userId: userId,
      });

      e.target.reset();
      setUrlImgDesc("");
      setImageUploaded(!imageUploaded); // Invertir el estado de imageUploaded para forzar la actualización
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const archiveImg = e.target.files[0];
    const refArchive = ref(storage, `documents/${archiveImg.name}`);
    await uploadBytes(refArchive, archiveImg);

    const imageUrl = await getDownloadURL(refArchive);
    setUrlImgDesc(imageUrl);
  };

  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-sm-8">
          <div className="card card-body container col-sm-8 mt-4">
            <h3 className="text-center fs-3">Agregar Multimedia</h3>
            <form className="m-2" onSubmit={handleSaveInfo}>
              <label>Titulo:</label>
              <div className="form-group mt-3">
                <input
                  type="text"
                  placeholder="Ponle un titulo a la imagen"
                  name="title"
                  className="form-control mt-1"
                  required
                />
              </div>
              <label className="mt-2 mb-2">Agregar imagen:</label>
              <input
                type="file"
                name="file"
                placeholder="Agregar imagen"
                className="form-control"
                onChange={handleFileUpload}
              />
              <label className="mt-2 mb-2">Comentario: </label>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Ponle un comentario"
                  name="commentary"
                  className="form-control mt-1"
                  required
                />
              </div>
              <button className="btn btn-primary mt-3 form-control" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Publicar"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <List list={list} setImageUploaded={setImageUploaded} /> {/* Pasar setImageUploaded como prop */}
    </div>
  );
};