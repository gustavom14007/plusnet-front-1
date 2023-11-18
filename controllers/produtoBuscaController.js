// controllers/produtoBuscaController.js

const banco = require('../database/main-db');

async function buscarProdutos(req, res) {
    try {
        const { lojaID, marcaID, categoriaID, atributoID, valorAtributoID } = req.query;

        let query = `
      SELECT P.*
      FROM Produtos AS P
      JOIN Marca_Produto AS MP ON P.idProduto = MP.idProduto
      JOIN Marcas AS M ON MP.idMarca = M.idMarca
      JOIN Grupo_Produto AS GP ON P.idProduto = GP.idProduto
      JOIN Grupos AS G ON GP.idGrupo = G.idGrupo
      JOIN Variantes AS V ON P.idProduto = V.idProduto
      JOIN Atributos AS A ON A.idVariante = V.idVariante
      JOIN Valor_Atributo AS VA ON A.idAtributo = VA.idAtributo
      WHERE 1 = 1
    `;

        if (lojaID) {
            query += ` AND P.idLoja = ${lojaID}`;
        }

        if (marcaID) {
            query += ` AND M.idMarca = ${marcaID}`;
        }

        if (categoriaID) {
            query += ` AND G.idGrupo = ${categoriaID}`;
        }

        if (atributoID && valorAtributoID) {
            query += `
        AND A.idAtributo = ${atributoID}
        AND VA.idValorAtributo = ${valorAtributoID}
      `;
        }

        console.log(query);

        const results = await banco.conn.query(query);

        res.status(200).json({ products: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
}

async function listarProdutosDaLoja(req, res) {
    try {
        const lojaID = req.headers.loja; // Obtenha o ID da loja a partir dos parâmetros da URL

        if (!lojaID) {
            res.status(400).json({ error: 'ID da loja não fornecido.' });
            return;
        }

        const query = `
      SELECT *
      FROM Produtos
      WHERE idLoja = ?
      LIMIT 20
    `;

        const results = await banco.conn.query(query, [lojaID]);

        res.status(200).json({ products: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar produtos da loja.' });
    }
}

async function listarProdutosDaLojaComIntervalo(req, res) {
    try {
        const lojaID = req.headers.loja; // Obtenha o ID da loja a partir dos parâmetros da URL
        const inicio = req.params.inicio; // Obtenha o início do intervalo
        const fim = req.params.fim; // Obtenha o fim do intervalo

        if (!lojaID || !inicio || !fim) {
            res.status(400).json({ error: 'Parâmetros ausentes.' });
            return;
        }

        const query = `
      SELECT *
      FROM Produtos
      WHERE idLoja = ?
      LIMIT ?, ?
    `;

        const results = await banco.conn.query(query, [lojaID, parseInt(inicio), parseInt(fim)]);

        res.status(200).json({ products: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar produtos da loja.' });
    }
}




module.exports = {
    buscarProdutos,
    listarProdutosDaLoja,
    listarProdutosDaLojaComIntervalo,
};
