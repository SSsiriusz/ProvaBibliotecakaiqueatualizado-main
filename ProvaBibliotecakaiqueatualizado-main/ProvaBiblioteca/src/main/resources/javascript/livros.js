// static/javascript/livros.js

const apiLivros = 'http://localhost:8080/api/livros';
const apiBibliotecarios = 'http://localhost:8080/api/bibliotecario';
let bibliotecarios = [];

async function carregarBibliotecarios() {
  try {
    const res = await fetch(apiBibliotecarios);
    bibliotecarios = await res.json();
    const select = document.getElementById('bibliotecario_id');
    if (!select) return;
    select.innerHTML = '<option value="">Selecione</option>';
    bibliotecarios.forEach(b => {
      select.innerHTML += `<option value="${b.id}">${b.nome || ('ID ' + b.id)}</option>`;
    });
  } catch (err) {
    console.error("Erro ao carregar bibliotecários para livros:", err);
  }
}

async function listarLivros() {
  try {
    const res = await fetch(apiLivros);
    const livros = await res.json();
    const tbody = document.getElementById('livrosTableBody');
    tbody.innerHTML = '';

    livros.forEach(livro => {
      tbody.innerHTML += `
        <tr>
          <td class="px-4 py-2">${livro.id}</td>
          <td class="px-4 py-2">
            <input class="w-full px-2 py-1 border rounded" 
              value="${livro.titulo || ''}" 
              onchange="editarCampoLivro(${livro.id}, 'titulo', this.value)">
          </td>
          <td class="px-4 py-2">
            <input class="w-full px-2 py-1 border rounded" 
              value="${livro.autor || ''}" 
              onchange="editarCampoLivro(${livro.id}, 'autor', this.value)">
          </td>
          <td class="px-4 py-2">
            <input class="w-full px-2 py-1 border rounded" 
              value="${livro.genero || ''}" 
              onchange="editarCampoLivro(${livro.id}, 'genero', this.value)">
          </td>
          <td class="px-4 py-2">
            <select class="w-full px-2 py-1 border rounded" 
              onchange="alterarStatusLivro(${livro.id}, this.value)">
              <option value="Disponível" ${livro.status === 'Disponível' ? 'selected' : ''}>Disponível</option>
              <option value="Emprestado" ${livro.status === 'Emprestado' ? 'selected' : ''}>Emprestado</option>
            </select>
          </td>
          <td class="px-4 py-2">${livro.dataCadastro || ''}</td>
          <td class="px-4 py-2">
            <select class="w-full px-2 py-1 border rounded" 
              onchange="editarCampoLivro(${livro.id}, 'bibliotecario', this.value)">
              <option value="">Selecione</option>
              ${bibliotecarios.map(b => `
                <option value="${b.id}" ${livro.bibliotecario?.id === b.id ? 'selected' : ''}>
                  ${b.nome || ('ID ' + b.id)}
                </option>`).join('')}
            </select>
          </td>
          <td class="px-4 py-2">
            <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onclick="excluirLivro(${livro.id})">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Erro ao listar livros:", err);
  }
}

async function editarCampoLivro(id, campo, valor) {
  try {
    const res = await fetch(`${apiLivros}/${id}`);
    let livro = await res.json();

    if (campo === 'bibliotecario') {
      livro.bibliotecario = valor ? { id: Number(valor) } : null;
    } else {
      livro[campo] = valor;
    }

    if (!livro.bibliotecario || !livro.bibliotecario.id) {
      Swal.fire('Selecione um bibliotecário válido!', '', 'error');
      return;
    }

    await fetch(`${apiLivros}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro)
    });

    Swal.fire('Atualizado!', '', 'success');
    atualizarListaLivros();
  } catch (err) {
    console.error("Erro ao editar campo livro:", err);
    Swal.fire('Erro!', 'Não foi possível editar.', 'error');
  }
}

async function alterarStatusLivro(id, status) {
  try {
    await fetch(`${apiLivros}/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH'
    });
    Swal.fire('Status alterado!', '', 'success');
    atualizarListaLivros();
  } catch (err) {
    console.error("Erro ao alterar status:", err);
    Swal.fire('Erro!', 'Não foi possível alterar status.', 'error');
  }
}

async function excluirLivro(id) {
  try {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Esta ação não pode ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!'
    });
    if (result.isConfirmed) {
      const res = await fetch(`${apiLivros}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        Swal.fire('Excluído!', '', 'success');
        atualizarListaLivros();
      } else {
        Swal.fire('Erro ao excluir!', '', 'error');
      }
    }
  } catch (err) {
    console.error("Erro ao excluir livro:", err);
    Swal.fire('Erro!', 'Não foi possível excluir.', 'error');
  }
}

async function exportarDados() {
  try {
    const response = await fetch(`${apiLivros}/exportarLivros`, { method: 'GET' });
    if (!response.ok) throw new Error('Erro ao gerar o arquivo');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'livros.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error("Erro exportar dados:", err);
    Swal.fire('Erro', err.message, 'error');
  }
}

async function atualizarListaLivros() {
  await carregarBibliotecarios();
  await listarLivros();
}

document.addEventListener('DOMContentLoaded', async () => {
  await atualizarListaLivros();

  // Atacha evento ao form
  const formLivro = document.getElementById('livroForm');
  formLivro.onsubmit = async function(e) {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const genero = document.getElementById('genero').value.trim();
    const bibliotecario_id = document.getElementById('bibliotecario_id').value;

    if (!titulo || !autor || !genero || !bibliotecario_id) {
      Swal.fire('Preencha todos os campos!', '', 'error');
      return;
    }

    const livro = {
      titulo,
      autor,
      genero,
      bibliotecario: { id: Number(bibliotecario_id) }
    };

    try {
      const res = await fetch(apiLivros, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livro)
      });
      if (res.ok) {
        Swal.fire('Cadastrado!', '', 'success');
        formLivro.reset();
        await atualizarListaLivros();
      } else {
        Swal.fire('Erro no cadastro de livro!', '', 'error');
      }
    } catch (err) {
      console.error("Erro POST livro:", err);
      Swal.fire('Erro!', 'Não foi possível cadastrar livro.', 'error');
    }
  };
});
