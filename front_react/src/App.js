import {BrowserRouter as Router,Route,Routes}from"react-router-dom"

import logo from './logo.svg';
import './App.css';
import Header from "./componentes/layout/header";
import Footer from "./componentes/layout/footer";
import Login from "./componentes/pages/login";
import CadastroFuncionario from "./componentes/pages/cadastroFuncionario";
import Pedidos from "./componentes/pages/pedidos";
import Relatorios from "./componentes/pages/relatorios";
import Cadastros from "./componentes/pages/cadastros";
import RelatorioProduto from "./componentes/pages/relatorioProduto";
import RelatorioCliente from "./componentes/pages/relatorioCliente";
import RelatorioFuncionario from "./componentes/pages/relatorioFuncionario";
import RelatorioPedido from "./componentes/pages/relatorioPedido";
import Home from "./componentes/pages/home";
import RelatorioProducao from "./componentes/pages/relatorioProducao";
import Fechamento from "./componentes/pages/fechamento";

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route exact path="/header" element={<Header/>}/>
        <Route exact path="/cadastroFuncionario" element={<CadastroFuncionario/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/pedidos" element={<Pedidos/>}/>
        <Route exact path="/relatorios" element={<Relatorios/>}/>
        <Route exact path="/cadastros" element={<Cadastros/>}/>
        <Route exact path="/relatorioFuncionario" element={<RelatorioFuncionario/>}/>
        <Route exact path="/relatorioCliente" element={<RelatorioCliente/>}/>
        <Route exact path="/relatorioProduto" element={<RelatorioProduto/>}/>
        <Route exact path="/relatorioPedido" element={<RelatorioPedido/>}/>
        <Route exact path="/relatorioProducao" element={<RelatorioProducao/>}/>
        <Route exact path="/home" element={<Home/>}/>
        <Route exact path="/fechamento" element={<Fechamento/>}/>
      </Routes>
    
      <Footer/>
    </Router>
     
  );
}

export default App;
