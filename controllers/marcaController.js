// marcaController.js

const banco = require('../database/main-db');

function cadastrarMarca(req, res) {
    try {
        const { urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, idLoja } = req.body;

        // Validar entrada
        if (!urlDe || !urlPara || !tipo || !dataHoraInicial || !dataHoraFinal || !horaInicial || !horaFinal || !situacao || !idLoja) {
            return res.status(400).json({ error: 'Dados incompletos para cadastrar a marca.' });
        }

        const query = 'INSERT INTO Marcas (urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, idLoja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        banco.conn.query(query, [urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, idLoja], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar marca.' });
            }

            res.status(201).json({ message: 'Marca cadastrada com sucesso.', brand: { id: results.insertId, urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, idLoja } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar marca.' });
    }
}

function listarMarcas(req, res) {
    try {
        // Parâmetros opcionais de consulta
        const { marcaID, tipo, situacao, idLoja } = req.query;

        // Construir a consulta SQL base
        let query = 'SELECT * FROM Marcas WHERE 1';

        // Adicionar condições para filtros opcionais
        if (marcaID) {
            query += ` AND idMarca = ${parseInt(marcaID)}`;
        }

        if (tipo) {
            query += ` AND tipo LIKE '%${tipo}%'`;
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
                return res.status(500).json({ error: 'Erro ao listar marcas.' });
            }

            res.status(200).json({ brands: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar marcas.' });
    }
}

function atualizarMarcaPorId(req, res) {
    try {
        const marcaID = req.params.marcaID;
        const { urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao } = req.body;

        // Validar entrada
        if (!urlDe || !urlPara || !tipo || !dataHoraInicial || !dataHoraFinal || !horaInicial || !horaFinal || !situacao) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar a marca.' });
        }

        const query = 'UPDATE Marcas SET urlDe = ?, urlPara = ?, tipo = ?, dataHoraInicial = ?, dataHoraFinal = ?, horaInicial = ?, horaFinal = ?, situacao = ? WHERE idMarca = ?';
        banco.conn.query(query, [urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, marcaID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar a marca.' });
            }

            res.status(200).json({ message: 'Marca atualizada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar a marca.' });
    }
}

function deletarMarcaPorId(req, res) {
    try {
        const marcaID = req.params.marcaID;

        const query = 'DELETE FROM Marcas WHERE idMarca = ?';
        banco.conn.query(query, [marcaID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar a marca.' });
            }

            res.status(200).json({ message: 'Marca deletada com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar a marca.' });
    }
}

module.exports = {
    cadastrarMarca,
    listarMarcas,
    atualizarMarcaPorId,
    deletarMarcaPorId
};
