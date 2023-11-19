// varianteController.js

const banco = require('../database/main-db');

function cadastrarVariante(req, res) {
    try {
        const { idProduto, quantidade } = req.body;

        // Validar entrada
        if (!idProduto || !quantidade) {
            return res.status(400).json({ error: 'Dados incompletos para cadastrar a variante.' });
        }

        const query = 'INSERT INTO Variantes (idProduto, quantidade) VALUES (?, ?)';
        banco.conn.query(query, [idProduto, quantidade], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar variante.' });
            }

            res.status(201).json({ message: 'Variante cadastrada com sucesso.', variant: { id: results.insertId, idProduto, quantidade } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar variante.' });
    }
}

function listarVariantes(req, res) {
    try {
        const query = 'SELECT * FROM Variantes';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar variantes.' });
            }

            res.status(200).json({ variants: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar variantes.' });
    }
}

function atualizarVariantePorId(req, res) {
    try {
        const varianteID = req.params.varianteID;
        const { quantidade } = req.body;

        // Validar entrada
        if (!quantidade) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar a variante.' });
        }

        const query = 'UPDATE Variantes SET quantidade = ? WHERE idVariante = ?';
        banco.conn.query(query, [quantidade, varianteID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar a variante.' });
            }

            res.status(200).json({ message: 'Variante atualizada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar a variante.' });
    }
}

function deletarVariantePorId(req, res) {
    try {
        const varianteID = req.params.varianteID;

        const query = 'DELETE FROM Variantes WHERE idVariante = ?';
        banco.conn.query(query, [varianteID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar a variante.' });
            }

            res.status(200).json({ message: 'Variante deletada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar a variante.' });
    }
}

module.exports = {
    cadastrarVariante,
    listarVariantes,
    atualizarVariantePorId,
    deletarVariantePorId
};
