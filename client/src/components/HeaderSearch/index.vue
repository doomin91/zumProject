<template>

<div style="display: inline-flex">
    <el-input
        v-model="keyword"
        :disabled="readonly"
        :placeholder="placeholder"
        prefix-icon="el-icon-search"
        style="width: 300px;margin-right: 10px"
        clearable
        @clear="search"
        @keydown.enter.native="search"></el-input>
    <el-button
        :disabled="readonly"
        icon="el-icon-search"
        style="width:100px; height:40px;margin:5px auto;"
        type="primary"
        @click="search">
        search
    </el-button>
</div>
</template>


<script>

export default {
    name: "Search",
    props:{
        disabled:{
            type:Boolean,
            default:true
        },
        placeholder:{
            type:String,
            default:'search'
        }
    },
    data(){
        return {
            keyword:''
        }
    },
    methods:{
        search(){
            this.$emit("search",['search',this.keyword])
        }
    }
}

</script>
