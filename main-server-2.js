// main-server-2.js

// Comandos - npm init -y ---- comando para criar um app node.
// npm i express - comando para instalar express
// npm i jsonwebtoken
// npm i body-parser
// npm i dotenv

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importando os módulos das rotas
const authRoutes = require('./routes/authRoutes');
const lojasRoutes = require('./routes/lojaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const produtoBuscaRoutes = require('./routes/produtoBuscaRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const grupoRoutes = require('./routes/grupoRoutes');
const marcaRoutes = require('./routes/marcaRoutes');
const varianteRoutes = require('./routes/varianteRoutes');
const atributoRoutes = require('./routes/atributoRoutes');
const valorAtributoRoutes = require('./routes/valorAtributoRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const carrinhoProdutoVarianteRoutes = require('./routes/carrinhoProdutoVarianteRoutes');
const pedidoClienteRoutes = require('./routes/pedidoClienteRoutes');
const entregaRoutes = require('./routes/entregaRoutes');
const entregaPedidoRoutes = require('./routes/entregaPedidoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const pedidoProdutoVariantesRoutes = require('./routes/pedidoProdutoVarianteRoutes');
const enderecoClienteRoutes = require('./routes/enderecoClienteRoutes');
const grupoSubgrupoRoutes = require('./routes/grupoSubgrupoRoutes');
const marcaProdutoRoutes = require('./routes/marcaProdutoRoutes');
const grupoProdutoRoutes = require('./routes/grupoProdutoRoutes');
const carrinhoFuncionalRoutes = require('./routes/carrinhoFuncionalRoutes');

// Usando as rotas no aplicativo Express
app.use('/auth', authRoutes);
app.use('/lojas', lojasRoutes);
app.use('/produtos', produtoRoutes);
app.use('/produtoBusca', produtoBuscaRoutes);
app.use('/enderecos', enderecoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/grupos', grupoRoutes);
app.use('/marcas', marcaRoutes);
app.use('/variantes', varianteRoutes);
app.use('/atributos', atributoRoutes);
app.use('/valorAtributos', valorAtributoRoutes);
app.use('/carrinhos', carrinhoRoutes);
app.use('/carrinhoProdutoVariantes', carrinhoProdutoVarianteRoutes);
app.use('/pedidoClientes', pedidoClienteRoutes);
app.use('/entregas', entregaRoutes);
app.use('/entregaPedidos', entregaPedidoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/pedidoProdutoVariantes', pedidoProdutoVariantesRoutes);
app.use('/enderecoClientes', enderecoClienteRoutes);
app.use('/grupoSubgrupos', grupoSubgrupoRoutes);
app.use('/marcaProdutos', marcaProdutoRoutes);
app.use('/grupoProdutos', grupoProdutoRoutes);
app.use('/carrinhoFuncional', carrinhoFuncionalRoutes);

const portaNode = process.env.API_PORT || 3000;

app.listen(portaNode, () => {
  console.log(`API está rodando na porta ${portaNode}`);
});
