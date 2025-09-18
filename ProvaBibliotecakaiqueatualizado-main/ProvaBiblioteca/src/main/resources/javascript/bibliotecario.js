const apiUrl = "http://localhost:8080/api/bibliotecario";
const tabelaCorpo = document.getElementById('tabelaCorpo');
const form = document.getElementById('formCadastro');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const idInput = document.getElementById('id');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');

function carregarTabela() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      tabelaCorpo.innerHTML = '';
      data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="px-4 py-2">${item.nome}</td>
          <td class="px-4 py-2">${item.email}</td>
          <td class="px-4 py-2">
            <button class="bg-yellow-400 text-white px-2 py-1 rounded mr-2" onclick="editar(${item.id}, '${item.nome}', '${item.email}')">Editar</button>
            <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deletar(${item.id})">Excluir</button>
          </td>
        `;
        tabelaCorpo.appendChild(tr);
      });
    });
}

form.onsubmit = function(e) {
  e.preventDefault();
  const id = idInput.value;
  const nome = nomeInput.value;
  const email = emailInput.value;
  if (!nome || !email) return;

  if (id) {
    // Update
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email })
    })
    .then(res => {
      if (res.ok) {
        Swal.fire('Atualizado!', '', 'success');
        form.reset();
        idInput.value = '';
        btnSalvar.textContent = 'Adicionar';
        btnCancelar.classList.add('hidden');
        carregarTabela();
      }
    });
  } else {
    // Create
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email })
    })
    .then(res => {
      if (res.ok) {
        Swal.fire('Cadastrado!', '', 'success');
        form.reset();
        carregarTabela();
      }
    });
  }
};

window.editar = function(id, nome, email) {
  idInput.value = id;
  nomeInput.value = nome;
  emailInput.value = email;
  btnSalvar.textContent = 'Atualizar';
  btnCancelar.classList.remove('hidden');
};

btnCancelar.onclick = function() {
  form.reset();
  idInput.value = '';
  btnSalvar.textContent = 'Adicionar';
  btnCancelar.classList.add('hidden');
};

window.deletar = function(id) {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Esta ação não pode ser desfeita!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            Swal.fire('Excluído!', '', 'success');
            carregarTabela();
          }
        });
    }
  });
};

// Inicializar tabela ao carregar página
carregarTabela();