import React, { useState, useEffect } from "react";
import styles from "../styles/relatorioCliente.module.css";

function RelatorioFuncionario() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [isModalExclusaoAberto, setIsModalExclusaoAberto] = useState(false);
  const [isModalEdicaoAberto, setIsModalEdicaoAberto] = useState(false);
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);

  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const handleAbrirModalCadastro = () => {
    setIsModalCadastroAberto(true);
  };

  const handleFecharModalCadastro = () => {
    setIsModalCadastroAberto(false);
    setNovoFuncionario({
      nome: "",
      email: "",
      senha: "",
    });
  };

  const handleInputChangeCadastro = (e) => {
    const { name, value } = e.target;
    setNovoFuncionario((prevFuncionario) => ({
      ...prevFuncionario,
      [name]: value,
    }));
  };

  const handleCadastrarFuncionario = () => {
    fetch("http://localhost:5000/funcionarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoFuncionario),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setFuncionarios([...funcionarios, data]);
        handleFecharModalCadastro();
      })
      .catch((err) => console.log(err));
  };

  const [edicaoFuncionario, setEdicaoFuncionario] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const handleExcluirClick = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setIsModalExclusaoAberto(true);
  };

  const handleCancelarExclusao = () => {
    setFuncionarioSelecionado(null);
    setIsModalExclusaoAberto(false);
  };

  const handleExcluir = () => {
    fetch(`http://localhost:5000/funcionarios/${funcionarioSelecionado.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setFuncionarios(funcionarios.filter((funcionario) => funcionario.id !== funcionarioSelecionado.id));
        setFuncionarioSelecionado(null);
        setIsModalExclusaoAberto(false);
      })
      .catch((err) => console.log(err));
  };

  const handleEditarClick = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setEdicaoFuncionario({
      nome: funcionario.nome,
      email: funcionario.email,
      senha: funcionario.senha,
    });
    setIsModalEdicaoAberto(true);
  };

  const handleFecharModalEdicao = () => {
    setIsModalEdicaoAberto(false);
    setEdicaoFuncionario({
      nome: "",
      email: "",
      senha: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEdicaoFuncionario((prevFuncionario) => ({
      ...prevFuncionario,
      [name]: value,
    }));
  };

  const handleSalvarEdicao = () => {
    fetch(`http://localhost:5000/funcionarios/${funcionarioSelecionado.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edicaoFuncionario),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setFuncionarios(funcionarios.map(f => (f.id === funcionarioSelecionado.id ? edicaoFuncionario : f)));
        setFuncionarioSelecionado(null);
        setIsModalEdicaoAberto(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch("http://localhost:5000/funcionarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setFuncionarios(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Funcionários</h1>
      </div>

      <div className={styles.div_adicionar}>
        <button
          className={styles.botao_adicionar}
          onClick={handleAbrirModalCadastro}
        >
          Adicionar Funcionário
        </button>
      </div>

      <div className={styles.div_relatorio}>
        <ul className={styles.ul_cards}>
          {funcionarios.map((funcionario) => (
            <li key={funcionario.id} className={styles.li_cards}>
              <p>
                <strong>ID:</strong> {funcionario.id}
              </p>
              <p>
                <strong>Nome:</strong> {funcionario.nome}
              </p>
              <p>
                <strong>Email:</strong> {funcionario.email}
              </p>
              <div className={styles.buttons}>
                <button
                  className={styles.button_cards}
                  onClick={() => handleExcluirClick(funcionario)}
                >
                  Excluir
                </button>
                <button
                  className={styles.button2_cards}
                  onClick={() => handleEditarClick(funcionario)}
                >
                  Editar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {funcionarioSelecionado && isModalExclusaoAberto && (
        <div className={styles.modal_exclusao}>
          <p>
            Tem certeza que deseja excluir o funcionário{" "}
            <strong>{funcionarioSelecionado.nome}</strong>?
          </p>
          <div className={styles.modal_botoes}>
            <button onClick={handleExcluir}>Sim</button>
            <button onClick={handleCancelarExclusao}>Cancelar</button>
          </div>
        </div>
      )}

      {funcionarioSelecionado && isModalEdicaoAberto && (
        <div className={styles.modal_edicao}>
          <p>
            Editar informações do funcionário{" "}
            <strong>{funcionarioSelecionado.nome}</strong>:
          </p>
          <div className={styles.form_edicao}>
            <label>
              Nome:
              <input
                type="text"
                name="nome"
                value={edicaoFuncionario.nome}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={edicaoFuncionario.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Senha:
              <input
                type="text"
                name="senha"
                value={edicaoFuncionario.senha}
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
          <p>Cadastre um novo funcionário:</p>
          <div className={styles.form_cadastro}>
            <label>
              Nome:
              <input
                type="text"
                name="nome"
                value={novoFuncionario.nome}
                onChange={handleInputChangeCadastro}
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={novoFuncionario.email}
                onChange={handleInputChangeCadastro}
              />
            </label>
            <label>
              Senha:
              <input
                type="text"
                name="senha"
                value={novoFuncionario.senha}
                onChange={handleInputChangeCadastro}
              />
            </label>
          </div>
          <p></p>
          <div className={styles.modal_botoes}>
            <button onClick={handleCadastrarFuncionario}>Cadastrar</button>
            <button onClick={handleFecharModalCadastro}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RelatorioFuncionario;
