const api = 'http://localhost:8080/api/livros';
const apiBibliotecarios = 'http://localhost:8080/api/bibliotecario';
let bibliotecarios = [];

// Carregar bibliotecários para o select do formulário
async function carregarBibliotecarios() {
    const res = await fetch(apiBibliotecarios);
    bibliotecarios = await res.json();
    const select = document.getElementById('bibliotecario_id');
    select.innerHTML = '<option value="">Selecione</option>';
    bibliotecarios.forEach(b => {
        select.innerHTML += `<option value="${b.id}">${b.nome || ('ID ' + b.id)}</option>`;
    });
}

// Atualiza tanto os bibliotecários quanto os livros
async function atualizarLista() {
    await carregarBibliotecarios();
    await listarLivros();
}

document.getElementById('livroForm').onsubmit = async function(e) {
    e.preventDefault();
    const livro = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        genero: document.getElementById('genero').value,
        bibliotecario: { id: Number(document.getElementById('bibliotecario_id').value) }
    };
    await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livro)
    });
    Swal.fire('Cadastrado!', '', 'success');
    atualizarLista();
    this.reset();
};

// Sempre use o array bibliotecarios mais recente ao montar a tabela
async function listarLivros() {
    const res = await fetch(api);
    const livros = await res.json();
    const tbody = document.getElementById('livrosTableBody');
    tbody.innerHTML = '';
    livros.forEach(livro => {
        tbody.innerHTML += `
            <tr>
                <td class="px-4 py-2">${livro.id}</td>
                <td class="px-4 py-2"><input class="w-full px-2 py-1 border rounded" value="${livro.titulo}" onchange="editarCampo(${livro.id}, 'titulo', this.value)"></td>
                <td class="px-4 py-2"><input class="w-full px-2 py-1 border rounded" value="${livro.autor}" onchange="editarCampo(${livro.id}, 'autor', this.value)"></td>
                <td class="px-4 py-2"><input class="w-full px-2 py-1 border rounded" value="${livro.genero}" onchange="editarCampo(${livro.id}, 'genero', this.value)"></td>
                <td class="px-4 py-2">
                    <select class="w-full px-2 py-1 border rounded" onchange="alterarStatus(${livro.id}, this.value)">
                        <option ${livro.status === 'Disponível' ? 'selected' : ''}>Disponível</option>
                        <option ${livro.status === 'Emprestado' ? 'selected' : ''}>Emprestado</option>
                    </select>
                </td>
                <td class="px-4 py-2">${livro.dataCadastro || ''}</td>
                <td class="px-4 py-2">
                    <select class="w-full px-2 py-1 border rounded" onchange="editarCampo(${livro.id}, 'bibliotecario', this.value)">
                        <option value="">Selecione</option>
                        ${bibliotecarios.map(b => `
                            <option value="${b.id}" ${livro.bibliotecario?.id === b.id ? 'selected' : ''}>
                                ${b.nome || ('ID ' + b.id)}
                            </option>
                        `).join('')}
                    </select>
                </td>
                <td class="px-4 py-2">
                    <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onclick="excluirLivro(${livro.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

async function editarCampo(id, campo, valor) {
    const res = await fetch(`${api}/${id}`);
    let livro = await res.json();
    if (campo === 'bibliotecario') {
        livro.bibliotecario = valor ? { id: Number(valor) } : null;
    } else {
        livro[campo] = valor;
    }
    // Corrigir: garantir que o bibliotecario seja sempre um objeto com id válido
    if (!livro.bibliotecario || !livro.bibliotecario.id) {
        Swal.fire('Selecione um bibliotecário válido!', '', 'error');
        return;
    }
    await fetch(`${api}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livro)
    });
    Swal.fire('Atualizado!', '', 'success');
    atualizarLista();
}

async function alterarStatus(id, status) {
    await fetch(`${api}/${id}/status?status=${encodeURIComponent(status)}`, {
        method: 'PATCH'
    });
    Swal.fire('Status alterado!', '', 'success');
    atualizarLista();
}

async function excluirLivro(id) {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Esta ação não pode ser desfeita!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`${api}/${id}`, { method: 'DELETE' });
            Swal.fire('Excluído!', '', 'success');
            atualizarLista();
        }
    });
}

function backupBanco() {
    Swal.fire('Backup realizado!', 'Função de backup do banco acionada.', 'info');
}
function restaurarBanco() {
    Swal.fire('Restaurar banco!', 'Função de restauração do banco acionada.', 'info');
}
function exportarDados() {
    Swal.fire('Exportar dados!', 'Função de exportação acionada.', 'info');
}
function importarDados() {
    Swal.fire('Importar dados!', 'Função de importação acionada.', 'info');
}

// Ao carregar a página, atualize tudo
document.addEventListener('DOMContentLoaded', async () => {
    await atualizarLista();
});