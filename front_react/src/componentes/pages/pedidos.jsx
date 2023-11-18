import React, { useState, useEffect } from "react";
import styles from "../styles/pedidos.module.css";

function Pedidos() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
  const [isModalSucessoAberto, setIsModalSucessoAberto] = useState(false);
  const [quantidadeProduto, setQuantidadeProduto] = useState(1);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    valor: "",
  });
  const [isMensagemVisivel, setIsMensagemVisivel] = useState(false);

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

  const handleFecharAoPedido = () => {
    // Lógica para adicionar o produto ao pedido
    fetch("http://localhost:5000/pedidos/adicionar-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        produtoId: produtoSelecionado.id,
        quantidade: quantidadeProduto,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        // Lógica adicional, se necessário
        handleFecharModalCadastro();
        setIsModalSucessoAberto(true);
        setIsMensagemVisivel(true);
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

  useEffect(() => {
    if (isMensagemVisivel) {
      const timeoutId = setTimeout(() => {
        setIsMensagemVisivel(false);
      }, 1000); // 1000 ms = 1 segundo

      return () => clearTimeout(timeoutId);
    }
  }, [isMensagemVisivel]);

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
                  onClick={() => {
                    setProdutoSelecionado(produto);
                    setIsMensagemVisivel(true); // Mostrar a mensagem ao clicar no botão
                  }}
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {produtoSelecionado && isModalCadastroAberto && (
        <div className={styles.modal_cadastro}>
          <p>Informe a quantidade do produto:</p>
          <input
            type="number"
            min="1"
            value={quantidadeProduto}
            onChange={(e) => setQuantidadeProduto(e.target.value)}
          />
          <p></p>
          <div className={styles.modal_botoes}>
            <button onClick={handleFecharAoPedido}>Fechar o Pedido</button>
            <button onClick={handleFecharModalCadastro}>Cancelar</button>
          </div>
        </div>
      )}

      {produtoSelecionado && isModalSucessoAberto && (
        <div className={styles.modal_cadastro}>
          <p>Pedido finalizado!</p>
          <div className={styles.modal_botoes}>
            <button onClick={() => setIsModalSucessoAberto(false)}>OK</button>
          </div>
        </div>
      )}

      {isMensagemVisivel && (
        <div className={styles.modal_cadastro}>
          Produto adicionado ao carrinho!
        </div>
      )}
    </div>
  );
}

export default Pedidos;
