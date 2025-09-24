// Função para exibir o spinner
function showSpinner(spinnerId = 'spinner') {
  document.getElementById('runExperimentButton').style.display = "none";
  document.getElementById(spinnerId).style.display = "flex";
}

// Função para esconder o spinner
function hideSpinner(spinnerId = 'spinner') {
  document.getElementById('runExperimentButton').style.display = "flex";
  document.getElementById(spinnerId).style.display = "none";
}
