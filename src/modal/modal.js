// Função para abrir o modal e inserir conteúdo dinamicamente
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");
const links = document.querySelectorAll('.footer-links a');
const closeBtn = document.querySelector(".close");

links.forEach(link => {
  link.addEventListener('click', (e) => {
    if(e.target.getAttribute('href') != '#')
      return;
    
    e.preventDefault();
    modalText.textContent = e.target.getAttribute('data-content');
    modal.style.display = "block";
  });
});

// Fechar o modal ao clicar no X
closeBtn.addEventListener('click', () => {
  modal.style.display = "none";
});

// Fechar o modal ao clicar fora dele
window.addEventListener('click', (e) => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
});
