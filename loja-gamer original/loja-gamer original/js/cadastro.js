// cadastro.js

const formCadastro = document.getElementById("formCadastro");
const mensagemCadastro = document.getElementById("mensagemCadastro");

// Inicia EmailJS
emailjs.init("G-ifi0lC9qS6KcfVq");

formCadastro.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nomeCadastro").value.trim();
  const email = document.getElementById("emailCadastro").value.trim();
  const telefone = document.getElementById("telefoneCadastro").value.trim();
  const senha = document.getElementById("senhaCadastro").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  mensagemCadastro.textContent = "";

  // Verifica senha
  if (senha !== confirmarSenha) {
    mensagemCadastro.textContent = "As senhas não coincidem.";
    return;
  }

  // Busca usuários salvos
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Verifica duplicado
  const usuarioExistente = usuarios.find(usuario =>
    usuario.email === email || usuario.telefone === telefone
  );

  if (usuarioExistente) {
    mensagemCadastro.textContent = "E-mail ou telefone já cadastrado.";
    return;
  }

  // Código aleatório
  const codigo = Math.floor(100000 + Math.random() * 900000);

  // Usuário pendente
  const novoUsuario = {
    nome: nome,
    email: email,
    telefone: telefone,
    senha: senha,
    enderecos: [],
    foto: "",
    verificado: false
  };

  // Salva temporário
  localStorage.setItem("usuarioPendente", JSON.stringify(novoUsuario));
  localStorage.setItem("codigoVerificacao", codigo);

  mensagemCadastro.textContent = "Enviando código para o e-mail...";

  // Envia email
  emailjs.send("service_c1sz853", "template_92fkxz5", {
    nome: nome,
    email: email,
    codigo: codigo
  }).then(function () {

    mensagemCadastro.textContent = "Código enviado com sucesso!";

    setTimeout(() => {
      window.location.href = "verificar.html";
    }, 1500);

  }).catch(function (erro) {

    console.log(erro);
    mensagemCadastro.textContent = "Erro ao enviar o código.";

  });

});