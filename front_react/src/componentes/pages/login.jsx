import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [formularioValido, setFormularioValido] = useState(false);
  const [loginInvalido, setLoginInvalido] = useState(false);

  useEffect(() => {
    validarFormulario();
  }, [email, senha, emailError, senhaError]);

  const validar_email = (valor) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(valor)) {
      setEmailError("Digite um e-mail válido");
    } else {
      setEmailError("");
    }
  };

  const validarFormulario = () => {
    if (emailError === "" && senhaError === "" && email !== "" && senha !== "") {
      setFormularioValido(true);
    } else {
      setFormularioValido(false);
    }
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();

    // Validação E-mail
    if (email === "") {
      setEmailError("Preencha o e-mail");
    } else {
      validar_email(email);
    }

    // Validação Senha
    if (senha === "") {
      setSenhaError("Preencha a senha");
    } else {
      setSenhaError("");
    }

    if (formularioValido) {
      // Fazer a chamada para a API de login
      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.token) {
            console.log("Token:", data.token);
            window.location.href = "/home"; // Redirecionar para a página home
          } else {
            setLoginInvalido(true);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Login</h1>

        <div className={styles.card_formulario_container}>
          <form onSubmit={handleSubmit}>
            <div className={styles.informacoes_formulario}>
              <label>
                E-mail *
              </label>
              <input
                type="text"
                name="email"
                placeholder="Digite o seu e-mail..."
                value={email}
                onChange={(evento) => {
                  setEmail(evento.target.value);
                  validar_email(evento.target.value);
                }}
              />
              {emailError && (
                <span className={styles.error_mensagem}>{emailError}</span>
              )}
            </div>

            <div className={styles.informacoes_formulario}>
              <label className={senhaError ? styles.label_error : ""}>
                Senha *
              </label>
              <input
                type="password"
                name="password"
                style={{ borderColor: senhaError ? "red" : "" }}
                placeholder="Digite sua senha..."
                value={senha}
                onChange={(evento) => {
                  setSenha(evento.target.value);
                }}
              />
              {senhaError && (
                <span className={styles.error_mensagem}>{senhaError}</span>
              )}
            </div>

            <div className={styles.informacoes_formulario}>
              {loginInvalido && (
                <span className={styles.error_mensagem}>
                  Credenciais inválidas. Tente novamente.
                </span>
              )}
              <div className={styles.button_formulario}>
                <button type="submit">Entrar</button>
              </div>
              <div className={styles.cadastre_se}>
                <Link to="/cadastroFuncionario">
                  <span>Não tem login? Cadastre-se</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
