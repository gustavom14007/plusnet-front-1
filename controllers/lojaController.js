// controllers/lojasController.js
const banco = require('../database/main-db');

// Cadastrar uma nova loja
function cadastrarLoja(req, res) {
    const {
        url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj,
        inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG,
        permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica,
        idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp,
        clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao
    } = req.body;

    const query = `
    INSERT INTO Lojas (
      url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj,
      inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG,
      permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica,
      idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp,
      clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    banco.conn.query(
        query,
        [
            url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj,
            inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG,
            permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica,
            idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp,
            clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao
        ],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Erro ao cadastrar loja.' });
                return;
            }

            res.status(201).json({
                message: 'Loja cadastrada com sucesso.',
                store: {
                    id: results.insertId,
                    url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj,
                    inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG,
                    permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica,
                    idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp,
                    clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao
                },
            });
        }
    );
}

// Listar todas as lojas
function listarLojas(req, res) {
    const query = 'SELECT * FROM Lojas';
    banco.conn.query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Erro ao listar lojas.' });
            return;
        }

        res.status(200).json({ stores: results });
    });
}

// Atualizar uma loja pelo ID
function atualizarLoja(req, res) {
    const lojaID = req.params.lojaID;
    const {
        url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj,
        inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG,
        permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica,
        idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp,
        clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao
    } = req.body;

    const query = `
    UPDATE Lojas SET
      url = ?, titulo = ?, descricao = ?, modalidade = ?, email = ?, idEndereco = ?, telefone1 = ?, telefone2 = ?,
      telefone3 = ?, cpfcnpj = ?, inscricaoEstadual = ?, frameworkFrontEnd = ?, breakpoint = ?, fotoProporcao = ?,
      fotoLarguraP = ?, fotoLarguraG = ?, permitirVendedor = ?, permitirObservacao = ?, emailCopiaOculta = ?,
      primeiraRegra = ?, regraGratis = ?, permitirPessoaJuridica = ?, idPagamentos = ?, pagamentoCartaoCpfTitular = ?,
      clearSaleModalidade = ?, clearSaleProduto = ?, clearSaleFingerPrintApp = ?, clearSaleEntityCode = ?,
      seoRobots = ?, googleAnalyticsID = ?, outrosSituacao = ?
    WHERE idLoja = ?
  `;

    banco.conn.query(
        query,
        [
            url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj,
            inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG,
            permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica,
            idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp,
            clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao, lojaID
        ],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Erro ao atualizar a loja.' });
                return;
            }

            res.status(200).json({ message: 'Loja atualizada com sucesso.' });
        }
    );
}

// Deletar uma loja pelo ID
function deletarLoja(req, res) {
    const lojaID = req.params.lojaID;

    const query = 'DELETE FROM Lojas WHERE idLoja = ?';
    banco.conn.query(query, [lojaID], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Erro ao deletar a loja.' });
            return;
        }

        res.status(200).json({ message: 'Loja deletada com sucesso.' });
    });
}

// Listar uma loja pelo ID
function listarLojaPorId(req, res) {
    const lojaID = req.params.lojaID;

    const query = 'SELECT * FROM Lojas WHERE idLoja = ?';
    banco.conn.query(query, [lojaID], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Erro ao listar a loja.' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'Loja não encontrada.' });
        } else {
            res.status(200).json({ store: results[0] });
        }
    });
}

module.exports = {
    cadastrarLoja,
    listarLojas,
    listarLojaPorId, // Adicionada a nova função
    atualizarLoja,
    deletarLoja,
};