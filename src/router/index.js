import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import useAuthUser from 'src/composables/UseAuthUser'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })


  // antes de fazer cada comando To ele vai executar essa função
  Router.beforeEach((to) => {
    //puxando a instância do composable
    const { isLoggedIn } = useAuthUser()

    if (
      to.hash.includes('type=recovery') &&
      to.name !== 'reset-password'
    ) {
      const acessToken = to.hash.split('&')[0]
      const token = acessToken.replace('#access_token=', '')
      return { name: 'reset-password', query: { token } }
    }

    if (
      //função pra ver se está logado
      !isLoggedIn() &&
      //pega  do objeto meta o parâmetro requiresAuth definido lá em routes
      to.meta.requiresAuth &&
      //caso esteja na página me com o query parâmeter fromEmail também
      !Object.keys(to.query).includes('fromEmail')
    ) {
      //manda pra página de login!
      return { name: 'login' }
    }

  })


  return Router
})
