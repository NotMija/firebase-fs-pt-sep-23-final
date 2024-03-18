import React from "react";
import { getAuth, signOut } from "firebase/auth";

class LogoutButton extends React.Component {
  handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.location.href = "/login";
      })
      .catch((error) => {
        // Manejar errores aquí, si es necesario.
        console.error("Error al cerrar sesión:", error);
      });
  };

  render() {
    return (
      <button className="align-items: end;"
        onClick={this.handleLogout}
        style={{
          color: "black",
        }}
      >
        Cerrar Sesión
      </button>
    );
  }
}


export default LogoutButton;