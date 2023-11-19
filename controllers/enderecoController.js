// controllers/enderecoController.js

const banco = require('../database/main-db');

function cadastrarEndereco(req, res) {
    try {
        const { logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja } = req.body;

        if (!logradouro || !numero || !bairro || !cidade || !estado || !pais || !cep || !idLoja) {
            return res.status(400).json({ error: 'Dados incompletos para cadastrar o endereço.' });
        }

        const query = 'INSERT INTO Enderecos (logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        banco.conn.query(query, [logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar endereço.' });
            }

            res.status(201).json({ message: 'Endereço cadastrado com sucesso.', address: { id: results.insertId, logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar endereço.' });
    }
}

function listarEnderecos(req, res) {
    try {
        // Parâmetros opcionais de consulta
        const {
            idEndereco,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            pais,
            cep,
            idLoja
        } = req.query;

        // Construir a consulta SQL base
        let query = 'SELECT * FROM Enderecos WHERE 1';

        // Adicionar condições para filtros opcionais
        if (idEndereco) {
            query += ` AND idEndereco = ${parseInt(idEndereco)}`;
        }

        if (logradouro) {
            query += ` AND logradouro LIKE '%${logradouro}%'`;
        }

        if (numero) {
            query += ` AND numero LIKE '%${numero}%'`;
        }

        if (complemento) {
            query += ` AND complemento LIKE '%${complemento}%'`;
        }

        if (bairro) {
            query += ` AND bairro LIKE '%${bairro}%'`;
        }

        if (cidade) {
            query += ` AND cidade LIKE '%${cidade}%'`;
        }

        if (estado) {
            query += ` AND estado LIKE '%${estado}%'`;
        }

        if (pais) {
            query += ` AND pais LIKE '%${pais}%'`;
        }

        if (cep) {
            query += ` AND cep LIKE '%${cep}%'`;
        }

        if (idLoja) {
            query += ` AND idLoja = ${parseInt(idLoja)}`;
        }

        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar endereços.' });
            }

            res.status(200).json({ addresses: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar endereços.' });
    }
}


function atualizarEnderecoPorId(req, res) {
    try {
        const enderecoID = req.params.enderecoID;
        const { logradouro, numero, complemento, bairro, cidade, estado, pais, cep } = req.body;

        if (!logradouro || !numero || !bairro || !cidade || !estado || !pais || !cep) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar o endereço.' });
        }

        const query = 'UPDATE Enderecos SET logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?, pais = ?, cep = ? WHERE idEndereco = ?';
        banco.conn.query(query, [logradouro, numero, complemento, bairro, cidade, estado, pais, cep, enderecoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o endereço.' });
            }

            res.status(200).json({ message: 'Endereço atualizado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o endereço.' });
    }
}

function deletarEnderecoPorId(req, res) {
    try {
        const enderecoID = req.params.enderecoID;

        const query = 'DELETE FROM Enderecos WHERE idEndereco = ?';
        banco.conn.query(query, [enderecoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o endereço.' });
            }

            res.status(200).json({ message: 'Endereço deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar o endereço.' });
    }
}


module.exports = {
    cadastrarEndereco,
    listarEnderecos,
    atualizarEnderecoPorId,
    deletarEnderecoPorId,
};
