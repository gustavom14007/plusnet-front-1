import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom"
import logo from "../../img/logo.png";
import styles from "../styles/home.module.css";

function Home() {


  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        
      <div className={styles.logo_container}>
        <img src={logo} alt="Logo Empresa" />
        </div>
        
        <h1>Plusnet e-commerce</h1>
        <h3>Bem vindo!</h3>
        
      </div>
      
    </div>
  );
}

export default Home