import React, { useState, useEffect } from "react";
import { db, auth } from "../config/firebase";

export const Profile = () => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const snapshot = await db.collection("usuarios").get();
                const userDataArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUserData(userDataArray);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <h2>Perfil de Usuario</h2>
            <ul>
                {userData.map(user => (
                    <li key={user.id}>
                        <strong>Nombre:</strong> {user.name} <br />
                        <strong>Apellidos:</strong> {user.lastName} <br />
                        <strong>Nickname:</strong> {user.nickname} <br />
                        <strong>Correo:</strong> {user.correo} <br />
                        {/* Mostrar otros campos aquí (fecha de nacimiento, estudios, ciudad, etc.) */}
                        {user.foto && <img src={user.foto} alt="Avatar" style={{ width: "100px" }} />}
                    </li>
                ))}
            </ul>
        </div>
    );
};
