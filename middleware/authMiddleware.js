// authMiddleware.js
const jwt = require('jsonwebtoken');

// function verifyJWT(req, res, next) {
//     const token = req.headers['x-acess-token'];

//     if (!token) return res.status(401).json({ auth: false, message: 'No token provided' });

//     jwt.verify(token, process.env.SECRET, function (err, decoded) {
//         if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

//         const lojaDoToken = decoded.loja;
//         const lojaDaRequisicao = parseInt(req.headers.loja);

//         console.log(lojaDoToken, lojaDaRequisicao);

//         if (lojaDoToken === lojaDaRequisicao) {
//             req.userId = decoded.id;
//             req.userLoja = lojaDoToken;
//             next();
//         } else {
//             res.status(403).json({ auth: false, message: 'Access denied: Unauthorized store' });
//         }
//     });
// }

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).json({ auth: false, message: 'Token não fornecido.' });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ auth: false, message: 'Falha ao autenticar o token.' });
        }

        // Adiciona o ID do usuário ao objeto de solicitação para uso posterior nas rotas protegidas
        req.userId = decoded.id;
        next();
    });
};



module.exports = verifyJWT;