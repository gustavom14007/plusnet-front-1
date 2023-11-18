-- está no arquivo higher than te satelite, só a parte em cima dos @









CREATE TABLE IF NOT EXISTS Lojas (
    idLoja INTEGER PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(255),
    titulo VARCHAR(24),
    descricao TEXT,
    modalidade ENUM('física', 'virtual'),
    email VARCHAR(150),
    idEndereco INTEGER,
    telefone1 VARCHAR(15),
    telefone2 VARCHAR(15),
    telefone3 VARCHAR(15),
    cpfcnpj VARCHAR(14),
    inscricaoEstadual VARCHAR(9),
    frameworkFrontEnd TEXT,
    breakpoint VARCHAR(12),
    fotoProporcao VARCHAR(10),
    fotoLarguraP VARCHAR(50),
    fotoLarguraG VARCHAR(50),
    permitirVendedor BOOLEAN,
    permitirObservacao BOOLEAN,
    emailCopiaOculta TEXT,
    primeiraRegra BOOLEAN,
    regraGratis BOOLEAN,
    permitirPessoaJuridica BOOLEAN,
    idPagamentos INTEGER,
    pagamentoCartaoCpfTitular BOOLEAN,
    clearSaleModalidade ENUM('0', '1'),
    clearSaleProduto ENUM('0', '1', '2', '3', '4', '5'),
    clearSaleFingerPrintApp VARCHAR(25),
    clearSaleEntityCode VARCHAR(25),
    seoRobots TEXT,
    googleAnalyticsID INTEGER,
    outrosSituacao ENUM('ativo', 'inativo')
);



CREATE TABLE IF NOT EXISTS Produtos (
  idProduto INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(75),
  identificadorERP INT,
  identificadorFabricante INT,
  marca VARCHAR(75),
  grupo VARCHAR(75),
  descricao TEXT,
  preco FLOAT,
  precoPromocional FLOAT,
  embalagemAltura FLOAT,
  embalagemProfundidade FLOAT,
  embalagemPeso FLOAT,
  sinonimos TEXT,
  exclusivoParaRelacionamento BOOLEAN,
  prioridade INT,
  seoHtmlTitle TEXT,
  seoHtmlMetaDescription TEXT,
  seoHtmlMetaKeywords TEXT,
  seoHtmlMetaAbstract TEXT,
  seoHtmlHead TEXT,
  seoHtmlA TEXT,
  situacao BOOLEAN,
  urlimagem TEXT, 
  idLoja INT, 
 FOREIGN KEY (idLoja) REFERENCES Lojas(idLoja)
);


CREATE TABLE IF NOT EXISTS Enderecos (
  idEndereco INT PRIMARY KEY AUTO_INCREMENT,
  logradouro VARCHAR(100),
  numero VARCHAR(10),
  complemento VARCHAR(50),
  bairro VARCHAR(50),
  cidade VARCHAR(50),
  estado CHAR(2),
  pais VARCHAR(50),
  cep VARCHAR(10),
  idLoja INT, 
 FOREIGN KEY (idLoja) REFERENCES Lojas(idLoja)
);


CREATE TABLE IF NOT EXISTS Marcas (
  idMarca INT PRIMARY KEY AUTO_INCREMENT,
  nome varchar(255),
  urlDe VARCHAR(120),
  urlPara VARCHAR(120),
  tipo ENUM('fabricante', 'distribuidor', 'lojista'),
  dataHoraInicial DATETIME,
  dataHoraFinal DATETIME,
  horaInicial TIME,
  horaFinal TIME,
  situacao BOOLEAN,
  idLoja INT, 
 FOREIGN KEY (idLoja) REFERENCES Lojas(idLoja)
);



CREATE TABLE IF NOT EXISTS Grupos (
  idGrupo INT PRIMARY KEY AUTO_INCREMENT,
  grupoPai INT,
  nome VARCHAR(75),
  identificadorERP INT,
  descricao TEXT,
  seoHtmlTitle TEXT,
  seoHtmlMetaDescription TEXT,
  seoHtmlMetaKeywords TEXT,
  seoHtmlAbstract TEXT,
  seoHtmlHead TEXT,
  filtroDeMarca BOOLEAN,
  situacao ENUM('ativo', 'inativo'),
  idLoja INT, 
 FOREIGN KEY (idLoja) REFERENCES Lojas(idLoja)
);



CREATE TABLE IF NOT EXISTS Clientes (
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(75),
    sobrenome VARCHAR(75),
    cpf VARCHAR(14),
    rgNumero VARCHAR(14),
    rgDataExpedicao DATE,
    dataNascimento DATE,
    sexo VARCHAR(20),
    cnpj VARCHAR(14),
    inscricaoEstadual VARCHAR(20),
    receberNotificacoes BOOLEAN,
    receberInformativos BOOLEAN,
    situacao BOOLEAN,
    situacaoMotivo ENUM('ativo', 'inativo', 'suspenso'),
    observacaoInterna TEXT,
   email varchar(100), 
   senha varchar(100), 
  idLoja INT, 
 FOREIGN KEY (idLoja) REFERENCES Lojas(idLoja)
  );


