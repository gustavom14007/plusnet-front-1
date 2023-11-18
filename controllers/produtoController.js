// controllers/produtoController.js

const banco = require('../database/main-db');

async function cadastrarProduto(req, res) {
    try {
        const { nome, descricao, preco, precoPromocional, idLoja } = req.body;

        // Validar entrada
        if (!nome || !descricao || !preco || !idLoja) {
            return res.status(400).json({ error: 'Dados incompletos para cadastrar o produto.' });
        }

        const query = 'INSERT INTO Produtos (nome, descricao, preco, precoPromocional, idLoja) VALUES (?, ?, ?, ?, ?)';
        const results = await banco.conn.query(query, [nome, descricao, preco, precoPromocional, idLoja]);

        res.status(201).json({ message: 'Produto cadastrado com sucesso.', data: { id: results.insertId, nome, descricao, preco, precoPromocional, idLoja } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar produto.' });
    }
}

async function listarProdutos(req, res) {
    try {
        const query = 'SELECT * FROM Produtos';
        const results = await banco.conn.query(query);

        res.status(200).json({ data: { products: results } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar produtos.' });
    }
}

async function obterProdutoPorId(req, res) {
    try {
        const produtoID = req.params.produtoID;

        const query = 'SELECT * FROM Produtos WHERE idProduto = ?';
        const results = await banco.conn.query(query, [produtoID]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        res.status(200).json({ data: { product: results[0] } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao obter o produto.' });
    }
}

async function atualizarProdutoPorId(req, res) {
    try {
        const produtoID = req.params.produtoID;
        const { nome, descricao, preco, precoPromocional } = req.body;

        // Validar entrada
        if (!nome || !descricao || !preco) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar o produto.' });
        }

        const query = 'UPDATE Produtos SET nome = ?, descricao = ?, preco = ?, precoPromocional = ? WHERE idProduto = ?';
        await banco.conn.query(query, [nome, descricao, preco, precoPromocional, produtoID]);

        res.status(200).json({ message: 'Produto atualizado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o produto.' });
    }
}

async function deletarProdutoPorId(req, res) {
    try {
        const produtoID = req.params.produtoID;

        const query = 'DELETE FROM Produtos WHERE idProduto = ?';
        const results = await banco.conn.query(query, [produtoID]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar o produto.' });
    }
}

module.exports = {
    cadastrarProduto,
    listarProdutos,
    obterProdutoPorId,
    atualizarProdutoPorId,
    deletarProdutoPorId,
};
