function mostrarErro(mensagem) {
  const el = document.getElementById('mensagemErro');
  el.textContent = mensagem;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

module.exports = {
  mostrarErro
};