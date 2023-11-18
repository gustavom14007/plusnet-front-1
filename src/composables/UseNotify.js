import { useQuasar } from "quasar"
import { defineComponent, ref, onMounted, onUnmounted } from "vue";



export default function useNotify() {

  const $q = useQuasar()


  const notifySuccess = (message) => {
    $q.notify({
      type: 'positive',
      message: message || 'Sucesso!'
    })
  }

  const notifyError = (message) => {
    $q.notify({
      type: 'negative',
      message: message || 'Falha!'
    })
  }




  return {
    notifySuccess,
    notifyError,

  }
}
