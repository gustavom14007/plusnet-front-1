import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/login.module.css";

function CadastroFuncionario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [nomeError, setNomeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  const [formularioValido, setFormularioValido] = useState(false);
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

  useEffect(() => {
    validarFormulario();
  }, [nome, email, senha, nomeError, emailError, senhaError]);

  // Validação Nome
  const validarNome = (valor) => {
    if (valor.match(/\d/)) {
      setNomeError("O campo nome não pode ter números");
    } else {
      setNomeError("");
    }
  };

  // Validação E-mail
  const validarEmail = (valor) => {
    if (valor === "") {
      setEmailError("Preencha o e-mail");
    } else {
      setEmailError("");
    }
  };

  const validarFormulario = () => {
    if (
      nomeError === "" &&
      emailError === "" &&
      senhaError === "" &&
      nome !== "" &&
      email !== "" &&
      senha !== "" &&
      senha.length >= 6
    ) {
      setFormularioValido(true);
    } else {
      setFormularioValido(false);
    }
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();

    // Validação Nome
    if (nome === "") {
      setNomeError("Preencha o nome");
    } else {
      validarNome(nome);
    }

    // Validação E-mail
    validarEmail(email);

    // Validação Senha
    if (senha === "") {
      setSenhaError("Preencha a senha");
    } else {
      setSenhaError("");
    }

    if (formularioValido) {
      fetch("http://localhost:5000/funcionarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          // Mostrar mensagem de sucesso
          setCadastroSucesso(true);

          // Limpar campos
          setNome("");
          setEmail("");
          setSenha("");
        })
        .catch((err) => console.log(err));
    }
  };

  const fecharModalSucesso = () => {
    setCadastroSucesso(false);
  };

  return (
    <div className={styles.formulario_container}>
      <div className={styles.titulo_formulario}>
        <h1>Cadastro Funcionário</h1>

        <div className={styles.card_formulario_container}>
          <form onSubmit={handleSubmit}>
            <div className={styles.informacoes_formulario}>
              <label className={nomeError ? styles.label_error : ""}>Nome *</label>
              <input
                type="text"
                name="nome"
                style={{ borderColor: nomeError ? "red" : "" }}
                placeholder="Digite o seu nome..."
                value={nome}
                onChange={(evento) => {
                  setNome(evento.target.value);
                  validarNome(evento.target.value);
                }}
              />
              {nomeError && (
                <span className={styles.error_mensagem}>{nomeError}</span>
              )}
            </div>

            <div className={styles.informacoes_formulario}>
              <label className={emailError ? styles.label_error : ""}>E-mail *</label>
              <input
                type="text"
                name="email"
                style={{ borderColor: emailError ? "red" : "" }}
                placeholder="Digite o seu e-mail..."
                value={email}
                onChange={(evento) => {
                  setEmail(evento.target.value);
                  validarEmail(evento.target.value);
                }}
              />
              {emailError && (
                <span className={styles.error_mensagem}>{emailError}</span>
              )}
            </div>

            <div className={styles.informacoes_formulario}>
              <label className={senhaError ? styles.label_error : ""}>Senha *</label>
              <input
                type="password"
                name="senha"
                style={{ borderColor: senhaError ? "red" : "" }}
                placeholder="Digite a sua senha..."
                value={senha}
                onChange={(evento) => {
                  setSenha(evento.target.value);
                  setSenhaError(
                    evento.target.value.length < 6
                      ? "A senha deve ter pelo menos 6 caracteres"
                      : ""
                  );
                }}
              />
              {senhaError && (
                <span className={styles.error_mensagem}>{senhaError}</span>
              )}
            </div>

            <div className={styles.informacoes_formulario}>
              <div className={styles.button_formulario}>
                <button type="submit">Cadastrar</button>
              </div>
              <div className={styles.cadastre_se}>
                <Link to="/login">
                  <span>Já tem login? Entre</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {cadastroSucesso && (
        <div className={styles.modal_sucesso}>
          <div className={styles.modal_sucesso_content}>
            <span>Funcionário cadastrado com sucesso!</span>
            <button onClick={fecharModalSucesso}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroFuncionario;
