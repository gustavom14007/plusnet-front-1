const banco = require('../database/main-db');

// carrinhoProdutoVarianteController.js

function adicionarProdutoVarianteAoCarrinho(req, res) {
    try {
        const { idProduto, idVariante, idCarrinho, dataAtualizacao } = req.body;

        // Validar entrada
        if (!idProduto || !idVariante || !idCarrinho || !dataAtualizacao) {
            return res.status(400).json({ error: 'Dados incompletos para adicionar produto variante ao carrinho.' });
        }

        const query = 'INSERT INTO Carrinho_Produto_Variante (idProduto, idVariante, idCarrinho, dataAtualizacao) VALUES (?, ?, ?, ?)';
        banco.conn.query(query, [idProduto, idVariante, idCarrinho, dataAtualizacao], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao adicionar produto variante ao carrinho.' });
            }

            res.status(201).json({ message: 'Produto variante adicionado ao carrinho com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao adicionar produto variante ao carrinho.' });
    }
}

function listarProdutosVariantesNoCarrinho(req, res) {
    try {
        const idCarrinho = req.params.idCarrinho;
        const query = 'SELECT * FROM Carrinho_Produto_Variante WHERE idCarrinho = ?';
        banco.conn.query(query, [idCarrinho], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar produtos variantes no carrinho.' });
            }

            res.status(200).json({ cartProducts: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar produtos variantes no carrinho.' });
    }
}

function atualizarProdutoVarianteNoCarrinho(req, res) {
    try {
        const idProduto = req.params.idProduto;
        const idCarrinho = req.params.idCarrinho;
        const { idVariante, dataAtualizacao } = req.body;

        // Validar entrada
        if (!idProduto || !idVariante || !idCarrinho || !dataAtualizacao) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar produto variante no carrinho.' });
        }

        const query = 'UPDATE Carrinho_Produto_Variante SET idVariante = ?, dataAtualizacao = ? WHERE idProduto = ? AND idCarrinho = ?';
        banco.conn.query(query, [idVariante, dataAtualizacao, idProduto, idCarrinho], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o produto variante no carrinho.' });
            }

            res.status(200).json({ message: 'Produto variante no carrinho atualizado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar produto variante no carrinho.' });
    }
}

function deletarProdutoVarianteDoCarrinho(req, res) {
    try {
        const idProduto = req.params.idProduto;
        const idCarrinho = req.params.idCarrinho;

        const query = 'DELETE FROM Carrinho_Produto_Variante WHERE idProduto = ? AND idCarrinho = ?';
        banco.conn.query(query, [idProduto, idCarrinho], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o produto variante do carrinho.' });
            }

            res.status(200).json({ message: 'Produto variante do carrinho deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar produto variante do carrinho.' });
    }
}

module.exports = {
    adicionarProdutoVarianteAoCarrinho,
    listarProdutosVariantesNoCarrinho,
    atualizarProdutoVarianteNoCarrinho,
    deletarProdutoVarianteDoCarrinho
};
