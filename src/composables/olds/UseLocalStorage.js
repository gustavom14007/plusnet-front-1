import { ref, onMounted, watch } from "vue";

export default function useLocalStorage() {
  const objetoNoLocalStorage = ref(getLocalStorageObject());

  function getLocalStorageObject() {
    const storedData = JSON.parse(localStorage.getItem("meuObjeto"));
    if (!storedData) {
      const novoObjeto = { dados: [] };
      localStorage.setItem("meuObjeto", JSON.stringify(novoObjeto));
      return novoObjeto;
    }
    return storedData;
  }

  function adicionarAoLocalStorage(tipo, pressaoArterial, saturacaoOxigenio, batimentosPorMinuto) {
    const novoDado = {
      tipo,
      pressaoArterial,
      saturacaoOxigenio,
      batimentosPorMinuto,
      dateTime: new Date().toLocaleString(),
    };

    objetoNoLocalStorage.value.dados.push(novoDado);
    localStorage.setItem("meuObjeto", JSON.stringify(objetoNoLocalStorage.value));
  }

  function obterBPMsDoLocalStorage() {
    return objetoNoLocalStorage.value.dados.map((dado) => {
      return parseInt(dado.batimentosPorMinuto);
    });
  }

  // Use watch para monitorar o localStorage e reagir às alterações
  onMounted(() => {
    watch(
      () => localStorage.getItem("meuObjeto"),
      (newData) => {
        const parsedData = JSON.parse(newData);
        objetoNoLocalStorage.value = parsedData || { dados: [] };
      }
    );
  });

  return {
    objetoNoLocalStorage,
    adicionarAoLocalStorage,
    obterBPMsDoLocalStorage,
  };
}
