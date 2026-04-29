const formLogin = document.getElementById("formLogin");
const mensagemLogin = document.getElementById("mensagemLogin");

const btnEsqueciSenha = document.getElementById("btnEsqueciSenha");
const recuperarSenhaBox = document.getElementById("recuperarSenhaBox");
const btnTrocarSenha = document.getElementById("btnTrocarSenha");
const mensagemSenha = document.getElementById("mensagemSenha");

let codigoGerado = "";
let emailParaRecuperar = "";
let novaSenhaTemporaria = "";

formLogin.addEventListener("submit", function (e) {
  e.preventDefault();

  const login = document.getElementById("loginUsuario").value.trim();
  const senha = document.getElementById("senhaLogin").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioEncontrado = usuarios.find(usuario =>
    (usuario.email === login ||
     usuario.nome === login ||
     usuario.telefone === login) &&
     usuario.senha === senha
  );

  if (!usuarioEncontrado) {
    mensagemLogin.textContent = "Nome, e-mail, telefone ou senha incorretos.";
    return;
  }

  if (usuarioEncontrado.verificado !== true) {
    mensagemLogin.textContent = "Verifique seu e-mail antes de entrar.";
    return;
  }

  sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
  localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
  localStorage.setItem("logado", "true");

  mensagemLogin.textContent = "Login realizado com sucesso!";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});

btnEsqueciSenha.addEventListener("click", function () {
  recuperarSenhaBox.style.display =
    recuperarSenhaBox.style.display === "block" ? "none" : "block";
});

btnTrocarSenha.addEventListener("click", function () {
  const emailRecuperar = document.getElementById("emailRecuperar").value.trim();
  const novaSenha = document.getElementById("novaSenha").value.trim();

  if (emailRecuperar === "" || novaSenha === "") {
    mensagemSenha.textContent = "Preencha o e-mail e a nova senha.";
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioEncontrado = usuarios.find(usuario => usuario.email === emailRecuperar);

  if (!usuarioEncontrado) {
    mensagemSenha.textContent = "E-mail não encontrado.";
    return;
  }

  codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();
  emailParaRecuperar = emailRecuperar;
  novaSenhaTemporaria = novaSenha;

  emailjs.send("service_c1sz853", "template_92fkxz5", {
    email: emailRecuperar,
    codigo: codigoGerado,
    nome: "Usuário"
  })
  .then(function () {
    mensagemSenha.textContent = "Código enviado para seu e-mail.";
    document.getElementById("areaCodigo").style.display = "block";
  })
  .catch(function (error) {
    console.log("ERRO EMAILJS:", error);
    mensagemSenha.textContent = "Erro ao enviar o e-mail.";
  });
});

function confirmarCodigo() {
  const codigoDigitado = document.getElementById("codigoDigitado").value.trim();

  if (codigoDigitado === "") {
    mensagemSenha.textContent = "Digite o código recebido.";
    return;
  }

  if (codigoDigitado !== codigoGerado) {
    mensagemSenha.textContent = "Código incorreto.";
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioEncontrado = usuarios.find(usuario => usuario.email === emailParaRecuperar);

  if (!usuarioEncontrado) {
    mensagemSenha.textContent = "Usuário não encontrado.";
    return;
  }

  usuarioEncontrado.senha = novaSenhaTemporaria;

  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  mensagemSenha.textContent = "Senha alterada com sucesso!";

  document.getElementById("emailRecuperar").value = "";
  document.getElementById("novaSenha").value = "";
  document.getElementById("codigoDigitado").value = "";

  recuperarSenhaBox.style.display = "none";
  document.getElementById("areaCodigo").style.display = "none";

  codigoGerado = "";
  emailParaRecuperar = "";
  novaSenhaTemporaria = "";
}