<template>
	<div>
		<div>
			<section class="data_section">
				<header class="section_title">数据统计</header>
				<el-row :gutter="20" style="margin-bottom: 10px;">
					<el-col :span="4"><div class="data_list today_head"><span class="data_num head">当日数据：</span></div></el-col>
					<el-col :span="4"><div class="data_list"><span class="data_num">3</span> 新增名俗</div></el-col>
					<el-col :span="4"><div class="data_list"><span class="data_num">2</span> 新增访客</div></el-col>
					<el-col :span="4"><div class="data_list"><span class="data_num">1</span> 新增管理员</div></el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="4"><div class="data_list all_head"><span class="data_num head">总数据：</span></div></el-col>
					<el-col :span="4"><div class="data_list"><span class="data_num">43</span> 收录名俗</div></el-col>
					<el-col :span="4"><div class="data_list"><span class="data_num">289</span> 访客</div></el-col>
					<el-col :span="4"><div class="data_list"><span class="data_num">27</span> 管理员</div></el-col>
				</el-row>
			</section>
		</div>
		<div>
			<tendency></tendency>
		</div>
	</div>
</template>

<script>
	import tendency from "./charts/tendency"
	export default {
		data:{

		},
		components:{
			tendency
		}
	}
</script>

<style lang="less">
	@import '../styles/mixin.less';
	.data_section {
		padding: 20px;
		margin-bottom: 40px;
	}
	.section_title{
		text-align: center;
		font-size: 30px;
		margin-bottom: 10px;
	}
	.data_list {
		text-align: center;
		font-size: 14px;
		color: #666;
		border-radius: 6px;
		background: #E5E9F2;
	}
	.data_num{
		color: #333;
		font-size: 26px;

	}
	.head{
		border-radius: 6px;
		font-size: 22px;
		padding: 4px 0;
		color: #fff;
		display: inline-block;
	}
	.today_head{
		background: #FF9800;
	}
	.all_head{
		background: #20A0FF;
	}
	.wan{
	.sc(16px, #333)
	}
</style>
