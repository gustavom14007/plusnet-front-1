
import { ref } from 'vue'


// faz com que o User seja dinâmico, sempre que atualizar ele atualiza em tudo
const banana = ref(0)

export default function useTeste() {

  const testarBanana = async () => {
    try {
      banana.value++
    } catch (error) {
      console.log(error.message)
    }
  }


  // faz com que as variáveis usadas aqui dentro estejam disponíveis em outros lugares, lembrar que pra ser dinâmica tem que criar lá em cima com o ref(null)
  return {
    banana,
    testarBanana
  }
}
