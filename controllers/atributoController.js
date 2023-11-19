// atributoController.js

const banco = require('../database/main-db');

function cadastrarAtributo(req, res) {
    try {
        const { idVariante, valorAtributo } = req.body;

        // Validar entrada
        if (!idVariante || !valorAtributo) {
            return res.status(400).json({ error: 'Dados incompletos para cadastrar o atributo.' });
        }

        const query = 'INSERT INTO Atributos (idVariante, valorAtributo) VALUES (?, ?)';
        banco.conn.query(query, [idVariante, valorAtributo], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar atributo.' });
            }

            res.status(201).json({ message: 'Atributo cadastrado com sucesso.', attribute: { id: results.insertId, idVariante, valorAtributo } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar atributo.' });
    }
}

function listarAtributos(req, res) {
    try {
        const query = 'SELECT * FROM Atributos';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar atributos.' });
            }

            res.status(200).json({ attributes: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar atributos.' });
    }
}

function atualizarAtributoPorId(req, res) {
    try {
        const atributoID = req.params.atributoID;
        const { valorAtributo } = req.body;

        // Validar entrada
        if (!valorAtributo) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar o atributo.' });
        }

        const query = 'UPDATE Atributos SET valorAtributo = ? WHERE idAtributo = ?';
        banco.conn.query(query, [valorAtributo, atributoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o atributo.' });
            }

            res.status(200).json({ message: 'Atributo atualizado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o atributo.' });
    }
}

function deletarAtributoPorId(req, res) {
    try {
        const atributoID = req.params.atributoID;

        const query = 'DELETE FROM Atributos WHERE idAtributo = ?';
        banco.conn.query(query, [atributoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o atributo.' });
            }

            res.status(200).json({ message: 'Atributo deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar o atributo.' });
    }
}

module.exports = {
    cadastrarAtributo,
    listarAtributos,
    atualizarAtributoPorId,
    deletarAtributoPorId
};
