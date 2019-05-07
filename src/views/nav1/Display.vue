<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.id" placeholder="展览编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getDisplayById">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="diaplays" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="id" label="编号" width="100" sortable>
            </el-table-column>
            <el-table-column prop="displayTitle" label="展览名称" width="190" sortable>
            </el-table-column>
            <el-table-column prop="diapalyStartdate" label="开始时间" width="180" sortable>
            </el-table-column>
            <el-table-column prop="displayEnddate" label="结束时间" width="180" sortable>
            </el-table-column>
            <el-table-column prop="desc" label="展览项目" width="180" sortable >{{list}}
            </el-table-column>
            <el-table-column prop="resource" label="主办方" min-width="120" sortable>河南非遗网
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
                <el-form-item label="展览名称" prop="displayTitle">
                    <el-input v-model="editForm.displayTitle" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="展览时间">
                    <el-col :span="11">
                        <el-date-picker
                                v-model="editForm.diapalyStartdate" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">至</el-col>
                    <el-col :span="11">
                        <el-date-picker
                                v-model="editForm.displayEnddate" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="主办方">
                    <el-input  v-model="editForm.resource" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="会展内容">
                    <el-input type="textarea" v-model="editForm.desc"></el-input>
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
                <el-form-item label="展览名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-radio-group v-model="addForm.sex">
                        <el-input-number v-model="addForm.birth" :min="0" :max="200"></el-input-number>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-input-number v-model="addForm.birth" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="展览项目">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="主办方">
                    <el-input type="textarea" v-model="addForm.addr"></el-input>
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
                    id: ''
                },
                diaplays: [],
                list:'凤翔泥塑、刀书画、桃符手工、木板彩烙、拓片、亿凡浮雕、布艺口金包、' +
                    '葫芦烙画、白手篆刻、锦玉麦草画、中国结艺、动物标本制作、吹糖人、木版年画、' +
                    '手工纸雕、依山堂钧窑项目',
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    displayTitle: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: "",
                    displayTitle: '',
                    diapalyStartdate: '',
                    displayEnddate: '',
                    resource: '',
                    desc:''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
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
            //获取展览列表
            getDisplay() {
                let para = {
                    page: this.page,
                    id: this.filters.id,
                };
                this.listLoading = true;
                //NProgress.start();
                this.$axios({
                    methods:"get",
                    url:"/api/dispaly/findAllDisplay",
                }).then((res) => {
                    //this.total = res.data.total;
                    this.diaplays = res.data.data;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //通过id获得Display
            getDisplayById(){
                let para = {
                    page: this.page,
                    id: this.filters.id,
                };
                this.listLoading = true;
                //NProgress.start();
                this.$axios({
                    methods:"get",
                    url:"/api/dispaly/findDisplayById",
                    params:{
                        id:para.id
                    }
                }).then((res) => {
                    //this.total = res.data.total;
                    console.log(res);
                    console.log(res.data.data);
                    var list = [];
                    list[0] = res.data.data;
                    this.diaplays = list;
                    this.listLoading = false;
                    //NProgress.done();
                });
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
                        url: "/api/dispaly/deleteById",
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
                        this.getDisplay();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
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
                            para.diapalyStartdate = (!para.diapalyStartdate || para.diapalyStartdate == '') ? '' : util.formatDate.format(new Date(para.diapalyStartdate), 'yyyy-MM-dd hh:mm:ss');
                            para.displayEnddate = (!para.displayEnddate || para.displayEnddate == '') ? '' : util.formatDate.format(new Date(para.displayEnddate), 'yyyy-MM-dd hh:mm:ss');
                            console.log("start"+para.diapalyStartdate);
                            this.$axios({
                                method:"post",
                                url:"/api/dispaly/updateDisplay",
                                params: {
                                    id:para.id,
                                    displayTitle:para.displayTitle,
                                    start : para.diapalyStartdate,
                                    end : para.displayEnddate,
                                    displayContend : para.desc
                                }
                            }).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getDisplay();
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
                            let para = Object.assign({}, this.addForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            addUser(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getUsers();
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
                        this.getUsers();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getDisplay();
        }
    }

</script>

<style scoped>

</style>