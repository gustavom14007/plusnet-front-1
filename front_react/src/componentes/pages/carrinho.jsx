import React, { useState, useEffect } from "react";
import styles from "../styles/relatorioCliente.module.css";

function Carrinho() {
  const [producao, setProducao] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [quantidadePessoas, setQuantidadePessoas] = useState(1);
  const [valorPorPessoa, setValorPorPessoa] = useState(null);
  const [pedidoId, setPedidoId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/relatorio-producao", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setProducao(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFecharConta = (pedidoId) => {
    setModalAberto(true);
    setPedidoId(pedidoId);
  };

  const handleConfirmarCarrinho = () => {
    // Lógica para obter o valor por pessoa após o clique em "Confirmar"
    fetch(`http://localhost:5000/pedidos/${pedidoId}/Carrinho`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numeroPessoas: quantidadePessoas }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        return resp.json();
      })
      .then((data) => {
        setValorPorPessoa(data.valorPorPessoa);
      })
      .catch((err) => {
        console.error("Erro na requisição:", err.message);
      });
  
    // Lógica adicional, se necessário
  };
  
  

  const handleFinalizarCarrinho = () => {
    // Lógica para finalizar o Carrinho, atualizar o status do pedido, etc.
    fetch(`http://localhost:5000/pedidos/${pedidoId}/Carrinho`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numeroPessoas: quantidadePessoas }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        return resp.json();
      })
      .then((data) => {
        console.log(data); // Mensagem de sucesso ou erro da API
        setModalAberto(false); // Fechar o modal
        setValorPorPessoa(null);
        setPedidoId(null);
        setQuantidadePessoas(1);
        window.location.reload(); // Recarregar a página após finalizar o Carrinho
      })
      .catch((err) => console.log(err));
  };
  
  

  const handleCancelarCarrinho = () => {
    setModalAberto(false);
    setPedidoId(null);
    setValorPorPessoa(null);
    setQuantidadePessoas(1);
  };

  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Carrinho</h1>
      </div>

      <div className={styles.div_relatorio}>
        <ul className={styles.ul_cards}>
          {producao.map((item) => (
            <li key={item.id} className={styles.li_cards}>
              <p>
                <strong>Pedido ID:</strong> {item.pedidoId}
              </p>
              <p>
                <strong>Produto:</strong> {item.produto}
              </p>
              <p>
                <strong>Quantidade:</strong> {item.quantidade}
              </p>
              <p>
                <strong>Total do Pedido:</strong> {item.totalPedido}
              </p>
              <div className={styles.buttons}>
                <button
                  className={styles.button_cards}
                  onClick={() => handleFecharConta(item.pedidoId)}
                >
                  Fechar conta
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {modalAberto && (
        <div className={styles.modal_cadastro}>
          <p>Informe a quantidade de pessoas:</p>
          <input
            type="number"
            min="1"
            max="4" // Você pode ajustar o limite máximo aqui
            value={quantidadePessoas}
            onChange={(e) => setQuantidadePessoas(e.target.value)}
          />
          <p></p>
          <div className={styles.modal_botoes}>
            <button onClick={handleConfirmarCarrinho}>Confirmar</button>
            <button onClick={handleCancelarCarrinho}>Cancelar</button>
          </div>
          {valorPorPessoa !== null && (
            <>
              <p>Valor por pessoa: R$ {valorPorPessoa.toFixed(2)}</p>
              <div className={styles.modal_botoes}>
              <button onClick={handleFinalizarCarrinho} >Finalizar</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Carrinho;
