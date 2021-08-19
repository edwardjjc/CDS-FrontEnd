<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="red lighten-2"
          dark
          v-on="on"
        >
          Click Me
        </v-btn>
      </template>

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Sesión Expirará
        </v-card-title>

        <v-card-text>
          Usted ha dejado inactivo el sistema por el tiempo límite (más de 45 minutos). Por tal motivo la sesión expirará.
          <p>{{ time }} second left</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <!-- <div
    class="overlay"
  >
    <div class="modal">
      <div class="modal__title">
        <span>Session Expired</span>
      </div>
      <div class="p-3"> 
    		<p>You have left this browser idle for 10 minutes.</p>
    		<p>{{ time }} second left</p>
      </div>
    </div>
  </div> -->
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    data() {
      return {
        time: 10000,
        dialog: false
      }
    },
    mounted(){
      this.dialog = true;
    },
    methods:{
      ...mapMutations({
          logIn: 'Login/logIn',
          logOut: 'Login/logOut'
      }),
    },
    created() {
      let timerId = setInterval(() => {
        this.time -= 1000;
        if (!this.$store.state.idleVue.isIdle) clearInterval(timerId);
        if (this.time < 1) {
          clearInterval(timerId);
          // Your logout function should be over here
          var currentdate = new Date(); 
          var datetime = "Last Sync: " + currentdate.getDate() + "/"
                          + (currentdate.getMonth()+1)  + "/" 
                          + currentdate.getFullYear() + " @ "  
                          + currentdate.getHours() + ":"  
                          + currentdate.getMinutes() + ":" 
                          + currentdate.getSeconds();


          //alert('logout user.... ' + datetime);
              //state.commit('Login/logOut');
          this.logOut();
        }
      }, 1000);
    }
  };
</script>

<style lang="postcss" scoped>
  .overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal {
    width: 500px;
    box-shadow: 1px 2px 4px rgba(153, 155, 168, 0.12);
    border-radius: 4px;
    @apply bg-white p-2;
  }
  .modal__title {
    color: #38404f;
    @apply flex items-center justify-between p-3 font-bold;
  }
</style>