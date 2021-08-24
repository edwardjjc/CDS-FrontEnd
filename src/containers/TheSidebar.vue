<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
  <!-- LOGO PRINCIPAL -->
    <CSidebarBrand class="d-md-down-none" to="/">
       <CIcon 
        class="c-sidebar-brand-full" 
        name="cdsLogo" 
        size="custom-size" 
        src="cds-logo.png"
        :height="35" 
        viewBox="0 0 556 134"
      />
      <CIcon 
        class="c-sidebar-brand-minimized" 
        name="sygnet" 
        size="custom-size" 
        src="cds-logo.png"
        :height="35" 
        viewBox="0 0 110 134"
      />
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="computedSidebar"/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import nav from './_nav';
import jwt_decode from 'jwt-decode';

export default {
  name: 'TheSidebar',
  nav,
  data() {
    return {
    }
  },
  mounted() {
    this.minimize = true;
  },
  computed: {
    currentItems() {
      let jwtData = jwt_decode(localStorage.access_token);
      console.log(jwtData.aud);
      return nav[0]._children.filter(item => {
        return !item.roles || item.roles.includes(jwtData.aud);
      });
    },
    computedSidebar() {
      return [
        {
          _name: "CSidebarNav",
          _children: this.currentItems
        }
      ];
    },
    show () {
      return this.$store.state.sidebarShow 
    },
    minimize () {
      return this.$store.state.sidebarMinimize 
    }
  }
}
</script>
