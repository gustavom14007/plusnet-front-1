// valorAtributoController.js

const banco = require('../database/main-db');

function cadastrarValorAtributo(req, res) {
    try {
        const { idAtributo, texto } = req.body;

        // Validar entrada
        if (!idAtributo || !texto) {
            return res.status(400).json({ error: 'Dados incompletos para cadastrar valor de atributo.' });
        }

        const query = 'INSERT INTO Valor_Atributo (idAtributo, texto) VALUES (?, ?)';
        banco.conn.query(query, [idAtributo, texto], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar valor de atributo.' });
            }

            res.status(201).json({ message: 'Valor de atributo cadastrado com sucesso.', attributeValue: { id: results.insertId, idAtributo, texto } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar valor de atributo.' });
    }
}

function listarValoresAtributo(req, res) {
    try {
        const query = 'SELECT * FROM Valor_Atributo';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar valores de atributo.' });
            }

            res.status(200).json({ attributeValues: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar valores de atributo.' });
    }
}

function atualizarValorAtributoPorId(req, res) {
    try {
        const valorAtributoID = req.params.valorAtributoID;
        const { texto } = req.body;

        // Validar entrada
        if (!texto) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar valor de atributo.' });
        }

        const query = 'UPDATE Valor_Atributo SET texto = ? WHERE idValorAtributo = ?';
        banco.conn.query(query, [texto, valorAtributoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar valor de atributo.' });
            }

            res.status(200).json({ message: 'Valor de atributo atualizado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar valor de atributo.' });
    }
}

function deletarValorAtributoPorId(req, res) {
    try {
        const valorAtributoID = req.params.valorAtributoID;

        const query = 'DELETE FROM Valor_Atributo WHERE idValorAtributo = ?';
        banco.conn.query(query, [valorAtributoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar valor de atributo.' });
            }

            res.status(200).json({ message: 'Valor de atributo deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar valor de atributo.' });
    }
}

module.exports = {
    cadastrarValorAtributo,
    listarValoresAtributo,
    atualizarValorAtributoPorId,
    deletarValorAtributoPorId
};
