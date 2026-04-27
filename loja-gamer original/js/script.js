const usuarioLogado =
  JSON.parse(sessionStorage.getItem("usuarioLogado")) ||
  JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
  alert("Você precisa fazer login primeiro.");
  window.location.href = "login.html";
}

const chaveCarrinho = "carrinho_" + usuarioLogado.email;
const chavePedidos = "pedidos_" + usuarioLogado.email;

let carrinho = JSON.parse(localStorage.getItem(chaveCarrinho)) || [];
let pedidos = JSON.parse(localStorage.getItem(chavePedidos)) || [];

function salvarCarrinho() {
  localStorage.setItem(chaveCarrinho, JSON.stringify(carrinho));
}

function salvarPedidos() {
  localStorage.setItem(chavePedidos, JSON.stringify(pedidos));
}

function formatarPreco(valor) {
  return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
}

function atualizarCarrinho() {
  const listaCarrinho = document.getElementById("listaCarrinho");
  const totalCarrinho = document.getElementById("totalCarrinho");

  if (!listaCarrinho || !totalCarrinho) return;

  listaCarrinho.innerHTML = "";

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = `<p class="carrinho-vazio">Seu carrinho está vazio.</p>`;
    totalCarrinho.textContent = "R$ 0,00";
    return;
  }

  let total = 0;

  carrinho.forEach((produto, index) => {
    const preco = Number(produto.preco) || 0;
    total += preco;

    const item = document.createElement("div");
    item.classList.add("item-carrinho");

    item.innerHTML = `
      <div class="item-info">
        <h3>${produto.nome}</h3>
        <p>${formatarPreco(preco)}</p>
      </div>
      <button class="btn-remover" onclick="removerItem(${index})">Remover</button>
    `;

    listaCarrinho.appendChild(item);
  });

  totalCarrinho.textContent = formatarPreco(total);
}

function removerItem(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();
}

function limparPedidos() {
  pedidos = [];
  salvarPedidos();
  renderizarPedidos();
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  document.getElementById("carrinhoTela").style.display = "none";
  document.getElementById("checkoutTela").style.display = "block";
  document.getElementById("pagamentoTela").style.display = "none";
}

function voltarParaCarrinho() {
  document.getElementById("carrinhoTela").style.display = "block";
  document.getElementById("checkoutTela").style.display = "none";
  document.getElementById("pagamentoTela").style.display = "none";
}

function irParaPagamento() {
  const endereco = document.getElementById("endereco");

  if (!endereco || endereco.value === "") {
    alert("Selecione um endereço.");
    return;
  }

  document.getElementById("checkoutTela").style.display = "none";
  document.getElementById("pagamentoTela").style.display = "block";
}

function voltarParaEndereco() {
  document.getElementById("checkoutTela").style.display = "block";
  document.getElementById("pagamentoTela").style.display = "none";
}

function finalizarPedido() {
  const endereco = document.getElementById("endereco");

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const novoPedido = {
    cliente: usuarioLogado.nome,
    email: usuarioLogado.email,
    telefone: usuarioLogado.telefone,
    endereco: endereco.options[endereco.selectedIndex].text,
    itens: [...carrinho],
    status: "Pedido recebido",
    data: new Date().toLocaleString("pt-BR")
  };

  pedidos.push(novoPedido);
  salvarPedidos();

  let todosPedidos = JSON.parse(localStorage.getItem("todosPedidos")) || [];
  todosPedidos.push(novoPedido);
  localStorage.setItem("todosPedidos", JSON.stringify(todosPedidos));

  carrinho = [];
  salvarCarrinho();

  atualizarCarrinho();
  renderizarPedidos();

  document.getElementById("pagamentoTela").style.display = "none";
  document.getElementById("carrinhoTela").style.display = "block";

  endereco.value = "";

  alert("Pedido realizado com sucesso!");
}

function renderizarPedidos() {
  const listaPedidos = document.getElementById("listaPedidos");
  if (!listaPedidos) return;

  listaPedidos.innerHTML = "";

  if (pedidos.length === 0) {
    listaPedidos.innerHTML = `<p class="pedido-vazio">Nenhum pedido realizado ainda.</p>`;
    return;
  }

  pedidos.forEach((pedido, index) => {
    let totalPedido = 0;

    const itensHtml = pedido.itens.map(produto => {
      const preco = Number(produto.preco) || 0;
      totalPedido += preco;
      return `<li>${produto.nome} - ${formatarPreco(preco)}</li>`;
    }).join("");

    const card = document.createElement("div");
    card.classList.add("pedido-card");

    card.innerHTML = `
      <h3>Pedido ${index + 1}</h3>
      <p><strong>Data:</strong> ${pedido.data}</p>
      <p><strong>Status:</strong> ${pedido.status}</p>
      <p><strong>Endereço:</strong> ${pedido.endereco}</p>
      <ul>${itensHtml}</ul>
      <p><strong>Total:</strong> ${formatarPreco(totalPedido)}</p>
    `;

    listaPedidos.appendChild(card);
  });
}

function adicionarAoCarrinho(nome, preco) {
  const usuario =
    JSON.parse(sessionStorage.getItem("usuarioLogado")) ||
    JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuario) {
    alert("Você precisa fazer login primeiro.");
    window.location.href = "login.html";
    return;
  }

  const chaveCarrinhoUsuario = "carrinho_" + usuario.email;

  let carrinhoUsuario = JSON.parse(localStorage.getItem(chaveCarrinhoUsuario)) || [];

  carrinhoUsuario.push({
    nome: nome,
    preco: preco
  });

  localStorage.setItem(chaveCarrinhoUsuario, JSON.stringify(carrinhoUsuario));

  carrinho = carrinhoUsuario;

  atualizarCarrinho();

  alert(nome + " foi adicionado ao carrinho!");
}

function carregarEnderecosSalvos() {
  const selectEndereco = document.getElementById("endereco");
  if (!selectEndereco) return;

  selectEndereco.innerHTML = `<option value="">Selecione um endereço</option>`;

  if (!usuarioLogado.enderecos || usuarioLogado.enderecos.length === 0) {
    return;
  }

  usuarioLogado.enderecos.forEach(endereco => {
    const option = document.createElement("option");

    option.value = `${endereco.rua}, ${endereco.numero}`;
    option.textContent =
      `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}/${endereco.estado} - CEP: ${endereco.cep}`;

    selectEndereco.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarCarrinho();
  renderizarPedidos();
  carregarEnderecosSalvos();
});