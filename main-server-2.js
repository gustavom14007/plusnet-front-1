// comandos - npm init -y  ---- comando para criar um app node.
// npm i express - comando para instalar express
// npm i jsonwebtoken
// npm i body-parser 
// npm i dotenv 

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
// const mysql = require('mysql2')
const banco = require('./main-db.js')
require('dotenv').config()

const jwt = require('jsonwebtoken')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true,
}))



app.post('/adicionarAoCarrinho', verifyJWT, async (req, res) => {
  try {
    const { produtoID, varianteID, quantidade } = req.body;
    const userId = req.userId;
    const lojaDoUsuario = req.userLoja; // Obtenha a loja do usuário a partir do token JWT

    // Verifique se o usuário já possui um carrinho
    let carrinhoID = null;

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
        res.status(200).json({ message: 'Produto adicionado ao carrinho com sucesso!' });
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
});





app.post('/criarPedido', verifyJWT, async (req, res) => {
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
});

app.get('/listarPedidosUsuario', verifyJWT, async (req, res) => {
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
});


app.get('/listarPedidos', async (req, res) => {
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
});



















// CREATE TABLE Lojas
//!LOJA
// Inserir uma nova loja
app.post('/lojas', verifyJWT, (req, res) => {
  const { url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj, inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG, permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica, idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp, clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao } = req.body;

  const query = 'INSERT INTO Lojas (url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj, inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG, permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica, idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp, clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  banco.conn.query(query, [url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj, inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG, permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica, idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp, clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar loja.' });
      return;
    }

    res.status(201).json({ message: 'Loja cadastrada com sucesso.', store: { id: results.insertId, url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj, inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG, permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica, idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp, clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao } });
  });
});

// Listar todas as lojas:
app.get('/lojas', (req, res) => {
  const query = 'SELECT * FROM Lojas';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar lojas.' });
      return;
    }

    res.status(200).json({ stores: results });
  });
});

// Atualizar uma loja pelo ID:
app.put('/lojas/:lojaID', verifyJWT, (req, res) => {
  const lojaID = req.params.lojaID;
  const { url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj, inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG, permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica, idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp, clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao } = req.body;

  const query = 'UPDATE Lojas SET url = ?, titulo = ?, descricao = ?, modalidade = ?, email = ?, idEndereco = ?, telefone1 = ?, telefone2 = ?, telefone3 = ?, cpfcnpj = ?, inscricaoEstadual = ?, frameworkFrontEnd = ?, breakpoint = ?, fotoProporcao = ?, fotoLarguraP = ?, fotoLarguraG = ?, permitirVendedor = ?, permitirObservacao = ?, emailCopiaOculta = ?, primeiraRegra = ?, regraGratis = ?, permitirPessoaJuridica = ?, idPagamentos = ?, pagamentoCartaoCpfTitular = ?, clearSaleModalidade = ?, clearSaleProduto = ?, clearSaleFingerPrintApp = ?, clearSaleEntityCode = ?, seoRobots = ?, googleAnalyticsID = ?, outrosSituacao = ? WHERE idLoja = ?';
  banco.conn.query(query, [url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3, cpfcnpj, inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG, permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis, permitirPessoaJuridica, idPagamentos, pagamentoCartaoCpfTitular, clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp, clearSaleEntityCode, seoRobots, googleAnalyticsID, outrosSituacao, lojaID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar a loja.' });
      return;
    }

    res.status(200).json({ message: 'Loja atualizada com sucesso.' });
  });
});

// Deletar uma loja pelo ID:
app.delete('/lojas/:lojaID', verifyJWT, (req, res) => {
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
});
//!LOJA

// CREATE TABLE Produtos
// !PRODUTO
// inserir produto 
app.post('/produtos', verifyJWT, (req, res) => {
  const { nome, descricao, preco, precoPromocional, idLoja } = req.body;

  const query = 'INSERT INTO Produtos (nome, descricao, preco, precoPromocional, idLoja) VALUES (?, ?, ?, ?, ?)';
  banco.conn.query(query, [nome, descricao, preco, precoPromocional, idLoja], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar produto.' });
      return;
    }

    res.status(201).json({ message: 'Produto cadastrado com sucesso.', product: { id: results.insertId, nome, descricao, preco, precoPromocional, idLoja } });
  });
});

// listar produtos 
app.get('/produtos', (req, res) => {
  const query = 'SELECT * FROM Produtos';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar produtos.' });
      return;
    }

    res.status(200).json({ products: results });
  });
});

// Atualizar um produto pelo pelo ID 
app.put('/produtos/:produtoID', verifyJWT, (req, res) => {
  const produtoID = req.params.produtoID;
  const { nome, descricao, preco, precoPromocional } = req.body;

  const query = 'UPDATE Produtos SET nome = ?, descricao = ?, preco = ?, precoPromocional = ? WHERE idProduto = ?';
  banco.conn.query(query, [nome, descricao, preco, precoPromocional, produtoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar o produto.' });
      return;
    }

    res.status(200).json({ message: 'Produto atualizado com sucesso.' });
  });
});

// Deletar um produto pelo ID
app.delete('/produtos/:produtoID', verifyJWT, (req, res) => {
  const produtoID = req.params.produtoID;

  const query = 'DELETE FROM Produtos WHERE idProduto = ?';
  banco.conn.query(query, [produtoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o produto.' });
      return;
    }

    res.status(200).json({ message: 'Produto deletado com sucesso.' });
  });
});

//?lojaID=1&marcaID=1&categoriaID=1&atributoID=1&valorAtributoID=1 
app.get('/buscarProdutos', verifyJWT, (req, res) => {
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

  console.log(query)

  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao buscar produtos.' });
      return;
    }

    res.status(200).json({ products: results });
  });
});


