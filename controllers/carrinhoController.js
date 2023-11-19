const banco = require('../database/main-db');


// carrinhoController.js

function cadastrarCarrinho(req, res) {
    try {
        const { idCliente, dataPublicacao, dataAtualizacao, idLoja } = req.body;

        // Validar entrada
        if (!idCliente || !dataPublicacao || !dataAtualizacao || !idLoja) {
            return res.status(400).json({ error: 'Dados incompletos para cadastrar carrinho.' });
        }

        const query = 'INSERT INTO Carrinhos (idCliente, dataPublicacao, dataAtualizacao, idLoja) VALUES (?, ?, ?, ?)';
        banco.conn.query(query, [idCliente, dataPublicacao, dataAtualizacao, idLoja], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar carrinho.' });
            }

            res.status(201).json({ message: 'Carrinho cadastrado com sucesso.', cart: { id: results.insertId, idCliente, dataPublicacao, dataAtualizacao, idLoja } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar carrinho.' });
    }
}

function listarCarrinhos(req, res) {
    try {
        const query = 'SELECT * FROM Carrinhos';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar carrinhos.' });
            }

            res.status(200).json({ carts: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar carrinhos.' });
    }
}

function atualizarCarrinhoPorId(req, res) {
    try {
        const carrinhoID = req.params.carrinhoID;
        const { idCliente, dataPublicacao, dataAtualizacao, idLoja } = req.body;

        // Validar entrada
        if (!idCliente || !dataPublicacao || !dataAtualizacao || !idLoja) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar carrinho.' });
        }

        const query = 'UPDATE Carrinhos SET idCliente = ?, dataPublicacao = ?, dataAtualizacao = ?, idLoja = ? WHERE idCarrinho = ?';
        banco.conn.query(query, [idCliente, dataPublicacao, dataAtualizacao, idLoja, carrinhoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o carrinho.' });
            }

            res.status(200).json({ message: 'Carrinho atualizado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar carrinho.' });
    }
}

function deletarCarrinhoPorId(req, res) {
    try {
        const carrinhoID = req.params.carrinhoID;

        const query = 'DELETE FROM Carrinhos WHERE idCarrinho = ?';
        banco.conn.query(query, [carrinhoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o carrinho.' });
            }

            res.status(200).json({ message: 'Carrinho deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar carrinho.' });
    }
}

module.exports = {
    cadastrarCarrinho,
    listarCarrinhos,
    atualizarCarrinhoPorId,
    deletarCarrinhoPorId
};
