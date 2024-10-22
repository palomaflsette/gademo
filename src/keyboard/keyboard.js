function insertSymbol( charToInject) {
  const input = document.getElementById("func_str");
  const cursorPos = input.selectionStart; // Posição do cursor no input
  const inputValue = input.value; // Valor atual do input
  
  // Nova string com o caractere injetado na posição do cursor
  const newValue = inputValue.slice(0, cursorPos) + charToInject + inputValue.slice(cursorPos);
  
  // Atualiza o valor do input com o novo valor
  input.value = newValue;
  
  // Reposiciona o cursor logo após o caractere injetado
  input.selectionStart = input.selectionEnd = cursorPos + charToInject.length;
  
  // Foco de volta no input (se necessário)
  input.focus();
}