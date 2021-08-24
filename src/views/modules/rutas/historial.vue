<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3>Historial de Rutas</h3>
      </div>
      <div class="card-body">
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
                <CIcon name="cil-truck"/>
              </CButton>
            </td>
          </template>
        </CDataTable>
      </div>
      <div>
        <CCard>
          <CCardHeader>
            <CIcon name="cil-justify-center"/>
            <strong> Ruta A Seguir </strong>
          </CCardHeader>
          <CCardBody>
            <CListGroup sm="6" >
              <CListGroupItem v-for="rutaContenedor in rutasContenedores" :key="rutaContenedor.id">{{rutaContenedor.orden}} - {{rutaContenedor.contenedor.descripcion}} - {{rutaContenedor.contenedor.direccion}}</CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

const items = [
]

const fields = [
  { key: 'camion', label: "Camion", _style:'min-width:200px' },
  { key: 'marca', label: "Marca", _style:'min-width:200px' },
  { key: 'placa', label: "Placa", _style:'min-width:200px' },
  { key: 'fechaRuta', _style:'min-width:100px;' },
  { key: 'isActive', label: "Estatus", _style:'min-width:100px;' },
  { 
    key: 'show_details', 
    label: '', 
    _style: 'width:15%', 
    sorter: false, 
    filter: false
  }
]

export default {
  name: 'Historial',
  data() {
    return {
      items: items.map((item, id) => { return {...item, id}}),
      fields,
      details: [],
      collapseDuration: 0,
      rutas: undefined,
      rutasContenedores: []
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    Vue.axios.get('http://localhost:3000/api/rutas/history/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}` 
      }
    }).
    then((resp) => {
      this.rutas = resp.data.data
      this.items = resp.data.data.map(obj => { return { id: obj.id, camion: obj.camion.descripcion, marca: obj.camion.marca, placa: obj.camion.identificadorUnico, fechaRuta: obj.createDateTime, isActive: obj.isActive } })
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
      const API_KEY = localStorage.access_token;
      Vue.axios.get(`http://localhost:3000/api/rutas/detail/${item.id}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}` 
        }
      }).
      then((resp) => {
        this.rutasContenedores = resp.data.data.rutasContenedores
      }).catch((error) => {
        if (error.toString().includes("401")){
          this.$router.push({ name: 'Login' })
        }
      });
    }
  }
}
</script>