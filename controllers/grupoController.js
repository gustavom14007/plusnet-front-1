// grupoController.js

const banco = require('../database/main-db');

function cadastrarGrupo(req, res) {
    try {
        const { grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao, idLoja } = req.body;

        // Validar entrada
        if (!nome || !idLoja) {
            return res.status(400).json({ error: 'Dados incompletos para cadastrar o grupo.' });
        }

        const query = 'INSERT INTO Grupos (grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao, idLoja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        banco.conn.query(query, [grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao, idLoja], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar grupo.' });
            }

            res.status(201).json({ message: 'Grupo cadastrado com sucesso.', group: { id: results.insertId, grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao, idLoja } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar grupo.' });
    }
}

function listarGrupos(req, res) {
    try {
        // Parâmetros opcionais de consulta
        const { grupoID, nome, situacao, idLoja } = req.query;

        // Construir a consulta SQL base
        let query = 'SELECT * FROM Grupos WHERE 1';

        // Adicionar condições para filtros opcionais
        if (grupoID) {
            query += ` AND idGrupo = ${parseInt(grupoID)}`;
        }

        if (nome) {
            query += ` AND nome LIKE '%${nome}%'`;
        }

        if (situacao) {
            query += ` AND situacao = '${situacao}'`;
        }

        if (idLoja) {
            query += ` AND idLoja = ${parseInt(idLoja)}`;
        }

        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar grupos.' });
            }

            res.status(200).json({ groups: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar grupos.' });
    }
}

function atualizarGrupoPorId(req, res) {
    try {
        const grupoID = req.params.grupoID;
        const { grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao } = req.body;

        // Validar entrada
        if (!nome) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar o grupo.' });
        }

        const query = 'UPDATE Grupos SET grupoPai = ?, nome = ?, identificadorERP = ?, descricao = ?, seoHtmlTitle = ?, seoHtmlMetaDescription = ?, seoHtmlMetaKeywords = ?, seoHtmlAbstract = ?, seoHtmlHead = ?, filtroDeMarca = ?, situacao = ? WHERE idGrupo = ?';
        banco.conn.query(query, [grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao, grupoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o grupo.' });
            }

            res.status(200).json({ message: 'Grupo atualizado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o grupo.' });
    }
}

function deletarGrupoPorId(req, res) {
    try {
        const grupoID = req.params.grupoID;

        const query = 'DELETE FROM Grupos WHERE idGrupo = ?';
        banco.conn.query(query, [grupoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o grupo.' });
            }

            res.status(200).json({ message: 'Grupo deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar o grupo.' });
    }
}

module.exports = {
    cadastrarGrupo,
    listarGrupos,
    atualizarGrupoPorId,
    deletarGrupoPorId
};
