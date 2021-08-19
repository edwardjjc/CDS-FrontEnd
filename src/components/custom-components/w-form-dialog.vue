<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-icon @click.stop="goBack">arrow_back</v-icon>
                <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                <v-divider
                    class="mx-2" inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" append-icon="search"
                    label="Buscar"
                    hide-details
                    v-model="search"
                    v-if="searchInput && permisos.leer"
                >
                </v-text-field>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn
                            v-if="printAction && permisos.imprimir"
                            small
                            fab
                            color="secondary"
                            dark v-on="on"
                            @click="print"
                        >
                            <v-icon>mdi-printer</v-icon>
                        </v-btn>
                    </template>
                    <span>Inserta un registro nuevo.</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn
                            v-if="permisos.agregar && addAction"
                            color="primary"
                            fab
                            dark v-on="on"
                            @click.stop="New"
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Inserta un registro nuevo.</span>
                </v-tooltip>
                <v-dialog
                    v-model="dialog"
                    :max-width="dialogWith + 'px'"
                    persistent
                    transition="slide-x-transition"
                >
                    <v-card>
                        <v-card-title class="headline grey lighten-2">
                            <h3 class="headline">{{ cardTitle }}</h3>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <slot></slot>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="error" flat
                                @click="closeDialog"
                            >
                                <v-icon>cancel</v-icon>&nbsp;Cancelar
                            </v-btn>
                            <v-btn
                                color="primary" flat
                                v-if="!edit"
                                @click.stop="save"
                                :disabled="errors.any()"
                                :loading="loading"
                            >
                                <v-icon>save</v-icon>&nbsp;Guardar
                            </v-btn>
                            <v-btn
                                color="primary" flat
                                v-if="edit"
                                @click.stop="update"
                                :disabled="errors.any()"
                                :loading="loading"
                            >
                                <v-icon>save</v-icon>&nbsp;Actualizar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <w-data-table
                :editAction="permisos && permisos.modificar"
                :headers="headers"
                :items="items"
                :search="search"
                :loading="loading"
                :rows-per-page-text="rowsPerPageText"
                :rows-per-page-items="rowsPerPageItems"
                @editItem="editItem"
            >
            </w-data-table>
            <v-snackbar
                v-model="snackbar.visible"
                top
                :multi-line="snackbar.multiLine"
                :timeout="3000"
                :color="snackbar.color"
            >
                {{ snackbar.text }}
                <v-btn
                    flat
                    dark
                    @click.stop="snackbar.visible = false"
                >
                    <v-icon>cancel</v-icon>&nbsp;Cerrar
                </v-btn>
            </v-snackbar>
        </v-flex>
    </v-layout>
</template>

<script>
//import CleanForm from '@/mixins/cleanForm'
import Router from '@/router'
import WDataTable from '@/components/custom-components/w-data-table'

export default {
    name: 'WFormDialog',
    data(){
        return{
            search: '',
            dialog: false,
            edit: false,
            snackbar:{
                visible: false,
                text: '',
                multiLine: false,
                color: 'info',
                timeout: 10000
            }
        }
    },
    computed:{
        cardTitle(){
            return this.edit ? 'Modificar Registro':'Nuevo Registro'
        },
        permisos(){
            const permisos = this.$store.state.Login.menu.find(x => x.url === window.location.pathname);

            if(permisos) return permisos;
            else return {leer: false, modificar: false, agregar: false, imprimir: false, eliminar: false};
        }
    },
    inject: ['$validator'],
    mixins: [CleanForm],
    methods:{
        closeDialog(){
            this.dialog = false;
        },
        close(){
            this.dialog = false;
            this.errors.clear();
        },
        editItem(item){
            this.errors.clear();
            this.edit = true;
            this.dialog = true;
            this.$emit('editItem', item);
        },
        //Genera una notificación de error, no puede ser customizada
        errorNotification(){
            this.snackbar.color = 'error';
            this.snackbar.multiLine = true;
            this.snackbar.text = 'Ha ocurrido un error durante la petición, inténtelo de nuevo más tarde';
            this.snackbar.visible = true;
        },
        goBack(){
            if(this.backUrl){
                Router.push({path: this.backUrl})
            }
            else{
                Router.push({name: 'home'});
            }
        },
        //Genera una notificación customizada.
        makeNotification(text, color){
            this.snackbar.color = color;
            this.snackbar.text = text;
            this.snackbar.visible = true;
        },
        New(){
            this.errors.clear();
            this.edit = false;
            this.dialog = true;
            this.$emit('New');
        },
        //Genera una notificación cuando no se encuentra un registro, no puede ser customizada.
        notFoundNotification(){
            this.snackbar.color = 'error';
            this.snackbar.multiLine = true;
            this.snackbar.text = 'No se ha encontrado el registro, puede que este se haya eliminado';
            this.snackbar.visible = true;
        },
        print(){
            this.$emit('print');
        },
        async save(){
            if(!await this.validate()) return;
            this.$parent.$on('saveDone', (ex) => {
                const parentError = ex || this.$parent.error;

                if(!parentError){
                    this.saveNotification();
                    this.close();
                }
                else if(parentError !== 'Network Error')this.errorNotification();
                this.$parent.$off('saveDone');
            });
            this.$emit('save');
        },
        //Genera una notificación de que se guardó un registro, no puede ser customizada
        saveNotification(){
            this.snackbar.multiLine = false;
            this.snackbar.color = 'success';
            this.snackbar.text = 'Se guardó el registro exitosamente';
            this.snackbar.visible = true;
        },
        async update(){
            if(!await this.validate()) return;
            this.$parent.$on('updateDone', (ex) => {
                const parentError = ex || this.$parent.error;

                if(!parentError){
                    this.updateNotification();
                    this.close();
                }
                else if(parentError === 404) this.notFoundNotification();
                else if(parentError !== 'Network Error') this.errorNotification();
                this.$parent.$off('updateDone');
            });
            this.$emit('update');
        },
        //Genera una notificación de que se actualizó un registro, no puede ser customizada
        updateNotification(){
            this.snackbar.multiLine = false;
            this.snackbar.color = 'success';
            this.snackbar.text = 'Se actualizó el registro exitosamente';
            this.snackbar.visible = true;
        },
        async validate(){
            let validate = await this.$validator.validateAll();
            return validate;
        }
    },
    props:{
        addAction:{
            type: Boolean,
            default: true
        },
        backUrl:{
            type: String,
            default: null
        },
        dialogWith:{
            type: Number,
            default: 700
        },
        formTitle:{
            type: String,
            required: true
        },
        headers:{
            type: Array,
            required: true
        },
        items:{
            type: Array,
            required: true
        },
        loading:{
            type: Boolean,
            default: false
        },
        printAction:{
            type: Boolean,
            default: false
        },
        rowsPerPageItems:{
            type: Array,
            default: () => {
                return [
                    5,
                    10,
                    50,
                    {text: 'Todos', value: -1}
                ];
            }
        },
        rowsPerPageText:{
            type: String,
            default: 'Filas por Página'
        },
        searchInput:{
            type: Boolean,
            default: true
        }
    },
    components:{
        'w-data-table': WDataTable
    }
}
</script>

<style>
    .red-message{
        display: block;
        color: red;
        text-align: center;
    }
</style>