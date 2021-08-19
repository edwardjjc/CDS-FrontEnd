<template>
    <div>
        <v-data-table
            class="elevation-4"
            :headers="headers"
            :items="items"
            :search="search"
            :loading="loading"
            :rows-per-page-text="rowsPerPageText"
            :rows-per-page-items="rowsPerPageItems"
            disable-initial-sort
        >
            <template slot="items" slot-scope="props">
                <td v-for="header in headers"
                    :key="header.value"
                    v-show="header.class !== 'd-none' && props.item.estatus !== 'ELIMINADO'"
                >
                   <span
                        v-if="typeof props.item[header.value] == 'string' || typeof props.item[header.value] == 'number'"
                    >
                        {{ props.item[header.value] }}
                    </span>
                    <span
                        v-if="header.value.includes('.')"
                    >
                        {{ props.item[header.value.split('.')[0]][header.value.split('.')[1]] }}
                    </span>
                    <v-icon
                        color="success"
                        v-if="typeof props.item[header.value] == 'boolean' && props.item[header.value]"
                    >
                        check_box
                    </v-icon>
                    <v-icon
                        v-else-if="typeof props.item[header.value] == 'boolean' && !props.item[header.value]"
                    >
                        check_box_outline_blank
                    </v-icon>
                    <v-icon
                        v-if="(header.value === 'acciones' || header.value === 'actions') && editAction"
                        @click="editItem(props.item)"
                    >
                        edit
                    </v-icon>
                    <v-icon
                        v-if="(header.value === 'acciones' || header.value === 'actions') && selectAction"
                        @click="select(props.item)"
                    >
                        add
                    </v-icon>
                    <v-icon
                        v-if="(header.value === 'acciones' || header.value === 'actions') && deleteAction"
                        @click.stop="confirmDialog(props.item)"
                    >
                        delete
                    </v-icon>
                    <span
                        v-if="(header.value === 'acciones' || header.value === 'actions')"
                    >
                        <slot name="additional-actions" :item="props.item"></slot>
                    </span>
                    <v-icon
                        v-if="(header.value === 'acciones' || header.value === 'actions') && printAction"
                        @click.stop="printItem(props.item)"
                    >
                        print
                    </v-icon>
                </td>
            </template>
            <template slot="no-data">
                <span class="red-message">
                    <slot name="no-data-message">
                        No hay datos que mostrar.
                    </slot>
                </span>
            </template>
            <template slot="no-results">
                <span class="red-message">
                    <slot name="no-results-message">
                        No se han encontrado resultados para '{{search}}.'
                    </slot>
                </span>
            </template>
        </v-data-table>
        <w-confirmation-dialog
            :visible="dialog"
            @cancel="dialog = false"
            @confirm="deleteItem"
        >
            Se eliminará el registro
        </w-confirmation-dialog>
    </div>
</template>

<script>
import WConfirmationDialog from '@/components/custom-components/w-confirmation-dialog'

export default {
    data(){
        return {
            dialog: false,
            itemToDelete: null
        }
    },
    methods:{
        confirmDialog(item){
            this.dialog = true;
            this.itemToDelete = item;
        },
        deleteItem(){
            this.$emit('deleteItem', this.itemToDelete);
            this.dialog = false;
        },
        editItem(item){
            this.$emit('editItem', item);
        },
        select(item){
            this.$emit('select', item);
        },
        printItem(item){
            this.$emit('printItem', item);
        }
    },
    props:{
        printAction:{
            type: Boolean,
            default: false
        },
        deleteAction:{
            type: Boolean,
            default: false
        },
        editAction:{
            type: Boolean,
            default: true
        },
        colorBkGr:{
            type: Boolean,
            default: false
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
        search:{
            type: String,
            default: ''
        },
        selectAction:{
            type: Boolean,
            default: false
        }
    },
    components:{
        'w-confirmation-dialog': WConfirmationDialog
    }
}
</script>
