<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="展厅名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getDigitalByname">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="digitals" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="编号" width="100" sortable>
      </el-table-column>
      <el-table-column prop="digitalName" label="展厅名称" width="120" sortable>
      </el-table-column>
      <el-table-column prop="createUser" label="展厅描述" width="150" sortable>
      </el-table-column>
      <el-table-column prop="updateUser" label="展览件数" width="120" sortable>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="updateTime" label="修改时间" min-width="150" sortable>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="ID">
          <el-input v-model="editForm.id" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="展厅名称" prop="digitalName">
          <el-input v-model="editForm.digitalName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="展厅描述">
          <el-input v-model="editForm.createUser" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="展览件数">
          <el-input v-model="editForm.updateUser" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="editForm.createTime" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="editForm.updateTime" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="展厅名称" prop="digitalName">
          <el-input v-model="addForm.digitalName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="展厅描述">
          <el-input v-model="addForm.createUser" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="展览件数">
          <el-input v-model="addForm.updateUser" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        digitals: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          digitalName: [
            { required: true, message: '请输入展厅名称', trigger: 'blur' }
          ]
        },
        //编辑界面数据
        editForm: {
          id:"",
          digitalName:'',
          createUser:'',
          updateUser:'',
          createTime:'',
          updateTime:''
        },
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          digitalName: [
            { required: true, message: '请输入展厅名称', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          digitalName:'',
          createUser: '',
          updateUser: '',
        }

      }
    },
    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getUsers();
      },
      //获取展厅列表
      getDigitalByname() {
        var searchName = {name:this.filters.name};
        this.$axios({
          method:"get",
          url:"/api/digital/findByWord",
          params:{
            name:searchName.name
          }
        }).then(res =>{
          console.log(res);
          console.log(res.data.data);
          var list = res.data.data;
          console.log(list[0].adminName);
          this.digitals = list;
        })
                .catch(err =>{
                  console.log(err);
                })
      },
      //通过名字查询
      getUserByname:function(){
        var searchName = {name:this.filters.name};
        console.log("search="+searchName);
        this.$axios({
          methods:"get",
          url: "/api/Manager/findByName",
          params:{
            name:searchName.name
          }
        }).then(res =>{
          var list = res.data.data;
          this.users = list;
        })
                .catch(error => {
                  console.log(error);
                })
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          this.$axios({
            method:"delete",
            url: "/api/digital/deleteById",
            params:{
              id:para.id
            }
          }).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getDigitalByname();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        console.log("editForm"+this.editForm);
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        };
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              console.log("para"+para);
              para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd hh:mm:ss');
              para.updateTime = (!para.updateTime || para.updateTime == '') ? '' : util.formatDate.format(new Date(para.updateTime), 'yyyy-MM-dd hh:mm:ss');
              this.$axios({
                method:"post",
                url:"/api/digital/updateById",
                params: {
                  id: para.id,
                  digitalName: para.digitalName,
                  createUser: para.createUser,
                  updateUser: para.updateUser,
                  creat:para.createTime,
                  updatee:para.updateTime
                }
              }).then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                	message: '提交成功',
                	type: 'success'
                });
                console.log("res"+res);
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getDigitalByname();
              });
            });
          }
        });
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              let para = {digitalName:this.addForm.digitalName,updateUser:this.addForm.updateUser,createUser:this.addForm.createUser};
              //para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              this.$axios({
                method:"post",
                url:"/api/digital/addDigital",
                params: {
                  digitalName:para.digitalName,
                  createUser:para.createUser,
                  updateUser:para.updateUser
                }
              }).then((res) => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getDigitalByname();
              });
            });
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getDigitalByname();
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.getDigitalByname();
    }
  }

</script>

<style scoped>

</style>