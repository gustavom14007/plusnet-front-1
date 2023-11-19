// controllers/clienteController.js

const banco = require('../database/main-db');

function cadastrarCliente(req, res) {
    try {
        const { nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja } = req.body;

        // Validar entrada
        if (!nome || !cpf || !email || !senha || !idLoja) {
            return res.status(400).json({ error: 'Dados incompletos para cadastrar o cliente.' });
        }

        const query = 'INSERT INTO Clientes (nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        banco.conn.query(query, [nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
            }

            res.status(201).json({ message: 'Cliente cadastrado com sucesso.', client: { id: results.insertId, nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
    }
}

function listarClientes(req, res) {
    try {
        // Parâmetros opcionais de consulta
        const {
            idCliente,
            nome,
            sobrenome,
            cpf,
            rgNumero,
            rgDataExpedicao,
            dataNascimento,
            sexo,
            cnpj,
            inscricaoEstadual,
            receberNotificacoes,
            receberInformativos,
            situacao,
            situacaoMotivo,
            observacaoInterna,
            email,
            idLoja
        } = req.query;

        // Construir a consulta SQL base
        let query = 'SELECT * FROM Clientes WHERE 1';

        // Adicionar condições para filtros opcionais
        if (idCliente) {
            query += ` AND idCliente = ${parseInt(idCliente)}`;
        }

        if (nome) {
            query += ` AND nome LIKE '%${nome}%'`;
        }

        if (sobrenome) {
            query += ` AND sobrenome LIKE '%${sobrenome}%'`;
        }

        if (cpf) {
            query += ` AND cpf = '${cpf}'`;
        }

        if (rgNumero) {
            query += ` AND rgNumero = '${rgNumero}'`;
        }

        if (rgDataExpedicao) {
            query += ` AND rgDataExpedicao = '${rgDataExpedicao}'`;
        }

        if (dataNascimento) {
            query += ` AND dataNascimento = '${dataNascimento}'`;
        }

        if (sexo) {
            query += ` AND sexo = '${sexo}'`;
        }

        if (cnpj) {
            query += ` AND cnpj = '${cnpj}'`;
        }

        if (inscricaoEstadual) {
            query += ` AND inscricaoEstadual = '${inscricaoEstadual}'`;
        }

        if (receberNotificacoes !== undefined) {
            query += ` AND receberNotificacoes = ${parseInt(receberNotificacoes)}`;
        }

        if (receberInformativos !== undefined) {
            query += ` AND receberInformativos = ${parseInt(receberInformativos)}`;
        }

        if (situacao) {
            query += ` AND situacao = '${situacao}'`;
        }

        if (situacaoMotivo) {
            query += ` AND situacaoMotivo = '${situacaoMotivo}'`;
        }

        if (observacaoInterna) {
            query += ` AND observacaoInterna LIKE '%${observacaoInterna}%'`;
        }

        if (email) {
            query += ` AND email LIKE '%${email}%'`;
        }

        if (idLoja) {
            query += ` AND idLoja = ${parseInt(idLoja)}`;
        }

        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar clientes.' });
            }

            res.status(200).json({ clients: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar clientes.' });
    }
}

function atualizarClientePorId(req, res) {
    try {
        const clienteID = req.params.clienteID;
        const { nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha } = req.body;

        // Validar entrada
        if (!nome || !cpf || !email || !senha) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar o cliente.' });
        }

        const query = 'UPDATE Clientes SET nome = ?, sobrenome = ?, cpf = ?, rgNumero = ?, rgDataExpedicao = ?, dataNascimento = ?, sexo = ?, cnpj = ?, inscricaoEstadual = ?, receberNotificacoes = ?, receberInformativos = ?, situacao = ?, situacaoMotivo = ?, observacaoInterna = ?, email = ?, senha = ? WHERE idCliente = ?';
        banco.conn.query(query, [nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, clienteID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o cliente.' });
            }

            res.status(200).json({ message: 'Cliente atualizado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o cliente.' });
    }
}

function deletarClientePorId(req, res) {
    try {
        const clienteID = req.params.clienteID;

        const query = 'DELETE FROM Clientes WHERE idCliente = ?';
        banco.conn.query(query, [clienteID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o cliente.' });
            }

            res.status(200).json({ message: 'Cliente deletado com sucesso.' });
        });
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
