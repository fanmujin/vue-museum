<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="展览名称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="展厅">
			<el-select v-model="form.region" placeholder="请选择展览区">
				<el-option label="展厅一" value="1"></el-option>
				<el-option label="展厅二" value="2"></el-option>
				<el-option label="展厅三" value="3"></el-option>
				<el-option label="展厅四" value="4"></el-option>
				<el-option label="展厅五" value="5"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="展览时间">
			<el-col :span="11">
				<el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
			</el-col>
			<el-col class="line" :span="2">-</el-col>
			<el-col :span="11">
				<el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
			</el-col>
		</el-form-item>
		<el-form-item label="结束时间">
			<el-col :span="11">
				<el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
			</el-col>
			<el-col class="line" :span="2">-</el-col>
			<el-col :span="11">
				<el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
			</el-col>
		</el-form-item>
		<el-form-item label="展览性质">
			<el-checkbox-group v-model="form.type">
				<el-checkbox label="艺术品展览" name="type"></el-checkbox>
				<el-checkbox label="音乐展览" name="type"></el-checkbox>
				<el-checkbox label="主题展览" name="type"></el-checkbox>
				<el-checkbox label="其他" name="type"></el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="主办单位">
			<el-radio-group v-model="form.resource">
				<el-radio label="河南非遗文创联盟"></el-radio>
				<el-radio label="河南非物质文化遗产网"></el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="会展内容">
			<el-input type="textarea" v-model="form.desc"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="create">立即创建</el-button>
			<el-button @click="clear">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			create:function () {
				alert("创建成功");
				this.form = {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			},
			clear:function () {
				this.form = {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		}
	}

</script>