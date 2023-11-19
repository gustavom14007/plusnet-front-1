// grupoProdutoController.js

const banco = require('../database/main-db');

function criarRelacaoGrupoProduto(req, res) {
    try {
        const { idGrupo, idProduto } = req.body;

        // Validar entrada
        if (!idGrupo || !idProduto) {
            return res.status(400).json({ error: 'Dados incompletos para criar a relação Grupo-Produto.' });
        }

        const query = 'INSERT INTO Grupo_Produto (idGrupo, idProduto) VALUES (?, ?)';
        banco.conn.query(query, [idGrupo, idProduto], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao criar a relação Grupo-Produto.' });
            }

            res.status(201).json({ message: 'Relação Grupo-Produto criada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar a relação Grupo-Produto.' });
    }
}

function listarRelacoesGrupoProduto(req, res) {
    try {
        const query = 'SELECT * FROM Grupo_Produto';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar as relações Grupo-Produto.' });
            }

            res.status(200).json({ relationships: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar as relações Grupo-Produto.' });
    }
}

function deletarRelacaoGrupoProduto(req, res) {
    try {
        const idGrupo = req.params.idGrupo;
        const idProduto = req.params.idProduto;

        const query = 'DELETE FROM Grupo_Produto WHERE idGrupo = ? AND idProduto = ?';
        banco.conn.query(query, [idGrupo, idProduto], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar a relação Grupo-Produto.' });
            }

            res.status(200).json({ message: 'Relação Grupo-Produto deletada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar a relação Grupo-Produto.' });
    }
}

function atualizarRelacaoGrupoProduto(req, res) {
    try {
        const idGrupo = req.params.idGrupo;
        const idProduto = req.params.idProduto;
        const { novoIdGrupo, novoIdProduto } = req.body;

        // Verifique se a relação Grupo-Produto existente está sendo atualizada para novos valores
        if (!novoIdGrupo || !novoIdProduto) {
            return res.status(400).json({ error: 'É necessário fornecer novos valores para a atualização.' });
        }

        const query = 'UPDATE Grupo_Produto SET idGrupo = ?, idProduto = ? WHERE idGrupo = ? AND idProduto = ?';
        banco.conn.query(query, [novoIdGrupo, novoIdProduto, idGrupo, idProduto], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar a relação Grupo-Produto.' });
            }

            res.status(200).json({ message: 'Relação Grupo-Produto atualizada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar a relação Grupo-Produto.' });
    }
}

module.exports = {
    criarRelacaoGrupoProduto,
    listarRelacoesGrupoProduto,
    deletarRelacaoGrupoProduto,
    atualizarRelacaoGrupoProduto
};
