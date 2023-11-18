// RelatorioCliente.js
import React, { useState, useEffect } from "react";
import styles from "../styles/relatorioCliente.module.css";

function RelatorioCliente() {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [isModalExclusaoAberto, setIsModalExclusaoAberto] = useState(false);
  const [isModalEdicaoAberto, setIsModalEdicaoAberto] = useState(false);
 
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    telefone: "",
  });

  const handleAbrirModalCadastro = () => {
    setIsModalCadastroAberto(true);
  };

  const handleFecharModalCadastro = () => {
    setIsModalCadastroAberto(false);
    setNovoCliente({
      nome: "",
      sobrenome: "",
      cpf: "",
      telefone: "",
    });
  };

  const handleInputChangeCadastro = (e) => {
    const { name, value } = e.target;
    setNovoCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value,
    }));
  };

  const handleCadastrarCliente = () => {
    // Chame a API para cadastrar um novo cliente
    // Certifique-se de ajustar o endpoint e os detalhes conforme necessário.
    fetch("http://localhost:5000/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoCliente),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        // Atualize a lista de clientes ou faça outra ação necessária
        // ...

        // Feche o modal de cadastro
        handleFecharModalCadastro();
        reloadPage();
      })
      .catch((err) => console.log(err));
  };
  
  
  
  const [edicaoCliente, setEdicaoCliente] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    telefone: "",
  });

  const reloadPage = () => {
    window.location.reload();
  };


  const handleExcluirClick = (cliente) => {
    // Define o cliente a ser excluído quando o botão Excluir é clicado
    setClienteSelecionado(cliente);
    // Abre o modal de exclusão
    setIsModalExclusaoAberto(true);
  };

  const handleCancelarExclusao = () => {
    // Cancela a exclusão e fecha o modal de confirmação
    setClienteSelecionado(null);
    setIsModalExclusaoAberto(false);
  };

  const handleExcluir = () => {
    // Aqui você faria a chamada para a API para excluir o cliente.
    // Certifique-se de adicionar o código adequado para a exclusão no backend.
    // Exemplo fictício:
    fetch(`http://localhost:5000/clientes/${clienteSelecionado.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        // Aqui você pode recarregar a lista de clientes ou fazer outra ação necessária.
        setClienteSelecionado(null);
        setIsModalExclusaoAberto(false);
        reloadPage();
      })
      .catch((err) => console.log(err));
  };

  const handleEditarClick = (cliente) => {
    setClienteSelecionado(cliente);
    setEdicaoCliente({
      nome: cliente.nome,
      sobrenome: cliente.sobrenome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
    });
    setIsModalEdicaoAberto(true);
  };

  const handleFecharModalEdicao = () => {
    setIsModalEdicaoAberto(false);
    setEdicaoCliente({
      nome: "",
      sobrenome: "",
      cpf: "",
      telefone: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEdicaoCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value,
    }));
  };

  const handleSalvarEdicao = () => {
    // Chame a API para atualizar as informações do cliente
    // Certifique-se de ajustar o endpoint e os detalhes conforme necessário.
    fetch(`http://localhost:5000/clientes/${clienteSelecionado.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edicaoCliente),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        // Atualize a lista de clientes após a edição
        // ...

        // Feche o modal de edição
        handleFecharModalEdicao();
        reloadPage();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch("http://localhost:5000/clientes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setClientes(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Clientes</h1>
      </div>

      <div className={styles.div_adicionar}>
        <button
          className={styles.botao_adicionar}
          onClick={handleAbrirModalCadastro}
        >
          Adicionar cliente
        </button>
      </div>

      <div className={styles.div_relatorio}>

        <ul className={styles.ul_cards}>
          {clientes.map((cliente) => (
            <li key={cliente.id} className={styles.li_cards}>
              <p>
                <strong>ID:</strong> {cliente.id}
              </p>
              <p>
                <strong>Nome:</strong> {cliente.nome}
              </p>
              <p>
                <strong>Sobrenome:</strong> {cliente.sobrenome}
              </p>
              <p>
                <strong>CPF:</strong> {cliente.cpf}
              </p>
              <p>
                <strong>Telefone:</strong> {cliente.telefone}
              </p>
              <div className={styles.buttons}>
                <button
                  className={styles.button_cards}
                  onClick={() => handleExcluirClick(cliente)}
                >
                  Excluir
                </button>
                <button
                  className={styles.button2_cards}
                  onClick={() => handleEditarClick(cliente)}
                >
                  Editar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {clienteSelecionado && isModalExclusaoAberto && (
        <div className={styles.modal_exclusao}>
          <p>
            Tem certeza que deseja excluir o cliente{" "}
            <strong>{clienteSelecionado.nome}</strong>?
          </p>
          <div className={styles.modal_botoes}>
            <button onClick={handleExcluir}>Sim</button>
            <button onClick={handleCancelarExclusao}>Cancelar</button>
          </div>
        </div>
      )}

      {clienteSelecionado && isModalEdicaoAberto && (
        <div className={styles.modal_edicao}>
          <p>
            Editar informações do cliente{" "}
            <strong>{clienteSelecionado.nome}</strong>:
          </p>
          <div className={styles.form_edicao}>
            <label>
              Nome:
              <input
                type="text"
                name="nome"
                value={edicaoCliente.nome}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Sobrenome:
              <input
                type="text"
                name="sobrenome"
                value={edicaoCliente.sobrenome}
                onChange={handleInputChange}
              />
            </label>
            <label>
              CPF:
              <input
                type="text"
                name="cpf"
                value={edicaoCliente.cpf}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Telefone:
              <input
                type="text"
                name="telefone"
                value={edicaoCliente.telefone}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <p></p>
          <div className={styles.modal_botoes}>
            <button onClick={handleSalvarEdicao}>Salvar</button>
            <button onClick={handleFecharModalEdicao}>Cancelar</button>
          </div>
        </div>
      )}

{isModalCadastroAberto && (
        <div className={styles.modal_cadastro}>
          <p>Cadastre um novo cliente:</p>
          <div className={styles.form_cadastro}>
            <label>
              Nome:
              <input
                type="text"
                name="nome"
                value={novoCliente.nome}
                onChange={handleInputChangeCadastro}
              />
            </label>
            <label>
              Sobrenome:
              <input
                type="text"
                name="sobrenome"
                value={novoCliente.sobrenome}
                onChange={handleInputChangeCadastro}
              />
            </label>
            <label>
              CPF:
              <input
                type="text"
                name="cpf"
                value={novoCliente.cpf}
                onChange={handleInputChangeCadastro}
              />
            </label>
            <label>
              Telefone:
              <input
                type="text"
                name="telefone"
                value={novoCliente.telefone}
                onChange={handleInputChangeCadastro}
              />
            </label>
          </div>
          <p></p>
          <div className={styles.modal_botoes}>
            <button onClick={handleCadastrarCliente}>Cadastrar</button>
            <button onClick={handleFecharModalCadastro}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RelatorioCliente;
