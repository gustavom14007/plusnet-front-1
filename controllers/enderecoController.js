// controllers/enderecoController.js

const banco = require('../database/main-db');

async function cadastrarEndereco(req, res) {
    try {
        const { logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja } = req.body;

        const query = 'INSERT INTO Enderecos (logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const results = await banco.conn.query(query, [logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja]);

        res.status(201).json({ message: 'Endereço cadastrado com sucesso.', address: { id: results.insertId, logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar endereço.' });
    }
}

async function listarEnderecos(req, res) {
    try {
        const query = 'SELECT * FROM Enderecos';
        const results = await banco.conn.query(query);

        res.status(200).json({ addresses: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar endereços.' });
    }
}

async function atualizarEnderecoPorId(req, res) {
    try {
        const enderecoID = req.params.enderecoID;
        const { logradouro, numero, complemento, bairro, cidade, estado, pais, cep } = req.body;

        const query = 'UPDATE Enderecos SET logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?, pais = ?, cep = ? WHERE idEndereco = ?';
        await banco.conn.query(query, [logradouro, numero, complemento, bairro, cidade, estado, pais, cep, enderecoID]);

        res.status(200).json({ message: 'Endereço atualizado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o endereço.' });
    }
}

async function deletarEnderecoPorId(req, res) {
    try {
        const enderecoID = req.params.enderecoID;

        const query = 'DELETE FROM Enderecos WHERE idEndereco = ?';
        await banco.conn.query(query, [enderecoID]);

        res.status(200).json({ message: 'Endereço deletado com sucesso.' });
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
