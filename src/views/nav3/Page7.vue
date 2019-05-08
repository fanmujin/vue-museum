<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" :rules="SerchRules">
				<el-form-item prop="name">
					<el-input v-model="filters.name" placeholder="学术名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getInstituteByName">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="institute" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" label="编号" width="100" sortable>
			</el-table-column>
			<el-table-column prop="reportName" label="Title" width="150" sortable>
			</el-table-column>
			<el-table-column prop="reportAuthor" label="作者" width="120" sortable>
			</el-table-column>
			<el-table-column prop="reportTime" label="发表时间" width="150" sortable>
			</el-table-column>
			<el-table-column prop="createUser" label="发表内容" width="150" sortable>
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
				<el-form-item label="Title" prop="reportName">
					<el-input v-model="editForm.reportName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="作者">
					<el-input v-model="editForm.reportAuthor" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="发表时间">
					<el-input v-model="editForm.reportTime" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="发表内容">
					<el-input v-model="editForm.createUser" auto-complete="off" ></el-input>
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
				<el-form-item label="Title" prop="reportName">
					<el-input v-model="addForm.reportName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="作者">
					<el-input  v-model="addForm.reportAuthor" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="发表时间">
					<el-input  v-model="addForm.reportTime" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="发表内容">
					<el-input  v-model="addForm.createUser" auto-complete="off"></el-input>
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
				institute: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				SerchRules:{
					name:[
						{ required: true, message: '请输入学术报告', trigger: 'blur'}
					]
				},
				editFormRules: {
					reportName: [
						{ required: true, message: '请输入学术报告名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id:"",
					reportName:'',
					reportTime:'',
					reportAuthor:'',
					createUser:'',
					createTime:'',
					updateTime:''
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					reportName: [
						{ required: true, message: '请输入学术报告名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					reportName:'',
					reportTime:'',
					reportAuthor:'',
					createUser:''
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
			getInstitute() {
				//var searchName = {name:this.filters.name};
				this.$axios({
					methods:"get",
					url:"/api/institutions/getAllInstitution",
				}).then(res =>{
					console.log(res);
					console.log(res.data.data);
					var list = res.data.data;
					this.institute = list;
				}).catch(err =>{
					console.log(err);
				})
			},
			//通过名字查询
			getInstituteByName(){
				var searchName = {name:this.filters.name};
				this.$axios({
					methods:"get",
					url: "/api/institutions/findByName",
					params:{
						name:searchName.name
					}
				}).then(res =>{
					var list = res.data.data;
					this.institute = list;
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
						method:"get",
						url: "/api/institutions/deleteById",
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
						this.getNotify();
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
					reportName:'',
					reportTime:'',
					reportAuthor:'',
					createUser:''
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
							this.$axios({
								method:"post",
								url:"/api/institutions/updateById",
								params: {
									id: para.id,
									reportName: para.reportName,
									reportTime: para.reportTime,
									reportAuthor: para.reportAuthor,
									createUser:para.createUser,
									creat:para.createTime
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
								this.getInstitute();
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
							let para = {reportName:this.addForm.reportName,reportTime:this.addForm.reportTime,
								reportAuthor:this.addForm.reportAuthor,createUser:this.addForm.createUser};
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							this.$axios({
								method:"post",
								url:"/api/institutions/insertInstitution",
								params: {
									reportName:para.reportName,
									reportAuthor:para.reportAuthor,
									reportTime:para.reportTime,
									createUser:para.createUser
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
								this.getInstitute();
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
						this.getNotify();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getInstitute();
		}
	}

</script>

<style scoped>

</style>