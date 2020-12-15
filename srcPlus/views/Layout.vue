<template>
    <div class="layout">
        {{username}}        
    </div>
</template>
<script>
import {mapGetters} from  "vuex"
export default {
    computed:{
        // username(){
        //     return this.$store.getters["user/username"]
        // }

        ...mapGetters("user",["username"])
    }
}
</script>
<style lang="less" scoped>
.layout{
    height: 100%;
    background-color: #ccc;
}
    
</style>