// grupoSubgrupoController.js

const banco = require('../database/main-db');

function criarRelacionamentoGrupoSubgrupo(req, res) {
    try {
        const { idGrupo, idSubgrupo } = req.body;

        // Validar entrada
        if (!idGrupo || !idSubgrupo) {
            return res.status(400).json({ error: 'Dados incompletos para criar o relacionamento Grupo-Subgrupo.' });
        }

        const query = 'INSERT INTO Grupo_Subgrupo (idGrupo, idSubgrupo) VALUES (?, ?)';
        banco.conn.query(query, [idGrupo, idSubgrupo], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao criar o relacionamento Grupo-Subgrupo.' });
            }

            res.status(201).json({ message: 'Relacionamento Grupo-Subgrupo criado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar o relacionamento Grupo-Subgrupo.' });
    }
}

function listarRelacionamentosGrupoSubgrupo(req, res) {
    try {
        const query = 'SELECT * FROM Grupo_Subgrupo';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar os relacionamentos Grupo-Subgrupo.' });
            }

            res.status(200).json({ relationships: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar os relacionamentos Grupo-Subgrupo.' });
    }
}

function deletarRelacionamentoGrupoSubgrupo(req, res) {
    try {
        const idGrupo = req.params.idGrupo;
        const idSubgrupo = req.params.idSubgrupo;

        const query = 'DELETE FROM Grupo_Subgrupo WHERE idGrupo = ? AND idSubgrupo = ?';
        banco.conn.query(query, [idGrupo, idSubgrupo], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o relacionamento Grupo-Subgrupo.' });
            }

            res.status(200).json({ message: 'Relacionamento Grupo-Subgrupo deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar o relacionamento Grupo-Subgrupo.' });
    }
}

function atualizarRelacionamentoGrupoSubgrupo(req, res) {
    try {
        const idGrupo = req.params.idGrupo;
        const idSubgrupo = req.params.idSubgrupo;
        const { novoIdGrupo, novoIdSubgrupo } = req.body;

        // Verifique se o relacionamento Grupo-Subgrupo existente está sendo atualizado para novos valores
        if (!novoIdGrupo || !novoIdSubgrupo) {
            return res.status(400).json({ error: 'É necessário fornecer novos valores para a atualização.' });
        }

        const query = 'UPDATE Grupo_Subgrupo SET idGrupo = ?, idSubgrupo = ? WHERE idGrupo = ? AND idSubgrupo = ?';
        banco.conn.query(query, [novoIdGrupo, novoIdSubgrupo, idGrupo, idSubgrupo], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o relacionamento Grupo-Subgrupo.' });
            }

            res.status(200).json({ message: 'Relacionamento Grupo-Subgrupo atualizado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o relacionamento Grupo-Subgrupo.' });
    }
}

module.exports = {
    criarRelacionamentoGrupoSubgrupo,
    listarRelacionamentosGrupoSubgrupo,
    deletarRelacionamentoGrupoSubgrupo,
    atualizarRelacionamentoGrupoSubgrupo
};