app.get('/produtosDaLoja', verifyJWT, (req, res) => {
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

  banco.conn.query(query, [lojaID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao buscar produtos da loja.' });
      return;
    }

    res.status(200).json({ products: results });
  });
});



app.get('/produtosDaLoja/:inicio/:fim', verifyJWT, (req, res) => {
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

  banco.conn.query(query, [lojaID, parseInt(inicio), parseInt(fim)], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao buscar produtos da loja.' });
      return;
    }

    res.status(200).json({ products: results });
  });
});





// !PRODUTO



// CREATE TABLE Enderecos
// !ENDERECOS
// Inserir um novo endereço:
app.post('/enderecos', verifyJWT, (req, res) => {
  const { logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja } = req.body;

  const query = 'INSERT INTO Enderecos (logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  banco.conn.query(query, [logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar endereço.' });
      return;
    }

    res.status(201).json({ message: 'Endereço cadastrado com sucesso.', address: { id: results.insertId, logradouro, numero, complemento, bairro, cidade, estado, pais, cep, idLoja } });
  });
});
// Listar todos os endereços:
app.get('/enderecos', verifyJWT, (req, res) => {
  const query = 'SELECT * FROM Enderecos';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar endereços.' });
      return;
    }

    res.status(200).json({ addresses: results });
  });
});
// 
// Atualizar um endereço pelo ID:
app.put('/enderecos/:enderecoID', verifyJWT, (req, res) => {
  const enderecoID = req.params.enderecoID;
  const { logradouro, numero, complemento, bairro, cidade, estado, pais, cep } = req.body;

  const query = 'UPDATE Enderecos SET logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?, pais = ?, cep = ? WHERE idEndereco = ?';
  banco.conn.query(query, [logradouro, numero, complemento, bairro, cidade, estado, pais, cep, enderecoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar o endereço.' });
      return;
    }

    res.status(200).json({ message: 'Endereço atualizado com sucesso.' });
  });
});
// 
// Deletar um endereço pelo ID:
app.delete('/enderecos/:enderecoID', verifyJWT, (req, res) => {
  const enderecoID = req.params.enderecoID;

  const query = 'DELETE FROM Enderecos WHERE idEndereco = ?';
  banco.conn.query(query, [enderecoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o endereço.' });
      return;
    }

    res.status(200).json({ message: 'Endereço deletado com sucesso.' });
  });
});
// !ENDERECOS



// CREATE TABLE Clientes
// !CLIENTES
// Inserir um novo cliente:
app.post('/clientes', verifyJWT, (req, res) => {
  const { nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja } = req.body;

  const query = 'INSERT INTO Clientes (nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  banco.conn.query(query, [nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
      return;
    }

    res.status(201).json({ message: 'Cliente cadastrado com sucesso.', client: { id: results.insertId, nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, idLoja } });
  });
});

// Listar todos os clientes:
app.get('/clientes', verifyJWT, (req, res) => {
  const query = 'SELECT * FROM Clientes';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar clientes.' });
      return;
    }

    res.status(200).json({ clients: results });
  });
});

// Atualizar um cliente pelo ID:
app.put('/clientes/:clienteID', verifyJWT, (req, res) => {
  const clienteID = req.params.clienteID;
  const { nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha } = req.body;

  const query = 'UPDATE Clientes SET nome = ?, sobrenome = ?, cpf = ?, rgNumero = ?, rgDataExpedicao = ?, dataNascimento = ?, sexo = ?, cnpj = ?, inscricaoEstadual = ?, receberNotificacoes = ?, receberInformativos = ?, situacao = ?, situacaoMotivo = ?, observacaoInterna = ?, email = ?, senha = ? WHERE idCliente = ?';
  banco.conn.query(query, [nome, sobrenome, cpf, rgNumero, rgDataExpedicao, dataNascimento, sexo, cnpj, inscricaoEstadual, receberNotificacoes, receberInformativos, situacao, situacaoMotivo, observacaoInterna, email, senha, clienteID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar o cliente.' });
      return;
    }

    res.status(200).json({ message: 'Cliente atualizado com sucesso.' });
  });
});

// Deletar um cliente pelo ID:
app.delete('/clientes/:clienteID', verifyJWT, (req, res) => {
  const clienteID = req.params.clienteID;

  const query = 'DELETE FROM Clientes WHERE idCliente = ?';
  banco.conn.query(query, [clienteID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o cliente.' });
      return;
    }

    res.status(200).json({ message: 'Cliente deletado com sucesso.' });
  });
});

// !CLIENTES


// CREATE TABLE Grupos
// !GRUPOS
// Inserir um novo grupo:
app.post('/grupos', verifyJWT, (req, res) => {
  const { grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao, idLoja } = req.body;

  const query = 'INSERT INTO Grupos (grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao, idLoja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  banco.conn.query(query, [grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao, idLoja], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar grupo.' });
      return;
    }

    res.status(201).json({ message: 'Grupo cadastrado com sucesso.', group: { id: results.insertId, grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao, idLoja } });
  });
});

// Listar todos os grupos:
app.get('/grupos', (req, res) => {
  const query = 'SELECT * FROM Grupos';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar grupos.' });
      return;
    }

    res.status(200).json({ groups: results });
  });
});

// Atualizar um grupo pelo ID:
app.put('/grupos/:grupoID', verifyJWT, (req, res) => {
  const grupoID = req.params.grupoID;
  const { grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao } = req.body;

  const query = 'UPDATE Grupos SET grupoPai = ?, nome = ?, identificadorERP = ?, descricao = ?, seoHtmlTitle = ?, seoHtmlMetaDescription = ?, seoHtmlMetaKeywords = ?, seoHtmlAbstract = ?, seoHtmlHead = ?, filtroDeMarca = ?, situacao = ? WHERE idGrupo = ?';
  banco.conn.query(query, [grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao, grupoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar o grupo.' });
      return;
    }

    res.status(200).json({ message: 'Grupo atualizado com sucesso.' });
  });
});

