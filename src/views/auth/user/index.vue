<template>
  <div class="app-container">
    <el-form inline :model="searchForm" ref="searchForm">
      <el-form-item prop="userName">
        <el-input placeholder="用户名" v-model="searchForm.userName"/>
      </el-form-item> 

      <el-button type="primary"  icon="el-icon-search" @click="resultSearch" :loading="loading">查询</el-button>
      <el-button type="default" @click="clearSearch">清空</el-button>
    </el-form>

    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="showAddUser">添 加</el-button>
      <el-button type="danger" @click="removeTabelCell">批量删除</el-button>
    </div>

    <el-table border :data="users" @selection-change="tabelCellChange"  v-loading="loading">
      <el-table-column type="selection" width="55" />

      <el-table-column type="index" label="序号" width="80" align="center" />

      <el-table-column prop="userName" label="用户名" width="150" />
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="roleNames" label="权限列表">
        <template slot-scope="{ row }">
          <el-tag
            type="success"
            v-for="(roleName, idx) in row.roleNames"
            :key="idx"
            style="margin: 0px 10px"
            >{{ roleName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="创建时间" width="180" />
      <el-table-column prop="gmtModified" label="更新时间" width="180" />

      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="{ row, $index }">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-user-solid"
            title="分配角色"
            @click="showRoles($index)"
          />

          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            title="修改用户"
            @click="showUser($index)"

          />

          <el-popconfirm
            :title="`确定删除 ${row.userName} 吗?`"
            @onConfirm="removeUser($index)"
          >
            <el-button
              style="margin-left: 10px"
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除用户"
            />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="targetUser.userid?'修改用户':'添加用户'" :visible.sync="dialogUserVisible">
      <el-form ref="userForm" :model="targetUser" :rules="userRules" label-width="120px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="targetUser.userName" maxlength="20" minlength="4" placeholder="请输入用户名" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="targetUser.nickName"  maxlength="20" minlength="4" placeholder="请输入昵称" autocomplete="off" />
        </el-form-item>
        
        <el-form-item v-if="!targetUser.id" label="用户密码" prop="password">
          <el-input v-model="targetUser.password" show-password   maxlength="20" minlength="6" placeholder="请输入密码" autocomplete="off" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button  type="primary" @click="confirmUser">确 定</el-button>
      </div>
      
    </el-dialog>

    <el-dialog title="设置角色" :visible.sync="dialogRoleVisible">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="targetUser.userName"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="roleAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group v-model="allRolesIds" @change="rolesChange">
            <el-checkbox
              v-for="role in allRoles"
              :key="role.id"
              :label="role.id"
              >{{ role.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="dialogRoleVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRole">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: "AclUserList",

  data() {
    return {
      dialogUserVisible: false,
      dialogRoleVisible: false,
      loading:false,
      selectIdList: [],
      selectUsername: [],
      users: [
        {
          userid: 1,
          allRolesIds: [1],
          userName: "Admin",
          nickName: "boss",
          roleNames: ["超级管理员"],
          gmtCreate: "2022-5-19",
          gmtModified: "2022-5-19",
        },
        {
          userid: 2,
          allRolesIds: [1, 2],
          userName: "Editor",
          nickName: "小三",
          roleNames: ["超级管理员", "白富美"],
          gmtCreate: "2022-5-19",
          gmtModified: "2022-5-19",
        },
      ],

      checkAll: false,
      isIndeterminate: true,
      allRolesIds: [],
      allRoles: [
        { roleName: "超级管理员", id: 1 },
        { roleName: "白富美", id: 2 },
        { roleName: "高富帅", id: 3 },
        { roleName: "土豪", id: 4 },
      ],
      targetUser: {
        userid: "",
        userName: "",
        nickName:"",
        password:""
      },
      userRules: {
          userName:[
            { required: true, message: '请输入用户名' },
            { min: 4, message: '用户名不能小于4位' },
          ],
          nickName:[
            { required: true, message: '请输入昵称' }, 
          ],
          password:[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码不能小于6位' },
          ], 
      },

      searchForm:{
        userName:"",
      }
    };
  },

  methods: {
    resultSearch(){
      this.loading = true;
      setTimeout(()=>{
         const searchName = this.searchForm.userName;

          const searchResult = this.users.filter((item)=> item.userName.includes(searchName) );

          if(searchResult.length == 0){
            this.$message({
              type:"error",
              message:"查无此人"
            })
          }else{
            this.users = searchResult;
          }
          this.loading = false;
      },2000)
       
    },
    clearSearch(){
      this.$nextTick(()=>{
          this.$refs.searchForm.resetFields()
      })
    
    },
    showUser(index){
      this.dialogUserVisible = true;
      this.targetUser.userid = this.users[index].userid;
      this.targetUser.userName = this.users[index].userName;
      this.targetUser.nickName = this.users[index].nickName;
      const password = Math.random().toString(16).substring(2);
      this.targetUser.password = password;


    },
    showRoles(index) {
   
      this.dialogRoleVisible = true;
      this.targetUser.userid = this.users[index].userid;
      this.targetUser.userName = this.users[index].userName;
      this.allRolesIds = this.users[index].allRolesIds;
     
    },
    confirmRole() {
      this.$message.success("分配角色成功");
      this.dialogRoleVisible = false;

      const userid = this.targetUser.userid;
      const allRolesIds = this.allRolesIds;

      const roleNames = this.allRoles
        .filter((item) => {
          return allRolesIds.includes(item.id);
        })
        .map((item) => {
          return item.roleName;
        });

    

      const findIndex = this.users.findIndex((item) => (item.userid == userid));
      
      this.users[findIndex].roleNames = roleNames;
      this.users[findIndex].allRolesIds = allRolesIds;

      // 如果你是操作的自己的权限 那么就要刷新页面
      // if (this.$store.getters.name===this.targetUser.username) {
      //     window.location.reload()
      // }
    },
    tabelCellChange(values) {
      this.selectIdList = values.map((map) => map.userid);
      this.selectUsername = values.map((map) => map.userName).join(";");
    },
    removeTabelCell() {
      const selectIdList = this.selectIdList;

      const list = this.users.filter((item) => {
        return !selectIdList.includes(item.userid);
      });

      this.$confirm(`你确定删除${this.selectUsername}?`, "提示", {
        confirmButtonText: "确定",

        cancelButtonText: "取消",

        type: "warning",
      })
        .then(() => {
          this.users = list;
          this.$message({
            type: "success",
            message: "删除成功",
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "删除失败",
          });
        });
    },
    roleAllChange(value) {
      const data = this.$options.data().allRoles.map((item) => item.id);
      this.allRolesIds = value ? data : [];
      this.isIndeterminate = false;
    },
    rolesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allRolesIds.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allRolesIds.length;
    },
    removeUser(index) {
      this.users.splice(index, 1);
      this.$message.success("删除成功");
    },

    cancel() {
      this.dialogUserVisible = false;
    },
    confirmUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$message.success("保存成功!");
          this.dialogUserVisible = false;
          
          const targetUser ={...this.targetUser};
          targetUser.userid =  this.users.length +1;
          targetUser.gmtCreate = dayjs().format('YYYY-MM-DD');
          targetUser.gmtModified = dayjs().format('YYYY-MM-DD'); 
          targetUser.allRolesIds = []
          targetUser.roleNames = []

          console.log(targetUser)
          this.users = [...this.users,targetUser]
        }
      });
    },
    
    search() {
      this.searchObj = { ...this.tempSearchObj };
      this.getUsers();
    },

    resetSearch() {
      this.searchObj = {
        username: "",
      };
      this.tempSearchObj = {
        username: "",
      };
      this.getUsers();
    },

    
    showAddUser() {
      this.user = {};
      this.dialogUserVisible = true;
      this.targetUser = this.$options.data().targetUser;
      this.$nextTick(() => this.$refs.userForm.resetFields());
    },

   

  },
};
</script>
