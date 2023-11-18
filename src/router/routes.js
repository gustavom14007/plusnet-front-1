
const routes = [

  {
    path: '',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      //  todo: fazer uma landing page aqui
      { path: '', name: 'loginDefault', component: () => import('pages/Login.vue') },
    ]
  },
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      //  todo: fazer uma landing page aqui
      { path: '', name: 'loginDefaultPath', component: () => import('pages/Login.vue') },
      { path: 'login', name: 'login', component: () => import('pages/Login.vue') },
      { path: 'register', name: 'register', component: () => import('pages/Register.vue') },
      { path: 'email-confirmation', name: 'email-confirmation', component: () => import('pages/EmailConfirmation.vue') },
      { path: 'forgot-password', name: 'forgot-password', component: () => import('pages/ForgotPassword.vue') },
      { path: 'reset-password', name: 'reset-password', component: () => import('pages/ResetPassword.vue') }


    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'me', name: 'me', component: () => import('pages/Me.vue') },
      { path: 'MedHome', name: 'PageHomeMedDefault', component: () => import('pages/MedHome.vue') },
      { path: 'MedicoHome', name: 'MedicoHome', component: () => import('pages/MedicoHome.vue') },
      { path: 'PacienteHome', name: 'PacienteHome', component: () => import('pages/PacienteHome.vue') },
      { path: 'dispositivo', name: 'dispositivo', component: () => import('pages/TelaDispositivo.vue') },
      { path: 'testes2', name: 'testes2', component: () => import('pages/fazendoTestes2.vue') },
      { path: 'clinica', name: 'clinica', component: () => import('pages/clinica/List.vue') },
      { path: 'form-clinica/:id?', name: 'form-clinica', component: () => import('pages/clinica/Form.vue') },
      { path: 'paciente', name: 'paciente', component: () => import('pages/paciente/List.vue') },
      { path: 'form-paciente/:id?', name: 'form-paciente', component: () => import('pages/paciente/Form.vue') },
      { path: 'dados-paciente/:id?', name: 'dados-paciente', component: () => import('pages/DadosPaciente.vue') },
      { path: 'grafico-paciente/:id?:nome?:sexo?:nascimento?:profissao?:clinica_id?:descricao?:img_url?', name: 'grafico-paciente', component: () => import('pages/GraficoPaciente.vue') }
    ],
    meta: {
      //isso aqui faz com que só as rotas que tem isso precisem de autenticação
      requiresAuth: true
    }
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
