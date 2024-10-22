// Função para exibir o spinner
function showSpinner() {
  document.getElementById('runExperimentButton').style.display = "none";
  document.getElementById('spinner').style.display = "flex";
}

// Função para esconder o spinner
function hideSpinner() {
  document.getElementById('runExperimentButton').style.display = "flex";
  document.getElementById('spinner').style.display = "none";
}
