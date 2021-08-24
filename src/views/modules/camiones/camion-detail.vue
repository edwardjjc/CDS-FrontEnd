<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3>Camion</h3>
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
                                v-model="cam.id"
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
                                v-model="cam.descripcion"
                                label="Nombre del Contenedor"
                                horizontal
                                autocomplete="name"
                            />
                            <CInput
                                v-model="cam.identificadorUnico"
                                label="Placa"
                                horizontal
                                autocomplete="name"
                            />
                            <CInput
                                v-model="cam.marca"
                                label="Marca"
                                horizontal
                                autocomplete="name"
                            />
                            <CInput
                                v-model="cam.modelo"
                                label="Modelo"
                                horizontal
                                autocomplete="name"
                            />
                            <CRow form class="form-group">
                                <CCol tag="label" sm="3" class="col-form-label">
                                    Activo
                                </CCol>
                                <CCol sm="9">
                                    <CSwitch
                                        :checked.sync="cam.isActive"
                                        class="mr-1"
                                        color="info"
                                        shape="pill"
                                        variant="outline"
                                    />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="cam.anio"
                                label="Año Fabricacion"
                                horizontal
                                autocomplete="name"
                            />
                            <CInput
                                v-model="cam.color"
                                label="Color"
                                horizontal
                                autocomplete="name"
                            />
                            <CSelect
                                :value.sync="cam.tipoCamion.id"
                                :options="tiposCamiones"
                                label="Tipo Camion"
                                horizontal
                                autocomplete="name"
                            />
                            <CSelect
                                :value.sync="cam.compania.id"
                                :options="companias"
                                label="Compañia"
                                horizontal
                                autocomplete="name"
                            />
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
                                v-model="cam.createdBy"
                                label="Creador"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="cam.lastChangedBy"
                                label="Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="cam.createDateTime"
                                label="Fecha Creacion"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="cam.lastChangedDateTime"
                                label="Fecha Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                    </CRow>
                    <CTextarea
                        v-model="cam.internalComment"
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
                                :checked="cam.isArchived"
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
let tiposCamiones=[];
let companias=[];
export default {
  name: 'Camion-Detail',
  data () {
    return {
      collapse: false,
      cardCollapse: false,
      innerCollapse: false,
      accordion: 0,
      cam: {},
      companias: companias.map((obj) => { return {label: obj.descripcion, value: obj.id} }),
      tiposCamiones: tiposCamiones.map((obj) => { return {label: obj.descripcion, value: obj.id} })
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    const id = this.$route.params.id;
    if (id == "new"){
        this.cam = { tipoCamion: { id: "" }, compania: { id: "" } };
    } else {
        Vue.axios.get('http://localhost:3000/api/camiones/' + id, {
            headers: {
                'Authorization': `Bearer ${API_KEY}` 
            }
        }).
        then((resp) => {
            const { data } = resp.data;
            this.cam = data;
        }).catch((error) => {
            if (error.toString().includes("401")){
            this.$router.push({ name: 'Login' })
            }
        });
    }
    Vue.axios.get('http://localhost:3000/api/tipos-camiones/', {
        headers: {
            'Authorization': `Bearer ${API_KEY}` 
        }
    }).
    then((resp) => {
        const { data } = resp.data;
        this.tiposCamiones= data.map(obj => { return {label: obj.descripcion, value: obj.id} });
    }).catch((error) => {
        if (error.toString().includes("401")){
            this.$router.push({ name: 'Login' })
        }
    });
    Vue.axios.get('http://localhost:3000/api/compania/', {
        headers: {
            'Authorization': `Bearer ${API_KEY}` 
        }
    }).
    then((resp) => {
        const { data } = resp.data;
        this.companias= data.map(obj => { return {label: obj.descripcion, value: obj.id} });
    }).catch((error) => {
        if (error.toString().includes("401")){
            this.$router.push({ name: 'Login' })
        }
    });
  },
  methods: {
      volverAtras(e) {
        this.$router.push({ name: 'Camiones' })
      },
      guardar(e) {
        const API_KEY = localStorage.access_token;
        if(this.cam.id){
            Vue.axios.put("http://localhost:3000/api/camiones/" + this.cam.id, {
                isActive: this.cam.isActive,
                descripcion: this.cam.descripcion,
                marca: this.cam.marca,
                modelo: this.cam.modelo,
                identificadorUnico: this.cam.identificadorUnico,
                anio: this.cam.anio,
                color: this.cam.color,
                tipoCamion: this.cam.tipoCamion,
                compania: this.cam.compania
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {
                const { status, message, data } = resp.data
                if (status && status == "success"){
                    this.$router.push({ name: 'Camiones' })
                }
            }).catch((error) => {
                if (error.toString().includes("401")){
                this.$router.push({ name: 'Login' })
                }
            });
        } else {
            Vue.axios.post("http://localhost:3000/api/camiones/", {
                isActive: this.cam.isActive,
                descripcion: this.cam.descripcion,
                marca: this.cam.marca,
                modelo: this.cam.modelo,
                identificadorUnico: this.cam.identificadorUnico,
                anio: this.cam.anio,
                color: this.cam.color,
                tipoCamion: this.cam.tipoCamion,
                compania: this.cam.compania
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {
                const { status, message, data } = resp.data
                if (status && status == "success"){
                    this.$router.push({ name: 'Camiones' })
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