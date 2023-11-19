// marcaProdutoController.js

const banco = require('../database/main-db');

function criarRelacaoMarcaProduto(req, res) {
    try {
        const { idMarca, idProduto } = req.body;

        // Validar entrada
        if (!idMarca || !idProduto) {
            return res.status(400).json({ error: 'Dados incompletos para criar a relação Marca-Produto.' });
        }

        const query = 'INSERT INTO Marca_Produto (idMarca, idProduto) VALUES (?, ?)';
        banco.conn.query(query, [idMarca, idProduto], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao criar a relação Marca-Produto.' });
            }

            res.status(201).json({ message: 'Relação Marca-Produto criada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar a relação Marca-Produto.' });
    }
}

function listarRelacoesMarcaProduto(req, res) {
    try {
        const query = 'SELECT * FROM Marca_Produto';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar as relações Marca-Produto.' });
            }

            res.status(200).json({ relationships: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar as relações Marca-Produto.' });
    }
}

function deletarRelacaoMarcaProduto(req, res) {
    try {
        const idMarca = req.params.idMarca;
        const idProduto = req.params.idProduto;

        const query = 'DELETE FROM Marca_Produto WHERE idMarca = ? AND idProduto = ?';
        banco.conn.query(query, [idMarca, idProduto], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar a relação Marca-Produto.' });
            }

            res.status(200).json({ message: 'Relação Marca-Produto deletada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar a relação Marca-Produto.' });
    }
}

function atualizarRelacaoMarcaProduto(req, res) {
    try {
        const idMarca = req.params.idMarca;
        const idProduto = req.params.idProduto;
        const { novoIdMarca, novoIdProduto } = req.body;

        // Verifique se a relação Marca-Produto existente está sendo atualizada para novos valores
        if (!novoIdMarca || !novoIdProduto) {
            return res.status(400).json({ error: 'É necessário fornecer novos valores para a atualização.' });
        }

        const query = 'UPDATE Marca_Produto SET idMarca = ?, idProduto = ? WHERE idMarca = ? AND idProduto = ?';
        banco.conn.query(query, [novoIdMarca, novoIdProduto, idMarca, idProduto], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar a relação Marca-Produto.' });
            }

            res.status(200).json({ message: 'Relação Marca-Produto atualizada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar a relação Marca-Produto.' });
    }
}

module.exports = {
    criarRelacaoMarcaProduto,
    listarRelacoesMarcaProduto,
    deletarRelacaoMarcaProduto,
    atualizarRelacaoMarcaProduto
};
