
// import { formatCurrency } from "src/utils/format";
// ver documentacao format table do quasar
// format: (val) => formatCurency(val)



const columnsPaciente = [


  // {
  //   name: "id",
  //   align: "left",
  //   label: "id",
  //   field: "id",
  //   sortable: true,
  // },

  {
    name: "img_url",
    align: "center",
    label: "Foto",
    field: "img_url",
    sortable: false,
  },
  {
    name: "nome",
    align: "left",
    label: "Nome",
    field: "nome",
    sortable: true,
  },

  {
    name: "sexo",
    align: "center",
    label: "Sexo",
    field: "sexo",
    sortable: true,
  },
  {
    name: "nascimento",
    align: "center",
    label: "Nascimento",
    field: "nascimento",
    sortable: true,
  },
  {
    name: "profissao",
    align: "center",
    label: "Profissão",
    field: "profissao",
    sortable: true,
  },
  {
    name: "descricao",
    align: "left",
    label: "Descrição",
    field: "descricao",
    sortable: true,
  },
  {
    name: "clinica_id",
    align: "left",
    label: "Clínica",
    field: "clinica_id",
    sortable: true,
  },


  //actions abaixo
  {
    name: "actions",
    align: "right",
    label: "Ações",
    field: "actions",
    sortable: false,
  },
];


export {
  columnsPaciente
}
