<template>
    <div>
        <div v-for="option in options" :key="option.id">
            <!--Primer Nivel - Opciones sin Hijos-->
            <v-list-tile 
                v-if="option.padre == null && getChildOptions(option).length == 0"
                :to="{path: option.url}"
            >
                <v-list-tile-action>
                    <v-icon>{{ option.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>
                    {{ option.descripcion }}
                </v-list-tile-title>
            </v-list-tile>
            <!--Primer Nivel - Opción con Hijos-->
            <v-list-group
                v-if="option.padre == null && getChildOptions(option).length > 0"
                :prepend-icon="option.icon"
            >
                <v-list-tile slot="activator">
                    <v-list-tile-title>
                        {{ option.descripcion }}
                    </v-list-tile-title>
                </v-list-tile>
                <div v-for="child in getChildOptions(option)" :key="child.key">
                    <!--Segundo Nivel - Opciones sin Hijos-->
                    <v-list-tile
                        v-if="getChildOptions(child).length == 0"
                        :to="{path: child.url}"
                    >
                        <v-list-tile-action>
                            <v-icon>{{ child.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-tooltip top color="primary">
                            <template v-slot:activator="{ on }">
                                <v-list-tile-title v-on="on">
                                    {{ child.descripcion }}
                                </v-list-tile-title>
                            </template>
                            <span>{{ child.descripcion }}</span>
                        </v-tooltip>
                    </v-list-tile>
                    <!--Segundo Nivel - Opciones con Hijos-->
                    <v-list-group
                        v-if="getChildOptions(child).length > 0"
                        :prepend-icon="child.icon"
                        sub-group
                        no-action
                    >
                        <v-list-tile slot="activator">
                            <v-tooltip top color="primary">
                                <template v-slot:activator="{ on }">

                                    <v-list-tile-title v-on="on">
                                        {{ child.descripcion }}
                                    </v-list-tile-title>
                                </template>
                                <span>{{ child.descripcion }}</span>
                            </v-tooltip>
                        </v-list-tile>
                        <div v-for="grandChild in getChildOptions(child)" :key="grandChild.id">
                            <!--Tercer Nivel - Opciones sin Hijos-->
                            <v-list-tile
                                v-if="getChildOptions(grandChild).length == 0"
                                :to="{path: grandChild.url}"
                            >
                                <v-tooltip top color="primary">
                                    <template v-slot:activator="{ on }">
                                    <v-list-tile-title v-on="on">
                                        {{ grandChild.descripcion }}
                                    </v-list-tile-title>
                                    </template>
                                    <span>{{ grandChild.descripcion }}</span>
                                </v-tooltip>
                                <v-list-tile-action>
                                    <v-icon>{{ grandChild.icon }}</v-icon>
                                </v-list-tile-action>
                            </v-list-tile>
                            <!--Tercer Nivel - Opciones con Hijos-->
                            <v-list-group
                                v-else-if="getChildOptions(grandChild).length > 0"
                                :append-icon="child.icon"
                                sub-group
                                no-action
                            >
                                <v-list-tile slot="activator">
                                    <v-tooltip top color="primary">
                                        <template v-slot:activator="{ on }">
                                            <v-list-tile-title v-on="on">
                                                {{ grandChild.descripcion }}
                                            </v-list-tile-title>
                                        </template>
                                        <span>{{ grandChild.descripcion }}</span>
                                    </v-tooltip>
                                </v-list-tile>
                                <div 
                                    v-for="greatGrandChild in getChildOptions(grandChild)"
                                    :key="greatGrandChild.id"
                                >
                                    <!--Cuarto Nivel - Opciones sin Hijos (límite del algoritmo)-->
                                    <v-list-tile
                                        v-if="getChildOptions(greatGrandChild).length == 0"
                                        :to="{path: greatGrandChild.url}"
                                    >
                                        <v-list-tile-title>
                                            {{ greatGrandChild.descripcion }}
                                        </v-list-tile-title>
                                        <v-list-tile-action>
                                            <v-icon>{{ greatGrandChild.icon }}</v-icon>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                </div>
                            </v-list-group>
                        </div>
                    </v-list-group>
                </div>
            </v-list-group>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        options: {
            type: Array,
            required: true
        }
    },
    methods:{
        //Obtener padre de la opción
        getParentOption(option){
            let parent = this.options.filter(x => x.id == option.padre);
            return parent;
        },
        //Obtener hijo/s de la opción
        getChildOptions(option){
            let childs = this.options.filter(x => x.padre == option.id);
            return childs;
        }
    }
}
</script>
