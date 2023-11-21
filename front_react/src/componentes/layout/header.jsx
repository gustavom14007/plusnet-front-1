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
        <div className={styles.header_menus}></div>

        <Link to="/carrinho">
          <li className={styles.item}>Carrinho</li>
        </Link>
      </ul>
    </div>
  );
}

export default Header;
