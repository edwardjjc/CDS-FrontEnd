<template>
  <CHeader fixed with-subheader light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />
<!--     <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <CIcon name="logo" height="48" alt="Logo"/>
    </CHeaderBrand> -->
    <CHeaderNav class="d-md-down-none mr-auto">
<!--       <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>
          Users
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink>
          Settings
        </CHeaderNavLink>
      </CHeaderNavItem> -->
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2">
<!--         <CHeaderNavLink>
          <CIcon name="cil-bell"/>
        </CHeaderNavLink> -->
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
<!--         <CHeaderNavLink>
          <CIcon name="cil-list"/>
        </CHeaderNavLink> -->
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
<!--         <CHeaderNavLink>
          <CIcon name="cil-envelope-open"/>
        </CHeaderNavLink> -->
      </CHeaderNavItem>
      <p class="d-md-down-none mx-2">Bienvenido {{username}}!!!</p>
      <TheHeaderDropdownAccnt/>
    </CHeaderNav>
<!--     <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader> -->
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import jwt_decode from 'jwt-decode';

export default {
  name: 'TheHeader',
  data() {
    return {
      username: ""
    }
  },
  mounted() {
    let jwtData = jwt_decode(localStorage.access_token);
    this.username = jwtData.username;
  },
  components: {
    TheHeaderDropdownAccnt
  }
}
</script>
