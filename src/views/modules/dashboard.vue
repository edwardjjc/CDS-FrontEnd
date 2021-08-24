<template>
  <div>
    <CWidgetIcon
        header="{{this.contenedores.length}}"
        text="Contenedores"
        color="gradient-info"
    >
        <CIcon name="cil-laptop" width="24"/>
    </CWidgetIcon>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'Dashboard',
  data() {
    return {
      items: items.map((item, id) => { return {...item, id}}),
      fields,
      details: [],
      collapseDuration: 0,
      contenedores: undefined
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
      this.contenedores = data;
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