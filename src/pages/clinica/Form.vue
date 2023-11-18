<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          {{ isUpdate ? "Atualizar Clínica" : "Adicionar Clínica" }}
        </p>
      </div>
      <q-form
        class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <q-input
          label="Nome"
          v-model="form.nome"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Insira um nome válido!',
          ]"
        ></q-input>
        <q-btn
          :label="isUpdate ? 'Atualizar' : 'Salvar'"
          color="primary"
          class="full-width"
          rounded
          type="submit"
        ></q-btn>
        <q-btn
          label="Cancelar"
          color="dark"
          class="full-width"
          flat
          :to="{ name: 'clinica' }"
        ></q-btn>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "PageFormClinica",
  setup() {
    const table = "clinica";
    const router = useRouter();
    const route = useRoute();

    const { post, getById, update } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    //priemira vez usando o computed, se existe ele da true eu acho
    const isUpdate = computed(() => {
      return route.params.id;
    });

    let clinica = {};
    const form = ref({
      nome: "",
    });

    onMounted(() => {
      if (isUpdate.value) {
        handleGetClinica(isUpdate.value);
      }
    });

    const handleSubmit = async () => {
      try {
        if (isUpdate.value) {
          await update(table, form.value);
          notifySuccess("Atualizado com sucesso!");
          router.push({ name: "clinica" });
        } else {
          await post(table, form.value);
          notifySuccess("Salvo com sucesso!");
          router.push({ name: "clinica" });
        }
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetClinica = async (id) => {
      try {
        clinica = await getById(table, id);
        form.value = clinica;
      } catch (error) {}
    };

    return {
      handleSubmit,
      form,
      isUpdate,
    };
  },
});
</script>
