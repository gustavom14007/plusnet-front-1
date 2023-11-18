import React, { useState, useEffect } from "react";
import styles from "../styles/relatorioProduto.module.css";

function RelatorioProduto() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [isModalExclusaoAberto, setIsModalExclusaoAberto] = useState(false);
  const [isModalEdicaoAberto, setIsModalEdicaoAberto] = useState(false);
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);

  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    valor: "",
  });

  const handleAbrirModalCadastro = () => {
    setIsModalCadastroAberto(true);
  };

  const handleFecharModalCadastro = () => {
    setIsModalCadastroAberto(false);
    setNovoProduto({
      nome: "",
      valor: "",
    });
  };

  const handleInputChangeCadastro = (e) => {
    const { name, value } = e.target;
    setNovoProduto((prevProduto) => ({
      ...prevProduto,
      [name]: value,
    }));
  };

  

  const handleCadastrarProduto = () => {
    fetch("http://localhost:5000/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoProduto),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setProdutos([...produtos, data]); // Adiciona o novo produto à lista
        handleFecharModalCadastro();
      })
      .catch((err) => console.log(err));
  };

  const handleExcluirClick = (produto) => {
    setProdutoSelecionado(produto);
    setIsModalExclusaoAberto(true);
  };

  const handleCancelarExclusao = () => {
    setProdutoSelecionado(null);
    setIsModalExclusaoAberto(false);
  };

  const handleExcluir = () => {
    fetch(`http://localhost:5000/produtos/${produtoSelecionado.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setProdutos(produtos.filter((produto) => produto.id !== produtoSelecionado.id));
        setProdutoSelecionado(null);
        setIsModalExclusaoAberto(false);
      })
      .catch((err) => console.log(err));
  };

  const handleEditarClick = (produto) => {
    setProdutoSelecionado(produto);
    setIsModalEdicaoAberto(true);
  };

  const handleFecharModalEdicao = () => {
    setProdutoSelecionado(null);
    setIsModalEdicaoAberto(false);
  };

  const handleSalvarEdicao = () => {
    fetch(`http://localhost:5000/produtos/${produtoSelecionado.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produtoSelecionado),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        // Atualize o estado local com os dados atualizados do servidor, se necessário
        setProdutos(produtos.map(p => (p.id === produtoSelecionado.id ? produtoSelecionado : p)));
        setProdutoSelecionado(null);
        setIsModalEdicaoAberto(false);
      })
      .catch((err) => console.log(err));
  };
  

  useEffect(() => {
    fetch("http://localhost:5000/produtos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setProdutos(data);
      })
      .catch((err) => console.log(err));
  }, []);

  

  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Produtos</h1>
      </div>

      
      <div className={styles.div_relatorio}>
        <ul className={styles.ul_cards}>
          {produtos.map((produto) => (
            <li key={produto.id} className={styles.li_cards}>
              <p>
                <strong>ID:</strong> {produto.id}
              </p>
              <p>
                <strong>Nome:</strong> {produto.nome}
              </p>
              <p>
                <strong>Valor:</strong> {produto.valor}
              </p>
              <div className={styles.buttons}>
                
                <button
                  className={styles.button2_cards}
                  onClick={() => handleEditarClick(produto)}
                >
                  Comprar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {produtoSelecionado && isModalExclusaoAberto && (
        <div className={styles.modal_exclusao}>
          <p>
            Tem certeza que deseja excluir o produto{" "}
            <strong>{produtoSelecionado.nome}</strong>?
          </p>
          <div className={styles.modal_botoes}>
            <button onClick={handleExcluir}>Sim</button>
            <button onClick={handleCancelarExclusao}>Cancelar</button>
          </div>
        </div>
      )}

{produtoSelecionado && isModalEdicaoAberto && (
  <div className={styles.modal_edicao}>
    <p>
      Editar informações do produto{" "}
      <strong>{produtoSelecionado.nome}</strong>:
    </p>
    <div className={styles.form_edicao}>
      <label>
        Nome:
        <input
          type="text"
          name="nome"
          value={produtoSelecionado.nome}
          onChange={(e) => setProdutoSelecionado({ ...produtoSelecionado, nome: e.target.value })}
        />
      </label>
      <label>
        Valor:
        <input
          type="text"
          name="valor"
          value={produtoSelecionado.valor}
          onChange={(e) => setProdutoSelecionado({ ...produtoSelecionado, valor: e.target.value })}
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
          <p>Cadastre um novo produto:</p>
          <div className={styles.form_cadastro}>
            <label>
              Nome:
              <input
                type="text"
                name="nome"
                value={novoProduto.nome}
                onChange={handleInputChangeCadastro}
              />
            </label>
            <label>
              Valor:
              <input
                type="text"
                name="valor"
                value={novoProduto.valor}
                onChange={handleInputChangeCadastro}
              />
            </label>
          </div>
          <p></p>
          <div className={styles.modal_botoes}>
            <button onClick={handleCadastrarProduto}>Cadastrar</button>
            <button onClick={handleFecharModalCadastro}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RelatorioProduto;
