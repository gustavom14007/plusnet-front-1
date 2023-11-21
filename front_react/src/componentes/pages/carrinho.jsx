import React, { useState, useEffect } from "react";
import styles from "../styles/relatorioCliente.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

function Carrinho() {
  const [produtos, setProdutos] = useState([]);
  const [loadInicial, setLoadInicial] = useState(false);
  const [quantidadePessoas, setQuantidadePessoas] = useState(1);
  const [valorPorPessoa, setValorPorPessoa] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const navigate = useNavigate();
  const [CarrinhoID, setCarrinhoID] = useState(() => {
    console.log(
      "useState definir carrinhoID " + localStorage.getItem("CarrinhoID")
    );
    return parseInt(localStorage.getItem("CarrinhoID"));
  });

  useEffect(() => {
    if (!CarrinhoID || !localStorage.getItem("CarrinhoID")) {
      navigate("/pedidos");
      return;
    }

    console.log(CarrinhoID);

    console.log(CarrinhoID);
    if (CarrinhoID) {
      fetch("http://localhost:3000/carrinhoFuncional/adicionarAoCarrinho", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carrinhoID: parseInt(CarrinhoID),

          inserir: "false",
        }),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Erro ao carregar produtos.");
          }
          return resp.json();
        })
        .then((data) => {
          console.log(data.produtosLista.produtos);
          setProdutos(data.produtosLista.produtos);
        })
        .catch((err) => {
          console.error("Erro na requisição:", err);
        });
    }
  }, [CarrinhoID, loadInicial, navigate]);

  const handleRemoverProduto = (produtoId) => {
    // Lógica para remover o produto do carrinho
    fetch("http://localhost:3000/carrinhoFuncional/adicionarAoCarrinho", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carrinhoID: parseInt(CarrinhoID),
        produtoID: produtoId,
        quantidade: 0, //corrigir quantidade
        acao: "removerProduto",
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Erro ao carregar produtos.");
        }
        return resp.json();
      })
      .then((data) => {
        setProdutos(data.produtosLista.produtos);
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
      });
  };

  const handleAdicionarQuantidade = (produtoId) => {
    // Lógica para aumentar a quantidade do produto
    // Lógica para remover o produto do carrinho
    fetch("http://localhost:3000/carrinhoFuncional/adicionarAoCarrinho", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carrinhoID: parseInt(CarrinhoID),
        produtoID: produtoId,
        quantidade: 0, //corrigir quantidade
        acao: "adicionar",
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Erro ao carregar produtos.");
        }
        return resp.json();
      })
      .then((data) => {
        setProdutos(data.produtosLista.produtos);
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
      });
  };

  const handleRemoverQuantidade = (produtoId) => {
    // Lógica para diminuir a quantidade do produto
    // Lógica para remover o produto do carrinho
    fetch("http://localhost:3000/carrinhoFuncional/adicionarAoCarrinho", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carrinhoID: parseInt(CarrinhoID),
        produtoID: produtoId,
        quantidade: 0, //corrigir quantidade
        acao: "remover",
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Erro ao carregar produtos.");
        }
        return resp.json();
      })
      .then((data) => {
        setProdutos(data.produtosLista.produtos);
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
      });
  };

  const handleFinalizarCompra = () => {
    // Lógica para finalizar a compra
    // criarPedido
    fetch("http://localhost:3000/carrinhoFuncional/criarPedido", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carrinhoID: parseInt(CarrinhoID),
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Erro ao procurar carrinho.");
        }
        return resp.json();
      })
      .then((data) => {
        // setProdutos(data.produtosLista.produtos);
        alert("carrinho transformado em pedido com sucesso!");
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
      });
  };

  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Carrinho</h1>
      </div>

      <div className={styles.div_relatorio}>
        <ul className={styles.ul_cards}>
          {Array.isArray(produtos) &&
            produtos.map((produto) => (
              <li key={produto.id} className={styles.li_cards}>
                <div className={styles.produtoContainer}>
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
                  <div className={styles.infoContainer}>
                    <p className={styles.produtoNome}>
                      <strong>Nome:</strong> {produto.nome}
                    </p>
                    <p>
                      <strong>Marca:</strong> {produto.marca}
                    </p>
                    <p>
                      <strong>Preço:</strong> {produto.preco}
                    </p>
                    <p>
                      <strong>Preço Promocional:</strong>{" "}
                      {produto.precoPromocional}
                    </p>
                  </div>
                  <div className={styles.buttonsContainer}>
                    <button
                      className={styles.buttonCards}
                      onClick={() => handleRemoverProduto(produto.id)}
                    >
                      Remover
                    </button>
                    <div className={styles.quantidadeContainer}>
                      <button
                        className={styles.buttonQuantidade}
                        onClick={() => handleRemoverQuantidade(produto.id)}
                      >
                        -
                      </button>
                      <input
                        className={styles.inputQuantidade}
                        type="number"
                        value={produto.quantidade}
                        readOnly
                      />
                      <button
                        className={styles.buttonQuantidade}
                        onClick={() => handleAdicionarQuantidade(produto.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>

      <div className={styles.totalContainer}>
        <p className={styles.totalLabel}>Total:</p>
        <p className={styles.totalValue}>
          R$ {valorPorPessoa !== null ? valorPorPessoa.toFixed(2) : "0.00"}
        </p>
      </div>

      <div className={styles.finalizarContainer}>
        <button
          className={styles.buttonFinalizar}
          onClick={handleFinalizarCompra}
        >
          Finalizar Pedido
        </button>
      </div>

      {modalAberto && (
        <div className={styles.modalCadastro}>
          <p>Informe a quantidade de pessoas:</p>
          <input
            type="number"
            min="1"
            max="4"
            value={quantidadePessoas}
            onChange={(e) => setQuantidadePessoas(e.target.value)}
          />
          <div className={styles.modalBotoes}>
            {/* <button onClick={handleConfirmarCarrinho}>Confirmar</button> */}
            {/* <button onClick={handleCancelarCarrinho}>Cancelar</button> */}
          </div>
          {valorPorPessoa !== null && (
            <>
              <p>Valor por pessoa: R$ {valorPorPessoa.toFixed(2)}</p>
              <div className={styles.modalBotoes}>
                {/* <button onClick={handleFinalizarCarrinho}>Finalizar</button> */}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Carrinho;
