// controllers/clienteController.js

const banco = require('../database/main-db');

async function cadastrarCliente(req, res) {
    try {
        const { nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja } = req.body;

        const query = 'INSERT INTO Clientes (nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const results = await banco.conn.query(query, [nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja]);

        res.status(201).json({ message: 'Cliente cadastrado com sucesso.', client: { id: results.insertId, nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
    }
}

async function listarClientes(req, res) {
    try {
        const query = 'SELECT * FROM Clientes';
        const results = await banco.conn.query(query);

        res.status(200).json({ clients: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar clientes.' });
    }
}

async function atualizarClientePorId(req, res) {
    try {
        const clienteID = req.params.clienteID;
        const { nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha } = req.body;

        const query = 'UPDATE Clientes SET nome = ?, sobrenome = ?, cpf = ?, rgNumero = ?, rgDataExpedicao = ?, dataNascimento = ?, sexo = ?, cnpj = ?, inscricaoEstadual = ?, receberNotificacoes = ?, receberInformativos = ?, situacao = ?, situacaoMotivo = ?, observacaoInterna = ?, email = ?, senha = ? WHERE idCliente = ?';
        await banco.conn.query(query, [nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, clienteID]);

        res.status(200).json({ message: 'Cliente atualizado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o cliente.' });
    }
}

async function deletarClientePorId(req, res) {
    try {
        const clienteID = req.params.clienteID;

        const query = 'DELETE FROM Clientes WHERE idCliente = ?';
        await banco.conn.query(query, [clienteID]);

        res.status(200).json({ message: 'Cliente deletado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar o cliente.' });
    }
}

module.exports = {
    cadastrarCliente,
    listarClientes,
    atualizarClientePorId,
    deletarClientePorId,
};
