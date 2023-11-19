// pedidosController.js


const banco = require('../database/main-db');


function criarPedido(req, res) {
    try {
        const { quantidade, valorTotal, idLoja } = req.body;

        // Validar entrada
        if (!quantidade || !valorTotal || !idLoja) {
            return res.status(400).json({ error: 'Dados incompletos para criar o pedido.' });
        }

        const query = 'INSERT INTO Pedidos (quantidade, valorTotal, idLoja) VALUES (?, ?, ?)';
        banco.conn.query(query, [quantidade, valorTotal, idLoja], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar pedido.' });
            }

            res.status(201).json({ message: 'Pedido cadastrado com sucesso.', order: { id: results.insertId, quantidade, valorTotal, idLoja } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar pedido.' });
    }
}

function listarPedidos(req, res) {
    try {
        const query = 'SELECT * FROM Pedidos';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar pedidos.' });
            }

            res.status(200).json({ orders: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar pedidos.' });
    }
}

function atualizarPedido(req, res) {
    try {
        const pedidoID = req.params.pedidoID;
        const { quantidade, valorTotal } = req.body;

        // Validar entrada
        if (!quantidade || !valorTotal) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar o pedido.' });
        }

        const query = 'UPDATE Pedidos SET quantidade = ?, valorTotal = ? WHERE idPedido = ?';
        banco.conn.query(query, [quantidade, valorTotal, pedidoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o pedido.' });
            }

            res.status(200).json({ message: 'Pedido atualizado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o pedido.' });
    }
}

function deletarPedido(req, res) {
    try {
        const pedidoID = req.params.pedidoID;

        const query = 'DELETE FROM Pedidos WHERE idPedido = ?';
        banco.conn.query(query, [pedidoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o pedido.' });
            }

            res.status(200).json({ message: 'Pedido deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar o pedido.' });
    }
}

module.exports = {
    criarPedido,
    listarPedidos,
    atualizarPedido,
    deletarPedido
};
