<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3>Usuario</h3>
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
                                v-model="usr.id"
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
                                v-model="usr.username"
                                label="Usuario"
                                horizontal
                                autocomplete="name"
                            />
                            <CInput
                                v-model="usr.password"
                                label="Password"
                                type="password"
                                horizontal
                                autocomplete="name"
                            />
                            <CRow form class="form-group">
                                <CCol tag="label" sm="3" class="col-form-label">
                                    Activo
                                </CCol>
                                <CCol sm="9">
                                    <CSwitch
                                        :checked.sync="usr.isActive"
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
                                v-model="usr.email"
                                label="Email"
                                horizontal
                                autocomplete="name"
                            />
                            <CSelect
                                :value.sync="usr.perfil.id"
                                :options="perfiles"
                                label="Perfil"
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
                                v-model="usr.createdBy"
                                label="Creador"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="usr.lastChangedBy"
                                label="Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                        <CCol sm="6">
                            <CInput
                                v-model="usr.createDateTime"
                                label="Fecha Creacion"
                                horizontal
                                plaintext
                            />
                            <CInput
                                v-model="usr.lastChangedDateTime"
                                label="Fecha Ultima Modificacion"
                                horizontal
                                plaintext
                            />
                        </CCol>
                    </CRow>
                    <CTextarea
                        v-model="usr.internalComment"
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
                                :checked="usr.isArchived"
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
let perfiles=[];
export default {
  name: 'Usuarios-Detail',
  data () {
    return {
      collapse: false,
      cardCollapse: false,
      innerCollapse: false,
      accordion: 0,
      usr: {},
      perfiles: perfiles.map((obj) => { return {label: obj.descripcion, value: obj.id} })
    }
  },
  mounted() {
    const API_KEY = localStorage.access_token;
    const id = this.$route.params.id;
    if (id == "new"){
        this.usr = { perfil: { id: "" }};
    } else {
        Vue.axios.get('http://localhost:3000/api/usuarios/' + id, {
            headers: {
                'Authorization': `Bearer ${API_KEY}` 
            }
        }).
        then((resp) => {
            const { data } = resp.data;
            this.usr = data;
        }).catch((error) => {
            if (error.toString().includes("401")){
            this.$router.push({ name: 'Login' })
            }
        });
    }
    Vue.axios.get('http://localhost:3000/api/usuarios/perfiles/', {
        headers: {
            'Authorization': `Bearer ${API_KEY}` 
        }
    }).
    then((resp) => {
        const { data } = resp.data;
        this.perfiles = data.map(obj => { return {label: obj.descripcion, value: obj.id} });
    }).catch((error) => {
        if (error.toString().includes("401")){
            this.$router.push({ name: 'Login' })
        }
    });
  },
  methods: {
      volverAtras(e) {
        this.$router.push({ name: 'Usuarios' })
      },
      guardar(e) {
        const API_KEY = localStorage.access_token;
        if(this.usr.id){

        } else {
            Vue.axios.post("http://localhost:3000/api/usuarios", {
                username: this.usr.username,
                password: this.usr.password,
                perfil: this.usr.perfil,
                email: this.usr.email
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` 
                }
            }).then((resp) => {
                const { status, message, data } = resp.data
                if (status && status == "success"){
                    this.$router.push({ name: 'Usuarios' })
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