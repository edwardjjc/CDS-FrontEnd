<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3>Tipo Contenedor</h3>
      </div>
      <div class="card-body">
        <CCard>
            <CCardHeader>
                <CRow>
                    <CCol sm="6">
                        <strong>Datos</strong>
                    </CCol>
                    <CCol sm="6">
                        <CInput
                            v-model="tc.id"
                            horizontal
                            plaintext
                            align="right"
                        />
                    </CCol>
                </CRow>
            </CCardHeader>
            <CCardBody>
                <CForm @submit="guardar">
                    <CRow>
                        <CCol sm="6">
                            <CInput
                                v-model="tc.descripcion"
                                label="Tipo Contenedor"
                                horizontal
                                autocomplete="name"
                            />
                            <CInput
                                v-model="tc.dimensiones"
                                label="Dimensiones"
                                horizontal
                                autocomplete="name"
                            />
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="tc.cantidadMetros"
                                label="Cant. Metros"
                                horizontal
                                autocomplete="name"
                                append="mts"
                            />
                            <CRow form class="form-group">
                                <CCol tag="label" sm="3" class="col-form-label">
                                    Activo
                                </CCol>
                                <CCol sm="9">
                                    <CSwitch
                                        :checked.sync="tc.isActive"
                                        class="mr-1"
                                        color="info"
                                        shape="pill"
                                        variant="outline"
                                    />
                                </CCol>
                            </CRow>
                        </CCol>
                    </CRow>
                    <CButton type="submit" size="sm" color="primary">
                        <CIcon name="cil-check-circle"/> Submit
                    </CButton>
                    <CButton size="sm" color="danger" @click="volverAtras">
                        <CIcon name="cil-ban"/> Cancelar
                    </CButton>
                </CForm>
            </CCardBody>
            <CCardFooter>
            </CCardFooter>
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
                                v-model="tc.createdBy"
                                label="Creador"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="tc.lastChangedBy"
                                label="Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="tc.createDateTime"
                                label="Fecha Creacion"
                                type="date"
                                horizontal
                            />
                            <CInput
                                v-model="tc.lastChangedDateTime"
                                label="Fecha Ultima Modificacion"
                                type="date"
                                horizontal
                            />
                        </CCol>
                    </CRow>
                    <CTextarea
                        v-model="tc.internalComment"
                        label="Comentarios"
                        placeholder="Content..."
                        horizontal
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
                                :checked="tc.isArchived"
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
export default {
  name: 'TiposContenedores-Detail',
  data () {
    return {
      collapse: false,
      cardCollapse: false,
      innerCollapse: false,
      accordion: 0,
      tc: {}
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    const id = this.$route.params.id;
    if (id == "new"){
        this.tc = {};
    } else {
        Vue.axios.get('http://localhost:3000/api/tipos-contenedores/' + id, {
            headers: {
                'Authorization': `Bearer ${API_KEY}` 
            }
        }).
        then((resp) => {
            const { data } = resp.data;
            this.tc = data;
        }).catch((error) => {
            if (error.toString().includes("401")){
            this.$router.push({ name: 'Login' })
            }
        });
    }
  },
  methods: {
      volverAtras(e) {
        this.$router.push({ name: 'TiposContenedores' })
      },
      guardar(e) {
        const API_KEY = localStorage.access_token;
        if(this.tc.id){
            Vue.axios.put("http://localhost:3000/api/tipos-contenedores/" + this.tc.id, {
                isActive: this.tc.isActive,
                descripcion: this.tc.descripcion,
                dimensiones: this.tc.dimensiones,
                cantidadMetros: this.tc.cantidadMetros
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {
                const { status, message, data } = resp.data
                if (status && status == "success"){
                    this.$router.push({ name: 'TiposContenedores' })
                }
            }).catch((error) => {
                if (error.toString().includes("401")){
                this.$router.push({ name: 'Login' })
                }
            });
        } else {
            Vue.axios.post("http://localhost:3000/api/tipos-contenedores/", {
                isActive: this.tc.isActive,
                descripcion: this.tc.descripcion,
                dimensiones: this.tc.dimensiones,
                cantidadMetros: this.tc.cantidadMetros
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {
                const { status, message, data } = resp.data
                if (status && status == "success"){
                    this.$router.push({ name: 'TiposContenedores' })
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