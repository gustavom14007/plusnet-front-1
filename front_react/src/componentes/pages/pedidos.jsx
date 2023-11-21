import React, { useState, useEffect } from "react";
import styles from "../styles/pedidos.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

function Pedidos() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidadeProduto, setQuantidadeProduto] = useState(1);
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState(null);
  const [CarrinhoID, setCarrinhoID] = useState(() => {
    // Verifica se há um CarrinhoID no localStorage
    const localCarrinhoID = localStorage.getItem("CarrinhoID");
    return localCarrinhoID ? localCarrinhoID : null;
  });

  useEffect(() => {
    fetch("http://localhost:3000/produtos/produtos")
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Erro ao carregar produtos.");
        }
        return resp.json();
      })
      .then((data) => {
        console.log("Dados recebidos:", data);

        setProdutos(data.data.products); // Ajuste aqui para refletir a estrutura dos dados
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
        setErroCarregamento(err.message);
      });
  }, []);

  console.log("Produtos:", produtos);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");

  const handleFiltrar = () => {
    // Lógica para buscar produtos com base nos filtros
    fetch(
      `http://localhost:3000/produtos/produtos?nome=${filtroNome}&marca=${filtroMarca}`
    )
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Erro ao filtrar produtos.");
        }
        return resp.json();
      })
      .then((data) => {
        setProdutos(data.data.products);
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
        setErroCarregamento(err.message);
      });
  };

  const handleAdicionarAoCarrinho = () => {
    if (!produtoSelecionado) {
      alert("Selecione um produto antes de adicionar ao carrinho.");
      return;
    }

    // Lógica para adicionar ao carrinho
    fetch("http://localhost:3000/carrinhoFuncional/adicionarAoCarrinho", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        CarrinhoID
          ? {
              produtoID: produtoSelecionado.id,
              quantidade: quantidadeProduto,
              carrinhoID: CarrinhoID,
              acao: "adicionar",
            }
          : {
              produtoID: produtoSelecionado.id,
              quantidade: quantidadeProduto,
              acao: "adicionar",
            }
      ),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Erro ao adicionar ao carrinho.");
        }

        return resp.json();
      })
      .then((data) => {
        console.log("Resposta da API:", data); // Adicione este log para verificar a resposta da API
        // Lógica adicional, se necessário
        alert("Produto adicionado ao carrinho com sucesso!");
        // Verifica se há CarrinhoID na resposta da API e, se não existir no estado, atualiza o estado

        setCarrinhoID(data.carrinhoID);
        // Salva o CarrinhoID no localStorage para uso futuro
        localStorage.setItem("CarrinhoID", data.carrinhoID);

        setIsModalAberto(false);
        // Adicionar lógica de sucesso ou tratamento de erro, se necessário
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao adicionar ao carrinho. Tente novamente mais tarde.");
        // Adicionar lógica de tratamento de erro, se necessário
      });
  };

  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Produtos</h1>
      </div>

      {/* Área de filtro */}
      <div className={`filter-container ${styles.div_relatorio}`}>
        <div>
          <label htmlFor="filtroNome">Nome:</label>
          <input
            type="text"
            id="filtroNome"
            className={`filter-input ${styles.input}`}
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="filtroMarca">Marca:</label>
          <input
            type="text"
            id="filtroMarca"
            className={`filter-input ${styles.input}`}
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
          />
        </div>

        <button
          className={`filter-button ${styles.button}`}
          onClick={handleFiltrar}
        >
          Filtrar
        </button>
      </div>
      {erroCarregamento && <p>{erroCarregamento}</p>}

      <div className={styles.div_relatorio}>
        <ul className={styles.ul_cards}>
          {Array.isArray(produtos) &&
            produtos.map((produto) => (
              <li key={produto.id} className={styles.li_cards}>
                <div className={styles.iconContainer}>
                  {produto.imagem ? (
                    <img
                      className={styles.produtoImagem}
                      src={produto.imagem}
                      alt={`Imagem de ${produto.nome}`}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faImage} className={styles.icon} />
                  )}
                </div>
                <p>
                  <strong>Nome:</strong> {produto.nome}
                </p>
                <p>
                  <strong>Marca:</strong> {produto.marca}
                </p>
                <p>
                  <strong>Preço:</strong> {produto.preco}
                </p>
                <p>
                  <strong>Preço Promocional:</strong> {produto.precoPromocional}
                </p>
                <div className={styles.buttons}>
                  <button
                    className={styles.button2_cards}
                    onClick={() => {
                      setProdutoSelecionado(produto);
                      setIsModalAberto(true);
                    }}
                  >
                    Adicionar ao carrinho
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {produtoSelecionado && isModalAberto && (
        <div className={styles.modal_cadastro}>
          <p>Informe a quantidade do produto:</p>
          <input
            type="number"
            min="1"
            value={quantidadeProduto}
            onChange={(e) => setQuantidadeProduto(e.target.value)}
          />
          <div className={styles.modal_botoes}>
            <button onClick={handleAdicionarAoCarrinho}>
              Adicionar ao Carrinho
            </button>
            <button onClick={() => setIsModalAberto(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedidos;
