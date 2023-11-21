import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import styles from "../styles/home.module.css";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <div className={styles.logo_container}>
          <img src={logo} alt="Logo Empresa" />
        </div>

        <h1>Plusnet e-commerce</h1>
        <h3>Bem vindo!</h3>

        <div className={styles.navigation_buttons}>
          {/* <Route exact path="/header" element={<Header />} /> 
         <Route exact path="/cadastroFuncionario" element={<CadastroFuncionario />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/pedidos" element={<Pedidos />} />
        <Route exact path="/relatorios" element={<Relatorios />} />
        <Route exact path="/cadastros" element={<Cadastros />} />
        <Route exact path="/relatorioFuncionario" element={<RelatorioFuncionario />} />
        <Route exact path="/relatorioCliente" element={<RelatorioCliente />} />
        <Route exact path="/relatorioProduto" element={<RelatorioProduto />} />
        <Route exact path="/relatorioPedido" element={<RelatorioPedido />} />
        <Route exact path="/relatorioProducao" element={<RelatorioProducao />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/carrinho" element={<Carrinho />} /> */}

          <NavLink to="/login" className={styles.nav_button}>
            Login
          </NavLink>
          <NavLink to="/cadastros" className={styles.nav_button}>
            Cadastros
          </NavLink>
          <NavLink to="/pedidos" className={styles.nav_button}>
            Pedidos
          </NavLink>
          {/* <NavLink exact to="/relatorios" className={styles.nav_button} activeClassName={styles.active}>
        Relatórios
      </NavLink>
      <NavLink exact to="/relatorioFuncionario" className={styles.nav_button} activeClassName={styles.active}>
      Relatório Funcionário
      </NavLink>
      <NavLink exact to="/relatorioCliente" className={styles.nav_button} activeClassName={styles.active}>
      Relatório Cliente 
      </NavLink>
      <NavLink exact to="/relatorioProduto" className={styles.nav_button} activeClassName={styles.active}>
      Relatório Produto
      </NavLink>
      <NavLink exact to="/relatorioPedido" className={styles.nav_button} activeClassName={styles.active}>
      Relatório Pedido
      </NavLink>
      <NavLink exact to="/relatorioProducao" className={styles.nav_button} activeClassName={styles.active}>
      Relatório Produção
      </NavLink> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
