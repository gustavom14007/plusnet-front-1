import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom"

import styles from "../styles/cadastros.module.css";

function Cadastros() {


  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Cadastros</h1>

        <div className={styles.card_formulario_container}>
          <form >
            
             
            <Link to="/relatorioProduto">
              <div className={styles.button_formulario}>
                  <button type="submit">Produto</button>
              </div>
            </Link>

            
            <Link to="/relatorioCliente"> 
            <div className={styles.button_formulario}>
                <button type="submit">Clientes</button>
              </div>
              </Link>  
          

              <Link to="/cadastroFuncionario">
              <div className={styles.button_formulario}>
                <button type="submit">Funcionario</button>
              </div>
              </Link> 



          </form>
        </div>
      </div>
      
    </div>
  );
}

export default Cadastros