<template>
    <el-upload 
        ref="uploader"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        name="fileName"
        :action="action"
        :data="params"
        :with-credentials="true"
        :show-file-list="false" 
        :limit="1"
        :before-upload="beforeUpload" 
        :on-success="handleSuccess"
        :on-error="handleError"
    >
        <slot></slot>
    </el-upload>
</template>



<script>
export default {
        props: {
            action: String,
            params: {
                type: Object
            },
            breforeUpload: Function,
            onSuccess: Function
        },
        data() {
            return {
                sizeSum: 0
            }
        },
        methods: {
            handleSuccess(res, file, fileList) {
                // console.log('res', res, 'file', file, 'fileList', fileList);
                this.sizeSum += file.size;

                const txt = res.errorMsg || '导入失败'

                // 上传异常数据
                const {content} = res

                if(res.resultCode !== 1){
                    this.$message.error(txt)
                }else{
                    this.$message.success(txt)
                }
                
                if(content && content.invalidMobile){
                    // console.log()
                    const noValidList = content.invalidMobile.split(',')

                    this.$notify({
                        title: '提示',
                        message: noValidList.length < 5 ? noValidList.join('\n') : `上传${noValidList.length}条异常线索`,
                        type: 'warning',
                        duration: 4000
                    })
                }

                this.onSuccess && this.onSuccess(res, file)
                this.$refs.uploader.clearFiles();

                this.$loading.hide()
            },
            isErrorTxt(file, size = 3) {
                const suffix = file.name.substr(file.name.lastIndexOf("."))

                if(".xls" != suffix && ".xlsx" != suffix ){    
                   return this.$message.error("选择Excel格式的文件！");
                }

                // const isSize = file.size / 1024 / 1024 < size;
                // if (!isSize) {
                //     const _size = size >= 1 ? size + "M" : size * 1000 + "K";
                //     this.$message.error(`单张图片大小不能超过 ${_size}！`);
                //     return true;
                // }
                return false;
            },
            beforeUpload(file) {
                // console.log('before:', file);
                
                if (this.isErrorTxt(file, 5)) return false;

                this.$loading.show('正在导入数据...')

                this.breforeUpload && this.breforeUpload(file, this.params)
                // this.uploadParams.id = file.uid;
                // this.uploadParams.name = file.name;
                // this.uploadParams.type = file.type;
                // this.uploadParams.lastModifiedDate = file.lastModifiedDate;
                // this.uploadParams.size = file.size;
            },
            handleError(e) {
                this.$message.error('导入数据失败,请重新检查Excel数据')
                this.$loading.hide()
            }
        }
    }
</script>