<template>
      <div>
    <div class="card">
      <div class="card-header">
        <h3>Camiones</h3>
      </div>
      <div class="card-body">
        <div align="right">
          <CButton align="justify-center" shape="pill" color="info" @click="createCamion">
            <CIcon name="cil-plus"/>
          </CButton>
        </div>
        <CDataTable
          :items="items"
          :fields="fields"
          table-filter
          items-per-page-select
          :items-per-page="5"
          :key="contador"
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
              <CButton
                color="danger"
                variant="outline"
                square
                size="sm"
                @click="confirmarI(item, index)"
              >
                <CIcon name="cil-x"/>
              </CButton>
            </td>
          </template>
        </CDataTable>
        <CModal
          :show.sync="confirmacion"
          :no-close-on-backdrop="true"
          :centered="true"
          title="Confirmacion"
          size="sm"
          color="dark"
        >
          Seguro que desea desactivar el camion?
          <template #header>
            <h6 class="modal-title">Confirmacion</h6>
            <CButtonClose @click="confirmacion = false" class="text-white"/>
          </template>
          <template #footer>
            <CButton @click="confirmacion = false" color="danger">Cancelar</CButton>
            <CButton @click="del" color="success">Aceptar</CButton>
          </template>
        </CModal>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
const items = [
]

const fields = [
  { key: 'descripcion', _style:'min-width:200px' },
  { key: 'marca', _style:'min-width:100px;' },
  { key: 'modelo', _style:'min-width:100px;' },
  { key: 'placa', _style:'min-width:100px;' },
  { key: 'color', _style:'min-width:100px;' },
  { key: 'tipoCamion', label: "Tipo Camion", _style:'min-width:100px;' },
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
  name: 'Camiones',
  data() {
    return {
      items: items.map((item, id) => { return {...item, id}}),
      fields,
      details: [],
      collapseDuration: 0,
      confirmacion: false,
      contador: 0,
      selectedCamionId: "",
      camiones: undefined,
      companias: undefined,
      tiposCamiones: undefined
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    Vue.axios.get('http://localhost:3000/api/camiones/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}` 
      }
    }).
    then((resp) => {
      const { data } = resp.data;
      this.camiones = data
      this.items = data.map(obj => { return { id: obj.id, descripcion: obj.descripcion, marca: obj.marca, modelo: obj.modelo, placa: obj.identificadorUnico, color: obj.color, tipoCamion: obj.tipoCamion.descripcion, isActive: obj.isActive } })
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
      this.$router.push(`/mantenimientos/camiones-detail/${item.id}`)
    },
    confirmarI (item) {
      this.confirmacion = true;
      this.selectedCamionId = item.id;
    },
    del () {
      const API_KEY = localStorage.access_token;
      Vue.axios.delete('http://localhost:3000/api/camiones/' + this.selectedCamionId, {
        headers: {
          'Authorization': `Bearer ${API_KEY}` 
        }
      }).
      then((resp) => {
        Vue.axios.get('http://localhost:3000/api/camiones/', {
          headers: {
            'Authorization': `Bearer ${API_KEY}` 
          }
        }).
        then((resp) => {
          const { data } = resp.data;
          this.camiones = data
          this.items = data.map(obj => { return { id: obj.id, descripcion: obj.descripcion, marca: obj.marca, modelo: obj.modelo, placa: obj.identificadorUnico, color: obj.color, tipoCamion: obj.tipoCamion.descripcion, isActive: obj.isActive } })
          this.confirmacion = false;
          this.contador += 1;
        }).catch((error) => {
          if (error.toString().includes("401")){
            this.$router.push({ name: 'Login' })
          }
        });
      }).catch((error) => {
        if (error.toString().includes("401")){
          this.$router.push({ name: 'Login' });
        }
      });
    },
    createCamion(){
      this.$router.push(`/mantenimientos/camiones-detail/${"new"}`)
    }

  }
}
</script>