// Deletar um grupo pelo ID:
app.delete('/grupos/:grupoID', verifyJWT, (req, res) => {
  const grupoID = req.params.grupoID;

  const query = 'DELETE FROM Grupos WHERE idGrupo = ?';
  banco.conn.query(query, [grupoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o grupo.' });
      return;
    }

    res.status(200).json({ message: 'Grupo deletado com sucesso.' });
  });
});
// !GRUPOS

// CREATE TABLE Marcas
// !MARCAS
// Inserir uma nova marca:
app.post('/marcas', verifyJWT, (req, res) => {
  const { urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, idLoja } = req.body;

  const query = 'INSERT INTO Marcas (urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, idLoja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  banco.conn.query(query, [urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, idLoja], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar marca.' });
      return;
    }

    res.status(201).json({ message: 'Marca cadastrada com sucesso.', brand: { id: results.insertId, urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, idLoja } });
  });
});

// Listar todas as marcas:
app.get('/marcas', (req, res) => {
  const query = 'SELECT * FROM Marcas';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar marcas.' });
      return;
    }

    res.status(200).json({ brands: results });
  });
});

// Atualizar uma marca pelo ID:
app.put('/marcas/:marcaID', verifyJWT, (req, res) => {
  const marcaID = req.params.marcaID;
  const { urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao } = req.body;

  const query = 'UPDATE Marcas SET urlDe = ?, urlPara = ?, tipo = ?, dataHoraInicial = ?, dataHoraFinal = ?, horaInicial = ?, horaFinal = ?, situacao = ? WHERE idMarca = ?';
  banco.conn.query(query, [urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, marcaID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar a marca.' });
      return;
    }

    res.status(200).json({ message: 'Marca atualizada com sucesso.' });
  });
});
// 
// Deletar uma marca pelo ID:
app.delete('/marcas/:marcaID', verifyJWT, (req, res) => {
  const marcaID = req.params.marcaID;

  const query = 'DELETE FROM Marcas WHERE idMarca = ?';
  banco.conn.query(query, [marcaID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar a marca.' });
      return;
    }

    res.status(200).json({ message: 'Marca deletada com sucesso.' });
  });
});
// !MARCAS

// CREATE TABLE Variantes
// !VARIANTES
// Tabela de Variantes
// Inserir uma nova variante:
app.post('/variantes', verifyJWT, (req, res) => {
  const { idProduto, quantidade } = req.body;

  const query = 'INSERT INTO Variantes (idProduto, quantidade) VALUES (?, ?)';
  banco.conn.query(query, [idProduto, quantidade], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar variante.' });
      return;
    }

    res.status(201).json({ message: 'Variante cadastrada com sucesso.', variant: { id: results.insertId, idProduto, quantidade } });
  });
});
// Listar todas as variantes:
app.get('/variantes', (req, res) => {
  const query = 'SELECT * FROM Variantes';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar variantes.' });
      return;
    }

    res.status(200).json({ variants: results });
  });
});
// Atualizar uma variante pelo ID:
app.put('/variantes/:varianteID', verifyJWT, (req, res) => {
  const varianteID = req.params.varianteID;
  const { quantidade } = req.body;

  const query = 'UPDATE Variantes SET quantidade = ? WHERE idVariante = ?';
  banco.conn.query(query, [quantidade, varianteID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar a variante.' });
      return;
    }

    res.status(200).json({ message: 'Variante atualizada com sucesso.' });
  });
});
// Deletar uma variante pelo ID:
app.delete('/variantes/:varianteID', verifyJWT, (req, res) => {
  const varianteID = req.params.varianteID;

  const query = 'DELETE FROM Variantes WHERE idVariante = ?';
  banco.conn.query(query, [varianteID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar a variante.' });
      return;
    }

    res.status(200).json({ message: 'Variante deletada com sucesso.' });
  });
});
// !VARIANTES

// CREATE TABLE Atributos
//!ATRIBUTOS
// Inserir um novo atributo:
app.post('/atributos', verifyJWT, (req, res) => {
  const { idVariante, valorAtributo } = req.body;

  const query = 'INSERT INTO Atributos (idVariante, valorAtributo) VALUES (?, ?)';
  banco.conn.query(query, [idVariante, valorAtributo], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar atributo.' });
      return;
    }

    res.status(201).json({ message: 'Atributo cadastrado com sucesso.', attribute: { id: results.insertId, idVariante, valorAtributo } });
  });
});

// Listar todos os atributos:
app.get('/atributos', (req, res) => {
  const query = 'SELECT * FROM Atributos';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar atributos.' });
      return;
    }

    res.status(200).json({ attributes: results });
  });
});

// Atualizar um atributo pelo ID:
app.put('/atributos/:atributoID', verifyJWT, (req, res) => {
  const atributoID = req.params.atributoID;
  const { valorAtributo } = req.body;

  const query = 'UPDATE Atributos SET valorAtributo = ? WHERE idAtributo = ?';
  banco.conn.query(query, [valorAtributo, atributoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar o atributo.' });
      return;
    }

    res.status(200).json({ message: 'Atributo atualizado com sucesso.' });
  });
});

// Deletar um atributo pelo ID:
app.delete('/atributos/:atributoID', verifyJWT, (req, res) => {
  const atributoID = req.params.atributoID;

  const query = 'DELETE FROM Atributos WHERE idAtributo = ?';
  banco.conn.query(query, [atributoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o atributo.' });
      return;
    }

    res.status(200).json({ message: 'Atributo deletado com sucesso.' });
  });
});

