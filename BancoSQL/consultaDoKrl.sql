-- USAR ESSE NO DETALHE DE PRODUTO
-- VAI TRAZER VARIAS LINHAS PARA O MESMO PRODUTO, TRAZENDO CADA ATRIBUTO E SEU VALOR E SUAS MARCAS E GRUPOS 
SELECT
    P.idProduto,
    P.nome AS nomeProduto,
    P.descricao AS descricaoProduto,
    M.idMarca,
    M.nome AS nomeMarca,
    G.idGrupo,
    G.nome AS nomeGrupo,
    V.idVariante,
    V.quantidade AS quantidadeVariante,
    A.idAtributo,
    A.valorAtributo AS valorAtributo,
    VA.texto AS valorAtributoTexto
FROM Produtos AS P
LEFT JOIN Marca_Produto AS MP ON P.idProduto = MP.idProduto
LEFT JOIN Marcas AS M ON MP.idMarca = M.idMarca
LEFT JOIN Grupo_Produto AS GP ON P.idProduto = GP.idProduto
LEFT JOIN Grupos AS G ON GP.idGrupo = G.idGrupo
LEFT JOIN Variantes AS V ON P.idProduto = V.idProduto
LEFT JOIN Atributos AS A ON V.idVariante = A.idVariante
LEFT JOIN Valor_Atributo AS VA ON A.idAtributo = VA.idAtributo
WHERE P.idProduto = 1;





-- ACHO QUE ESSE EH O MELHOR PRA LISTAR PRODUTOS, TEM QUE MONTAR UMA LÓGICA PRA CRIAR OBJETOS JSON COM ESSE SELECT
SELECT
    P.idProduto,
    P.nome AS nomeProduto,
    P.descricao AS descricaoProduto,
    M.idMarca,
    M.nome AS nomeMarca,
    G.idGrupo,
    G.nome AS nomeGrupo,
    V.idVariante,
    V.quantidade AS quantidadeVariante
FROM Produtos AS P
LEFT JOIN Marca_Produto AS MP ON P.idProduto = MP.idProduto
LEFT JOIN Marcas AS M ON MP.idMarca = M.idMarca
LEFT JOIN Grupo_Produto AS GP ON P.idProduto = GP.idProduto
LEFT JOIN Grupos AS G ON GP.idGrupo = G.idGrupo
LEFT JOIN Variantes AS V ON P.idProduto = V.idProduto
WHERE P.situacao = 1
ORDER BY P.idProduto, V.idVariante, M.idMarca, G.idGrupo;


--- trazer so os 20 primeiros
SELECT 
    P.idProduto,
    P.nome AS nomeProduto,
    P.descricao AS descricaoProduto,
    M.idMarca,
    M.nome AS nomeMarca,
    G.idGrupo,
    G.nome AS nomeGrupo,
    V.idVariante,
    V.quantidade AS quantidadeVariante
FROM (
    SELECT DISTINCT P.idProduto
    FROM Produtos AS P
    WHERE P.situacao = 1
    LIMIT 20
) AS ProdutosLimitados
LEFT JOIN Produtos AS P ON ProdutosLimitados.idProduto = P.idProduto
LEFT JOIN Marca_Produto AS MP ON P.idProduto = MP.idProduto
LEFT JOIN Marcas AS M ON MP.idMarca = M.idMarca
LEFT JOIN Grupo_Produto AS GP ON P.idProduto = GP.idProduto
LEFT JOIN Grupos AS G ON GP.idGrupo = G.idGrupo
LEFT JOIN Variantes AS V ON P.idProduto = V.idProduto
ORDER BY P.idProduto, V.idVariante, M.idMarca, G.idGrupo;
