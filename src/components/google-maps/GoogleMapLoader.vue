<template>
  <div>
    <div
      class="google-map"
      ref="googleMap"
    ></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader';

const mapOptions = {
  center: {
    lat: 18.496606,
    lng: -69.841385
  },
  zoom: 14
};

export default {
  props: {
    contenedores: Array,
    mapOptions: Object,
    apiKey: String
  },

  data() {
    return {
      google: null,
      map: null
    };
  },

  mounted() {
    const googleMapApi = new Loader({
      apiKey: this.apiKey
    });
    this.google = googleMapApi;
    this.initializeMap();
  },

  methods: {
    initializeMap() {
      this.google.load()
      .then((google) => {
        const mapContainer = this.$refs.googleMap;
        google.maps.event.trigger(this.map, 'resize');
        this.map = new google.maps.Map(mapContainer, mapOptions);

        this.contenedores.forEach(ruta => {
          const myLatLng = { lat: parseFloat(ruta.contenedor.gpsLatitude), lng: parseFloat(ruta.contenedor.gpsAltitude) };
          let marker = new google.maps.Marker({
            position: myLatLng,
            map: this.map,
            title: ruta.orden.toString(),
            label: ruta.orden.toString()
          });
        });
      })
      .catch(e => {
        // do something
      });
      //this.map = new this.google.maps.Map(mapContainer, this.mapConfig);
    }
  }
};
</script>

<style scoped>
.google-map {
  width: 100%;
  min-height: 100%;
}
</style>
