<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="名俗编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getCultureById">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="cultures" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="id" label="编号" width="100" sortable>
            </el-table-column>
            <el-table-column prop="cultureName" label="名称" width="190" sortable>
            </el-table-column>
            <el-table-column prop="cultureLevel" label="级别" width="180" sortable>
            </el-table-column>
            <el-table-column prop="address.addressName" label="收录地址" width="180" sortable>
            </el-table-column>
            <el-table-column prop="typee.typeName" label="类别" width="180" sortable >
            </el-table-column>
            <el-table-column prop="createTime" label="收录时间" min-width="120" sortable>
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
                <el-form-item label="名称" prop="cultureName">
                    <el-input v-model="editForm.cultureName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="级别" >
                    <el-radio-group v-model="editForm.cultureLevel">
                        <el-radio label="国家级非遗文化"></el-radio>
                        <el-radio label="河南省级非遗文化"></el-radio>
                        <el-radio label="市级非遗文化"></el-radio>
                        <el-radio label="地方特色文化"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="收录地址">
                    <el-select v-model="editForm.addressId">
                        <el-option label="郑州" value="1"></el-option>
                        <el-option label="安阳" value="2"></el-option>
                        <el-option label="新乡" value="3"></el-option>
                        <el-option label="鹤壁" value="4"></el-option>
                        <el-option label="濮阳" value="5"></el-option>
                        <el-option label="洛阳" value="6"></el-option>
                        <el-option label="南阳" value="7"></el-option>
                        <el-option label="开封" value="8"></el-option>
                        <el-option label="商丘" value="9"></el-option>
                        <el-option label="驻马店" value="10"></el-option>
                        <el-option label="周口" value="11"></el-option>
                        <el-option label="三门峡" value="12"></el-option>
                        <el-option label="焦作" value="13"></el-option>
                        <el-option label="平顶山" value="14"></el-option>
                        <el-option label="许昌" value="15"></el-option>
                        <el-option label="漯河" value="16"></el-option>
                        <el-option label="济源" value="17"></el-option>
                        <el-option label="信阳" value="18"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别">
                    <el-select v-model="editForm.typeId">
                        <el-option label="传统音乐" value="1"></el-option>
                        <el-option label="传统舞蹈" value="2"></el-option>
                        <el-option label="传统技艺" value="3"></el-option>
                        <el-option label="传统曲艺" value="4"></el-option>
                        <el-option label="传统风俗" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收录时间">
                    <el-col :span="11">
                        <el-date-picker
                                v-model="editForm.createTime" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-col>
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
                <el-form-item label="名称" prop="cultureName">
                    <el-input v-model="addForm.cultureName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="文化简介">
                    <el-input type="textarea" v-model="addForm.cultureDescription" :rows="6" placeholder="请输入文化简介"></el-input>
                </el-form-item>
                <el-form-item label="级别" >
                        <el-radio-group v-model="addForm.cultureLevel">
                            <el-radio label="国家级非遗文化"></el-radio>
                            <el-radio label="河南省级非遗文化"></el-radio>
                            <el-radio label="市级非遗文化"></el-radio>
                            <el-radio label="地方特色文化"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="收录地址">
                    <el-select v-model="addForm.addressId" placeholder="请选择收录地址">
                        <el-option label="郑州" value="1"></el-option>
                        <el-option label="安阳" value="2"></el-option>
                        <el-option label="新乡" value="3"></el-option>
                        <el-option label="鹤壁" value="4"></el-option>
                        <el-option label="濮阳" value="5"></el-option>
                        <el-option label="洛阳" value="6"></el-option>
                        <el-option label="南阳" value="7"></el-option>
                        <el-option label="开封" value="8"></el-option>
                        <el-option label="商丘" value="9"></el-option>
                        <el-option label="驻马店" value="10"></el-option>
                        <el-option label="周口" value="11"></el-option>
                        <el-option label="三门峡" value="12"></el-option>
                        <el-option label="焦作" value="13"></el-option>
                        <el-option label="平顶山" value="14"></el-option>
                        <el-option label="许昌" value="15"></el-option>
                        <el-option label="漯河" value="16"></el-option>
                        <el-option label="济源" value="17"></el-option>
                        <el-option label="信阳" value="18"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别">
                    <el-select v-model="addForm.typeId" placeholder="请选择收藏品类别">
                            <el-option label="传统音乐" value="1"></el-option>
                            <el-option label="传统舞蹈" value="2"></el-option>
                            <el-option label="传统技艺" value="3"></el-option>
                            <el-option label="传统曲艺" value="4"></el-option>
                            <el-option label="传统风俗" value="5"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="收录时间">
                    <el-col :span="11">
                        <el-date-picker
                                v-model="addForm.createTime" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-col>
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
    export default {
        data() {
            return {
                filters: {
                    id: ''
                },
                cultures: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    cultureName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: "",
                    cultureName: '',
                    cultureLevel: '',
                    addressId:'',
                    typeId:'',
                    createTime:''
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    cultureName: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    cultureName: '',
                    cultureLevel: '',
                    addressId: '',
                    typeId: '',
                    createTime:'',
                    cultureDescription:''
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
            getCulture() {
                let para = {
                    page: this.page,
                    id: this.filters.id,
                };
                this.listLoading = true;
                //NProgress.start();
                this.$axios({
                    methods:"get",
                    url:"/api/culture/findAllCulture",
                }).then((res) => {
                    //this.total = res.data.total;
                    this.cultures = res.data.data;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //通过id获得Display
            getCultureById(){
                let para = {
                    page: this.page,
                    name: this.filters.name,
                };
                this.listLoading = true;
                //NProgress.start();
                if(para.name != ""){
                    this.$axios({
                        methods:"get",
                        url:"/api/culture/findCultureByName",
                        params:{
                            name:para.name
                        }
                    }).then((res) => {
                        console.log(res.data.data.id);
                        var list = res.data.data;;
                        this.cultures = list;
                        this.listLoading = false;
                    })
                        .catch((error) => {
                            this.$message({
                                message: '记录不存在',
                                type: 'error'
                            });
                        });
                }else {
                    this.getCulture();
                }

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
                        url: "/api/culture/deleteById",
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
                        this.getCulture();
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
                            para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd hh:mm:ss');
                            this.$axios({
                                method:"post",
                                url:"/api/culture/saveOrupdateCulture",
                                params: {
                                    id:para.id,
                                    cultureName: para.cultureName,
                                    cultureLevel: para.cultureLevel,
                                    addressId: para.addressId,
                                    typeId: para.typeId,
                                    creat:para.createTime
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
                                this.getCulture();
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
                            para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd hh:mm:ss');
                            this.$axios({
                                method:"post",
                                url:"/api/culture/saveOrupdateCulture",
                                params:{
                                    cultureName: para.cultureName,
                                    cultureLevel: para.cultureLevel,
                                    addressId: para.addressId,
                                    typeId: para.typeId,
                                    cultureDescription:para.cultureDescription,
                                    creat:para.createTime
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
                                this.getCulture();
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
                        this.getCulture();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getCulture();
        }
    }

</script>

<style scoped>
    </style>