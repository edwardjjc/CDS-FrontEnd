<template>
    <div>
        <v-combobox
            :label="label"
            :items="selectItems"
            :item-text="selectItemText"
            :item-value="selectItemValue"
            append-outer-icon="add"
            @click:append-outer="addItem"
            ref="select"
        >
        </v-combobox>
        <w-data-table
            :headers="headers"
            :items="items"
            :deleteAction="deleteAction"
            :editAction="editAction"
            :selectAction="selectAction"
            @deleteItem="deleteItem"
        >
            <template slot="additional-actions" slot-scope="props">
                <slot name="additional-actions" :item="props.item"></slot>
            </template>
        </w-data-table>
        <w-information-dialog
            :visible="visible"
            @ok="visible = false"
        >
            Seleccione un item primero
        </w-information-dialog>
    </div>
</template>

<script>
import WDataTable from '@/components/custom-components/w-data-table'
import WInformationDialog from '@/components/custom-components/w-information-dialog'

export default {
    data(){
        return {
            visible: false
        }
    },
    methods:{
        addItem(){
            const item = this.$refs.select.selectedItems[0];
            
            if(!item){
                this.visible = true
            }
            else{
                this.$emit('add', item);
            }
        },
        deleteItem(item){
            this.$emit('deleteItem', item);
        }
    },
    props:{
        deleteAction:{
            type: Boolean,
            default: false
        },
        editAction:{
            type: Boolean,
            default: true
        },
        headers:{
            type: Array,
            required: true
        },
        items:{
            type: Array,
            required: true
        },
        label:{
            type: String,
            required: true
        },
        selectAction:{
            type: Boolean,
            default: false
        },
        selectItems:{
            type: Array,
            required: true
        },
        selectItemText:{
            type: String,
            required: true
        },
        selectItemValue:{
            type: String,
            required: true
        }
    },
    components:{
        'w-data-table': WDataTable,
        'w-information-dialog': WInformationDialog
    }
}
</script>