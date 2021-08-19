<template>
    <v-dialog
        v-model="visible"
        :max-width="maxWidth"
        persistent
    >
        <v-card>
            <v-card-title class="headline primary lighten-2">
                <h3 class="headline">
                    <slot name="title">
                        <v-icon>info</v-icon>&nbsp;Información
                    </slot>
                </h3>
            </v-card-title>
            <v-card-text>
                <slot></slot>
            </v-card-text>
            <v-card-actions>
                <slot name="actions">
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        @click.stop="ok"
                        flat
                    >
                        <v-icon>done</v-icon>&nbsp;OK
                    </v-btn>
                </slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'w-information-dialog',
    methods:{
        ok(){
            this.$emit('ok');
        }
    },
    props:{
        maxWidth:{
            type: String,
            default: '400px'
        },
        visible:{
            type: Boolean,
            required: true
        },
    }
}
</script>