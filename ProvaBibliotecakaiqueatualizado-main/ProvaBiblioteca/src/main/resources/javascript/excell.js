function exportarDados() {
  // Aqui você faz uma requisição ao seu backend para gerar o arquivo
  fetch('/api/livros/exportarLivros', {
    method: 'GET'
  }).then(response => {
    if(response.ok) {
      return response.blob();
    } else {
      throw new Error('Erro ao gerar o arquivo');
    }
  }).then(blob => {
    // Cria um link para baixar o arquivo
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'livros.xlsx'; // nome do arquivo
    document.body.appendChild(a);
    a.click();
    a.remove();
  }).catch(error => {
    Swal.fire('Erro', error.message, 'error');
  });
}
