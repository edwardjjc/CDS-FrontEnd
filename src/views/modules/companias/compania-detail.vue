<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3>Compañia</h3>
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
                            v-model="comp.id"
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
                                v-model="comp.descripcion"
                                label="Nombre de la compañia"
                                horizontal
                                autocomplete="name"
                            />
                            <CRow form class="form-group">
                                <CCol tag="label" sm="3" class="col-form-label">
                                    Activo
                                </CCol>
                                <CCol sm="9">
                                    <CSwitch
                                        class="mr-1"
                                        color="info"
                                        :checked="comp.isActive"
                                        shape="pill"
                                        variant="outline"
                                    />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="comp.telefono"
                                label="Telefono de la compañia"
                                horizontal
                                autocomplete="name"
                            />
                        </CCol>
                    </CRow>
                    <CTextarea
                        v-model="comp.direccion"
                        label="Direccion"
                        placeholder="Content..."
                        horizontal
                        rows="3"
                    />
                    <CButton type="submit" size="sm" color="primary">
                        <CIcon name="cil-check-circle"/> Submit
                    </CButton>
                    <CButton type="reset" size="sm" color="danger">
                        <CIcon name="cil-ban"/> Reset
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
                                v-model="comp.createdBy"
                                label="Creador"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="comp.lastChangedBy"
                                label="Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="comp.createDateTime"
                                label="Fecha Creacion"
                                type="date"
                                horizontal
                            />
                            <CInput
                                v-model="comp.lastChangedDateTime"
                                label="Fecha Ultima Modificacion"
                                type="date"
                                horizontal
                            />
                        </CCol>
                    </CRow>
                    <CTextarea
                        v-model="comp.internalComment"
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
                                :checked="comp.isArchived"
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
  name: 'Companias-Detail',
  data () {
    return {
      collapse: false,
      cardCollapse: true,
      innerCollapse: false,
      accordion: 0,
      comp: {}
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    const id = this.$route.params.id;
    console.log(id);
    if (id == "new"){
        this.comp = {};
    } else {
        Vue.axios.get('http://localhost:3000/api/compania/' + id, {
            headers: {
                'Authorization': `Bearer ${API_KEY}` 
            }
        }).
        then((resp) => {
            const { data } = resp.data;
            this.id = data.id;
            this.comp = data;
        }).catch((error) => {
            console.log(error);
        });
    }
  },
  methods: {
      guardar(e) {
        const API_KEY = localStorage.access_token;
        console.log(this.comp)
        if(this.comp.id){
            Vue.axios.put("http://localhost:3000/api/compania/" + this.comp.id, {
                isActive: this.comp.isActive,
                descripcion: this.comp.descripcion,
                direccion: this.comp.direccion,
                telefono: this.comp.telefono
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {
                const { status, message, data } = resp.data
                if (status && status == "success"){
                    this.$router.push({ name: 'Companias' })
                }
            });
        } else {
            Vue.axios.post("http://localhost:3000/api/compania/", {
                isActive: this.comp.isActive,
                descripcion: this.comp.descripcion,
                direccion: this.comp.direccion,
                telefono: this.comp.telefono
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {
                const { status, message, data } = resp.data
                if (status && status == "success"){
                    this.$router.push({ name: 'Companias' })
                }
            });
        }
      }
  },
}
</script>