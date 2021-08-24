<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3>Dispositivo IoT</h3>
      </div>
      <div class="card-body">
        <CCard>
            <CForm @submit="guardar">
                <CCardHeader>
                    <CRow>
                        <CCol sm="6">
                            <strong>Datos</strong>
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="disp.id"
                                horizontal
                                plaintext
                                align="right"
                            />
                        </CCol>
                    </CRow>
                </CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol sm="6">
                            <CInput
                                v-model="disp.noSerie"
                                label="Numero de Serie"
                                horizontal
                                autocomplete="name"
                            />
                            <CRow form class="form-group">
                                <CCol tag="label" sm="3" class="col-form-label">
                                    Activo
                                </CCol>
                                <CCol sm="9">
                                    <CSwitch
                                        :checked.sync="disp.isActive"
                                        class="mr-1"
                                        color="info"
                                        shape="pill"
                                        variant="outline"
                                    />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol sm="6">
                            <CSelect
                                :value.sync="disp.contenedor.id"
                                :options="contenedores"
                                label="Tipo Contenedor"
                                horizontal
                                autocomplete="name"
                            />
                            <CButton 
                                size="sm5" 
                                color="info" 
                                shape="square" 
                                variant="outline"
                                @click="verLecturas">
                                Ver Lecturas
                            </CButton>
                        </CCol>
                    </CRow>
                </CCardBody>
                <CCardFooter>
                    <CButton type="submit" size="sm" color="primary">
                        <CIcon name="cil-check-circle"/> Guardar
                    </CButton>
                    <CButton size="sm" color="danger" @click="volverAtras">
                        <CIcon name="cil-ban"/> Cancelar
                    </CButton>
                </CCardFooter>
            </CForm>
            <CModal
                title="Lecturas"
                :show.sync="lecturasModal"
                size="xl"
            >
                <CDataTable
                    :items="items"
                    :fields="fields"
                    items-per-page-select
                    :items-per-page="5"
                    sorter
                    hover
                    pagination>
                </CDataTable>
            </CModal>
        </CCard>
        <CCard>
            <CButton
                @click="cardCollapse = !cardCollapse"
                tag="button"
                color="light" 
                block
                class="text-left shadow-none card-header"
            > 
                <p class="m-0">Auditoria</p>
            </CButton>
            <CCollapse :show="cardCollapse">
                <CCardBody class="m-1">
                    <CRow>
                        <CCol sm="6">
                            <CInput
                                v-model="disp.createdBy"
                                label="Creador"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="disp.lastChangedBy"
                                label="Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="disp.createDateTime"
                                label="Fecha Creacion"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="disp.lastChangedDateTime"
                                label="Fecha Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                    </CRow>
                    <CTextarea
                        v-model="disp.internalComment"
                        label="Comentarios"
                        placeholder=""
                        horizontal
                        plaintext
                        rows="2"
                    />
                    <CRow form class="form-group">
                        <CCol tag="label" sm="3" class="col-form-label">
                            Archivado
                        </CCol>
                        <CCol sm="9">
                            <CSwitch
                                class="mr-1"
                                color="info"
                                disabled="true"
                                :checked="disp.isArchived"
                                shape="pill"
                                variant="outline"
                            />
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCollapse>
        </CCard>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
let contenedores=[];
const items = [
]

const fields = [
  { key: 'noSerie', label: "Serie Dispositivo", _style:'min-width:200px' },
  { key: 'tipoSensor', label: "Tipo Sensor", _style:'min-width:200px' },
  { key: 'fechaLectura', label: "Fecha Lectura", _style:'min-width:100px;' },
  { key: 'lectura', label: "Valor", _style:'min-width:100px;' }
]
export default {
  name: 'Dispositivo-Detail',
  data () {
    return {
      lecturasModal: false,
      collapse: false,
      cardCollapse: false,
      innerCollapse: false,
      accordion: 0,
      disp: {},
      items: items.map((item, id) => { return {...item, id}}),
      fields,
      contenedores: contenedores.map((obj) => { return {label: obj.descripcion, value: obj.id} })
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    const id = this.$route.params.id;
    if (id == "new"){
        this.cont = { contenedor: { id: "" } };
    } else {
        Vue.axios.get('http://localhost:3000/api/dispositivos-iot/' + id, {
            headers: {
                'Authorization': `Bearer ${API_KEY}` 
            }
        }).
        then((resp) => {
            const { data } = resp.data;
            this.disp = data;
        }).catch((error) => {
            if (error.toString().includes("401")){
            this.$router.push({ name: 'Login' })
            }
        });
    }
    Vue.axios.get('http://localhost:3000/api/contenedores/', {
        headers: {
            'Authorization': `Bearer ${API_KEY}` 
        }
    }).
    then((resp) => {
        const { data } = resp.data;
        this.contenedores = data.map(obj => { return {label: obj.descripcion, value: obj.id} });
    }).catch((error) => {
        if (error.toString().includes("401")){
            this.$router.push({ name: 'Login' })
        }
    });
  },
  methods: {
      volverAtras(e) {
        this.$router.push({ name: 'Dispositivos' });
      },
      verLecturas(e) {
        const API_KEY = localStorage.access_token;
        Vue.axios.get('http://localhost:3000/api/lecturas/' + this.disp.noSerie, {
            headers: {
                'Authorization': `Bearer ${API_KEY}` 
            }
        }).
        then((resp) => {
            const { data } = resp.data;
            this.items = data.map(obj => { return {noSerie: obj.dispositivoIoT.noSerie, tipoSensor: obj.tipoSensor.descripcion, fechaLectura: obj.createDateTime, lectura: obj.lectura} });
        }).catch((error) => {
            if (error.toString().includes("401")){
                this.$router.push({ name: 'Login' })
            }
        });
        this.lecturasModal = true;
      },
      guardar(e) {
        const API_KEY = localStorage.access_token;
        console.log(this.disp)
        if(this.disp.id){
            Vue.axios.put("http://localhost:3000/api/dispositivos-iot/" + this.disp.id, {
                isActive: this.disp.isActive,
                noSerie: this.disp.noSerie,
                contenedor: this.disp.contenedor.id
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {
                const { status, message, data } = resp.data
                if (status && status == "success"){
                    this.$router.push({ name: 'Dispositivos' })
                }
            }).catch((error) => {
                if (error.toString().includes("401")){
                    this.$router.push({ name: 'Login' })
                }
            });
        } else {
            Vue.axios.post("http://localhost:3000/api/dispositivos-iot/", {
                isActive: this.disp.isActive,
                noSerie: this.disp.noSerie,
                contenedor: this.disp.contenedor.id
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {
                const { status, message, data } = resp.data
                if (status && status == "success"){
                    this.$router.push({ name: 'Dispositivos' })
                }
            }).catch((error) => {
                if (error.toString().includes("401")){
                this.$router.push({ name: 'Login' })
                }
            });
        }
      }
  },
}
</script>