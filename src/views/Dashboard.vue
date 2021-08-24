<template>
  <div>
    <CCard>
      <CCardHeader>Variables</CCardHeader>
      <CCardBody>
        <CRow>
          <CCol sm="4">
            <CWidgetIcon
                :header="cantidadContenedores"
                text="Contenedores Activos"
                color="gradient-info"
            >
                <CIcon name="cil-trash" width="24"/>
            </CWidgetIcon>
          </CCol>
          <CCol sm="4">
            <CWidgetIcon
                :header="cantidadDispositivos"
                text="Dispositivos IoT Activos"
                color="gradient-info"
            >
                <CIcon name="cil-laptop" width="24"/>
            </CWidgetIcon>
          </CCol>
          <CCol sm="4">
            <CWidgetIcon
                :header="cantidadCamiones"
                text="Camiones Activos"
                color="gradient-info"
            >
                <CIcon name="cil-truck" width="24"/>
            </CWidgetIcon>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CCardGroup columns class="card-columns cols-2">
      <CCard>
        <CCardHeader>Contenedores</CCardHeader>
        <CCardBody>
          <CChartPie
            :datasets="defaultDatasetsPie"
            :labels="['Pentiente Recoleccion', 'No Recolectables']"
          />
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>Recoleccion</CCardHeader>
        <CCardBody>
          <CChartBar
            :datasets="defaultDatasetsBar"
            :labels="contenedores"
          />
        </CCardBody>
      </CCard>
    </CCardGroup>
  </div>
</template>

<script>
import Vue from 'vue';
import { CChartPie, CChartBar } from '@coreui/vue-chartjs'

let cantidadContenedores = "";
let cantidadDispositivos = "";
let cantidadCamiones = "";
let contenedoresRecolectables= [];
let lecturasActualesContenedores= [];
export default {
  name: 'Dashboard',
  components: {
    CChartPie,
    CChartBar
  },
  computed: {
    defaultDatasetsPie () {
      return [
        {
          backgroundColor: [
            '#41B883',
            '#E46651',
            '#00D8FF',
            '#DD1B16'
          ],
          data: contenedoresRecolectables
        }
      ]
    },
    defaultDatasetsBar () {
      return [
        {
          label: 'Lecturas Actuales',
          backgroundColor: '#f87979',
          data: lecturasActualesContenedores
        }
      ]
    }
  },
  data() {
    return {
      cantidadContenedores,
      cantidadDispositivos,
      cantidadCamiones,
      contenedoresRecolectables,
      lecturasActualesContenedores,
      details: [],
      collapseDuration: 0,
      contenedores: [],
      dispositivos: [],
      camiones: []
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
      const { data } = resp.data;
      this.cantidadContenedores = data.filter(f => f.isActive == true).length.toString();
      this.contenedoresRecolectables.push(data.filter(f => f.pendienteRecoleccion == true).length);
      this.contenedoresRecolectables.push(data.filter(f => f.pendienteRecoleccion == false).length);
    }).catch((error) => {
      if (error.toString().includes("401")){
        this.$router.push({ name: 'Login' })
      }
    });
    Vue.axios.get('http://localhost:3000/api/dispositivos-iot/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}` 
      }
    }).
    then((resp) => {
      const { data } = resp.data;
      this.contenedores = data.map(obj => { return obj.contenedor.descripcion });
      data.forEach(obj => {
        this.lecturasActualesContenedores.push(parseFloat(obj.lecturas[0].lectura))
      })
      this.dispositivos = data;
      this.cantidadDispositivos = data.filter(f => f.isActive == true).length.toString();
    }).catch((error) => {
      if (error.toString().includes("401")){
        this.$router.push({ name: 'Login' })
      }
    });
    Vue.axios.get('http://localhost:3000/api/camiones/', {
      headers: {
        'Authorization': `Bearer ${API_KEY}` 
      }
    }).
    then((resp) => {
      const { data } = resp.data;
      this.camiones = data;
      this.cantidadCamiones = data.filter(f => f.isActive == true).length.toString();
    }).catch((error) => {
      if (error.toString().includes("401")){
        this.$router.push({ name: 'Login' })
      }
    });
  },
  methods: {
  }
}
</script>