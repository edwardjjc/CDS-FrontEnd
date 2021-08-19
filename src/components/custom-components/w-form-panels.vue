<template>
    <v-layout align-start>
        <v-flex>
            <v-alert
                v-model="detAlertPanel.alert.visible"
                :type="detAlertPanel.alert.type"
                dismissible
                transition="slide-x-transition"
                ref="alerta"
            >
                {{ detAlertPanel.alert.message }}
            </v-alert>                
            <v-toolbar flat color="white">
                <v-icon @click="goBack">arrow_back</v-icon>
                <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                <v-divider
                    class="mx-2" inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-flex xs12 sm2 md2 v-if="pnlBusqueda && pnlData.visible">
                    <v-combobox
                        v-model="filtro"
                        :items="filtros ? filtros : headersFiltros"
                        item-text="text"
                        item-value="value"
                        chips
                        auto-select-first
                        label="Buscar por:"
                        ref="selectFiltros"
                    >
                        <template v-slot:selection="data">
                            <v-chip
                                :key="JSON.stringify(data.item)"
                                :selected="data.selected"
                                :disabled="data.disabled"
                                class="v-chip--select-multi"
                                @click.stop="data.parent.selectedIndex = data.index"
                                @input="data.parent.selectItem(data.item.value)"
                            >
                            <v-avatar class="accent white--text">
                                {{ data.item.text.slice(0, 1).toUpperCase() }}
                            </v-avatar>
                                {{ data.item.text }}
                            </v-chip>
                        </template>
                    </v-combobox>
                </v-flex>
                <v-spacer v-if="pnlBusqueda"></v-spacer>
                <v-text-field
                    class="text-xs-center"
                    label="Buscar"
                    hide-details
                    v-model="search"
                    v-if="pnlData.visible && permisos.leer"
                    @keyup.enter="searchData(search)"
                    v-uppercase
                >
                </v-text-field>
                <v-btn 
                    small fab
                    :loading="loading"
                    v-if="pnlData.visible && permisos.leer"
                    @click.stop="searchData(search)"
                >
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn
                            v-if="pnlData.visible && printAction && permisos.imprimir"
                            small
                            fab
                            dark v-on="on"
                            color="secondary"
                            @click.stop="print"
                        >
                            <v-icon>mdi-printer</v-icon>
                        </v-btn>
                    </template>
                    <span>Genera listado.</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            color="primary"
                            fab 
                            dark v-on="on"
                            @click.stop="New"
                            v-if="pnlData.visible && addAction && permisos.agregar"
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Inserta un registro nuevo.</span>
                </v-tooltip>
                
            </v-toolbar>
            <v-scale-transition>
                <w-data-table
                    :editAction="permisos.modificar"
                    :deleteAction="deleteAction && permisos.eliminar"
                    :headers="headers"
                    :items="items"
                    :loading="loading"
                    v-if="pnlData.visible"
                    :rows-per-page-text="rowsPerPageText"
                    :rows-per-page-items="rowsPerPageItems"
                    @editItem="editItem"
                >
                    <template slot="additional-actions" v-if="additionalActions">
                        <slot name="additional-actions"></slot>
                    </template>
                </w-data-table>
            </v-scale-transition>
            <v-scale-transition>
                <v-container 
                    grid-list-xl class="white pa-4 elevation-4" fluid
                    v-if="pnlEdit.visible"
                >
                    <slot></slot>
                    <br>
                    <v-divider></v-divider>
                    <div class="text-xs-center" v-if="!hideActions">
                        <slot name="form-actions">
                            <v-btn
                                color="error"
                                @click.stop="showPnlData"
                            >
                                <v-icon>cancel</v-icon>&nbsp;Cancelar
                            </v-btn>
                            <v-btn
                                v-if="!edit"
                                color="primary"
                                :loading="loading"
                                :disabled="scope ? errors.any(scope) : errors.any() || saveButtonDisabled"
                                @click.stop="save"
                            >
                                <v-icon>save</v-icon>&nbsp;Guardar
                            </v-btn>
                            <v-btn
                                v-else-if="edit && grabarAction"
                                color="primary"
                                :loading="loading"
                                :disabled="scope ? errors.any(scope) : errors.any() || updateButtonDisabled"
                                @click.stop="update"
                            >
                                <v-icon>save</v-icon>&nbsp;Actualizar
                            </v-btn>
                            <!-- <v-btn
                                v-if="edit && imprimirAction && permisos.imprimir"
                                color="primary"
                                :loading="loading"
                                @click.stop="printDoc"
                            >
                                <v-icon>print</v-icon>&nbsp;
                            </v-btn> -->
                            &nbsp;
                            &nbsp;
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn 
                                        color="primary" 
                                        dark v-on="on"
                                        :loading="loading"
                                        v-if="edit && removeAction && permisos.eliminar"
                                        @click.stop="eliminaReg"
                                    >
                                        <v-icon>delete_forever</v-icon>&nbsp;Eliminar
                                    </v-btn>
                                </template>
                                <span>Elimina el registro físicamente.</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn 
                                        color="primary" 
                                        dark v-on="on"
                                        :loading="loading"
                                        v-if="edit && imprimirAction && permisos.imprimir"
                                        @click.stop="printDoc"
                                    >
                                        <v-icon>print</v-icon>&nbsp;
                                    </v-btn>
                                </template>
                                <span>Genera Impresión del Documento</span>
                            </v-tooltip>
                        </slot>
                    </div>
                    <!-- <slot name="form-actions">
                        <br>
                        <v-divider></v-divider>
                        <div class="text-xs-center">
                            <v-btn
                                color="error"
                                @click="showPnlData"
                            >
                                <v-icon>cancel</v-icon>&nbsp;Cancelar
                            </v-btn>
                            <v-btn
                                v-if="!edit"
                                color="primary"
                                :loading="loading"
                                :disabled="scope ? errors.any(scope) : errors.any() || saveButtonDisabled"
                                @click.stop="save"
                            >
                                <v-icon>save</v-icon>&nbsp;Guardar
                            </v-btn>
                            <v-btn
                                v-else-if="edit && grabarAction"
                                color="primary"
                                :loading="loading"
                                :disabled="scope ? errors.any(scope) : errors.any() || updateButtonDisabled"
                                @click.stop="update"
                            >
                                <v-icon>save</v-icon>&nbsp;Actualizar
                            </v-btn>
                        </div>
                    </slot> -->
                </v-container>
            </v-scale-transition>
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
                    @click="snackbar.visible = false"
                >
                    <v-icon>cancel</v-icon>&nbsp;Cerrar
                </v-btn>
            </v-snackbar>
        </v-flex>
    </v-layout>
