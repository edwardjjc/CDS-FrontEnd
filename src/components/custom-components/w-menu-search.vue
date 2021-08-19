<template>
<div>
    <div v-for="option in options" :key="option.id">
        <!--Primer Nivel - Opciones sin Hijos-->
        <v-list-tile :to="{path: option.url}">
            <v-list-tile-action>
                <v-icon>{{ option.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>
                {{ option.descripcion }}
            </v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>
    </div>
</div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true
        }
    }
}
</script>
