
// carrinhoFuncionalController.js

const banco = require('../database/main-db');

async function adicionarAoCarrinho(req, res) {
    try {
        let { carrinhoID, produtoID, varianteID, quantidade } = req.body;
        const userId = req.userId;
        const lojaDoUsuario = req.userLoja; // Obtenha a loja do usuário a partir do token JWT


        if (!carrinhoID) {
            // Verifique se o usuário já possui um carrinho
            carrinhoID = null;
        }


        const getCarrinhoExistente = () => {
            return new Promise((resolve, reject) => {
                banco.conn.query('SELECT idCarrinho, status FROM carrinhos WHERE userID = ? ORDER BY dataAtualizacao DESC LIMIT 1', [userId], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
        };

        const carrinhoExistente = await getCarrinhoExistente();

        if (!carrinhoID) {
            if (carrinhoExistente.length === 0 || carrinhoExistente[0].status === 'pedido') {
                // Se o usuário não possui um carrinho ou o carrinho existente está com status "pedido", crie um novo carrinho
                const inserirCarrinhoResult = await new Promise((resolve, reject) => {
                    banco.conn.query('INSERT INTO carrinhos (userID, idLoja) VALUES (?, ?)', [userId, lojaDoUsuario], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                });

                if (inserirCarrinhoResult.insertId) {
                    // Obtenha o ID do carrinho criado
                    carrinhoID = inserirCarrinhoResult.insertId;
                } else {
                    throw new Error('Erro ao criar carrinho');
                }
            } else {
                // O usuário já possui um carrinho ativo, obtenha seu ID
                carrinhoID = carrinhoExistente[0].idCarrinho;
            }
        }

        // Verifique se o produto já existe no carrinho
        const produtoNoCarrinhoResult = await new Promise((resolve, reject) => {
            banco.conn.query('SELECT idCarrinhoProdutoVariante, quantidade FROM Carrinho_Produto_Variante WHERE idCarrinho = ? AND idProduto = ? AND idVariante = ?', [carrinhoID, produtoID, varianteID], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (produtoNoCarrinhoResult.length === 0) {
            // Se o produto não existir no carrinho, insira-o
            const inserirProdutoResult = await new Promise((resolve, reject) => {
                banco.conn.query('INSERT INTO Carrinho_Produto_Variante (idCarrinho, idProduto, idVariante, quantidade) VALUES (?, ?, ?, ?)', [carrinhoID, produtoID, varianteID, quantidade], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });

            if (inserirProdutoResult.insertId) {
                // Produto inserido com sucesso
                res.status(200).json({ carrinhoID: carrinhoID, message: 'Produto adicionado ao carrinho com sucesso!' });
            } else {
                throw new Error('Erro ao inserir o produto no carrinho');
            }
        } else {
            // O produto já existe no carrinho, atualize a quantidade
            const idCarrinhoProdutoVariante = parseInt(produtoNoCarrinhoResult[0].idCarrinhoProdutoVariante);
            const novaQuantidade = parseInt(produtoNoCarrinhoResult[0].quantidade) + parseInt(quantidade);

            const atualizarQuantidadeResult = await new Promise((resolve, reject) => {
                banco.conn.query('UPDATE Carrinho_Produto_Variante SET quantidade = ? WHERE idCarrinhoProdutoVariante = ?', [novaQuantidade, idCarrinhoProdutoVariante], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });

            if (atualizarQuantidadeResult.affectedRows > 0) {
                // Quantidade atualizada com sucesso
                res.status(200).json({ message: 'Produto adicionado ao carrinho com sucesso!' });
            } else {
                throw new Error('Erro ao atualizar a quantidade do produto no carrinho');
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar o produto ao carrinho.' });
    }
}

async function criarPedido(req, res) {
    try {
        const userId = req.userId; // Você deve ter recuperado o ID do usuário a partir do token JWT
        const userLoja = req.userLoja

        // Verifique se o usuário possui um carrinho ativo e recupere o idCarrinho mais recente
        const getCarrinhoID = () => {
            return new Promise((resolve, reject) => {
                banco.conn.query('SELECT idCarrinho FROM carrinhos WHERE userID = ? AND idLoja = ? ORDER BY dataAtualizacao DESC LIMIT 1', [userId, userLoja], (error, results) => {
                    if (error) {
                        reject(error);
                    } else if (results.length === 0) {
                        reject('Você não possui um carrinho ativo para transformar em pedido.');
                    } else {
                        resolve(results[0].idCarrinho);
                    }
                });
            });
        };

        const carrinhoID = await getCarrinhoID();

        // Atualize o status do carrinho para 'pedido' (ou qualquer outro status que você use)
        await new Promise((resolve, reject) => {
            banco.conn.query('UPDATE carrinhos SET status = ? WHERE idCarrinho = ?', ['pedido', carrinhoID], (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });


        res.status(200).json({ message: 'Carrinho transformado em pedido com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar o pedido.' });
    }
}

async function listarPedidosUsuario(req, res) {
    try {
        const userId = req.userId; // Você deve ter recuperado o ID do usuário a partir do token JWT
        const userLoja = req.userLoja

        // Consulte a tabela carrinhos para obter uma lista de carrinhos com status "pedido" do usuário
        const getPedidos = () => {
            return new Promise((resolve, reject) => {
                banco.conn.query('SELECT * FROM carrinhos WHERE userID = ? AND idLoja = ? AND status = ?', [userId, userLoja, 'pedido'], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        };

        const pedidos = await getPedidos();

        res.status(200).json({ pedidos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar os pedidos.' });
    }
}

async function listarPedidos(req, res) {
    try {
        const { dataMinima, dataMaxima, valorMinimo, valorMaximo, idLoja } = req.query;

        let sql = 'SELECT * FROM carrinhos WHERE status = "pedido"';

        const params = [];

        if (dataMinima) {
            sql += ' AND dataAtualizacao >= ?';
            params.push(dataMinima);
        }

        if (dataMaxima) {
            sql += ' AND dataAtualizacao <= ?';
            params.push(dataMaxima);
        }

        if (valorMinimo) {
            sql += ' AND valorTotal >= ?';
            params.push(valorMinimo);
        }

        if (valorMaximo) {
            sql += ' AND valorTotal <= ?';
            params.push(valorMaximo);
        }

        if (idLoja) {
            sql += ' AND idLoja = ?';
            params.push(idLoja);
        }

        banco.conn.query(sql, params, (err, results) => {
            if (err) {
                throw err;
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar os pedidos.' });
    }
}

module.exports = {
    adicionarAoCarrinho,
    criarPedido,
    listarPedidosUsuario,
    listarPedidos
};





