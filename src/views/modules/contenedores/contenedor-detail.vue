<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3>Contenedor</h3>
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
                                v-model="cont.id"
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
                                v-model="cont.descripcion"
                                label="Nombre del Contenedor"
                                horizontal
                                autocomplete="name"
                            />
                            <CRow form class="form-group">
                                <CCol tag="label" sm="3" class="col-form-label">
                                    Activo
                                </CCol>
                                <CCol sm="9">
                                    <CSwitch
                                        :checked.sync="cont.isActive"
                                        class="mr-1"
                                        color="info"
                                        shape="pill"
                                        variant="outline"
                                    />
                                </CCol>
                                <CCol tag="label" sm="3" class="col-form-label">
                                    Pentiente Recoleccion
                                </CCol>
                                <CCol sm="9">
                                    <CSwitch
                                        :checked.sync="cont.pendienteRecoleccion"
                                        class="mr-1"
                                        color="info"
                                        shape="pill"
                                        variant="outline"
                                        disabled="true"
                                    />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="cont.gpsLatitude"
                                label="Gps Latitude"
                                horizontal
                                autocomplete="name"
                            />
                            <CInput
                                v-model="cont.gpsAltitude"
                                label="Gps Altitude"
                                horizontal
                                autocomplete="name"
                            />
                            <CSelect
                                :value.sync="cont.tipoContenedor.id"
                                :options="tiposContenedores"
                                label="Tipo Contenedor"
                                horizontal
                                autocomplete="name"
                            />
                        </CCol>
                    </CRow>
                    <CTextarea
                        v-model="cont.direccion"
                        label="Direccion"
                        placeholder="Content..."
                        horizontal
                        rows="3"
                    />
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
                                v-model="cont.createdBy"
                                label="Creador"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="cont.lastChangedBy"
                                label="Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="cont.createDateTime"
                                label="Fecha Creacion"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="cont.lastChangedDateTime"
                                label="Fecha Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                    </CRow>
                    <CTextarea
                        v-model="cont.internalComment"
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
                                :checked="cont.isArchived"
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
let tiposContenedores=[];
export default {
  name: 'Contenedor-Detail',
  data () {
    return {
      collapse: false,
      cardCollapse: false,
      innerCollapse: false,
      accordion: 0,
      cont: {},
      tiposContenedores: tiposContenedores.map((obj) => { return {label: obj.descripcion, value: obj.id} })
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    const id = this.$route.params.id;
    if (id == "new"){
        this.cont = { tipoContenedor: { id: "" } };
    } else {
        Vue.axios.get('http://localhost:3000/api/contenedores/' + id, {
            headers: {
                'Authorization': `Bearer ${API_KEY}` 
            }
        }).
        then((resp) => {
            const { data } = resp.data;
            console.log(data);
            this.cont = data;
        }).catch((error) => {
            if (error.toString().includes("401")){
            this.$router.push({ name: 'Login' })
            }
        });
    }
    Vue.axios.get('http://localhost:3000/api/tipos-contenedores/', {
        headers: {
            'Authorization': `Bearer ${API_KEY}` 
        }
    }).
    then((resp) => {
        const { data } = resp.data;
        this.tiposContenedores = data.map(obj => { return {label: obj.descripcion, value: obj.id} });
    }).catch((error) => {
        if (error.toString().includes("401")){
            this.$router.push({ name: 'Login' })
        }
    });
  },
  methods: {
      volverAtras(e) {
        this.$router.push({ name: 'Contenedores' })
      },
      guardar(e) {
        const API_KEY = localStorage.access_token;
        if(this.cont.id){
            Vue.axios.put("http://localhost:3000/api/contenedores/" + this.cont.id, {
                isActive: this.cont.isActive,
                descripcion: this.cont.descripcion,
                direccion: this.cont.direccion,
                gpsLatitude: this.cont.gpsLatitude,
                gpsAltitude: this.cont.gpsAltitude
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {
                const { status, message, data } = resp.data
                if (status && status == "success"){
                    this.$router.push({ name: 'Contenedores' })
                }
            }).catch((error) => {
                if (error.toString().includes("401")){
                this.$router.push({ name: 'Login' })
                }
            });
        } else {
            Vue.axios.post("http://localhost:3000/api/contenedores/", {
                isActive: this.cont.isActive,
                descripcion: this.cont.descripcion,
                direccion: this.cont.direccion,
                gpsLatitude: this.cont.gpsLatitude,
                gpsAltitude: this.cont.gpsAltitude
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {
                const { status, message, data } = resp.data
                if (status && status == "success"){
                    this.$router.push({ name: 'Contenedeores' })
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