// static/javascript/bibliotecario.js

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
            <button class="bg-yellow-400 text-white px-2 py-1 rounded mr-2" onclick="editarBibliotecario(${item.id}, '${escapeHtml(item.nome)}', '${escapeHtml(item.email)}')">Editar</button>
            <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deletarBibliotecario(${item.id})">Excluir</button>
          </td>
        `;
        tabelaCorpo.appendChild(tr);
      });
    })
    .catch(err => console.error("Erro ao carregar bibliotecários:", err));
}

form.onsubmit = function(e) {
  e.preventDefault();
  const id = idInput.value;
  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  if (!nome || !email) return;

  const body = { nome, email };

  if (id) {
    // Update
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(res => {
      if (res.ok) {
        Swal.fire('Atualizado!', '', 'success');
        resetForm();
        carregarTabela();
      } else {
        Swal.fire('Erro na atualização!', '', 'error');
      }
    })
    .catch(err => {
      console.error("Erro PUT bibliotecário:", err);
      Swal.fire('Erro!', 'Não foi possível atualizar.', 'error');
    });

  } else {
    // Create
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(res => {
      if (res.ok) {
        Swal.fire('Cadastrado!', '', 'success');
        resetForm();
        carregarTabela();
      } else {
        Swal.fire('Erro no cadastro!', '', 'error');
      }
    })
    .catch(err => {
      console.error("Erro POST bibliotecário:", err);
      Swal.fire('Erro!', 'Não foi possível cadastrar.', 'error');
    });
  }
};

window.editarBibliotecario = function(id, nome, email) {
  idInput.value = id;
  nomeInput.value = nome;
  emailInput.value = email;
  btnSalvar.textContent = 'Atualizar';
  btnCancelar.classList.remove('hidden');
};

btnCancelar.onclick = function() {
  resetForm();
};

window.deletarBibliotecario = function(id) {
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
          } else {
            Swal.fire('Erro ao excluir!', '', 'error');
          }
        })
        .catch(err => {
          console.error("Erro DELETE bibliotecário:", err);
          Swal.fire('Erro!', 'Não foi possível excluir.', 'error');
        });
    }
  });
};

// Função para limpar formulário
function resetForm() {
  form.reset();
  idInput.value = '';
  btnSalvar.textContent = 'Adicionar';
  btnCancelar.classList.add('hidden');
}

// Função simples para escapar apóstrofos ou aspas em onclick inline
function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  carregarTabela();
  resetForm();
});
