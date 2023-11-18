INSERT INTO Lojas (
    url, titulo, descricao, modalidade, email, idEndereco, telefone1, telefone2, telefone3,
    cpfcnpj, inscricaoEstadual, frameworkFrontEnd, breakpoint, fotoProporcao, fotoLarguraP, fotoLarguraG,
    permitirVendedor, permitirObservacao, emailCopiaOculta, primeiraRegra, regraGratis,
    permitirPessoaJuridica, idPagamentos, pagamentoCartaoCpfTitular,
    clearSaleModalidade, clearSaleProduto, clearSaleFingerPrintApp, clearSaleEntityCode,
    seoRobots, googleAnalyticsID, outrosSituacao
) VALUES (
    'exemplo.com', 'Minha Loja', 'Descrição da Loja', 'virtual', 'email@exemplo.com', 1,
    'telefone1', 'telefone2', 'telefone3', '12345678901234', '123456789', 'Framework XYZ',
    '768px', '4:3', '400px', '600px', 1, 1, 'email@exemplo.com', 1, 0, 1, 1, 0,
    '1', '2', 'Fingerprint123', 'EntityCode123', 'index, follow', 12345, 'ativo'
);


INSERT INTO Produtos (
    nome, identificadorERP, identificadorFabricante, marca, grupo, descricao, preco, precoPromocional,
    embalagemAltura, embalagemProfundidade, embalagemPeso, sinonimos, exclusivoParaRelacionamento,
    prioridade, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlMetaAbstract,
    seoHtmlHead, seoHtmlA, situacao, idLoja
) VALUES (
    'Produto 1', 123, 456, 'Marca A', 'Grupo X', 'Descrição do Produto 1', 50.00, 45.00,
    10.0, 20.0, 1.0, 'Sinônimos do Produto 1', 0, 1, 'Título SEO', 'Descrição Meta SEO', 'Palavras-chave Meta SEO',
    'Resumo Meta SEO', 'Cabeçalho HTML', 'Link HTML', 1, 1
);

INSERT INTO Produtos (
    nome, identificadorERP, identificadorFabricante, marca, grupo, descricao, preco, precoPromocional,
    embalagemAltura, embalagemProfundidade, embalagemPeso, sinonimos, exclusivoParaRelacionamento,
    prioridade, seoHtmlTitle, seoHtmlMetaDescription, seoHtmlMetaKeywords, seoHtmlMetaAbstract,
    seoHtmlHead, seoHtmlA, situacao, idLoja
) VALUES (
    'Produto 2', 124, 457, 'Marca B', 'Grupo Y', 'Descrição do Produto 2', 60.00, 55.00,
    12.0, 22.0, 1.2, 'Sinônimos do Produto 2', 0, 2, 'Título SEO Produto 2', 'Descrição Meta SEO Produto 2',
    'Palavras-chave Meta SEO Produto 2', 'Resumo Meta SEO Produto 2', 'Cabeçalho HTML Produto 2', 'Link HTML Produto 2', 1, 1
);



INSERT INTO Marcas (
    urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, idLoja
) VALUES (
    'url_de', 'url_para', 'fabricante', '2023-09-20 00:00:00', '2023-09-20 23:59:59',
    '08:00:00', '18:00:00', 1, 1
);

INSERT INTO Marcas (
    urlDe, urlPara, tipo, dataHoraInicial, dataHoraFinal, horaInicial, horaFinal, situacao, idLoja
) VALUES (
    'url_de_2', 'url_para_2', 'fabricante', '2023-09-20 00:00:00', '2023-09-20 23:59:59',
    '08:00:00', '18:00:00', 1, 1
);

INSERT INTO Variantes (idProduto, quantidade) VALUES (1, 2);
INSERT INTO Variantes (idProduto, quantidade) VALUES (2, 5);


INSERT INTO Grupos (
    grupoPai, nome, identificadorERP, descricao, seoHtmlTitle, seoHtmlMetaDescription,
    seoHtmlMetaKeywords, seoHtmlAbstract, seoHtmlHead, filtroDeMarca, situacao, idLoja
) VALUES (
    NULL, 'Grupo A', 789, 'Descrição do Grupo A', 'Título SEO Grupo A', 'Descrição Meta SEO Grupo A',
    'Palavras-chave Meta SEO Grupo A', 'Resumo Meta SEO Grupo A', 'Cabeçalho HTML Grupo A', 0, 'ativo', 1
);

INSERT INTO Atributos (idVariante, valorAtributo)
VALUES (1, 'Cor');


INSERT INTO Valor_Atributo (idAtributo, texto)
VALUES (1, 'Vermelha');


INSERT INTO Marca_Produto (idMarca, idProduto) VALUES (1, 1);
INSERT INTO Marca_Produto (idMarca, idProduto) VALUES (2, 2);


INSERT INTO Grupo_Produto (idGrupo, idProduto) VALUES (1, 1);
INSERT INTO Grupo_Produto (idGrupo, idProduto) VALUES (1, 2);