//!ATRIBUTOS

// CREATE TABLE Valor_Atributo
// !valor_atributo
// Inserir um novo valor de atributo:
app.post('/valorAtributo', verifyJWT, (req, res) => {
  const { idAtributo, texto } = req.body;

  const query = 'INSERT INTO Valor_Atributo (idAtributo, texto) VALUES (?, ?)';
  banco.conn.query(query, [idAtributo, texto], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar valor de atributo.' });
      return;
    }

    res.status(201).json({ message: 'Valor de atributo cadastrado com sucesso.', attributeValue: { id: results.insertId, idAtributo, texto } });
  });
});

// Listar todos os valores de atributo:
app.get('/valorAtributo', (req, res) => {
  const query = 'SELECT * FROM Valor_Atributo';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar valores de atributo.' });
      return;
    }

    res.status(200).json({ attributeValues: results });
  });
});

// Atualizar um valor de atributo pelo ID:
app.put('/valorAtributo/:valorAtributoID', verifyJWT, (req, res) => {
  const valorAtributoID = req.params.valorAtributoID;
  const { texto } = req.body;

  const query = 'UPDATE Valor_Atributo SET texto = ? WHERE idValorAtributo = ?';
  banco.conn.query(query, [texto, valorAtributoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar o valor de atributo.' });
      return;
    }

    res.status(200).json({ message: 'Valor de atributo atualizado com sucesso.' });
  });
});

// Deletar um valor de atributo pelo ID:
app.delete('/valorAtributo/:valorAtributoID', verifyJWT, (req, res) => {
  const valorAtributoID = req.params.valorAtributoID;

  const query = 'DELETE FROM Valor_Atributo WHERE idValorAtributo = ?';
  banco.conn.query(query, [valorAtributoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o valor de atributo.' });
      return;
    }

    res.status(200).json({ message: 'Valor de atributo deletado com sucesso.' });
  });
});
// !valor_atributo

// CREATE TABLE Grupo_Subgrupo
// !Grupo_Subgrupo
// Inserir um novo relacionamento Grupo-Subgrupo:
app.post('/grupoSubgrupo', verifyJWT, (req, res) => {
  const { idGrupo, idSubgrupo } = req.body;

  const query = 'INSERT INTO Grupo_Subgrupo (idGrupo, idSubgrupo) VALUES (?, ?)';
  banco.conn.query(query, [idGrupo, idSubgrupo], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao criar o relacionamento Grupo-Subgrupo.' });
      return;
    }

    res.status(201).json({ message: 'Relacionamento Grupo-Subgrupo criado com sucesso.' });
  });
});

// Listar todos os Grupo-Subgrupo:
app.get('/grupoSubgrupo', (req, res) => {
  const query = 'SELECT * FROM Grupo_Subgrupo';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar os relacionamentos Grupo-Subgrupo.' });
      return;
    }

    res.status(200).json({ relationships: results });
  });
});

// Deletar um Grupo-Subgrupo pelo ID do Grupo e do Subgrupo:
app.delete('/grupoSubgrupo/:idGrupo/:idSubgrupo', verifyJWT, (req, res) => {
  const idGrupo = req.params.idGrupo;
  const idSubgrupo = req.params.idSubgrupo;

  const query = 'DELETE FROM Grupo_Subgrupo WHERE idGrupo = ? AND idSubgrupo = ?';
  banco.conn.query(query, [idGrupo, idSubgrupo], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o relacionamento Grupo-Subgrupo.' });
      return;
    }

    res.status(200).json({ message: 'Relacionamento Grupo-Subgrupo deletado com sucesso.' });
  });
});

// Atualizar um relacionamento Grupo-Subgrupo pelo ID do Grupo e do Subgrupo:
app.put('/grupoSubgrupo/:idGrupo/:idSubgrupo', verifyJWT, (req, res) => {
  const idGrupo = req.params.idGrupo;
  const idSubgrupo = req.params.idSubgrupo;
  const { novoIdGrupo, novoIdSubgrupo } = req.body;

  // Verifique se o relacionamento Grupo-Subgrupo existente está sendo atualizado para novos valores
  if (!novoIdGrupo || !novoIdSubgrupo) {
    res.status(400).json({ error: 'É necessário fornecer novos valores para a atualização.' });
    return;
  }

  const query = 'UPDATE Grupo_Subgrupo SET idGrupo = ?, idSubgrupo = ? WHERE idGrupo = ? AND idSubgrupo = ?';
  banco.conn.query(query, [novoIdGrupo, novoIdSubgrupo, idGrupo, idSubgrupo], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar o relacionamento Grupo-Subgrupo.' });
      return;
    }

    res.status(200).json({ message: 'Relacionamento Grupo-Subgrupo atualizado com sucesso.' });
  });
});

// !Grupo_Subgrupo

// CREATE TABLE Marca_Produto
// !Marca_Produto
// Inserir uma nova relação Marca-Produto:
app.post('/marcaProduto', verifyJWT, (req, res) => {
  const { idMarca, idProduto } = req.body;

  const query = 'INSERT INTO Marca_Produto (idMarca, idProduto) VALUES (?, ?)';
  banco.conn.query(query, [idMarca, idProduto], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao criar a relação Marca-Produto.' });
      return;
    }

    res.status(201).json({ message: 'Relação Marca-Produto criada com sucesso.' });
  });
});

// Listar todas as relações Marca-Produto:
app.get('/marcaProduto', (req, res) => {
  const query = 'SELECT * FROM Marca_Produto';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar as relações Marca-Produto.' });
      return;
    }

    res.status(200).json({ relationships: results });
  });
});

