const formLogin = document.getElementById("formLogin");
const mensagemLogin = document.getElementById("mensagemLogin");

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
localStorage.setItem("logado", "true");s

  mensagemLogin.textContent = "Login realizado com sucesso!";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});