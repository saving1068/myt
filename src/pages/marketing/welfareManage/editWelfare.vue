<template>
    <div class="edit">
        <el-upload ref="myUploader" multiple drag list-type="picture-card" :action="`/sellerstaff/doWtExcel?adviserId=2345`" name="fileName"
            :limit="49" :on-exceed="exceed" :on-preview="handlePictureCardPreview" :on-success="handleSuccess"
            :before-upload="beforeUpload" :on-remove="handleRemove">
            <i class="el-icon-plus">
                <span style="font-size: 12px;">
                    拖放或点击上传</span>
            </i>
        </el-upload>

    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogImageUrl: '',
            insertImagesDialogVisible: false,
            picVisible: false,
            name: '03-example',
            content: '',
            editorOption: {
                placeholder: '一篇 “颜值担当” 的详情能大大提升商品的购买率，赶紧开始编辑吧 ...（点击 第一个图标 开始上传商品详情图片）',
                modules: {
                    toolbar: '#toolbar'
                }
            },
            uploadParams: {
                adviserId: '123'
            },
            picList: [],
            sizeSum: 0
        }
    },
    methods: {
        setContent(content) {
            let quill = this.$refs.myQuillEditor.quill;
            // quill.setContents(content);
            // console.log(this.$refs.myQuillEditor);
            quill.root.innerHTML = content;
            // this.content = content;
        },
        getContent() {
            let quill = this.$refs.myQuillEditor.quill;
            // return quill.getContents();
            return quill.root.innerHTML;
        },
        // beforeRemove(file, fileList) {
        //     return this.$confirm(`确定移除 ${file.name}？`);
        // },
        handleSuccess(res, file, fileList) {
            // console.log('res', res, 'file', file, 'fileList', fileList);
            this.picList.push({ url: file.response.url, uid: file.uid });
            this.sizeSum += file.size;
        },
        isErrorTxt(file, size = 3) {
            const isFileType =
                file.type &&
                "image/jpg,image/jpeg,image/gif,image/png".indexOf(file.type) > -1;
            // console.log(file.type);
            if (!isFileType) {
                this.$message.error("仅支持上传jpg、png和gif格式的图片。");
                return true;
            }
            const isSize = file.size / 1024 / 1024 < size;
            if (!isSize) {
                const _size = size >= 1 ? size + "M" : size * 1000 + "K";
                this.$message.error(`单张图片大小不能超过 ${_size}！`);
                return true;
            }
            return false;
        },
        beforeUpload(file) {
            // console.log('before:', file);
            // if (this.isErrorTxt(file, 5)) return false;
            // this.uploadParams.id = file.uid;
            // this.uploadParams.name = file.name;
            // this.uploadParams.type = file.type;
            // this.uploadParams.lastModifiedDate = file.lastModifiedDate;
            // this.uploadParams.size = file.size;
        },
        handleRemove(file, fileList) {
            // console.log(file, fileList);
            let index = this.picList.findIndex(a => a.uid == file.uid);
            if (index != -1) {
                this.picList.splice(index, 1);
            }
            this.sizeSum -= file.size;
        },
        insertPics() {
            // console.log(this.picList);
            let quill = this.$refs.myQuillEditor.quill;
            quill.focus();
            // console.log(quill.getSelection());
            for (let i = 0; i < this.picList.length; i++) {
                let length = quill.getSelection().index;
                // // 插入图片  res.info为服务器返回的图片地址
                quill.insertEmbed(length, 'image', this.picList[i].url)
                // // 调整光标到最后
                quill.setSelection(length + 1);
            }
            this.insertImagesDialogVisible = false;
            this.picList.splice(0, this.picList.length);
            this.$refs.myUploader.clearFiles();
        },
        onEditorBlur(editor) {
            // console.log('editor blur!', editor)
        },
        onEditorFocus(editor) {
            // console.log('editor focus!', editor)
        },
        onEditorReady(editor) {
            // console.log('editor ready!', editor)
        },
        customButtonClick() {
            this.insertImagesDialogVisible = true;
        },
        exceed(file, fileList) {
            return this.$notify({
                message: '单次批量上次不超过50张，如果还有更多图片，请分批上传。',
                type: 'warning',
            });
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.picVisible = true;
        }
    }
}
</script>
