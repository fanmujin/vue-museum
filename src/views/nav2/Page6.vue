<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-model="http://www.w3.org/1999/xhtml">
    <section>
        <!--文件上传工具栏-->
    <el-form :model="form">
        <!--:on-success="handleSuccess"-->
        <!--:on-error="handleError"-->
        <el-form-item label="上传文件" :label-width="formLabelWidth">
            <el-upload
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :limit=limitNum
                    :auto-upload="false"
                    accept=type
                    :before-upload="beforeUploadFile"
                    :on-change="fileChange"
                    :on-exceed="exceedFile"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :file-list="fileList"
                    list-type="picture">
                <el-button size="small" plain>选择文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传png文件，且不超过10M</div>
            </el-upload>
        </el-form-item>
        <el-form-item>
            <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
            <el-button size="small">取消</el-button>
        </el-form-item>
    </el-form>
        <!--信息展示表格-->
    <template>
        <el-table :data="videos" highlight-current-row v-loading="loading" style="width: 100%;">
                    <el-table-column prop="id" label="编号" width="100" sortable>
                    </el-table-column>
                    <el-table-column prop="videoName" label="图片名称" width="120">
                    </el-table-column>
                    <el-table-column prop="videoUrl" label="视频详情" >
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
                            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
            </el-table>
        </template>
        <!--详情界面-->
        <el-dialog title="查看" v-model="showFormVisible" :close-on-click-modal="false">
            <el-form :model="showForm" label-width="80px" ref="showForm">
                <el-form-item label="ID">
                    <el-input v-model="showForm.id" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="视频名称">
                    <el-input v-model="showForm.videoName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="视频详情" prop="videoUrl">
                    <video id="myVideo" class="video-js" style="width: 500px;height: 300px">
                        <source src="http://localhost:8080//video/video-1557918351036-2.mp4"  type="video/mp4">
                    </video>
                    <el-input v-model="showForm.videoUrl" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="showFormVisible = false">取消</el-button>
                <el-button type="danger" size="small" @click="handeldel(showForm.id)">删除</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import axios from "axios"
    export default {
        data() {
            return {
                limitNum: 1,
                type:"",
                formLabelWidth: '80px',
                form: {
                    file: '',
                    fileName:''
                },
                listLoading: false,
                fileList: [],
                videos:[],
                loading: true,
                imgUrl:'http://localhost:8080//video/video-1557908328659-01.png',
                showFormVisible: false,//详情界面是否显示
                showLoading: false,
                //编辑界面数据
                showForm: {
                    id:"",
                    videoName:'',
                    videoUrl:''
                },
               }
        },
        methods: {
            // 文件超出个数限制时的钩子
            exceedFile(files, fileList) {
                this.$notify.warning({
                    title: '警告',
                    message: `只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`
                });
            },
            // 文件状态改变时的钩子
            fileChange(file, fileList) {
                console.log('change')
                console.log(file)
                this.form.file = file.raw
                console.log(this.form.file)
                console.log(fileList)
            },
            // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
            beforeUploadFile(file) {
                console.log('before upload')
                console.log(file)
                let extension = file.name.substring(file.name.lastIndexOf('.')+1)
                let size = file.size / 1024 / 1024
                if(extension == '') {
                    this.$notify.warning({
                        title: '警告',
                        message: `只能上传png的文件`
                    });
                }
                if(size > 10) {
                    this.$notify.warning({
                        title: '警告',
                        message: `文件大小不得超过10M`
                    });
                }
            },
            // 文件上传成功时的钩子
            handleSuccess(res, file, fileList) {
                this.$notify.success({
                    title: '成功',
                    message: `文件上传成功`
                });
            },
            // 文件上传失败时的钩子
            handleError(err, file, fileList) {
                this.$notify.success({
                    title: '成功',
                    message: `文件上传成功`
                });
            },
            uploadFile() {
                this.$refs.upload.submit();
                let formData = new FormData();
                formData.append('file', this.form.file);
                console.log(formData.get('file'));
                let headers = {headers: {"Content-Type": "multipart/form-data"}}//添加请求头
                axios.post("/api/Video/addVideo",formData,headers).then(res => {
                  console.log('res');
                  console.log(res);
                  this.findFile();
                })
                    .catch(err => {
                        console.log(err);
                })
            },
            //展示所有的文件信息
            findFile(){
                this.$axios({
                    methods: "get",
                    url: "/api/Video/findAllVideo",
                }).then(res =>{
                    var list = res.data.data
                    this.loading = false;
                    list.forEach((item)=>{
                        item.videoUrl = "http://localhost:8080/"+item.videoUrl;
                    })
                    this.videos = list
                })
            },
            handleShow: function (index, row) {
                this.showFormVisible = true;
                this.showForm = Object.assign({}, row);
                this.initVideo();
                console.log("showForm"+this.showForm);

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
                        url: "/api/Video/deleteById",
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
                        this.findFile();
                    });
                }).catch(() => {

                });
            },
            handeldel:function (id) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: id };
                    this.$axios({
                        method:"delete",
                        url: "/api/Video/deleteById",
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
                        this.showFormVisible = false;
                        this.findFile();
                    });
                }).catch(() => {

                });
            },
            initVideo() {
                //初始化视频方法
                let myPlayer = this.$video(myVideo, {
                    //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
                    controls: true,
                    //自动播放属性,muted:静音播放
                    autoplay: "muted",
                    //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
                    preload: "auto",
                    //设置视频播放器的显示宽度（以像素为单位）
                    width: "600px",
                    //设置视频播放器的显示高度（以像素为单位）
                    height: "400px"
                });
            }
        },
        mounted(){
            this.findFile();
        }
    }
</script>

<style>

</style>