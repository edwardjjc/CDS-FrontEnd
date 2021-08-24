<template>
      <div>
    <div class="card">
      <div class="card-header">
        <h3>Usuarios</h3>
      </div>
      <div class="card-body">
        <div align="right">
          <CButton align="justify-center" shape="pill" color="info" @click="createUsuario">
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
  { key: 'username', label: "Nombre Usuario", _style:'min-width:200px' },
  { key: 'email', _style:'min-width:100px;' },
  { key: 'perfil', _style:'min-width:100px;' },
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
  name: 'Usuarios',
  data() {
    return {
      items: items.map((item, id) => { return {...item, id}}),
      fields,
      details: [],
      collapseDuration: 0,
      usuarios: undefined
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    Vue.axios.get('http://localhost:3000/api/usuarios/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}` 
      }
    }).
    then((resp) => {
      this.usuarios = resp.data.data
      console.log(resp.data.data)
      this.items = resp.data.data.map(obj => { return { id: obj.id, username: obj.username, email: obj.email, perfil: obj.perfil.descripcion, isActive: obj.isActive } })
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
      this.$router.push(`/seguridad/usuarios-detail/${item.id}`)
    },
    del (item) {
      const API_KEY = localStorage.access_token;
      Vue.axios.delete('http://localhost:3000/api/usuarios/' + item.id, {
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
    createUsuario(){
      this.$router.push(`/seguridad/usuarios-detail/${"new"}`)
    }

  }
}
</script>