// Deletar uma relação Marca-Produto pelo ID da Marca e do Produto:
app.delete('/marcaProduto/:idMarca/:idProduto', verifyJWT, (req, res) => {
  const idMarca = req.params.idMarca;
  const idProduto = req.params.idProduto;

  const query = 'DELETE FROM Marca_Produto WHERE idMarca = ? AND idProduto = ?';
  banco.conn.query(query, [idMarca, idProduto], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar a relação Marca-Produto.' });
      return;
    }

    res.status(200).json({ message: 'Relação Marca-Produto deletada com sucesso.' });
  });
});

// Atualizar uma relação Marca-Produto pelo ID da Marca e do Produto:
app.put('/marcaProduto/:idMarca/:idProduto', verifyJWT, (req, res) => {
  const idMarca = req.params.idMarca;
  const idProduto = req.params.idProduto;
  const { novoIdMarca, novoIdProduto } = req.body;

  // Verifique se a relação Marca-Produto existente está sendo atualizada para novos valores
  if (!novoIdMarca || !novoIdProduto) {
    res.status(400).json({ error: 'É necessário fornecer novos valores para a atualização.' });
    return;
  }

  const query = 'UPDATE Marca_Produto SET idMarca = ?, idProduto = ? WHERE idMarca = ? AND idProduto = ?';
  banco.conn.query(query, [novoIdMarca, novoIdProduto, idMarca, idProduto], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar a relação Marca-Produto.' });
      return;
    }

    res.status(200).json({ message: 'Relação Marca-Produto atualizada com sucesso.' });
  });
});

// !Marca_Produto

// CREATE TABLE Grupo_Produto
// !Grupo_Produto

// Inserir uma nova relação Grupo-Produto:
app.post('/grupoProduto', verifyJWT, (req, res) => {
  const { idGrupo, idProduto } = req.body;

  const query = 'INSERT INTO Grupo_Produto (idGrupo, idProduto) VALUES (?, ?)';
  banco.conn.query(query, [idGrupo, idProduto], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao criar a relação Grupo-Produto.' });
      return;
    }

    res.status(201).json({ message: 'Relação Grupo-Produto criada com sucesso.' });
  });
});

// Listar todos os Grupo-Produto:
app.get('/grupoProduto', (req, res) => {
  const query = 'SELECT * FROM Grupo_Produto';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar as relações Grupo-Produto.' });
      return;
    }

    res.status(200).json({ relationships: results });
  });
});

// Deletar uma relação Grupo-Produto pelo ID do Grupo e do Produto:
app.delete('/grupoProduto/:idGrupo/:idProduto', verifyJWT, (req, res) => {
  const idGrupo = req.params.idGrupo;
  const idProduto = req.params.idProduto;

  const query = 'DELETE FROM Grupo_Produto WHERE idGrupo = ? AND idProduto = ?';
  banco.conn.query(query, [idGrupo, idProduto], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar a relação Grupo-Produto.' });
      return;
    }

    res.status(200).json({ message: 'Relação Grupo-Produto deletada com sucesso.' });
  });
});

// Atualizar uma relação Grupo-Produto pelo ID do Grupo e do Produto:
app.put('/grupoProduto/:idGrupo/:idProduto', verifyJWT, (req, res) => {
  const idGrupo = req.params.idGrupo;
  const idProduto = req.params.idProduto;
  const { novoIdGrupo, novoIdProduto } = req.body;

  // Verifique se a relação Grupo-Produto existente está sendo atualizada para novos valores
  if (!novoIdGrupo || !novoIdProduto) {
    res.status(400).json({ error: 'É necessário fornecer novos valores para a atualização.' });
    return;
  }

  const query = 'UPDATE Grupo_Produto SET idGrupo = ?, idProduto = ? WHERE idGrupo = ? AND idProduto = ?';
  banco.conn.query(query, [novoIdGrupo, novoIdProduto, idGrupo, idProduto], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar a relação Grupo-Produto.' });
      return;
    }

    res.status(200).json({ message: 'Relação Grupo-Produto atualizada com sucesso.' });
  });
});
// !Grupo_Produto

// CREATE TABLE Pedidos
// !Pedidos
// Inserir um novo pedido:
// 
app.post('/pedidos', verifyJWT, (req, res) => {
  const { quantidade, valorTotal, idLoja } = req.body;

  const query = 'INSERT INTO Pedidos (quantidade, valorTotal, idLoja) VALUES (?, ?, ?)';
  banco.conn.query(query, [quantidade, valorTotal, idLoja], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar pedido.' });
      return;
    }

    res.status(201).json({ message: 'Pedido cadastrado com sucesso.', order: { id: results.insertId, quantidade, valorTotal, idLoja } });
  });
});

// Listar todos os pedidos:
app.get('/pedidos', verifyJWT, (req, res) => {
  const query = 'SELECT * FROM Pedidos';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar pedidos.' });
      return;
    }

    res.status(200).json({ orders: results });
  });
});

// Atualizar um pedido pelo ID:
app.put('/pedidos/:pedidoID', verifyJWT, (req, res) => {
  const pedidoID = req.params.pedidoID;
  const { quantidade, valorTotal } = req.body;

  const query = 'UPDATE Pedidos SET quantidade = ?, valorTotal = ? WHERE idPedido = ?';
  banco.conn.query(query, [quantidade, valorTotal, pedidoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar o pedido.' });
      return;
    }

    res.status(200).json({ message: 'Pedido atualizado com sucesso.' });
  });
});

// Deletar um pedido pelo ID:
app.delete('/pedidos/:pedidoID', verifyJWT, (req, res) => {
  const pedidoID = req.params.pedidoID;

  const query = 'DELETE FROM Pedidos WHERE idPedido = ?';
  banco.conn.query(query, [pedidoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o pedido.' });
      return;
    }

    res.status(200).json({ message: 'Pedido deletado com sucesso.' });
  });
});
// !Pedidos

