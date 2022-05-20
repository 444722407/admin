<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="isShowTable = false"
          :disabled="attrList.length ==0"
          >添加属性</el-button
        >
        <!-- 表格:展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="title" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="(tag, tagIndex) in row.tags"
                :key="tagIndex"
                style="margin: 0px 10px"
                >{{ tag }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row,$index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="toEditCell(row)"
              ></el-button>

              <el-popconfirm
                :title="`确定删除${row.title}?`"
                @onConfirm="removeCell($index)"
                style="margin-left:10px"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.title"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.title"
          @click="addAttr"
          >添加属性值</el-button
        >

        <el-table style="width: 100%; margin: 20px 0px" border :data="tags">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80"
          ></el-table-column>

          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.value"
                v-if="row.flag"
                placeholder="请输入属性值名称"
                :ref="$index"
                @blur="validata(row, $index)"
                @keyup.native.enter="validate(row, $index)"
              ></el-input>

              <div v-else @click="toEdit(row, $index)" style="height: 100%">
                {{ row.value }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <!-- // 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.value}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="confrim" :disabled="tags.length ==0">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      isShowTable: true,
      // 修改添加的操作
      attrInfo: {
        title: "",
      },
      oldValue: "",
      tags: [],
    };
  },
  computed: {
    ...mapState({
      attrList: (state) => state.attrs.list,
    }),
  },
  methods: {
    ...mapActions({
      getData: "attrs/getData",
    }),
    confrim(){
      this.isShowTable = false;
      Object.assign(this.$data,this.$options.data())
    },
    cancel(){
      this.isShowTable = false;
      Object.assign(this.$data,this.$options.data())
    },
    // 判断数据是否重复
    isRepeat(value, index) {
      if (value.trim() != "") {
        return this.tags.some((item, idx) => {
          if (idx !== index) {
            return value === item.value;
          }
        });
      } else {
        return true;
      }
    },
    validata(row, index) {
      const { value } = row;
      //新增可以直接判断 但是编辑不能
      //编辑的当前值 那么永远会返回存在 需要剔除
      // 传入当前index 与 遍历的idx 完全不相等的时候判断
      if (this.isRepeat(value, index)) {
        this.$message("请你输入一个正常的属性值");
        return;
      } else {
        row.flag = false;
      }
    },
    // 通过列表跳转到编辑属性页
    toEditCell(row){
      this.isShowTable = false;
      const tags = row.tags.map((item)=>{
        return item = {
          value: item,
          flag: false,
        }
      })
      this.tags =tags;
    },
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    addAttr() {
      const value = this.attrInfo.title;

      if (this.isRepeat(value)) {
        this.$message("请你输入一个正常的属性值");
        return;
      } else {
        this.tags.push({
          value: value,
          flag: true,
        });
        this.$nextTick(() => {
          this.attrInfo.title = "";
          this.$refs[this.tags.length - 1].focus();
        });
      }
    },
    removeCell(index){
      this.attrList.splice(index,1)
      this.$message({
             type: "success",
              message: "已删除",
           })
    },
    deleteAttrValue(index) {
      this.tags.splice(index, 1);
     this.$message({
          type: "success",
          message: "已删除",
        })
    },
    getCategoryId({ categoryId, level }) {
      this.getData({ categoryId, level });
    },
  },
};
</script>
    