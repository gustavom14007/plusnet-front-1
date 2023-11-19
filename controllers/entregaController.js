// entregaController.js

const banco = require('../database/main-db');

function cadastrarEntrega(req, res) {
    try {
        const { idLoja } = req.body;

        // Validar entrada
        if (!idLoja) {
            return res.status(400).json({ error: 'Dados incompletos para cadastrar entrega.' });
        }

        const query = 'INSERT INTO Entregas (idLoja) VALUES (?)';
        banco.conn.query(query, [idLoja], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar entrega.' });
            }

            res.status(201).json({ message: 'Entrega cadastrada com sucesso.', delivery: { id: results.insertId, idLoja } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar entrega.' });
    }
}

function listarEntregas(req, res) {
    try {
        const query = 'SELECT * FROM Entregas';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar entregas.' });
            }

            res.status(200).json({ deliveries: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar entregas.' });
    }
}

function atualizarEntrega(req, res) {
    try {
        const entregaID = req.params.entregaID;
        const { idLoja } = req.body;

        const query = 'UPDATE Entregas SET idLoja = ? WHERE idEntrega = ?';
        banco.conn.query(query, [idLoja, entregaID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar a entrega.' });
            }

            res.status(200).json({ message: 'Entrega atualizada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar entrega.' });
    }
}

function deletarEntrega(req, res) {
    try {
        const entregaID = req.params.entregaID;

        const query = 'DELETE FROM Entregas WHERE idEntrega = ?';
        banco.conn.query(query, [entregaID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar a entrega.' });
            }

            res.status(200).json({ message: 'Entrega deletada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar entrega.' });
    }
}

module.exports = {
    cadastrarEntrega,
    listarEntregas,
    atualizarEntrega,
    deletarEntrega
};
