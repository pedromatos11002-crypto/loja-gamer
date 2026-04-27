function formatarPreco(valor) {
  return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
}

function carregarPedidosAdmin() {
  const lista = document.getElementById("listaAdminPedidos");
  let pedidos = JSON.parse(localStorage.getItem("todosPedidos")) || [];

  lista.innerHTML = "";

  if (pedidos.length === 0) {
    lista.innerHTML = "<p class='pedido-vazio'>Nenhum pedido recebido ainda.</p>";
    return;
  }

  pedidos.forEach((pedido, index) => {
    let total = 0;

    const itensHtml = (pedido.itens || []).map(item => {
      total += Number(item.preco);
      return `<li>${item.nome} - ${formatarPreco(item.preco)}</li>`;
    }).join("");

    const card = document.createElement("div");
    card.classList.add("pedido-card");

    let botao = "";

    if (!pedido.status || pedido.status === "Pedido recebido") {
      botao = `
        <button onclick="moverParaProcesso(${index})">
          Enviar para processo
        </button>
      `;
    } else {
      botao = `
        <span class="status-info">${pedido.status}</span>
      `;
    }

    card.innerHTML = `
      <h3>Pedido ${index + 1}</h3>

      <p><strong>Cliente:</strong> ${pedido.cliente || ""}</p>
      <p><strong>Email:</strong> ${pedido.email || ""}</p>
      <p><strong>Telefone:</strong> ${pedido.telefone || ""}</p>
      <p><strong>Endereço:</strong> ${pedido.endereco || ""}</p>
      <p><strong>Data:</strong> ${pedido.data || ""}</p>
      <p><strong>Status:</strong> ${pedido.status || "Pedido recebido"}</p>

      <h4>Itens:</h4>
      <ul>${itensHtml}</ul>

      <p><strong>Total:</strong> ${formatarPreco(total)}</p>

      ${botao}
    `;

    lista.appendChild(card);
  });
}

function moverParaProcesso(index) {
  let pedidos = JSON.parse(localStorage.getItem("todosPedidos")) || [];

  pedidos[index].status = "Em processo";

  localStorage.setItem("todosPedidos", JSON.stringify(pedidos));

  alert("Pedido enviado para a aba Em Processo!");
  carregarPedidosAdmin();
}

function limparPedidosAdmin() {
  if (confirm("Deseja apagar todos os pedidos do admin?")) {
    localStorage.removeItem("todosPedidos");
    carregarPedidosAdmin();
  }
}

document.addEventListener("DOMContentLoaded", carregarPedidosAdmin);