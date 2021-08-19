<template>
  <div>
    <WidgetsDropdown/>
    <CCard>
    </CCard>
    <WidgetsBrand/>
    <CRow>
    </CRow>
  </div>
</template>

<script>
import MainChartExample from './charts/MainChartExample'
import WidgetsDropdown from './widgets/WidgetsDropdown'
import WidgetsBrand from './widgets/WidgetsBrand'

export default {
  name: 'Dashboard',
  components: {
    MainChartExample,
    WidgetsDropdown,
    WidgetsBrand
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
