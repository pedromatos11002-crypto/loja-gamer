function verificarCodigo() {
  const codigo = document.getElementById("codigoDigitado").value.trim();
  const salvo = localStorage.getItem("codigoVerificacao");
  const mensagem = document.getElementById("mensagemVerificacao");

  if (codigo === salvo) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuario = JSON.parse(localStorage.getItem("usuarioPendente"));

    usuario.verificado = true;

    usuarios.push(usuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    

    localStorage.removeItem("usuarioPendente");
    localStorage.removeItem("codigoVerificacao");

    mensagem.textContent = "Conta verificada com sucesso!";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

  } else {
    mensagem.textContent = "Código incorreto.";
  }
}