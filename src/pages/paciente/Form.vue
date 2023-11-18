<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          {{ isUpdate ? "Atualizar Paciente" : "Adicionar Paciente" }}
        </p>
      </div>
      <q-form
        class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <p class="text-h4">Código: {{ isUpdate }}</p>
        <q-input label="Imagem" stack-label v-model="img" type="file">
        </q-input>

        <q-input
          label="Nome"
          v-model="form.nome"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Insira um nome válido!',
          ]"
        ></q-input>
        <q-input
          label="Sexo"
          v-model="form.sexo"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length <= 1) ||
              'Insira um Sexo válido no formato M / F!',
          ]"
        ></q-input>
        <q-input
          label="Data de Nascimento"
          v-model="form.nascimento"
          lazy-rules
          type="date"
          :rules="[
            (val) =>
              (val && val.length == 10) ||
              'Insira uma Data de Nascimento válida!',
          ]"
        ></q-input>
        <q-input
          label="Profissão"
          v-model="form.profissao"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Insira uma profissão válida!',
          ]"
        ></q-input>

        <q-editor v-model="form.descricao" min-height="5rem" />

        <q-select
          v-model="form.clinica_id"
          :options="optionsClinica"
          label="Clínica"
          option-value="id"
          option-label="nome"
          map-options
          emit-value
          :rule="[(val) => !!val || 'Insira uma clínica válida!']"
        ></q-select>

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
          :to="{ name: 'paciente' }"
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
  name: "PageFormPaciente",
  setup() {
    const table = "paciente";
    const router = useRouter();
    const route = useRoute();

    const { post, getById, update, list, uploadImg } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    //priemira vez usando o computed, se existe ele da true eu acho
    const isUpdate = computed(() => {
      return route.params.id;
    });

    let paciente = {};
    const optionsClinica = ref([]);
    const form = ref({
      nome: "",
      sexo: "M ou F",
      nascimento: "",
      profissao: "",
      descricao: "",
      clinica_id: "",
      img_url: "",
    });

    const img = ref([]);

    onMounted(() => {
      handleListClinicas();
      if (isUpdate.value) {
        handleGetPaciente(isUpdate.value);
      }
    });

    const handleListClinicas = async () => {
      optionsClinica.value = await list("clinica");
    };

    const handleSubmit = async () => {
      try {
        if (img.value.length > 0) {
          const imgUrl = await uploadImg(img.value[0], "pacientes");
          console.log("IMAGE URL: " + imgUrl);
          form.value.img_url = imgUrl;
        }

        if (isUpdate.value) {
          await update(table, form.value);
          notifySuccess("Atualizado com sucesso!");
          router.push({ name: "paciente" });
        } else {
          await post(table, form.value);
          notifySuccess("Salvo com sucesso!");
          router.push({ name: "paciente" });
        }
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetPaciente = async (id) => {
      try {
        paciente = await getById(table, id);
        form.value = paciente;
      } catch (error) {}
    };

    return {
      handleSubmit,
      form,
      isUpdate,
      optionsClinica,
      img,
    };
  },
});
</script>