// CREATE TABLE Pedido_Produto_Variante
// !Pedido_Produto_Variante
// Inserir um novo registro em Pedido_Produto_Variante(relacionando um produto variante a um pedido):

app.post('/pedidoProdutoVariante', verifyJWT, (req, res) => {
  const { idProduto, idVariante, idPedido } = req.body;

  const query = 'INSERT INTO Pedido_Produto_Variante (idProduto, idVariante, idPedido) VALUES (?, ?, ?)';
  banco.conn.query(query, [idProduto, idVariante, idPedido], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao relacionar produto variante ao pedido.' });
      return;
    }

    res.status(201).json({ message: 'Produto variante relacionado ao pedido com sucesso.' });
  });
});

// Listar todos os registros em Pedido_Produto_Variante:
app.get('/pedidoProdutoVariante', (req, res) => {
  const query = 'SELECT * FROM Pedido_Produto_Variante';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar os registros de Pedido_Produto_Variante.' });
      return;
    }

    res.status(200).json({ orderProductVariants: results });
  });
});

// Atualizar um registro em Pedido_Produto_Variante pelo ID do Pedido e ID da Variante:
app.put('/pedidoProdutoVariante/:idPedido/:idVariante', verifyJWT, (req, res) => {
  const idPedido = req.params.idPedido;
  const idVariante = req.params.idVariante;
  const { idProduto } = req.body;

  const query = 'UPDATE Pedido_Produto_Variante SET idProduto = ? WHERE idPedido = ? AND idVariante = ?';
  banco.conn.query(query, [idProduto, idPedido, idVariante], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar o registro em Pedido_Produto_Variante.' });
      return;
    }

    res.status(200).json({ message: 'Registro em Pedido_Produto_Variante atualizado com sucesso.' });
  });
});

// Deletar um registro em Pedido_Produto_Variante pelo ID do Pedido e ID da Variante:
app.delete('/pedidoProdutoVariante/:idPedido/:idVariante', verifyJWT, (req, res) => {
  const idPedido = req.params.idPedido;
  const idVariante = req.params.idVariante;

  const query = 'DELETE FROM Pedido_Produto_Variante WHERE idPedido = ? AND idVariante = ?';
  banco.conn.query(query, [idPedido, idVariante], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o registro em Pedido_Produto_Variante.' });
      return;
    }

    res.status(200).json({ message: 'Registro em Pedido_Produto_Variante deletado com sucesso.' });
  });
});
// !Pedido_Produto_Variante

// CREATE TABLE EnderecoCliente
// !EnderecoCliente
// Inserir um novo registro em EnderecoCliente(relacionando um cliente a um endereço):
app.post('/enderecoCliente', verifyJWT, (req, res) => {
  const { idEndereco, idCliente } = req.body;

  const query = 'INSERT INTO EnderecoCliente (idEndereco, idCliente) VALUES (?, ?)';
  banco.conn.query(query, [idEndereco, idCliente], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao relacionar cliente ao endereço.' });
      return;
    }

    res.status(201).json({ message: 'Cliente relacionado ao endereço com sucesso.' });
  });
});

// Listar todos os registros em EnderecoCliente:
app.get('/enderecoCliente', verifyJWT, (req, res) => {
  const query = 'SELECT * FROM EnderecoCliente';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar os registros de EnderecoCliente.' });
      return;
    }

    res.status(200).json({ addressClients: results });
  });
});

// Deletar um registro em EnderecoCliente pelo ID do Endereço e ID do Cliente:
app.delete('/enderecoCliente/:idEndereco/:idCliente', verifyJWT, (req, res) => {
  const idEndereco = req.params.idEndereco;
  const idCliente = req.params.idCliente;

  const query = 'DELETE FROM EnderecoCliente WHERE idEndereco = ? AND idCliente = ?';
  banco.conn.query(query, [idEndereco, idCliente], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o registro em EnderecoCliente.' });
      return;
    }

    res.status(200).json({ message: 'Registro em EnderecoCliente deletado com sucesso.' });
  });
});


// !EnderecoCliente

// CREATE TABLE Pedido_Cliente
// !Pedido_Cliente

// Inserir um novo registro em Pedidos_Cliente(relacionando um cliente a um pedido):
app.post('/pedidosCliente', verifyJWT, (req, res) => {
  const { idPedido, idCliente } = req.body;

  const query = 'INSERT INTO Pedido_Cliente (idPedido, idCliente) VALUES (?, ?)';
  banco.conn.query(query, [idPedido, idCliente], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao relacionar cliente ao pedido.' });
      return;
    }

    res.status(201).json({ message: 'Cliente relacionado ao pedido com sucesso.' });
  });
});

// Listar todos os registros em Pedidos_Cliente:
app.get('/pedidosCliente', verifyJWT, (req, res) => {
  const query = 'SELECT * FROM Pedido_Cliente';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar os registros de Pedidos_Cliente.' });
      return;
    }

    res.status(200).json({ orderClients: results });
  });
});

// Deletar um registro em Pedidos_Cliente pelo ID do Pedido e ID do Cliente:
// 
app.delete('/pedidosCliente/:idPedido/:idCliente', verifyJWT, (req, res) => {
  const idPedido = req.params.idPedido;
  const idCliente = req.params.idCliente;

  const query = 'DELETE FROM Pedido_Cliente WHERE idPedido = ? AND idCliente = ?';
  banco.conn.query(query, [idPedido, idCliente], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o registro em Pedidos_Cliente.' });
      return;
    }

    res.status(200).json({ message: 'Registro em Pedidos_Cliente deletado com sucesso.' });
  });
});


// !Pedido_Cliente

// CREATE TABLE Entregas
// !Entregas

