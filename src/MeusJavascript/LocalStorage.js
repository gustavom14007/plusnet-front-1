



// Verifique se o objeto já existe no localStorage
let objetoNoLocalStorage = JSON.parse(localStorage.getItem('meuObjeto'));

// Se o objeto não existir, crie um novo objeto com um array vazio
if (!objetoNoLocalStorage) {
  const novoObjeto = {
    dados: [],
  };

  localStorage.setItem('meuObjeto', JSON.stringify(novoObjeto));
}



function adicionarAoLocalStorage(tipo, pressaoArterial, saturacaoOxigenio, batimentosPorMinuto) {

  // Recupere o objeto do localStorage
  objetoNoLocalStorage = JSON.parse(localStorage.getItem('meuObjeto'));

  const novoDado = {
    tipo,
    pressaoArterial,
    saturacaoOxigenio,
    batimentosPorMinuto,
    dateTime: new Date().toLocaleString(),
  };

  // Adicione os novos dados ao array dentro do objeto
  objetoNoLocalStorage.dados.push(novoDado);

  // Atualize o objeto no localStorage
  localStorage.setItem('meuObjeto', JSON.stringify(objetoNoLocalStorage));


  // Retorne o objeto atualizado
  return objetoNoLocalStorage;
}





// Função para recuperar os dados de BPM do localStorage
function obterBPMsDoLocalStorage() {
  // Recupere o objeto do localStorage
  objetoNoLocalStorage = JSON.parse(localStorage.getItem('meuObjeto'));

  // Verifique se o objeto e o array de dados existem
  if (objetoNoLocalStorage && Array.isArray(objetoNoLocalStorage.dados)) {
    // Crie um novo array com os valores de BPM
    const arrayDeBPMs = objetoNoLocalStorage.dados.map(dado => dado.batimentosPorMinuto);

    return arrayDeBPMs;
  } else {
    // Se o objeto ou o array não existirem, retorne um array vazio
    return [];
  }
}



// !TODO: enviar para API



export { objetoNoLocalStorage, adicionarAoLocalStorage, obterBPMsDoLocalStorage }