</template>

<script>
import CleanForm from '@/mixins/cleanForm'
import WDataTable from '@/components/custom-components/w-data-table'

export default {
    name: 'WFormPanels',
    inject: ['$validator'],
    data(){
        return {
            search: '',
            edit: false,
            pnlData:{
                visible: true
            },
            pnlEdit:{
                visible: false
            },
            filtro: null,
            snackbar:{
                visible: false,
                text: '',
                multiLine: false,
                color: 'info',
                timeout: 10000
            },
            show: false,
            detAlertPanel:{
                alert:{
                    message: '',
                    type: 'error',
                    visible: false
                },
            }
        }
    },
    computed:{
        permisos(){
            const permisos = this.$store.state.Login.menu.find(x => x.url === window.location.pathname);

            if(permisos) return permisos;
            else return {leer: false, modificar: false, agregar: false, imprimir: false, eliminar: false};
        },
        headersFiltros(){
            const headers = this.headers.filter(x => x.value !== 'acciones' && x.value !== 'actions');
            this.filtro = headers[0];
            return headers;
        },
    },
    mixins: [CleanForm],
    mounted(){
        if(this.pnlBusqueda && this.filtros){
            this.filtro = this.filtros[0];
        }
    },
    methods:{
        showPnlData(){
            this.pnlEdit.visible = false;
            setTimeout(()=>{
                this.pnlData.visible = true;
            }, 300);
        },
        showPnlEdit(){
            this.pnlData.visible = false;
            setTimeout(()=>{
                this.pnlEdit.visible = true;
            }, 300);
        },
        goBack(){
            if(this.backUrl){
                this.$router.push({path: this.backUrl})
            }
            else if(!this.pnlData.visible){
                this.showPnlData()
            }
            else{
                history.back();
            }
        },
        searchData(value){
            if(this.pnlBusqueda){
                if(this.filtro){
                    this.$emit('searchData', {filtro: this.filtro.value, value});
                }
            }
            else{
                this.$emit('searchData', value);
            }
        },
        print(){
            this.$emit('print');
        },
        async validate(){
            if(this.scope) return await this.$validator.validateAll(this.scope);
            return this.$validator.validateAll();
        },
        New(){
            this.edit = false;
            this.showPnlEdit();
            this.$emit('New');
        },
        notFoundNotification(){
            this.snackbar.color = 'error';
            this.snackbar.multiLine = true;
            this.snackbar.text = 'No se ha encontrado el registro, puede que este se haya eliminado';
            this.snackbar.visible = true;
        },
        editItem(item){
            this.$parent.$on('editItemDone', (ex) => {
                const parentError = ex || this.$parent.error;
                
                if(parentError == 404) this.notFoundNotification();
                else if(!parentError) this.showPnlEdit();
                this.$parent.$off('editItemDone');
            });

            this.edit = true;
            this.$emit('editItem', item);
        },
        async save(){
            if(!await this.validate()) return;

            this.$parent.$on('saveDone', (ex) => {
                const parentError = ex || this.$parent.error;

                if(!parentError){
                    this.saveNotification();
                    this.showPnlData();
                }
                else if(parentError !== 'Network Error') this.errorNotification();
                this.$parent.$off('saveDone');
            });
            this.$emit('save');            
        },
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
                    this.showPnlData();
                }
                else if(parentError === 404) this.notFoundNotification();
                else if(parentError !== 'Network Error') this.errorNotification();
                this.$parent.$off('updateDone');
            });

            this.$emit('update');
        },
        async printDoc(){
            this.$emit('printDoc')
        },
        async eliminaReg(){
            if(!await this.validate()) return;

            this.$parent.$on('removeDone', (ex) => {
                const parentError = ex || this.$parent.error;

                if(!parentError){
                    this.removeNotification();
                    this.showPnlData();
                }
                else if(parentError === 404) this.notFoundNotification();
                else if(parentError !== 'Network Error') this.errorNotification();
                this.$parent.$off('removeDone');
            });

            this.$emit('eliminaReg')
        },
        updateNotification(){
            this.snackbar.multiLine = false;
            this.snackbar.color = 'success';
            this.snackbar.text = 'Se actualizó el registro exitosamente';
            this.snackbar.visible = true;
        },
        removeNotification(){
            this.snackbar.multiLine = false;
            this.snackbar.color = 'success';
            this.snackbar.text = 'Se eliminó el registro exitosamente';
            this.snackbar.visible = true;
        },
        activarAlerta(){
            this.detAlertPanel.alert.visible = true;
            this.detAlertPanel.alert.message = this.messagePanel;
            this.pnlData.visible = false;
        }
    },
    props:{
        addAction:{
            type: Boolean,
            default: true
        },
        additionalActions:{
            type: Boolean,
            default: false
        },
        backUrl:{
            type: String,
            default: null
        },
        deleteAction:{
            type: Boolean,
            default: false
        },
        filtros:{
            type: Array
        },
        formTitle:{
            type: String,
            required: true
        },
        headers:{
            type: Array,
            required: true
        },
        hideActions:{
            type: Boolean,
            default: false
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
        grabarAction:{
            type: Boolean,
            default: true
        },
        imprimirAction:{
            type: Boolean,
            default: false
        },
        removeAction:{
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
            default: 'Filas por Página:'
        },
        saveButtonDisabled:{
            type: Boolean,
            default: false
        },
        scope:{
            type: String,
            default: null
        },
        searchInput:{
            type: Boolean,
            default: true
        },
        pnlBusqueda:{
            type: Boolean,
            default: false
        },
        updateButtonDisabled:{
            type: Boolean,
            default: false
        },
        messagePanel:{
            type: String,
            default: ''
        },
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