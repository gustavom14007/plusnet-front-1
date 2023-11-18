import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom"

import styles from "../styles/relatorios.module.css";

function Relatorios() {


  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Relatorios</h1>

        <div className={styles.card_formulario_container}>
          <form >
            

          <Link to="/relatorioProducao">
              <div className={styles.button_formulario}>
                  <button type="submit">Relatorio de producao</button>
              </div>
            </Link>
             
            <Link to="/relatorioPedido">
              <div className={styles.button_formulario}>
                  <button type="submit">Pedidos</button>
              </div>
            </Link>

            
            <Link to="/relatorioProduto"> 
            <div className={styles.button_formulario}>
                <button type="submit">Produtos</button>
              </div>
              </Link>  
          

              <Link to="/relatorioCliente">
              <div className={styles.button_formulario}>
                <button type="submit">Clientes</button>
              </div>
              </Link> 

              <Link to="/relatorioFuncionario">
              <div className={styles.button_formulario}>
                <button type="submit">Funcionarios</button>
              </div>
              </Link> 



          </form>
        </div>
      </div>
      
    </div>
  );
}

export default Relatorios