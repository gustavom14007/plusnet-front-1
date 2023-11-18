import React, { useState, useEffect } from "react";
import styles from "../styles/relatorioCliente.module.css";

function RelatorioProducao() {
  const [producao, setProducao] = useState([]);

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

  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Relatório de Produção</h1>
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
              {/* Adicione aqui os campos específicos do relatório de produção */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RelatorioProducao;
