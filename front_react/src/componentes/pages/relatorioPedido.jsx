import React, { useState, useEffect } from "react";
import styles from "../styles/relatorioProduto.module.css";

function RelatorioPedido() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [isModalExclusaoAberto, setIsModalExclusaoAberto] = useState(false);
  const [isModalEdicaoAberto, setIsModalEdicaoAberto] = useState(false);
  const [edicaoPedido, setEdicaoPedido] = useState({
    total: "",
    status: "",
  });

  const handleExcluirClick = (pedido) => {
    setPedidoSelecionado(pedido);
    setIsModalExclusaoAberto(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEdicaoPedido((prevPedido) => ({
      ...prevPedido,
      [name]: value,
    }));
  };

  const handleCancelarExclusao = () => {
    setPedidoSelecionado(null);
    setIsModalExclusaoAberto(false);
  };

  const handleExcluir = () => {
    fetch(`http://localhost:5000/pedidos/${pedidoSelecionado.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setPedidoSelecionado(null);
        setIsModalExclusaoAberto(false);
        reloadPage();
      })
      .catch((err) => console.log(err));
  };

  const handleEditarClick = (pedido) => {
    setPedidoSelecionado(pedido);
    setEdicaoPedido({
      total: pedido.total,
      status: pedido.status ? "Ativo" : "Inativo",
    });
    setIsModalEdicaoAberto(true);
  };

  const handleFecharModalEdicao = () => {
    setIsModalEdicaoAberto(false);
    setEdicaoPedido({
      total: "",
      status: "",
    });
  };

  const handleSalvarEdicao = () => {
    fetch(`http://localhost:5000/pedidos/${pedidoSelecionado.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        total: edicaoPedido.total,
        status: edicaoPedido.status === "Ativo" ? 1 : 0,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setPedidoSelecionado(null);
        setIsModalEdicaoAberto(false);
        reloadPage();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch("http://localhost:5000/pedidos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setPedidos(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Pedidos</h1>
      </div>

      <div className={styles.div_relatorio}>
        <ul className={styles.ul_cards}>
          {pedidos.map((pedido) => (
            <li key={pedido.id} className={styles.li_cards}>
              <p>
                <strong>ID:</strong> {pedido.id}
              </p>
              <p>
                <strong>Total:</strong> {pedido.total}
              </p>
              <p>
                <strong>Status:</strong> {pedido.status ? "Ativo" : "Inativo"}
              </p>
              <div className={styles.buttons}>
                <button
                  className={styles.button_cards}
                  onClick={() => handleExcluirClick(pedido)}
                >
                  Excluir
                </button>
                <button
                  className={styles.button2_cards}
                  onClick={() => handleEditarClick(pedido)}
                >
                  Editar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {pedidoSelecionado && isModalExclusaoAberto && (
        <div className={styles.modal_exclusao}>
          <p>
            Tem certeza que deseja excluir o pedido{" "}
            <strong>{pedidoSelecionado.id}</strong>?
          </p>
          <div className={styles.modal_botoes}>
            <button onClick={handleExcluir}>Sim</button>
            <button onClick={handleCancelarExclusao}>Cancelar</button>
          </div>
        </div>
      )}

      {pedidoSelecionado && isModalEdicaoAberto && (
        <div className={styles.modal_edicao}>
          <p>
            Editar informações do pedido{" "}
            <strong>{pedidoSelecionado.id}</strong>:
          </p>
          <div className={styles.form_edicao}>
            <label>
              Total:
              <input
                type="text"
                name="total"
                value={edicaoPedido.total}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Status:
              <input
                type="text"
                name="status"
                value={edicaoPedido.status}
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
    </div>
  );
}

export default RelatorioPedido;
