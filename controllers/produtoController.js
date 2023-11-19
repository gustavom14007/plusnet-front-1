// controllers/produtoController.js

const banco = require('../database/main-db');

const cadastrarProduto = (req, res) => {
    try {
        const { nome, descricao, preco, precoPromocional, idLoja } = req.body;

        // Validar entrada
        if (!nome || !descricao || !preco || !idLoja) {
            return res.status(400).json({ error: 'Dados incompletos para cadastrar o produto.' });
        }

        const query = 'INSERT INTO Produtos (nome, descricao, preco, precoPromocional, idLoja) VALUES (?, ?, ?, ?, ?)';
        banco.conn.query(query, [nome, descricao, preco, precoPromocional, idLoja], (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Erro ao cadastrar produto.' })
                return
            }

            res.status(201).json({ message: 'Produto cadastrado com sucesso.', data: { id: results.insertId, nome, descricao, preco, precoPromocional, idLoja } });
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar produto.' });
    }
}



function listarProdutos(req, res) {
    try {
        // Parâmetros opcionais de consulta
        const {
            idProduto,
            nome,
            identificadorERP,
            identificadorFabricante,
            marca,
            grupo,
            descricao,
            precoMin,
            precoMax,
            precoPromocionalMin,
            precoPromocionalMax,
            embalagemAlturaMin,
            embalagemAlturaMax,
            embalagemProfundidadeMin,
            embalagemProfundidadeMax,
            embalagemPesoMin,
            embalagemPesoMax,
            sinonimos,
            exclusivoParaRelacionamento,
            prioridade,
            seoHtmlTitle,
            seoHtmlMetaDescription,
            seoHtmlMetaKeywords,
            seoHtmlMetaAbstract,
            seoHtmlHead,
            seoHtmlA,
            situacao,
            idLoja
        } = req.query;

        let query = 'SELECT * FROM Produtos WHERE 1';

        if (idProduto) {
            query += ` AND idProduto = ${parseInt(idProduto)}`;
        }

        if (nome) {
            query += ` AND nome LIKE '%${nome}%'`;
        }

        if (identificadorERP) {
            query += ` AND identificadorERP = ${parseInt(identificadorERP)}`;
        }

        if (identificadorFabricante) {
            query += ` AND identificadorFabricante = ${parseInt(identificadorFabricante)}`;
        }

        if (marca) {
            query += ` AND marca = '${marca}'`;
        }

        if (grupo) {
            query += ` AND grupo = '${grupo}'`;
        }

        if (descricao) {
            query += ` AND descricao LIKE '%${descricao}%'`;
        }

        if (precoMin && !isNaN(precoMin)) {
            query += ` AND preco >= ${parseFloat(precoMin)}`;
        }

        if (precoMax && !isNaN(precoMax)) {
            query += ` AND preco <= ${parseFloat(precoMax)}`;
        }

        if (precoPromocionalMin && !isNaN(precoPromocionalMin)) {
            query += ` AND precoPromocional >= ${parseFloat(precoPromocionalMin)}`;
        }

        if (precoPromocionalMax && !isNaN(precoPromocionalMax)) {
            query += ` AND precoPromocional <= ${parseFloat(precoPromocionalMax)}`;
        }

        if (embalagemAlturaMin && !isNaN(embalagemAlturaMin)) {
            query += ` AND embalagemAltura >= ${parseFloat(embalagemAlturaMin)}`;
        }

        if (embalagemAlturaMax && !isNaN(embalagemAlturaMax)) {
            query += ` AND embalagemAltura <= ${parseFloat(embalagemAlturaMax)}`;
        }

        if (embalagemProfundidadeMin && !isNaN(embalagemProfundidadeMin)) {
            query += ` AND embalagemProfundidade >= ${parseFloat(embalagemProfundidadeMin)}`;
        }

        if (embalagemProfundidadeMax && !isNaN(embalagemProfundidadeMax)) {
            query += ` AND embalagemProfundidade <= ${parseFloat(embalagemProfundidadeMax)}`;
        }

        if (embalagemPesoMin && !isNaN(embalagemPesoMin)) {
            query += ` AND embalagemPeso >= ${parseFloat(embalagemPesoMin)}`;
        }

        if (embalagemPesoMax && !isNaN(embalagemPesoMax)) {
            query += ` AND embalagemPeso <= ${parseFloat(embalagemPesoMax)}`;
        }

        if (sinonimos) {
            query += ` AND sinonimos LIKE '%${sinonimos}%'`;
        }

        if (exclusivoParaRelacionamento !== undefined) {
            query += ` AND exclusivoParaRelacionamento = ${parseInt(exclusivoParaRelacionamento)}`;
        }

        if (prioridade && !isNaN(prioridade)) {
            query += ` AND prioridade = ${parseInt(prioridade)}`;
        }

        if (seoHtmlTitle) {
            query += ` AND seoHtmlTitle LIKE '%${seoHtmlTitle}%'`;
        }

        if (seoHtmlMetaDescription) {
            query += ` AND seoHtmlMetaDescription LIKE '%${seoHtmlMetaDescription}%'`;
        }

        if (seoHtmlMetaKeywords) {
            query += ` AND seoHtmlMetaKeywords LIKE '%${seoHtmlMetaKeywords}%'`;
        }

        if (seoHtmlMetaAbstract) {
            query += ` AND seoHtmlMetaAbstract LIKE '%${seoHtmlMetaAbstract}%'`;
        }

        if (seoHtmlHead) {
            query += ` AND seoHtmlHead LIKE '%${seoHtmlHead}%'`;
        }

        if (seoHtmlA) {
            query += ` AND seoHtmlA LIKE '%${seoHtmlA}%'`;
        }

        if (situacao && !isNaN(situacao)) {
            query += ` AND situacao = ${parseInt(situacao)}`;
        }

        if (idLoja && !isNaN(idLoja)) {
            query += ` AND idLoja = ${parseInt(idLoja)}`;
        }

        banco.conn.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao listar produtos.' });
            }

            // Converter o resultado para JSON evitando estruturas circulares
            const products = JSON.parse(JSON.stringify(results, (key, value) => {
                // Excluir propriedades que causam circularidade
                if (key === '_timer' || key === '_object') {
                    return undefined;
                }
                return value;
            }));

            res.status(200).json({ data: { products } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar produtos.' });
    }
}


function obterProdutoPorId(req, res) {
    try {
        const produtoID = req.params.produtoID;

        const query = 'SELECT * FROM Produtos WHERE idProduto = ?';
        banco.conn.query(query, [produtoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao obter o produto.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }

            res.status(200).json({ data: { product: results[0] } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao obter o produto.' });
    }
}

function atualizarProdutoPorId(req, res) {
    try {
        const produtoID = req.params.produtoID;
        const { nome, descricao, preco, precoPromocional } = req.body;

        // Validar entrada
        if (!nome || !descricao || !preco) {
            return res.status(400).json({ error: 'Dados incompletos para atualizar o produto.' });
        }

        const query = 'UPDATE Produtos SET nome = ?, descricao = ?, preco = ?, precoPromocional = ? WHERE idProduto = ?';
        banco.conn.query(query, [nome, descricao, preco, precoPromocional, produtoID], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o produto.' });
            }

            res.status(200).json({ message: 'Produto atualizado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar o produto.' });
    }
}

function deletarProdutoPorId(req, res) {
    try {
        const produtoID = req.params.produtoID;

        const query = 'DELETE FROM Produtos WHERE idProduto = ?';
        banco.conn.query(query, [produtoID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o produto.' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }

            res.status(200).json({ message: 'Produto deletado com sucesso.' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar o produto.' });
    }
}

module.exports = {
    cadastrarProduto,
    listarProdutos,
    obterProdutoPorId,
    atualizarProdutoPorId,
    deletarProdutoPorId,
};
