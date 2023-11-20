
// carrinhoFuncionalController.js

const banco = require('../database/main-db');

async function adicionarAoCarrinho(req, res) {
    try {
        let { carrinhoID, produtoID, varianteID, quantidade } = req.body;
        let userId = req.userId;
        let lojaDoUsuario = req.userLoja; // Obtenha a loja do usuário a partir do token JWT
        let statusCarrinho = null;

        if (!userId) {
            userId = '1'
        }

        if (!lojaDoUsuario) {
            lojaDoUsuario = '1'
        }

        if (!varianteID) {
            varianteID = '1'
        }

        const carrinhoExistente = await getCarrinhoExistente(userId, carrinhoID);

        if (carrinhoID) {
            // Se um carrinhoID foi fornecido na requisição
            const carrinhoInformacoes = carrinhoExistente.find(c => c.idCarrinho === carrinhoID);

            if (carrinhoInformacoes) {
                // Se o carrinhoID fornecido existe no banco de dados
                carrinhoID = carrinhoInformacoes.idCarrinho;
                statusCarrinho = carrinhoInformacoes.status;

                if (statusCarrinho === 'pedido') {
                    // Se o status do carrinho existente for "pedido", crie um novo carrinho
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
                        // Obtenha o ID do novo carrinho criado
                        carrinhoID = inserirCarrinhoResult.insertId;
                        statusCarrinho = 'carrinho';
                    } else {
                        throw new Error('Erro ao criar carrinho');
                    }
                }
            } else {
                // Se o carrinhoID fornecido não existe no banco de dados, crie um novo carrinho
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
                    // Obtenha o ID do novo carrinho criado
                    carrinhoID = inserirCarrinhoResult.insertId;
                    statusCarrinho = 'carrinho';
                } else {
                    throw new Error('Erro ao criar carrinho');
                }
            }
        } else if (carrinhoExistente.length > 0) {
            // Se nenhum carrinhoID foi fornecido e existem carrinhos no banco de dados
            const carrinhoAtivo = carrinhoExistente.find(c => c.status === 'carrinho');

            if (carrinhoAtivo) {
                // Se existe um carrinho ativo, use o seu ID
                carrinhoID = carrinhoAtivo.idCarrinho;
                statusCarrinho = 'carrinho';
            } else {
                // Se não existe um carrinho ativo, crie um novo carrinho
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
                    // Obtenha o ID do novo carrinho criado
                    carrinhoID = inserirCarrinhoResult.insertId;
                    statusCarrinho = 'carrinho';
                } else {
                    throw new Error('Erro ao criar carrinho');
                }
            }
        } else {
            // Se nenhum carrinhoID foi fornecido e não existem carrinhos no banco de dados, crie um novo carrinho
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
                // Obtenha o ID do novo carrinho criado
                carrinhoID = inserirCarrinhoResult.insertId;
                statusCarrinho = 'carrinho';
            } else {
                throw new Error('Erro ao criar carrinho');
            }
        }

        //  a
        // Verifique se o produto já existe no carrinho
        const produtoNoCarrinhoResult = await new Promise((resolve, reject) => {
            banco.conn.query('SELECT idCarrinhoProdutoVariante, idCarrinho, idProduto, quantidade FROM Carrinho_Produto_Variante WHERE idCarrinho = ? AND idProduto = ? AND idVariante = ?', [carrinhoID, produtoID, varianteID], (err, results) => {
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
                let carrinhoTeste = await getCarrinhoExistente(userId, carrinhoID)
                let produtosLista = await getProdutosDoCarrinho(carrinhoID)
                res.status(200).json({ carrinhoID: carrinhoID, produtosLista, message: 'Produto adicionado ao carrinho com sucesso!' });


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
                let carrinhoTeste = await getCarrinhoExistente(userId, carrinhoID)
                let produtosLista = await getProdutosDoCarrinho(carrinhoID)
                res.status(200).json({ carrinhoID: carrinhoID, produtosLista, message: 'Produto adicionado ao carrinho com sucesso!' });

            } else {
                throw new Error('Erro ao atualizar a quantidade do produto no carrinho');
            }
        }
        // a
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: 'Erro ao adicionar o produto ao carrinho.' });
    }
}





async function getCarrinhoExistente(userId, carrinhoID) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT c.idCarrinho, c.status, cpv.idCarrinhoProdutoVariante, cpv.idProduto, cpv.idVariante, cpv.quantidade, p.nome, p.descricao, p.preco FROM carrinhos c';
        query += ' LEFT JOIN Carrinho_Produto_Variante cpv ON c.idCarrinho = cpv.idCarrinho';
        query += ' LEFT JOIN produtos p ON cpv.idProduto = p.idProduto';
        query += ' WHERE c.userID = ?';

        const params = [userId];

        if (!userId) {
            userId = 1
        }

        // Se carrinhoID estiver presente, adiciona à query
        if (carrinhoID) {
            query += ' AND c.idCarrinho = ?';
            params.push(carrinhoID);
        }

        query += ' ORDER BY c.dataAtualizacao DESC LIMIT 1';

        banco.conn.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


async function getProdutosDoCarrinho(carrinhoID) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT cpv.idCarrinhoProdutoVariante, p.idProduto, p.nome AS nomeProduto, p.descricao AS descricaoProduto, p.marca, p.grupo, p.preco, p.precoPromocional, p.identificadorERP, p.situacao, p.idLoja, v.idVariante, a.idAtributo, va.idValorAtributo, va.texto AS valorAtributo, cpv.quantidade';
        query += ' FROM carrinho_produto_variante cpv';
        query += ' JOIN produtos p ON cpv.idProduto = p.idProduto';
        query += ' LEFT JOIN variantes v ON cpv.idVariante = v.idVariante';
        query += ' LEFT JOIN atributos a ON v.idVariante = a.idVariante';
        query += ' LEFT JOIN valor_atributo va ON a.idAtributo = va.idAtributo';
        query += ' WHERE cpv.idCarrinho = ?';

        banco.conn.query(query, [carrinhoID], (err, results) => {
            if (err) {
                reject(err);
            } else {
                // Inicializa o carrinho e a lista de produtos
                const carrinho = {
                    idCarrinho: carrinhoID,
                    produtos: []
                };

                // Adiciona cada produto à lista de produtos do carrinho
                results.forEach(row => {
                    carrinho.produtos.push({
                        idCarrinhoProdutoVariante: row.idCarrinhoProdutoVariante,
                        idProduto: row.idProduto,
                        idVariante: row.idVariante,
                        quantidade: row.quantidade,
                        nome: row.nomeProduto,
                        descricao: row.descricaoProduto,
                        marca: row.marca,
                        grupo: row.grupo,
                        preco: row.preco,
                        precoPromocional: row.precoPromocional,
                        identificadorERP: row.identificadorERP,
                        situacao: row.situacao,
                        idLoja: row.idLoja,
                        idAtributo: row.idAtributo,
                        idValorAtributo: row.idValorAtributo,
                        valorAtributo: row.valorAtributo,
                    });
                });

                resolve(carrinho);
            }
        });
    });
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





