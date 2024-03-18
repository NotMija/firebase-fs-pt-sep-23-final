import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { storage } from "../config/firebase";
import { CircularProgress } from "@mui/material";
import { addDoc, collection, query, getDocs, where } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { List } from "../components/GalleryList";

export const Gallery = () => {
  const [list, setList] = useState([]);
  const [urlImgDesc, setUrlImgDesc] = useState("");
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  const userId = auth.currentUser.uid;

  useEffect(() => {
    if (userId) {
      getList();
    }
  }, [userId]);

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

  const saveInfo = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const commentary = e.target.commentary.value;

    const newPost = {
      title: title,
      commentary: commentary,
      image: urlImgDesc,
      userId: userId,
    };

    try {
      setLoading(true); // Inicia la carga al hacer clic en el botón

      await addDoc(collection(db, "photos"), {
        ...newPost,
      });

      await getList(); // Actualiza la lista de fotos

      e.target.reset(); // Limpia el formulario después de guardar

      setUrlImgDesc(""); // Reinicia la URL de la imagen
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Finaliza la carga después de completar la publicación
    }
  };

  const fileHandler = async (e) => {
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
            <form className="m-2" onSubmit={saveInfo}>
              <label>Titulo:</label>
              <div className="form-group mt-3">
                <input
                  type="text"
                  placeholder="Ponle un titulo a la imagen"
                  id="title"
                  className="form-control mt-1"
                  required
                />
              </div>
              <label className="mt-2 mb-2">Agregar imagen:</label>
              <input
                type="file"
                id="file"
                placeholder="Agregar imagen"
                className="form-control"
                onChange={fileHandler}
              />
              <label className="mt-2 mb-2">Comentario: </label>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Ponle un comentario"
                  id="commentary"
                  className="form-control mt-1"
                  required
                />
              </div>
              <button className="btn btn-primary mt-3 form-control" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Subir Imagen"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <List list={list} /> {/* Pasar la lista como una prop al componente List */}
    </div>
  );
};
