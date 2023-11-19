const banco = require('../database/main-db');

// pedidoProdutoVarianteController.js

function relacionarProdutoVariantePedido(req, res) {
    try {
        const { idProduto, idVariante, idPedido } = req.body;

        // Validar entrada
        if (!idProduto || !idVariante || !idPedido) {
            return res.status(400).json({ error: 'Dados incompletos para relacionar produto variante ao pedido.' });
        }

        const query = 'INSERT INTO Pedido_Produto_Variante (idProduto, idVariante, idPedido) VALUES (?, ?, ?)';
        banco.conn.query(query, [idProduto, idVariante, idPedido], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao relacionar produto variante ao pedido.' });
            }

            res.status(201).json({ message: 'Produto variante relacionado ao pedido com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao relacionar produto variante ao pedido.' });
    }
}

function listarRelacoesProdutoVariantePedido(req, res) {
    try {
        const query = 'SELECT * FROM Pedido_Produto_Variante';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar os registros de Pedido_Produto_Variante.' });
            }

            res.status(200).json({ orderProductVariants: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar os registros de Pedido_Produto_Variante.' });
    }
}

function atualizarRelacaoProdutoVariantePedido(req, res) {
    try {
        const idPedido = req.params.idPedido;
        const idVariante = req.params.idVariante;
        const { idProduto } = req.body;

        // Validar entrada
        if (!idProduto) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar o registro em Pedido_Produto_Variante.' });
        }

        const query = 'UPDATE Pedido_Produto_Variante SET idProduto = ? WHERE idPedido = ? AND idVariante = ?';
        banco.conn.query(query, [idProduto, idPedido, idVariante], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o registro em Pedido_Produto_Variante.' });
            }

            res.status(200).json({ message: 'Registro em Pedido_Produto_Variante atualizado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o registro em Pedido_Produto_Variante.' });
    }
}

function deletarRelacaoProdutoVariantePedido(req, res) {
    try {
        const idPedido = req.params.idPedido;
        const idVariante = req.params.idVariante;

        const query = 'DELETE FROM Pedido_Produto_Variante WHERE idPedido = ? AND idVariante = ?';
        banco.conn.query(query, [idPedido, idVariante], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o registro em Pedido_Produto_Variante.' });
            }

            res.status(200).json({ message: 'Registro em Pedido_Produto_Variante deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar o registro em Pedido_Produto_Variante.' });
    }
}

module.exports = {
    relacionarProdutoVariantePedido,
    listarRelacoesProdutoVariantePedido,
    atualizarRelacaoProdutoVariantePedido,
    deletarRelacaoProdutoVariantePedido
};