// Inserir uma nova entrega:
app.post('/entregas', (req, res) => {
  const { idLoja } = req.body;

  const query = 'INSERT INTO Entregas (idLoja) VALUES (?)';
  banco.conn.query(query, [idLoja], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar entrega.' });
      return;
    }

    res.status(201).json({ message: 'Entrega cadastrada com sucesso.', delivery: { id: results.insertId, idLoja } });
  });
});

// Listar todas as entregas:
app.get('/entregas', verifyJWT, (req, res) => {
  const query = 'SELECT * FROM Entregas';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar entregas.' });
      return;
    }

    res.status(200).json({ deliveries: results });
  });
});

// Atualizar uma entrega pelo ID:
app.put('/entregas/:entregaID', verifyJWT, (req, res) => {
  const entregaID = req.params.entregaID;
  const { idLoja } = req.body;

  const query = 'UPDATE Entregas SET idLoja = ? WHERE idEntrega = ?';
  banco.conn.query(query, [idLoja, entregaID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar a entrega.' });
      return;
    }

    res.status(200).json({ message: 'Entrega atualizada com sucesso.' });
  });
});

// Deletar uma entrega pelo ID:
app.delete('/entregas/:entregaID', verifyJWT, (req, res) => {
  const entregaID = req.params.entregaID;

  const query = 'DELETE FROM Entregas WHERE idEntrega = ?';
  banco.conn.query(query, [entregaID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar a entrega.' });
      return;
    }

    res.status(200).json({ message: 'Entrega deletada com sucesso.' });
  });
});

// !Entregas

// CREATE TABLE Entrega_Pedido 
// !Entrega_Pedido 
// Inserir uma nova relação Entrega - Pedido:
app.post('/entregaPedido', verifyJWT, (req, res) => {
  const { idEntrega, idPedido } = req.body;

  const query = 'INSERT INTO Entrega_Pedido (idEntrega, idPedido) VALUES (?, ?)';
  banco.conn.query(query, [idEntrega, idPedido], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao criar a relação Entrega-Pedido.' });
      return;
    }

    res.status(201).json({ message: 'Relação Entrega-Pedido criada com sucesso.' });
  });
});

// Listar todas as relações Entrega-Pedido:
app.get('/entregaPedido', verifyJWT, (req, res) => {
  const query = 'SELECT * FROM Entrega_Pedido';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar as relações Entrega-Pedido.' });
      return;
    }

    res.status(200).json({ relationships: results });
  });
});

// Deletar uma relação Entrega-Pedido pelo ID da Entrega e do Pedido:
app.delete('/entregaPedido/:idEntrega/:idPedido', verifyJWT, (req, res) => {
  const idEntrega = req.params.idEntrega;
  const idPedido = req.params.idPedido;

  const query = 'DELETE FROM Entrega_Pedido WHERE idEntrega = ? AND idPedido = ?';
  banco.conn.query(query, [idEntrega, idPedido], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar a relação Entrega-Pedido.' });
      return;
    }

    res.status(200).json({ message: 'Relação Entrega-Pedido deletada com sucesso.' });
  });
});

// Atualizar uma relação Entrega-Pedido pelo ID da Entrega e do Pedido:
app.put('/entregaPedido/:idEntrega/:idPedido', verifyJWT, (req, res) => {
  const idEntrega = req.params.idEntrega;
  const idPedido = req.params.idPedido;
  const { novoIdEntrega, novoIdPedido } = req.body;

  // Verifique se a relação Entrega-Pedido existente está sendo atualizada para novos valores
  if (!novoIdEntrega || !novoIdPedido) {
    res.status(400).json({ error: 'É necessário fornecer novos valores para a atualização.' });
    return;
  }

  const query = 'UPDATE Entrega_Pedido SET idEntrega = ?, idPedido = ? WHERE idEntrega = ? AND idPedido = ?';
  banco.conn.query(query, [novoIdEntrega, novoIdPedido, idEntrega, idPedido], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar a relação Entrega-Pedido.' });
      return;
    }

    res.status(200).json({ message: 'Relação Entrega-Pedido atualizada com sucesso.' });
  });
});

// !Entrega_Pedido 

// create table carrinhos 
// !carrinhos

// Inserir um novo carrinho:
app.post('/carrinhos', verifyJWT, (req, res) => {
  const { idCliente, dataPublicacao, dataAtualizacao, idLoja } = req.body;

  const query = 'INSERT INTO Carrinhos (idCliente, dataPublicacao, dataAtualizacao, idLoja) VALUES (?, ?, ?, ?)';
  banco.conn.query(query, [idCliente, dataPublicacao, dataAtualizacao, idLoja], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao cadastrar carrinho.' });
      return;
    }

    res.status(201).json({ message: 'Carrinho cadastrado com sucesso.', cart: { id: results.insertId, idCliente, dataPublicacao, dataAtualizacao, idLoja } });
  });
});

// Listar todos os carrinhos:
app.get('/carrinhos', verifyJWT, (req, res) => {
  const query = 'SELECT * FROM Carrinhos';
  banco.conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar carrinhos.' });
      return;
    }

    res.status(200).json({ carts: results });
  });
});

// Atualizar um carrinho pelo ID:
app.put('/carrinhos/:carrinhoID', verifyJWT, (req, res) => {
  const carrinhoID = req.params.carrinhoID;
  const { idCliente, dataPublicacao, dataAtualizacao, idLoja } = req.body;

  const query = 'UPDATE Carrinhos SET idCliente = ?, dataPublicacao = ?, dataAtualizacao = ?, idLoja = ? WHERE idCarrinho = ?';
  banco.conn.query(query, [idCliente, dataPublicacao, dataAtualizacao, idLoja, carrinhoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar o carrinho.' });
      return;
    }

    res.status(200).json({ message: 'Carrinho atualizado com sucesso.' });
  });
});

