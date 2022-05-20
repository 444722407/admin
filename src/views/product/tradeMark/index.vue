<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showForm"
    >
      添加
    </el-button>

   
   <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" align="center">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" align="center">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" align="center">
        <template slot-scope="{ row , $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row,$index)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row,$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      style="margin-top: 20px; text-align: center"
      :page-sizes="[1,2,3,4,5]"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper,->,sizes,total,slot"
    >
      <span>chenyao</span>
    </el-pagination>
 
    <el-dialog :title="isUpdate?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible" >
        <el-form style="width: 80%" ref="ruleForm" :model="tmForm" :rules="rules">
            <el-form-item label="品牌名称" prop="tmName" label-width="100px">
            <el-input autocomplete="off" v-model="tmForm.tmName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
            <el-upload
            
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-change="changeFileImage"
                :limit="1"
            >
                <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
                </div>
            </el-upload>
            </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary"  @click="confirmForm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';
export default {
  data() {
    var validateTmName = (rule, value, callback) => {
      //自定义校验规则
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称2-10位"));
      } else {
        callback();
      }
    };
    return {
      index:-1,
      isUpdate:false,
      page: 1,
      total: 200,
      limit: 10,
      dialogFormVisible: false,
      
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
           rules: {
        //品牌名称的验证规则
        //require:必须要校验字段（前面五角星有关系）  message 提示信息    trigger:用户行为设置（事件的设置:blur、change）
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        //品牌的logo验证规则
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    };
  },
  mounted(){
    this['tardeMark/getData']();
  },  
  computed:{
    ...mapState({
        list: state => state.tardeMark.list,
    })
  },
  methods: {
      ...mapActions(['tardeMark/getData']),
     
      showForm(){
       
          this.dialogFormVisible = true;
          this.isUpdate=false;
          this. tmForm = {
            tmName: "",
            logoUrl: "",
          }
          this.$refs.ruleForm.resetFields()
         
      },
      cancelForm(){
        this.dialogFormVisible =false;
      },
        confirmForm() {
            //当全部验证字段通过，再去书写业务逻辑
            this.$refs.ruleForm.validate(async (success) => {
                //如果全部字段符合条件
                if (success) {
                    this.dialogFormVisible = false;
                    this.$message({
                        type: "success",
                        message:this.isUpdate?"添加品牌成功":"修改品牌成功",
                    })
                    const data = {
                        tmName: this.tmForm.tmName,
                        logoUrl: this.tmForm.logoUrl,
                    }
                    if(!this.isUpdate){
                        this.list = [...this.list,data]; 
                    }else{
                        this.list.splice(this.index,1,data);
                    }
                    
                } else {
                    console.log("error submit!!");
                    return false;
                }
         
      });
      
    
      
    },
      changeFileImage(file){
          this.tmForm.logoUrl =URL.createObjectURL(file.raw)
      },    
      beforeAvatarUpload(file){
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isLt2M) {
                 this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
      },
      getPageList(page){
           console.log(page)
          this.list =  [
            {
            tmName: "王小虎",
            logoUrl:
                "https://img0.baidu.com/it/u=3979661563,1948755913&fm=253&fmt=auto&app=138&f=JPEG?w=658&h=329",
            },
        ]
      },
      handleSizeChange(page){
          console.log(page)
           this.list =  [
            {
            tmName: "王小虎",
            logoUrl:
                "https://img0.baidu.com/it/u=3979661563,1948755913&fm=253&fmt=auto&app=138&f=JPEG?w=658&h=329",
            },
        ]
      },

    updateTradeMark(row,index) {
        this.index = index;
        this.isUpdate =true;
        this.dialogFormVisible = true;
        this.tmForm = { ...row };
    },
  
    deleteTradeMark(row,index) {
      //弹框
      this.$confirm(`你确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
           this.list.splice(index,1);
           this.$message({
             type: "success",
              message: "已删除",
           })
        })
        .catch(() => {
          //当用户点击取消按钮的时候会触发
          this.$message({
            type: "error",
            message: "已取消",
          });
        });
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>