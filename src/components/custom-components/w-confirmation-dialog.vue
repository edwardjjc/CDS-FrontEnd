<template>
    <v-dialog
        v-model="visible"
        :max-width="maxWidth"
        persistent
    >
        <v-card>
            <v-card-title class="headline grey lighten-2">
                <h3 class="headline">
                    <slot name="title">
                        <v-icon>info</v-icon>&nbsp;¿Estás seguro?
                    </slot>
                </h3>
            </v-card-title>
            <v-card-text>
                <slot>Se procederá con la acción</slot>
            </v-card-text>
            <v-card-actions>
                <slot name="actions">
                    <v-spacer></v-spacer>
                    <v-btn
                        color="error"
                        @click.stop="cancel"
                        :disabled=cancelar
                        flat
                    >
                        <v-icon>cancel</v-icon> &nbsp;Cancelar
                    </v-btn>
                    <slot name="additional-actions"></slot>
                    <v-btn
                        color="success"
                        :loading="loading"
                        @click.stop="confirm"
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
    data() {
        return {
        }
    },
    methods:{
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm')
        }
    },
    props:{
        loading:{
            type: Boolean,
            default: false
        },
        maxWidth:{
            type: String,
            default: '400px'
        },
        visible:{
            type: Boolean,
            required: true
        },
        cancelar:{
            type: Boolean,
            default: false
        },
    }
}
</script>