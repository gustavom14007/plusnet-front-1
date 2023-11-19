// enderecoClienteController.js

const banco = require('../database/main-db');

function relacionarClienteEndereco(req, res) {
    try {
        const { idEndereco, idCliente } = req.body;

        // Validar entrada
        if (!idEndereco || !idCliente) {
            return res.status(400).json({ error: 'Dados incompletos para relacionar cliente ao endereço.' });
        }

        const query = 'INSERT INTO EnderecoCliente (idEndereco, idCliente) VALUES (?, ?)';
        banco.conn.query(query, [idEndereco, idCliente], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao relacionar cliente ao endereço.' });
            }

            res.status(201).json({ message: 'Cliente relacionado ao endereço com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao relacionar cliente ao endereço.' });
    }
}

function listarRelacoesClienteEndereco(req, res) {
    try {
        const query = 'SELECT * FROM EnderecoCliente';
        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar os registros de EnderecoCliente.' });
            }

            res.status(200).json({ addressClients: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar os registros de EnderecoCliente.' });
    }
}

function deletarRelacaoClienteEndereco(req, res) {
    try {
        const idEndereco = req.params.idEndereco;
        const idCliente = req.params.idCliente;

        const query = 'DELETE FROM EnderecoCliente WHERE idEndereco = ? AND idCliente = ?';
        banco.conn.query(query, [idEndereco, idCliente], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o registro em EnderecoCliente.' });
            }

            res.status(200).json({ message: 'Registro em EnderecoCliente deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar o registro em EnderecoCliente.' });
    }
}

module.exports = {
    relacionarClienteEndereco,
    listarRelacoesClienteEndereco,
    deletarRelacaoClienteEndereco
};
