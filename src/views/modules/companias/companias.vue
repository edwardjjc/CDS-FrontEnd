<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3>Compañias</h3>
      </div>
      <div class="card-body">
      
        <div align="right">
          <CButton align="justify-center" shape="pill" color="info" @click="createCompany">
            <CIcon name="cil-plus"/>
          </CButton>
        </div>
        <CDataTable
      :items="items"
      :fields="fields"
      table-filter
      items-per-page-select
      :items-per-page="5"
      hover
      pagination
    >
      <template #isActive="{item}">
        <td>
          <CBadge :color="getBadge(item.isActive)">
            {{item.isActive ? "Activo" : "Inactivo"}}
          </CBadge>
        </td>
      </template>
      <template #show_details="{item, index}">
        <td class="py-2">
          <CButton
            color="primary"
            variant="outline"
            square
            size="sm"
            @click="viewDetails(item, index)"
          >
            <CIcon name="cil-pencil"/>
          </CButton>
        </td>
      </template>
    </CDataTable>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

const items = [
]

const fields = [
  { key: 'descripcion', label: "Nombre Compañia", _style:'min-width:200px' },
  { key: 'telefono', _style:'min-width:100px;' },
  { key: 'isActive', label: "Estatus", _style:'min-width:100px;' },
  { 
    key: 'show_details', 
    label: '', 
    _style: 'width:1%', 
    sorter: false, 
    filter: false
  }
]



export default {
  name: 'Compañias',
  data() {
    return {
      items: items.map((item, id) => { return {...item, id}}),
      fields,
      details: [],
      collapseDuration: 0,
      companias: undefined
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    Vue.axios.get('http://localhost:3000/api/compania/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}` 
      }
    }).
    then((resp) => {
      this.companias = resp.data.data
      this.items = resp.data.data
    }).catch((error) => {
      if (error.data.status == 401){
        this.$router.push({ name: 'Login' })
      }
    });
  },
  methods: {
    getBadge (status) {
      switch (status) {
        case true: return 'success'
        case false: return 'secondary'
        default: 'primary'
      }
    },
    viewDetails (item) {
      this.$router.push(`/theme/companias-detail/${item.id}`)
    },
    createCompany(){
      this.$router.push(`/theme/companias-detail/${"new"}`)
    }

  }
}
</script>