CREATE TABLE IF NOT EXISTS Grupo_Subgrupo (
  idGrupo INT,
  idSubgrupo INT,
  PRIMARY KEY(idGrupo, idSubgrupo),
  FOREIGN KEY (idGrupo) REFERENCES Grupos(idGrupo),
  FOREIGN KEY (idSubgrupo) REFERENCES Grupos(idGrupo)
);


CREATE TABLE IF NOT EXISTS Marca_Produto (
idMarca INT,
idProduto INT,
FOREIGN KEY (idMarca) REFERENCES Marcas(idMarca),
FOREIGN KEY (idProduto) REFERENCES Produtos(idProduto)
);

CREATE TABLE IF NOT EXISTS Grupo_Produto (
idGrupo INT,
idProduto INT,
FOREIGN KEY (idGrupo) REFERENCES Grupos(idGrupo),
FOREIGN KEY (idProduto) REFERENCES Produtos(idProduto)
);


CREATE TABLE IF NOT EXISTS Variantes (
  idVariante INT AUTO_INCREMENT PRIMARY KEY,
  idProduto INT,
  quantidade INT,
 FOREIGN KEY (idProduto) REFERENCES Produtos(idProduto)
);

CREATE TABLE IF NOT EXISTS Atributos (
    idAtributo INT PRIMARY KEY AUTO_INCREMENT,
    idVariante INT,
    valorAtributo VARCHAR(100),
    FOREIGN KEY (idVariante) REFERENCES Variantes(idVariante)
);

CREATE TABLE IF NOT EXISTS Valor_Atributo (
  idValorAtributo INTEGER PRIMARY KEY AUTO_INCREMENT,
  idAtributo INTEGER,
  texto VARCHAR(255),
  FOREIGN KEY (idAtributo) REFERENCES Atributos (idAtributo)
);

create table IF NOT EXISTS carrinhos (
idCarrinho INTEGER PRIMARY KEY AUTO_INCREMENT,
userID INT,
idCliente INT, 
dataPublicacao DATETIME NOT NULL DEFAULT NOW(),
dataAtualizacao DATETIME DEFAULT NOW(),
valorTotal float DEFAULT 0, 
idLoja INT, 
FOREIGN KEY (idLoja) REFERENCES Lojas(idLoja),
status VARCHAR(255) default 'carrinho'

);

create table IF NOT EXISTS carrinho_produto_variante (
idCarrinhoProdutoVariante INT AUTO_INCREMENT PRIMARY KEY, 
idProduto INT,
idVariante INT,
idCarrinho INT,
quantidade INT, 
dataAtualizacao DATETIME DEFAULT NOW(),
FOREIGN KEY (idCarrinho ) REFERENCES carrinhos(idCarrinho ),
FOREIGN KEY (idVariante) REFERENCES Variantes(idVariante),
FOREIGN KEY (idProduto) REFERENCES Produtos(idProduto)

);

CREATE TABLE IF NOT EXISTS Pedidos (
  idPedido INT PRIMARY KEY AUTO_INCREMENT,
  idCarrinho INT, 
  valorTotal FLOAT,
 idLoja INT, 
 FOREIGN KEY (idCarrinho) REFERENCES Carrinhos(idCarrinho),
 FOREIGN KEY (idLoja) REFERENCES Lojas(idLoja)
);

CREATE TABLE IF NOT EXISTS Pedido_Produto_Variante (
  idItemPedido  INT AUTO_INCREMENT PRIMARY KEY,
 idCarrinhoProdutoVariante INT, 
FOREIGN KEY (idCarrinhoProdutoVariante) REFERENCES carrinho_produto_variante(idCarrinhoProdutoVariante)
);

CREATE TABLE IF NOT EXISTS EnderecoCliente (
    idEndereco INTEGER,
    idCliente INTEGER,
     FOREIGN KEY (idCliente)  REFERENCES Clientes(idCliente),
     FOREIGN KEY (idEndereco)  REFERENCES Enderecos(idEndereco)
);


CREATE TABLE IF NOT EXISTS Pedido_Cliente (
idPedido INT,
idCliente INT,
FOREIGN KEY (idPedido) REFERENCES Pedidos(idPedido),
FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente)
);

CREATE TABLE IF NOT EXISTS Entregas (
  idEntrega INT PRIMARY KEY AUTO_INCREMENT, 
 idLoja INT, 
 FOREIGN KEY (idLoja) REFERENCES Lojas(idLoja)
);

CREATE TABLE IF NOT EXISTS Entrega_Pedido (
 idEntrega INT,
 idPedido INT,
FOREIGN KEY (idPedido) REFERENCES Pedidos(idPedido),
FOREIGN KEY (idEntrega) REFERENCES Entregas(idEntrega)
);




