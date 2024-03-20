import React from "react";
import { AppBar, Box } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import LogoutButton from "./SignOut"; // Importa el componente LogoutButton

export const NavBar = () => {
  return (
    <>
      <AppBar sx={{ backgroundColor: "white" }} position="static">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // Para distribuir los elementos a los extremos del contenedor
            alignItems: "center", // Para centrar verticalmente los elementos
            padding: "0 20px", // Ajusta el espaciado según sea necesario
            margin: 2,
          }}
        >
          <div>
            <Link
              style={{
                color: "black",
                marginRight: "20px", // Espaciado entre los enlaces
              }}
              to="/"
            >
              Inicio
            </Link>

            <Link
              style={{
                color: "black",
                marginRight: "20px", // Espaciado entre los enlaces
              }}
              to="/friends"
            >
              Usuarios
            </Link>

            <Link
              style={{
                color: "black",
                marginRight: "20px", // Espaciado entre los enlaces
              }}
              to="/gallery"
            >
              Galeria
            </Link>
          </div>

          {/* Botón de cierre de sesión */}
          <LogoutButton />
        </Box>
      </AppBar>
      <Outlet />
    </>
  );
};
