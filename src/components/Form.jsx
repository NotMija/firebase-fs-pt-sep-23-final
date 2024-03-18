import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";

export const Form = () => {
    const [user, setUser] = useState(null); // Para almacenar la información del usuario autenticado
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        city: "",
        studies: "",
        birthdate: "",
        email: "", // Ya no se establece directamente aquí
        img: "",
        pets: false,
        showEmail: true
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setFormData({...formData, email: user.email});
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        if (e.target.name === "img") {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verificar que el nombre y el apellido estén llenos
            if (!formData.name || !formData.lastName) {
                alert("Por favor, complete el nombre y el apellido.");
                return;
            }
    
            let imgUrl = formData.imgUrl;
    
            // Verificar si se ha seleccionado una nueva imagen
            if (e.target.img.files.length > 0) {
                const imgFile = e.target.img.files[0];
                const imgRef = ref(storage, `avatars/${imgFile.name}`);
                await uploadBytes(imgRef, imgFile);
                imgUrl = await getDownloadURL(imgRef);
            }
    
            const formDataWithImgUrl = {
                name: formData.name,
                lastName: formData.lastName,
                city: formData.city,
                studies: formData.studies,
                birthdate: formData.birthdate,
                email: formData.email,
                imgUrl: imgUrl, 
                pets: formData.pets,
                showEmail: formData.showEmail
            };
    
            const userRef = doc(db, "users", user.uid); // Utilizar el UID del usuario autenticado
            await setDoc(userRef, formDataWithImgUrl, { merge: true });
    
            alert("Formulario enviado correctamente.");
            setFormData({
                name: "",
                lastName: "",
                city: "",
                studies: "",
                birthdate: "",
                email: user.email, // Utilizar el email del usuario autenticado
                pets: false,
                showEmail: true
            });
        } catch (error) {
            console.log(error);
            alert("Error al enviar el formulario.");
        }
    };
    return (
        <div className="mt-4 col-10 col-sm-8 card card-body mx-auto ">
            <h2 className="p-3 text-center mb-0 fs-5">Información Personal</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Apellido:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="city" className="form-label">Ciudad:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="studies" className="form-label">Estudios:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="studies"
                        name="studies"
                        value={formData.studies}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="birthdate" className="form-label">Fecha de Nacimiento:</label>
                    <input
                        type="date"
                        className="form-control"
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                    />
                </div>
                {formData.showEmail && (
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                )}
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="showEmail"
                        name="showEmail"
                        checked={formData.showEmail}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="showEmail">Mostrar Email</label>
                </div>
                <div className="mb-3">
                    <label htmlFor="img" className="form-label">Imagen (Avatar):</label>
                    <input
                        type="file"
                        className="form-control"
                        id="img"
                        name="img"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="pets"
                        name="pets"
                        checked={formData.pets}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="pets">¿Tienes mascotas?</label>
                </div>
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        </div>
    );
};

