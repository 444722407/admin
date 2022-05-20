<template>
  <div class=''>
     <el-form ref="form" label-width="80px" :inline="true" label-position="left" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.categoryId1" @change="handler(1)" :disabled="show">
          <el-option :label="c1.title" :value="c1.category_id" v-for="c1 in list1" :key="c1.category_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择"  v-model="cForm.categoryId2" @change="handler(2)" :disabled="show">
         <el-option :label="c2.title" :value="c2.category_id" v-for="c2 in list2" :key="c2.category_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择"  v-model="cForm.categoryId3" @change="handler(3)" :disabled="show">
         <el-option :label="c3.title" :value="c3.category_id" v-for="c3 in list3" :key="c3.category_id"></el-option>
        </el-select>
      </el-form-item>
      </el-form>  
 </div>
</template>


<script>
import { mapActions,mapState } from 'vuex'
export default {
  name: 'CategorySelect',
  props:["show"],
  data () {
    return {
      cForm: {
        categoryId1: "",
        categoryId2: "",
        categoryId3: "",
      },
    }
  },
  computed: {
    ...mapState({
      list1:state=>state.categorys.list1,
      list2:state=>state.categorys.list2,
      list3:state=>state.categorys.list3
    })
  },
  async mounted () {
    this.getCategorys(1);
    this.getCategorys(2);
    this.getCategorys(3);
  },
  methods: {
    ...mapActions({
      getCategorys:"categorys/getData"
    }),
    handler(id){
       const categoryId = this.cForm['categoryId' + id];
       this.$emit("getCategoryId", { categoryId: categoryId, level: id});
    }
    
  }
}
</script>

<style scoped>
</style>
