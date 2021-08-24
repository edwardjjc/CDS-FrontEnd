<template>
      <div>
    <div class="card">
      <div class="card-header">
        <h3>Contenedores</h3>
      </div>
      <div class="card-body">
        <div align="right">
          <CButton align="justify-center" shape="pill" color="info" @click="createContenedor">
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
          <template #pendienteRecoleccion="{item}">
            <td>
              <CBadge :color="getBadge(item.pendienteRecoleccion)">
                {{item.pendienteRecoleccion ? "Pendiente Recoleccion" : "No Recolectable"}}
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
              <CButton
                color="danger"
                variant="outline"
                square
                size="sm"
                @click="del(item, index)"
              >
                <CIcon name="cil-x"/>
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
  { key: 'descripcion', label: "Nombre Contenedor", _style:'min-width:200px' },
  { key: 'gpsAltitude', _style:'min-width:100px;' },
  { key: 'gpsLatitude', _style:'min-width:100px;' },
  { key: 'isActive', label: "Estatus", _style:'min-width:100px;' },
  { key: 'pendienteRecoleccion', label: "Accion", _style:'min-width:100px;' },
  { 
    key: 'show_details', 
    label: '', 
    _style: 'width:15%', 
    sorter: false, 
    filter: false
  }
]

export default {
  name: 'Contenedores',
  data() {
    return {
      items: items.map((item, id) => { return {...item, id}}),
      fields,
      details: [],
      collapseDuration: 0,
      contenedores: undefined
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    Vue.axios.get('http://localhost:3000/api/contenedores/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}` 
      }
    }).
    then((resp) => {
      this.contenedores = resp.data.data
      this.items = resp.data.data
    }).catch((error) => {
      if (error.toString().includes("401")){
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
      this.$router.push(`/mantenimientos/contenedores-detail/${item.id}`)
    },
    del (item) {
      const API_KEY = localStorage.access_token;
      Vue.axios.delete('http://localhost:3000/api/contenedores/' + item.id, {
        headers: {
          'Authorization': `Bearer ${API_KEY}` 
        }
      }).
      then((resp) => {
        location.reload();
      }).catch((error) => {
        if (error.toString().includes("401")){
          this.$router.push({ name: 'Login' })
        }
      });
    },
    createContenedor(){
      this.$router.push(`/mantenimientos/contenedores-detail/${"new"}`)
    }

  }
}
</script>