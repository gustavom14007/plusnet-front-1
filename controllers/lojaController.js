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

function listarLojas(req, res) {
    try {
        // Parâmetros opcionais de consulta
        const {
            idLoja,
            url,
            titulo,
            descricao,
            modalidade,
            email,
            idEndereco,
            telefone1,
            telefone2,
            telefone3,
            cpfcnpj,
            inscricaoEstadual,
            frameworkFrontEnd,
            breakpoint,
            fotoProporcao,
            fotoLarguraP,
            fotoLarguraG,
            permitirVendedor,
            permitirObservacao,
            emailCopiaOculta,
            primeiraRegra,
            regraGratis,
            permitirPessoaJuridica,
            idPagamentos,
            pagamentoCartaoCpfTitular,
            clearSaleModalidade,
            clearSaleProduto,
            clearSaleFingerPrintApp,
            clearSaleEntityCode,
            seoRobots,
            googleAnalyticsID,
            outrosSituacao
        } = req.query;

        // Construir a consulta SQL base
        let query = 'SELECT * FROM Lojas WHERE 1';

        if (idLoja) {
            query += ` AND idLoja = ${parseInt(idLoja)}`;
        }

        if (url) {
            query += ` AND url LIKE '%${url}%'`;
        }

        if (titulo) {
            query += ` AND titulo LIKE '%${titulo}%'`;
        }

        if (descricao) {
            query += ` AND descricao LIKE '%${descricao}%'`;
        }

        if (modalidade) {
            query += ` AND modalidade = '${modalidade}'`;
        }

        if (email) {
            query += ` AND email LIKE '%${email}%'`;
        }

        if (idEndereco) {
            query += ` AND idEndereco = ${parseInt(idEndereco)}`;
        }

        if (telefone1) {
            query += ` AND telefone1 LIKE '%${telefone1}%'`;
        }

        if (telefone2) {
            query += ` AND telefone2 LIKE '%${telefone2}%'`;
        }

        if (telefone3) {
            query += ` AND telefone3 LIKE '%${telefone3}%'`;
        }

        if (cpfcnpj) {
            query += ` AND cpfcnpj = '${cpfcnpj}'`;
        }

        if (inscricaoEstadual) {
            query += ` AND inscricaoEstadual = '${inscricaoEstadual}'`;
        }

        if (frameworkFrontEnd) {
            query += ` AND frameworkFrontEnd LIKE '%${frameworkFrontEnd}%'`;
        }

        if (breakpoint) {
            query += ` AND breakpoint = '${breakpoint}'`;
        }

        if (fotoProporcao) {
            query += ` AND fotoProporcao = '${fotoProporcao}'`;
        }

        if (fotoLarguraP) {
            query += ` AND fotoLarguraP = '${fotoLarguraP}'`;
        }

        if (fotoLarguraG) {
            query += ` AND fotoLarguraG = '${fotoLarguraG}'`;
        }

        if (permitirVendedor !== undefined) {
            query += ` AND permitirVendedor = ${parseInt(permitirVendedor)}`;
        }

        if (permitirObservacao !== undefined) {
            query += ` AND permitirObservacao = ${parseInt(permitirObservacao)}`;
        }

        if (emailCopiaOculta) {
            query += ` AND emailCopiaOculta LIKE '%${emailCopiaOculta}%'`;
        }

        if (primeiraRegra !== undefined) {
            query += ` AND primeiraRegra = ${parseInt(primeiraRegra)}`;
        }

        if (regraGratis !== undefined) {
            query += ` AND regraGratis = ${parseInt(regraGratis)}`;
        }

        if (permitirPessoaJuridica !== undefined) {
            query += ` AND permitirPessoaJuridica = ${parseInt(permitirPessoaJuridica)}`;
        }

        if (idPagamentos) {
            query += ` AND idPagamentos = ${parseInt(idPagamentos)}`;
        }

        if (pagamentoCartaoCpfTitular !== undefined) {
            query += ` AND pagamentoCartaoCpfTitular = ${parseInt(pagamentoCartaoCpfTitular)}`;
        }

        if (clearSaleModalidade) {
            query += ` AND clearSaleModalidade = '${clearSaleModalidade}'`;
        }

        if (clearSaleProduto) {
            query += ` AND clearSaleProduto = '${clearSaleProduto}'`;
        }

        if (clearSaleFingerPrintApp) {
            query += ` AND clearSaleFingerPrintApp = '${clearSaleFingerPrintApp}'`;
        }

        if (clearSaleEntityCode) {
            query += ` AND clearSaleEntityCode = '${clearSaleEntityCode}'`;
        }

        if (seoRobots) {
            query += ` AND seoRobots = '${seoRobots}'`;
        }

        if (googleAnalyticsID) {
            query += ` AND googleAnalyticsID = ${parseInt(googleAnalyticsID)}`;
        }

        if (outrosSituacao) {
            query += ` AND outrosSituacao LIKE '%${outrosSituacao}%'`;
        }

        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar lojas.' });
            }

            res.status(200).json({ stores: results });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar lojas.' });
    }
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