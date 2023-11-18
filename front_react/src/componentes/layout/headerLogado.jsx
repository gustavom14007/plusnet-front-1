import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import styles from "../styles/header.module.css";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles.header_container}>
      <div className={styles.logo_container}>
        <Link to="/home">
          <img src={logo} alt="Logo Empresa" />
        </Link>
      </div>

      <div
        className={`${styles.mobile_menu_icon} ${
          isMobileMenuOpen ? styles.open : ""
        }`}
        onClick={toggleMobileMenu}
      >
        ☰
      </div>

      <ul
        className={`${styles.lista_header} ${
          isMobileMenuOpen ? styles.open : ""
        }`}
      >
        <Link to="/cadastroFuncionario">
          <li className={styles.item}>Cadastre-se</li>
        </Link>
        
        <Link to="/login">
          <li className={styles.item}>Login</li>
        </Link>
        
        

      </ul>

    </div>
  );
}

export default Header;
