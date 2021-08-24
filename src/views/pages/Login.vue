<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="5">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit="login">
                  <h1>Login</h1>
                  <p class="text-muted">Iniciar sesion en su cuenta</p>
                  <CInput
                    v-model="Username"
                    id="Username"
                    placeholder="Username"
                    autocomplete="username email"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    v-model="Password"
                    id="Password"
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CAlert
                    color="danger"
                    closeButton
                    :show.sync="invalidPass"
                  >
                    Nombre de usuario o contraseña incorrecta!!!
                  </CAlert>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton type="submit" color="primary" class="px-4">Acceder</CButton>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0">Olvido su contraseña?</CButton>
                      <CButton color="link" class="d-lg-none">Register now!</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import vueAxios from 'vue-axios';
Vue.use(vueAxios, axios);
export default {
  name: 'Login',

  data() {
    return {
      Username: "",
      Password: "",
      invalidPass: 0
    }
  },
  mounted() {
    localStorage.setItem('access_token', '');
  },
  methods: {
    countDownChanged (invalidPass) {
      this.invalidPass = invalidPass
    },
    login(e) { 
      try {
        const resp = Vue.axios.post("http://localhost:3000/api/auth/login", {
          username: this.Username,
          password: this.Password
        }).then((resp) => {
          const { status, message, data } = resp.data
          if (status && status == "success"){
            localStorage.setItem('access_token', data.access_token)
            this.$router.push({ name: 'Home' })
          } else {
            this.invalidPass = 10;
          }
        }).catch((error) => {
          if (error.toString().includes("401")){
            this.invalidPass = 3;
          }
        });
      } catch(error) {
        console.log(error);
      }
    }
  }
}
</script>
