// userController.js
const banco = require('../database/main-db.js'); // Certifique-se de ajustar o caminho conforme necessário
const jwt = require('jsonwebtoken');

const registrar = (req, res) => {
    const usuario = req.body.user;
    const senha = req.body.password;
    const email = req.body.email;
    const loja = req.body.loja;

    const query = 'INSERT INTO usuarios (user, password, email, loja) VALUES (?, ?, ?, ?)';
    banco.conn.query(query, [usuario, senha, email, loja], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Não foi possível registrar uma conta com estes dados' });
            return;
        }

        res.status(200).json({ message: 'Conta criada com sucesso.', results: results });
    });
};

const login = (req, res, next) => {
    const usuarioRequest = req.body.user;
    const senhaRequest = req.body.password;
    const lojaRequest = req.body.loja;

    const query = 'SELECT usuarioID, loja FROM usuarios WHERE user=? AND password=? AND loja=?';

    banco.conn.query(query, [usuarioRequest, senhaRequest, lojaRequest], function (error, results) {
        if (error) {
            res.status(500).json({ message: 'Erro!', erro: error });
            throw error;
        } else if (results[0]) {
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
};

module.exports = {
    registrar,
    login,
};