CREATE TABLE IF NOT EXISTS `Usuarios`(
  `usuarioID`  integer UNIQUE AUTO_INCREMENT,
  `user` varchar(255) not null,
  `password` varchar(255) not null,
  `email` varchar(255)  not null,
  `loja` int not null,
  PRIMARY KEY(user, email, loja)
);



DROP TRIGGER IF EXISTS tr_atualizar_data_carrinhos_insert;
DROP TRIGGER IF EXISTS tr_atualizar_data_carrinhos_update;
DROP TRIGGER IF EXISTS tr_atualizar_valor_total_insert;
DROP TRIGGER IF EXISTS tr_atualizar_valor_total_update;




DELIMITER //

-- Gatilho para atualizar dataAtualizacao em carrinhos após inserções
CREATE TRIGGER tr_atualizar_data_carrinhos_insert
AFTER INSERT ON carrinhos
FOR EACH ROW
BEGIN
  UPDATE carrinhos
  SET dataAtualizacao = NOW()
  WHERE idCarrinho = NEW.idCarrinho;
END;
//

-- Gatilho para atualizar dataAtualizacao em carrinhos após atualizações
CREATE TRIGGER tr_atualizar_data_carrinhos_update
AFTER UPDATE ON carrinhos
FOR EACH ROW
BEGIN
  UPDATE carrinhos
  SET dataAtualizacao = NOW()
  WHERE idCarrinho = NEW.idCarrinho;
END;
//

DELIMITER ;

DELIMITER //

-- Gatilho para calcular e atualizar valorTotal em carrinhos após inserções
CREATE TRIGGER tr_atualizar_valor_total_insert
AFTER INSERT ON carrinho_produto_variante
FOR EACH ROW
BEGIN
  DECLARE total DECIMAL(10, 2);

  -- Calcular o valor total para o carrinho atual
  SELECT SUM(P.preco * CPV.quantidade) INTO total
  FROM produtos AS P
  INNER JOIN carrinho_produto_variante AS CPV ON P.idProduto = CPV.idProduto
  WHERE CPV.idCarrinho = NEW.idCarrinho;

  -- Atualizar o valor total do carrinho
  UPDATE carrinhos
  SET valorTotal = total
  WHERE idCarrinho = NEW.idCarrinho;
END;
//

DELIMITER ;

DELIMITER //

-- Gatilho para calcular e atualizar valorTotal em carrinhos após atualizações
CREATE TRIGGER tr_atualizar_valor_total_update
AFTER UPDATE ON carrinho_produto_variante
FOR EACH ROW
BEGIN
  DECLARE total DECIMAL(10, 2);

  -- Calcular o valor total para o carrinho atual
  SELECT SUM(P.preco * CPV.quantidade) INTO total
  FROM produtos AS P
  INNER JOIN carrinho_produto_variante AS CPV ON P.idProduto = CPV.idProduto
  WHERE CPV.idCarrinho = NEW.idCarrinho;

  -- Atualizar o valor total do carrinho
  UPDATE carrinhos
  SET valorTotal = total
  WHERE idCarrinho = NEW.idCarrinho;
END;
//

DELIMITER ;

DROP TRIGGER IF EXISTS tr_atualizar_data_carrinhos_insert;
DROP TRIGGER IF EXISTS tr_atualizar_data_carrinhos_update;
DROP TRIGGER IF EXISTS tr_atualizar_valor_total_insert;
DROP TRIGGER IF EXISTS tr_atualizar_valor_total_update;



DELIMITER //

-- Gatilho para calcular e atualizar valorTotal em carrinhos após inserções
CREATE TRIGGER tr_atualizar_valor_total_insert
AFTER INSERT ON carrinho_produto_variante
FOR EACH ROW
BEGIN
  DECLARE total DECIMAL(10, 2);

  -- Calcular o valor total para o carrinho atual
  SELECT SUM(P.preco * CPV.quantidade) INTO total
  FROM produtos AS P
  INNER JOIN carrinho_produto_variante AS CPV ON P.idProduto = CPV.idProduto
  WHERE CPV.idCarrinho = NEW.idCarrinho;

  -- Atualizar o valor total do carrinho
  UPDATE carrinhos
  SET valorTotal = total
  WHERE idCarrinho = NEW.idCarrinho;
END;
//

DELIMITER ;

DELIMITER //

-- Gatilho para calcular e atualizar valorTotal em carrinhos após atualizações
CREATE TRIGGER tr_atualizar_valor_total_update
AFTER UPDATE ON carrinho_produto_variante
FOR EACH ROW
BEGIN
  DECLARE total DECIMAL(10, 2);

  -- Calcular o valor total para o carrinho atual
  SELECT SUM(P.preco * CPV.quantidade) INTO total
  FROM produtos AS P
  INNER JOIN carrinho_produto_variante AS CPV ON P.idProduto = CPV.idProduto
  WHERE CPV.idCarrinho = NEW.idCarrinho;

  -- Atualizar o valor total do carrinho
  UPDATE carrinhos
  SET valorTotal = total
  WHERE idCarrinho = NEW.idCarrinho;
END;
//

DELIMITER ;
