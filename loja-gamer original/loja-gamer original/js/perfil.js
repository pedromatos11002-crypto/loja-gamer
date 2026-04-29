const fotoInput = document.getElementById("fotoInput");
const fotoPreview = document.getElementById("fotoPreview");
const salvarPerfil = document.getElementById("salvarPerfil");
const nomeUsuario = document.getElementById("nomeUsuario");
const emailUsuario = document.getElementById("emailUsuario");
const telefoneUsuario = document.getElementById("telefoneUsuario");
const mensagemPerfil = document.getElementById("mensagemPerfil");

const cepUsuario = document.getElementById("cepUsuario");
const ruaUsuario = document.getElementById("ruaUsuario");
const numeroUsuario = document.getElementById("numeroUsuario");
const bairroUsuario = document.getElementById("bairroUsuario");
const cidadeUsuario = document.getElementById("cidadeUsuario");
const estadoUsuario = document.getElementById("estadoUsuario");
const salvarEndereco = document.getElementById("salvarEndereco");
const mensagemEndereco = document.getElementById("mensagemEndereco");

let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
let logado = localStorage.getItem("logado");

if (logado !== "true" || !usuarioLogado) {
  window.location.href = "login.html";
}

window.addEventListener("load", function () {
  if (nomeUsuario) nomeUsuario.value = usuarioLogado.nome || "";
  if (emailUsuario) emailUsuario.value = usuarioLogado.email || "";
  if (telefoneUsuario) telefoneUsuario.value = usuarioLogado.telefone || "";
  if (fotoPreview && usuarioLogado.foto) fotoPreview.src = usuarioLogado.foto;
});

if (fotoInput && fotoPreview) {
  fotoInput.addEventListener("change", function () {
    const arquivo = this.files[0];

    if (arquivo) {
      const leitor = new FileReader();

      leitor.onload = function (e) {
        fotoPreview.src = e.target.result;
        usuarioLogado.foto = e.target.result;
        salvarUsuario();
      };

      leitor.readAsDataURL(arquivo);
    }
  });
}

if (salvarPerfil) {
  salvarPerfil.addEventListener("click", function () {
    usuarioLogado.nome = nomeUsuario.value;
    usuarioLogado.telefone = telefoneUsuario.value;

    salvarUsuario();

    mensagemPerfil.textContent = "Perfil salvo com sucesso!";
  });
}

/* BUSCAR CEP AUTOMATICAMENTE */
if (cepUsuario) {
  cepUsuario.addEventListener("blur", function () {
    let cep = cepUsuario.value.replace(/\D/g, "");

    if (cep.length !== 8) {
      alert("Digite um CEP válido com 8 números.");
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(resposta => resposta.json())
      .then(dados => {
        if (dados.erro) {
          alert("CEP não encontrado.");
          return;
        }

        ruaUsuario.value = dados.logradouro;
        bairroUsuario.value = dados.bairro;
        cidadeUsuario.value = dados.localidade;
        estadoUsuario.value = dados.uf;
      })
      .catch(() => {
        alert("Erro ao buscar o CEP.");
      });
  });
}

if (salvarEndereco) {
  salvarEndereco.addEventListener("click", function () {
    const novoEndereco = {
      cep: cepUsuario.value,
      rua: ruaUsuario.value,
      numero: numeroUsuario.value,
      bairro: bairroUsuario.value,
      cidade: cidadeUsuario.value,
      estado: estadoUsuario.value
    };

    if (!usuarioLogado.enderecos) {
      usuarioLogado.enderecos = [];
    }

    usuarioLogado.enderecos.push(novoEndereco);

    salvarUsuario();

    mensagemEndereco.textContent = "Endereço salvo com sucesso!";
  });
}

function salvarUsuario() {
  localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  usuarios = usuarios.map(usuario => {
    if (usuario.email === usuarioLogado.email) {
      return usuarioLogado;
    }
    return usuario;
  });

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}