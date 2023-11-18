<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-img
            clickable
            src="../assets/medtech-innovations-sharp-blue-5.png"
            fit="scale-down"
            height="75px"
            @click="router.push({ name: 'me' })"
          />
          <!-- MedTech Innovations -->
        </q-toolbar-title>

        <q-btn-dropdown flat color="white" icon="person">
          <q-list>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>
                <q-item-label>Encerrar Sessão</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
const linksList = [
  {
    title: "Paciente",
    caption: "Vá para página paciente home",
    icon: "person",
    link: "PacienteHome",
  },
  {
    title: "Médico",
    caption: "Vá para página médico home",
    icon: "home",
    link: "MedicoHome",
  },
  {
    title: "MedTech Home",
    caption: "Vá para página Medtech home",
    icon: "home",
    link: "MedHome",
  },
  {
    title: "Login",
    caption: "Vá para página de login",
    icon: "login",
    link: "login",
  },
  {
    title: "Registrar",
    caption: "Vá para página de registro",
    icon: "groups",
    link: "register",
  },
  {
    title: "Email confirmation",
    caption: "Vá para página de login",
    icon: "mail",
    link: "email-confirmation",
  },
  {
    title: "Forgot Password",
    caption: "Vá para página de login",
    icon: "mail",
    link: "forgot-password",
  },
  {
    title: "Reset Password",
    caption: "Vá para reset password",
    icon: "mail",
    link: "reset-password",
  },
  {
    title: "Cadastro de Clínica",
    caption: "Vá para Clínica",
    icon: "home",
    link: "clinica",
  },
  {
    title: "Cadastro de Paciente",
    caption: "Vá para Paciente",
    icon: "home",
    link: "paciente",
  },
  {
    title: "Dispositivo",
    caption: "Configure seu Dispositivo!",
    icon: "home",
    link: "dispositivo",
  },
];

import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";

import { useQuasar } from "quasar";
import { route } from "quasar/wrappers";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    const $q = useQuasar();

    const router = useRouter();

    const { logout } = useAuthUser();

    const handleLogout = async () => {
      $q.dialog({
        title: "Sair",
        message: "Você realmente quer desconectar? :(",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await logout();
        router.replace({ name: "login" });
      });
    };

    return {
      router,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      handleLogout,
    };
  },
});
</script>
