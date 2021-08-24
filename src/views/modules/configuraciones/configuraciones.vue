<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3>Configuraciones</h3>
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
                                v-model="conf.id"
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
                                v-model="conf.porcentajeMaxContenedores"
                                label="Porcentaje Maximo Contenedores"
                                horizontal
                                autocomplete="name"
                            />
                            <CTextarea
                                v-model="conf.direccionPuntoOrigen"
                                label="Direccion Punto Origen"
                                horizontal
                                autocomplete="name"
                            />
                            <CInput
                                v-model="conf.gpsLatitudePuntoOrigen"
                                label="Gps Latitude Punto Origen"
                                horizontal
                                autocomplete="name"
                            />
                            <CInput
                                v-model="conf.gpsAltitudePuntoOrigen"
                                label="Gps Altitude Punto Origen"
                                horizontal
                                autocomplete="name"
                            />
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="conf.fechaUltimaConstruccion"
                                label="Fecha Ultima Construcion Ruta"
                                horizontal
                                plaintext
                            />
                            <CTextarea
                                v-model="conf.direccionPuntoDestino"
                                label="Direccion Punto Destino"
                                horizontal
                                autocomplete="name"
                            />
                            <CInput
                                v-model="conf.gpsLatitudePuntoDestino"
                                label="Gps Latitude Punto Destino"
                                horizontal
                                autocomplete="name"
                            />
                            <CInput
                                v-model="conf.gpsAltitudePuntoDestino"
                                label="Gps Altitude Punto Destino"
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
                                v-model="conf.createdBy"
                                label="Creador"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="conf.lastChangedBy"
                                label="Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="conf.createDateTime"
                                label="Fecha Creacion"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="conf.lastChangedDateTime"
                                label="Fecha Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                    </CRow>
                    <CTextarea
                        v-model="conf.internalComment"
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
                                :checked="conf.isArchived"
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
  name: 'Configuraciones',
  data () {
    return {
      collapse: false,
      cardCollapse: false,
      innerCollapse: false,
      accordion: 0,
      conf: {}
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    const id = this.$route.params.id;
    if (id == "new"){
        this.cont = {};
    } else {
        Vue.axios.get('http://localhost:3000/api/configuraciones/', {
            headers: {
                'Authorization': `Bearer ${API_KEY}` 
            }
        }).
        then((resp) => {
            const { data } = resp.data;
            this.conf = data;
        }).catch((error) => {
            if (error.toString().includes("401")){
                this.$router.push({ name: 'Login' })
            }
        });
    }
  },
  methods: {
      volverAtras(e) {
        this.$router.push({ name: 'Dashboard' })
      },
      guardar(e) {
        const API_KEY = localStorage.access_token;
        if(this.conf.id){
            Vue.axios.put("http://localhost:3000/api/configuraciones/" + this.conf.id, {
                porcentajeMaxContenedores: this.conf.porcentajeMaxContenedores,
                direccionPuntoOrigen: this.conf.direccionPuntoOrigen,
                gpsLatitudePuntoOrigen: this.conf.gpsLatitudePuntoOrigen,
                gpsAltitudePuntoOrigen: this.conf.gpsAltitudePuntoOrigen,
                direccionPuntoDestino: this.conf.direccionPuntoDestino,
                gpsLatitudePuntoDestino: this.conf.gpsLatitudePuntoDestino,
                gpsAltitudePuntoDestino: this.conf.gpsAltitudePuntoDestino,
                fechaUltimaConstruccion: this.conf.fechaUltimaConstruccion,
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {

            }).catch((error) => {
                if (error.toString().includes("401")){
                    this.$router.push({ name: 'Login' });
                }
            });
        }
      }
  },
}
</script>