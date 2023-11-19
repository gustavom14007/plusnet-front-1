// pedidoClienteController.js

const banco = require('../database/main-db');

function relacionarClienteAoPedido(req, res) {
    try {
        const { idPedido, idCliente } = req.body;

        // Validar entrada
        if (!idPedido || !idCliente) {
            return res.status(400).json({ error: 'Dados incompletos para relacionar cliente ao pedido.' });
        }

        const query = 'INSERT INTO Pedido_Cliente (idPedido, idCliente) VALUES (?, ?)';
        banco.conn.query(query, [idPedido, idCliente], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao relacionar cliente ao pedido.' });
            }

            res.status(201).json({ message: 'Cliente relacionado ao pedido com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao relacionar cliente ao pedido.' });
    }
}

function listarRegistrosPedidosCliente(req, res) {
    try {
        const query = 'SELECT * FROM Pedido_Cliente';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar os registros de Pedidos_Cliente.' });
            }

            res.status(200).json({ orderClients: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar registros de Pedidos_Cliente.' });
    }
}

function deletarRegistroPedidosCliente(req, res) {
    try {
        const idPedido = req.params.idPedido;
        const idCliente = req.params.idCliente;

        const query = 'DELETE FROM Pedido_Cliente WHERE idPedido = ? AND idCliente = ?';
        banco.conn.query(query, [idPedido, idCliente], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o registro em Pedidos_Cliente.' });
            }

            res.status(200).json({ message: 'Registro em Pedidos_Cliente deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar registro em Pedidos_Cliente.' });
    }
}

module.exports = {
    relacionarClienteAoPedido,
    listarRegistrosPedidosCliente,
    deletarRegistroPedidosCliente
};
