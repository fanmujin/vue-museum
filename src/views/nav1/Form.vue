<template>
	<el-form ref="form" :model="form1" label-width="80px" @submit.prevent="onSubmit" :rules="addFormRules" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="展览名称" prop="name">
			<el-input v-model="form1.name"></el-input>
		</el-form-item>
		<el-form-item label="展厅">
			<el-select v-model="form1.region" placeholder="请选择展览区">
				<el-option label="展厅一" value="1"></el-option>
				<el-option label="展厅二" value="2"></el-option>
				<el-option label="展厅三" value="3"></el-option>
				<el-option label="展厅四" value="4"></el-option>
				<el-option label="展厅五" value="5"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="展览时间">
			<el-col :span="11">
				<el-date-picker
						v-model="form1.date1" type="datetime" placeholder="选择日期时间">
				</el-date-picker>
			</el-col>
			<el-col class="line" :span="2">至</el-col>
			<el-col :span="11">
				<el-date-picker
						v-model="form1.date2" type="datetime" placeholder="选择日期时间">
				</el-date-picker>
			</el-col>
		</el-form-item>
		<el-form-item label="展览性质">
			<el-checkbox-group v-model="form1.type">
				<el-checkbox label="艺术品展览" name="type"></el-checkbox>
				<el-checkbox label="音乐展览" name="type"></el-checkbox>
				<el-checkbox label="主题展览" name="type"></el-checkbox>
				<el-checkbox label="其他" name="type"></el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="主办单位">
			<el-radio-group v-model="form1.updateUser">
				<el-radio label="河南非遗文创联盟"></el-radio>
				<el-radio label="河南非物质文化遗产网"></el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="会展内容">
			<el-input type="textarea" v-model="form1.createUser"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="createDiaplay">立即创建</el-button>
			<el-button @click="clear">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	import util from '../../common/js/util'
	export default {
		data() {
			return {
				form1: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					updateUser: '',
					createUser: ''
				},
				addFormRules: {
					name: [
						{ required: true, message: '请输入展览名称', trigger: 'blur' }
					]
				},
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			createDiaplay:function () {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.form1);
							if(para.date1>para.date2){
								//判断时间是否正确
								this.$message({
									message: '起始时间错误',
									type: 'error'
								});
							}else{
								para.date1 = (!para.date1 || para.date1 == '') ? '' : util.formatDate.format(new Date(para.date1), 'yyyy-MM-dd hh:mm:ss');
								para.date2 = (!para.date1 || para.date2 == '') ? '' : util.formatDate.format(new Date(para.date2), 'yyyy-MM-dd hh:mm:ss');
								console.log("para"+para.name);
								this.$axios({
									method:"post",
									url:"/api/dispaly/addDisplay",
									params:{
										displayTitle:para.name,
										start : para.date1,
										end : para.date2,
										createUser : para.createUser,
										updateUser:para.updateUser
									}
								}).then((res) => {
									this.addLoading = false;
									//NProgress.done();
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.clear();
								})
							}
						});
					}
				});
			},
			clear:function () {
				this.form1 = {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					updateUser: '',
					createUser: ''
				}
			}
		}
	}

</script>