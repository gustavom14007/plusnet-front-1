// entregaPedidoController.js

const banco = require('../database/main-db');

function criarRelacaoEntregaPedido(req, res) {
    try {
        const { idEntrega, idPedido } = req.body;

        // Validar entrada
        if (!idEntrega || !idPedido) {
            return res.status(400).json({ error: 'Dados incompletos para criar a relação Entrega-Pedido.' });
        }

        const query = 'INSERT INTO Entrega_Pedido (idEntrega, idPedido) VALUES (?, ?)';
        banco.conn.query(query, [idEntrega, idPedido], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao criar a relação Entrega-Pedido.' });
            }

            res.status(201).json({ message: 'Relação Entrega-Pedido criada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar a relação Entrega-Pedido.' });
    }
}

function listarRelacoesEntregaPedido(req, res) {
    try {
        const query = 'SELECT * FROM Entrega_Pedido';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar as relações Entrega-Pedido.' });
            }

            res.status(200).json({ relationships: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar as relações Entrega-Pedido.' });
    }
}

function deletarRelacaoEntregaPedido(req, res) {
    try {
        const idEntrega = req.params.idEntrega;
        const idPedido = req.params.idPedido;

        const query = 'DELETE FROM Entrega_Pedido WHERE idEntrega = ? AND idPedido = ?';
        banco.conn.query(query, [idEntrega, idPedido], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar a relação Entrega-Pedido.' });
            }

            res.status(200).json({ message: 'Relação Entrega-Pedido deletada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar a relação Entrega-Pedido.' });
    }
}

function atualizarRelacaoEntregaPedido(req, res) {
    try {
        const idEntrega = req.params.idEntrega;
        const idPedido = req.params.idPedido;
        const { novoIdEntrega, novoIdPedido } = req.body;

        // Verificar se a relação Entrega-Pedido existente está sendo atualizada para novos valores
        if (!novoIdEntrega || !novoIdPedido) {
            return res.status(400).json({ error: 'É necessário fornecer novos valores para a atualização.' });
        }

        const query = 'UPDATE Entrega_Pedido SET idEntrega = ?, idPedido = ? WHERE idEntrega = ? AND idPedido = ?';
        banco.conn.query(query, [novoIdEntrega, novoIdPedido, idEntrega, idPedido], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar a relação Entrega-Pedido.' });
            }

            res.status(200).json({ message: 'Relação Entrega-Pedido atualizada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar a relação Entrega-Pedido.' });
    }
}

module.exports = {
    criarRelacaoEntregaPedido,
    listarRelacoesEntregaPedido,
    deletarRelacaoEntregaPedido,
    atualizarRelacaoEntregaPedido
};
