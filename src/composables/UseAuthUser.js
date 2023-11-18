
import { ref } from 'vue'
import useSupabase from 'boot/supabase'


// faz com que o User seja dinâmico, sempre que atualizar ele atualiza em tudo
const user = ref(null)

export default function useAuthUser() {


  const { supabase } = useSupabase()




  const login = async ({ email, password }) => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return user
  }

  const loginWithSocialProvider = async (provider) => {
    const { user, error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) throw error
    return user
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const isLoggedIn = () => {
    return !!user.value
  }

  const register = async ({ email, password, ...meta }) => {
    const { user, error } = await supabase.auth.signUp(
      { email, password },
      {
        data: meta,
        //vai redirecionar a pessoa pra página Me usando como query parâmetros (lembrar de api e http) o email de registro
        redirectTo: `${window.location.origin}/me?fromEmail=registrationConfirmation`
      }
    )
    if (error) throw error
    return user
  }

  const update = async (data) => {
    const { user, error } = await supabase.auth.updateUser(data)
    if (error) throw error
    return user
  }

  const sendPasswordRestEmail = async (email) => {
    const { user, error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return user
  }


  const resetPassword = async (accessToken, newPassword) => {

    const { user, error } = await supabase.auth.updateUser(
      { password: newPassword })
    if (error) { throw error }

    return user
  }

  // faz com que as variáveis usadas aqui dentro estejam disponíveis em outros lugares, lembrar que pra ser dinâmica tem que criar lá em cima com o ref(null)
  return {
    user,
    login,
    loginWithSocialProvider,
    logout,
    isLoggedIn,
    register,
    update,
    sendPasswordRestEmail,
    resetPassword,
  }
}
