import React, { useState, useEffect } from "react";
import styles from "../styles/pedidos.module.css";

function Pedidos() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidadeProduto, setQuantidadeProduto] = useState(1);
  const [isModalAberto, setIsModalAberto] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/produtos/produtos", {
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

  const handleAdicionarAoCarrinho = () => {
    // Lógica para adicionar ao carrinho
    fetch("http://localhost:5000/adicionarAoCarrinho", {
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
        setIsModalAberto(false);
        // Adicionar lógica de sucesso ou tratamento de erro, se necessário
      })
      .catch((err) => console.log(err));
  };

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
            <button onClick={handleAdicionarAoCarrinho}>Adicionar ao Carrinho</button>
            <button onClick={() => setIsModalAberto(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedidos;