// Deletar um carrinho pelo ID:
app.delete('/carrinhos/:carrinhoID', verifyJWT, (req, res) => {
  const carrinhoID = req.params.carrinhoID;

  const query = 'DELETE FROM Carrinhos WHERE idCarrinho = ?';
  banco.conn.query(query, [carrinhoID], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o carrinho.' });
      return;
    }

    res.status(200).json({ message: 'Carrinho deletado com sucesso.' });
  });
});

// TODO: LISTAR O CARRINHO DA PESSOA ATUAL, NAO PODE SER VINCULADO COM O ID


// !carrinhos

// create table carrinho_produto_variante
// !carrinho_produto_variante
// Inserir um novo produto variante em um carrinho:
app.post('/carrinhoProdutoVariante', verifyJWT, (req, res) => {
  const { idProduto, idVariante, idCarrinho, dataAtualizacao } = req.body;

  const query = 'INSERT INTO Carrinho_Produto_Variante (idProduto, idVariante, idCarrinho, dataAtualizacao) VALUES (?, ?, ?, ?)';
  banco.conn.query(query, [idProduto, idVariante, idCarrinho, dataAtualizacao], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao adicionar produto variante ao carrinho.' });
      return;
    }

    res.status(201).json({ message: 'Produto variante adicionado ao carrinho com sucesso.' });
  });
});

// Listar todos os produtos variantes em um carrinho:
app.get('/carrinhoProdutoVariante/:idCarrinho', verifyJWT, (req, res) => {
  const idCarrinho = req.params.idCarrinho;
  const query = 'SELECT * FROM Carrinho_Produto_Variante WHERE idCarrinho = ?';
  banco.conn.query(query, [idCarrinho], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao listar produtos variantes no carrinho.' });
      return;
    }

    res.status(200).json({ cartProducts: results });
  });
});


// Atualizar um produto variante em um carrinho pelo ID do Produto e ID do Carrinho:
app.put('/carrinhoProdutoVariante/:idProduto/:idCarrinho', verifyJWT, (req, res) => {
  const idProduto = req.params.idProduto;
  const idCarrinho = req.params.idCarrinho;
  const { idVariante, dataAtualizacao } = req.body;

  const query = 'UPDATE Carrinho_Produto_Variante SET idVariante = ?, dataAtualizacao = ? WHERE idProduto = ? AND idCarrinho = ?';
  banco.conn.query(query, [idVariante, dataAtualizacao, idProduto, idCarrinho], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao atualizar o produto variante no carrinho.' });
      return;
    }

    res.status(200).json({ message: 'Produto variante no carrinho atualizado com sucesso.' });
  });
});

// Deletar um produto variante em um carrinho pelo ID do Produto e ID do Carrinho:
app.delete('/carrinhoProdutoVariante/:idProduto/:idCarrinho', verifyJWT, (req, res) => {
  const idProduto = req.params.idProduto;
  const idCarrinho = req.params.idCarrinho;

  const query = 'DELETE FROM Carrinho_Produto_Variante WHERE idProduto = ? AND idCarrinho = ?';
  banco.conn.query(query, [idProduto, idCarrinho], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro ao deletar o produto variante do carrinho.' });
      return;
    }

    res.status(200).json({ message: 'Produto variante do carrinho deletado com sucesso.' });
  });
});

// !carrinho_produto_variante






// criar conta
app.post('/registrar', (req, res) => {
  const usuario = req.body.user;
  const senha = req.body.password;
  const email = req.body.email;
  const loja = req.body.loja; // Adicione a loja ao corpo da solicitação

  const query = 'INSERT INTO usuarios (user, password, email, loja) VALUES (?, ?, ?, ?)';
  banco.conn.query(query, [usuario, senha, email, loja], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Não foi possível registrar uma conta com estes dados' });
      return;
    }

    res.status(200).json({ message: 'Conta criada com sucesso.', results: results });
  });
});



// autenticação  ou login entrar
// autenticação ou login entrar
app.post('/login', (req, res, next) => {
  const usuarioRequest = req.body.user;
  const senhaRequest = req.body.password;
  const lojaRequest = req.body.loja; // Adicione a loja ao corpo da solicitação

  const query = 'SELECT usuarioID, loja FROM usuarios WHERE user=? AND password=? AND loja=?';

  banco.conn.query(query, [usuarioRequest, senhaRequest, lojaRequest], function (error, results) {
    if (error) {
      res.status(500).json({ message: 'Erro!', erro: error });
      throw error;
    } else if (results[0]) {
      // auth ok
      const id = results[0].usuarioID;
      const loja = results[0].loja;

      if (id) {
        const token = jwt.sign({ id, loja }, process.env.SECRET, {
          expiresIn: '900s'
        });

        return res.json({ auth: true, token: token });
      } else {
        res.status(500).json({ message: 'Login inválido!' });
      }
    } else {
      res.status(500).json({ message: 'Login inválido!' });
    }
  });
});





//Autorização
function verifyJWT(req, res, next) {
  const token = req.headers['x-acess-token'];

  if (!token) return res.status(401).json({ auth: false, message: 'No token provided' });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

    // Verifique o campo "loja" no token JWT
    const lojaDoToken = decoded.loja;
    const lojaDaRequisicao = parseInt(req.headers.loja); // Suponha que você receba a loja na solicitação

    console.log(lojaDoToken, lojaDaRequisicao)

    if (lojaDoToken === lojaDaRequisicao) {
      req.userId = decoded.id;
      req.userLoja = lojaDoToken; // Armazene a loja no objeto de solicitação para uso posterior
      next();
    } else {
      res.status(403).json({ auth: false, message: 'Access denied: Unauthorized store' });
    }
  });
}








///         se tiver uma porta, usa , senão: 3000
const portaNode = process.env.API_PORT || 3000

app.listen(3000, function () {
  console.log(`Api contato está rodando na porta ${portaNode}`)
})



// banco.conn.testar();