<template>
  <CRow>
    <template v-if="!noCharts">
      <CCol md="3" sm="6">
        
      </CCol>
    </template>
    <template v-else>
      <CCol md="3" sm="6">
        
       </CCol>
       <CCol md="3" sm="6">

       </CCol>
      <CCol md="3" sm="6">

      </CCol>
    </template>
  </CRow>
</template>

<script>
import { CChartLineSimple } from '../charts/index.js'

export default {
  name: 'WidgetsBrand',
  components: {
    CChartLineSimple
  },
  props: {
    noCharts: Boolean
  }
}
</script>

<style scoped>
.c-chart-brand {
  position: absolute;
  width: 100%;
  height: 100px;
}
</style>
