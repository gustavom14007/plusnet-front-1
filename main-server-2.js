// comandos - npm init -y  ---- comando para criar um app node.
// npm i express - comando para instalar express
// npm i jsonwebtoken
// npm i body-parser 
// npm i dotenv 

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
// const mysql = require('mysql2')
const banco = require('./database/main-db.js')
require('dotenv').config()

const jwt = require('jsonwebtoken')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true,
}))



// Importando os módulos das rotas
const authRoutes = require('./routes/authRoutes');

// Usando as rotas no aplicativo Express
app.use('/auth', authRoutes);

const lojasRoutes = require('./routes/lojaRoutes');

// Usando as rotas
app.use('/lojas', lojasRoutes);

const produtoRoutes = require('./routes/produtoRoutes');

// Usando as rotas
app.use('/produtos', produtoRoutes);



const produtoBuscaRoutes = require('./routes/produtoBuscaRoutes');

// Usando as rotas
app.use('/produtoBusca', produtoBuscaRoutes);



const enderecoRoutes = require('./routes/enderecoRoutes');

// Usando as rotas
app.use('/enderecos', enderecoRoutes);


const clienteRoutes = require('./routes/clienteRoutes');

// Usando as rotas
app.use('/clientes', clienteRoutes);



const grupoRoutes = require('./routes/grupoRoutes');

// Usando as rotas
app.use('/grupos', grupoRoutes);



const marcaRoutes = require('./routes/marcaRoutes');

// Usando as rotas
app.use('/marcas', marcaRoutes);


const varianteRoutes = require('./routes/varianteRoutes');

// Usando as rotas
app.use('/variantes', varianteRoutes);



const atributoRoutes = require('./routes/atributoRoutes');

// Usando as rotas
app.use('/atributos', atributoRoutes);


const valorAtributoRoutes = require('./routes/valorAtributoRoutes');

// Usando as rotas
app.use('/valorAtributos', valorAtributoRoutes);


const carrinhoRoutes = require('./routes/carrinhoRoutes');

// Usando as rotas
app.use('/carrinhos', carrinhoRoutes);


const carrinhoProdutoVarianteRoutes = require('./routes/carrinhoProdutoVarianteRoutes');

// Usando as rotas
app.use('/carrinhoProdutoVariantes', carrinhoProdutoVarianteRoutes);


const pedidoClienteRoutes = require('./routes/pedidoClienteRoutes');

// Usando as rotas
app.use('/pedidoClientes', pedidoClienteRoutes);




const entregaRoutes = require('./routes/entregaRoutes');

// Usando as rotas
app.use('/entregas', entregaRoutes);





const entregaPedidoRoutes = require('./routes/entregaPedidoRoutes');

// Usando as rotas
app.use('/entregaPedidos', entregaPedidoRoutes);



const pedidoRoutes = require('./routes/pedidoRoutes');

// Usando as rotas
app.use('/pedidos', pedidoRoutes);




const pedidoProdutoVariantesRoutes = require('./routes/pedidoProdutoVarianteRoutes');

// Usando as rotas
app.use('/pedidoProdutoVariantes', pedidoProdutoVariantesRoutes);







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








const portaNode = process.env.API_PORT || 3000

app.listen(3000, function () {
  console.log(`Api contato está rodando na porta ${portaNode}`)
})



