import React, { useState, useEffect } from "react";
import styles from "../styles/pedidos.module.css";

function Pedidos() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidadeProduto, setQuantidadeProduto] = useState(1);
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState(null);

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

  const handleAdicionarAoCarrinho = () => {
    if (!produtoSelecionado) {
      alert("Selecione um produto antes de adicionar ao carrinho.");
      return;
    }
  
    // Lógica para adicionar ao carrinho
    fetch("http://localhost:3000/adicionarAoCarrinho", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        produtoID: produtoSelecionado.id,
        quantidade: quantidadeProduto,
      }),
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

      {erroCarregamento && <p>{erroCarregamento}</p>}

      <div className={styles.div_relatorio}>
        <ul className={styles.ul_cards}>
          {Array.isArray(produtos) &&
            produtos.map((produto) => (
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
