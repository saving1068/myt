<template>
    <div class="advert-manamge page-container">
        <panel>
            <template slot="head">
                <div class="left"><span class="title">广告位列表</span></div>
                <div class="right">
                    <el-button type="info" size="mini">广告位BI数据</el-button>
                </div>
            </template>
            <div class="advert-contents" v-loading="loading">
                <ul class="advert-list clearfix">
                    <li v-for="(item, index) in list" :key="index" :class="'ad-item_'+index">
                        <div class="head"><span>{{item.title}}</span></div>
                        <div class="content flex">
                            <div class="left ad-show-area">
                                <template v-if="item.type == 1 || item.type == 2 || item.type == 3">
                                    <img src="~assets/ad/taofuli.png" class="img" width="220" height="400">
                                </template>
                                <template v-else-if="item.type == 4">
                                    <img src="~assets/ad/shop.png" class="img" width="220" height="400">
                                </template>
                                <template v-else-if="item.type == 5">
                                    <img src="~assets/ad/center.png" class="img" width="220" height="400">
                                </template>
                                <template v-else-if="item.type == 6">
                                    <img src="~assets/ad/adviser.png" class="img" width="220" height="400">
                                </template>
                                <template v-else-if="item.type == 7 || item.type == 8">
                                    <img src="~assets/ad/detail.png" class="img" width="220" height="400">
                                </template>
                                <template v-else>
                                    <img src="~assets/ad/detail.png" class="img" width="220" height="400">
                                </template>
                                <div class="ad-show-mask"></div>
                                <div class="ad-child" :style="{top: item.imgTop + 'px'}"  :class="{radius: item.type != 1}">
                                    <img v-if="item.picture" class="previwe-img" :src="setImgPath(item.picture)" :style="{width: item.imgWidth + 'px', height: item.imgHeight + 'px'}" >
                                    <div v-else class="no-adimg" :style="{width: item.imgWidth + 'px', height: item.imgHeight + 'px'}">
                                        <img class="previwe-img" src="~assets/no_ad.jpg" />
                                    </div>
                                    <i v-if="item.type == 1" class="el-icon-circle-close-outline ad-img-close"></i>
                                </div>
                            </div>
                            <div class="right col">
                                <el-form label-position="top" label-width="150px" size="mini">
                                    <el-form-item label="点击总量">
                                        {{item.clickNum}}
                                    </el-form-item>
                                    <el-form-item label="当前推广内容">
                                        {{item.extendContent}}
                                    </el-form-item>
                                    <el-form-item label="投放状态">
                                        <el-tag :type="item.status | getStatusType">{{item.status | getStatus}}</el-tag>
                                    </el-form-item>
                                    <el-form-item label="最后更新时间">
                                        {{item.dayTime}} {{item.hourTime}}
                                    </el-form-item>
                                </el-form>
                                <el-button v-if="isBtnPower('060302')" type="warning" class="adv-btn block textCenter" style="width:100%;" @click="adClick(item, index)">
                                    管理广告位
                                </el-button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </panel>

        <el-dialog :visible.sync="selectAdDialogVisible" :title="'编辑' + adInfo.title" width="1000px" top="40px" center class="car-dialog ad-dialog">
            <div class="car-type-content" v-loading="dialogLoading">
                 <el-form label-position="top" label-width="350px" size="mini">
                    <el-form-item label="第一步：先选定一个车系">
                        <ul class="car-type-list clearfix" v-if="carBrandList.length">
                            <li v-for="(item,index) in carBrandList" :key="index">
                                <car-type-item :item="item" :isSelected="item.isSelected" @select="selectBrandHandle" />
                            </li>
                        </ul>
                    </el-form-item>
                    <div class="hr"></div>
                    <el-form-item label="第二步：上传广告图">
                        <div class="ad-upload flex justify-content-spacebetween">
                            <div class="ad-upload__left">
                                <div class="title">上传活动封面</div>
                                <el-upload
                                    class="ad-uploader"
                                    v-loading="uploading"
                                    action=""
                                    :auto-upload="false"
                                    :show-file-list="false"
                                    accept="image/jpg,image/jpeg,image/gif,image/png" 
                                    :on-change="handleAdChange"
                                >
                                    <img v-if="queryParams.picture" :src="setImgPath(queryParams.picture)" class="upload-img">
                                    <i v-else class="el-icon-plus uploader-icon"></i>
                                </el-upload>
                                <p class="txt" v-if="adInfo">
                                    封面建议尺寸：<span>{{adInfo.type | getUploadSize}}</span><br>
                                    大小不超过2M，只能上传一张，点击可更换
                                </p>
                            </div>
                            <div class="ad-upload__right">
                                <div class="title">广告位效果示范</div>
                                <div class="ad-preview ad-show-area" ref="preview">
                                    
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                
                <no-data v-if="!carBrandList.length">暂无车系数据</no-data>
            </div>
            <div slot="footer" class="dialog-footer" v-if="carBrandList.length">
                <el-button style="display:block; width:100%;" type="warning" :loading="addLoading" @click="saveAdHandle">保存发布</el-button>
            </div>
        </el-dialog>

        <!--裁剪-->
        <el-dialog :visible.sync="cropperDialogVisible" :close-on-click-modal="false" width="1000px" top="40px" :title="'上传'+adInfo.title+'广告'">
            <div class="cropper-dialog" v-loading="cropperUploading">
                <div class="cropper-dialog-left">
                    <div class="cropper-box">
                        <vueCropper
                            class="adCropper"
                            ref="cropper"
                            :img="cropperParams.img"
                            :outputSize="cropperParams.size"
                            :outputType="cropperParams.outputType"
                            :info="true" 
                            :full="cropperParams.full"
                            :can-move="cropperParams.canMove" 
                            :can-move-box="cropperParams.canMoveBox" 
                            :fixed-box="cropperParams.fixedBox" 
                            :original="cropperParams.original"
                            :auto-crop="cropperParams.autoCrop" 
                            :auto-crop-width="cropperParams.autoCropWidth" 
                            :auto-crop-height="cropperParams.autoCropHeight" 
                            :center-box="cropperParams.centerBox"
                            :high="cropperParams.high"
                            @real-time="realTime"
                        ></vueCropper>
                    </div>
                    <div class="use-tip">可使用鼠标滚轮对图片放大、缩小</div>
                </div>
                <div class="cropper-dialog-right">
                    <h2>预览效果：</h2>
                    <div class="show-preview" :style="previewStyle">
                        <div :style="previews.div">
                            <img :src="previews.url" :style="previews.img">
                        </div>
                    </div>
                    <el-button style="margin-top:20px; width:100%;" type="warning" @click="uploadCropperImg">确定保存</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>


<script>
import Panel from '@/components/Panel'
import NoData from '@/components/NoData'
import CarTypeItem from '@/components/CarTypeItem'
import power from '@/mixins/power'
import { VueCropper }  from 'vue-cropper' 

import {setImgPath} from '@/utils'
import {getSaleBrandDtos, uploadPic} from '@/api/common'
import {getAdList, editAdInfo} from '@/api/advert'

const defaultParams = {
    busType: 1,
    type: '',
    busId: '',
    picture: '',
    adId: ''
}
export default {
    components: {Panel, CarTypeItem, NoData, VueCropper},
    mixins: [power],
    data() {
        return {
            loading: false,
            list: [],
            adInfo: '', // 广告信息

            // 编辑广告
            selectAdDialogVisible: false,
            carBrandList: [],
            dialogLoading: false,
            addLoading: false,
            uploading: false,

            setImgPath: setImgPath,

            queryParams: defaultParams,


            cropperDialogVisible: false,
            cropperUploading: false,
            previews: {},
            previewStyle: {},
            cropperParams: {
                img: '',
                size: 1,
                full: false,
                outputType: 'png',
                canMove: true,
                fixedBox: true,
                original: false,
                canMoveBox: true,
                autoCrop: true,
                // 只有自动截图开启 宽度高度才生效
                autoCropWidth: 200,
                autoCropHeight: 150,
                centerBox: false,
                high: true
            },

        }
    },
    async created() {
        await this.getPower('060302')
this.loading = true
        await this.getBrands()
        this.getData()
    },
    methods: {
        async getData() {
            this.loading = true
            try {
                const res = await getAdList()

                // 给图片宽高
                this.list = res.map(v => {
                    v.imgWidth = 210
                    v.imgHeight = parseInt(v.imgWidth * (v.height / v.width))
                    v.imgTop = this.getStyleTop(v.type)
                    return v
                })

            } catch (error) {
                console.error(error)
            }
            this.loading = false
        },
        async getBrands() {
            this.dialogLoading = true
            try {
                const brands = await getSaleBrandDtos({status:1})
                this.carBrandList = brands.map(v => {
                    v.isSelected = false
                    return v
                })
            } catch (error) {
                console.error(error)
            }
            this.dialogLoading = false
        },
        // type 1-登录页弹窗,2-首页[淘福利]位置A,3-首页[淘福利]位置B,4-[有好货]横幅,5-[我的]个人中心横幅，6－客户端顾问列表
        getStyleTop(type) {
            const o = {
                1: 100,
                2: 265,
                3: 265,
                4: 195,
                5: 220,
                6: 228,
                7: 275,
                8: 275,
                9: 275
            } 
            return o[type]
        },
        adClick(item, itemIndex) {
			console.log(item)
            // console.log(item, itemIndex)

            // 初始化
            this.queryParams = {...defaultParams}
            this.carBrandList.map(v => {
                v.isSelected = false
                return v
            })

            const {busType, busId, id, type, picture} = item

            this.adInfo = item
            this.queryParams.busType = busType || 1
            this.queryParams.type = type
            this.queryParams.picture = picture
            this.queryParams.busId = busId

            const cropperSize = this.getCopperSize(type)
            if(cropperSize){
                this.cropperParams.autoCropWidth = cropperSize.width
                this.cropperParams.autoCropHeight = cropperSize.height
            }

            // 如果编辑过，就有ID
            if(id){
                this.queryParams.adId = id
                // 选中对应的车系
                const brandIndex = this.carBrandList.findIndex(v => v.saleBrandId == busId);
				console.log(brandIndex)
                if(brandIndex >= 0){
					this.queryParams.busId = this.carBrandList[brandIndex].saleBrandId
                    this.carBrandList[brandIndex].isSelected = true

                // 请不到对应的车系，重新分配一个车系
                }else{
                    this.queryParams.busId = this.carBrandList[0].saleBrandId
                    this.carBrandList[0].isSelected = true
                }
                
            }

            // 设置预览图片内容
            this.$nextTick(_ => {
                const dom = document.querySelector('.ad-item_' + itemIndex)
                this.$refs.preview.innerHTML = dom.querySelector('.ad-show-area').innerHTML
            })

            this.selectAdDialogVisible = true
        },
        // 编辑广告保存
        async saveAdHandle() {
            // this.addLoading = true
            try {
                const params = {...this.queryParams}
				console.log(params)
                // 没选择车系 
                if(!params.busId){
                    return this.$message.error('请选择一个车系')
                }

                if(!params.picture){
                    return this.$message.error('请上传活动封面')
                }

                // console.log('.....',params)
                // return 

                const res = await editAdInfo(params)
                this.$message.success('编辑成功')
                this.getData()
                this.selectAdDialogVisible = false
            } catch (error) {
                console.error
            }
            this.addLoading = false
        },
        // 选择车系
        selectBrandHandle(item) {
            this.carBrandList.map(v => {
                v.isSelected = false
                return v
            })

            this.queryParams.busId = item.saleBrandId
            item.isSelected = !item.isSelected
        },
        // 上传图片
        handleAdChange(file, fileList) {
            
            //上传图片
            // this.option.img
            // var file = e.target.files[0]
            if (this.isErrorTxt(file, 2)){
                return false
            }

            var reader = new FileReader()
            reader.onload = (e) => {
                let data
                if (typeof e.target.result === 'object') {
                    // 把Array Buffer转化为blob 如果是base64不需要
                    data = window.URL.createObjectURL(new Blob([e.target.result]))
                } else {
                    data = e.target.result
                }

                this.cropperParams.img = data
                this.cropperDialogVisible = true
            }
            // 转化为base64
            // reader.readAsDataURL(file.raw)
            // 转化为blob
            reader.readAsArrayBuffer(file.raw)
            return 




            // if (this.isErrorTxt(file, 2)){
            //     return false
            // }

            // let _this = this
            // let reader = new FileReader()

            // reader.onload = function (e) {
            //     let data = e.target.result
            //     //加载图片获取图片真实宽度和高度
            //     let image = new Image()
            //     image.onload = async function (e) {
            //         console.log(image.width + 'x' + image.height)
            //         const isPix = image.width >= 400 && image.height >= 400

            //         _this.uploading = true
            //         try {
            //             const res = await uploadPic({picUrl: e.target.src})
            //             _this.queryParams.picture = res.filePath

            //             // 设置预览图片
            //             const imgDom = _this.$refs.preview.querySelector('.previwe-img')
            //             if(imgDom.parentNode.classList.contains('no-adimg')){
            //                 imgDom.parentNode.classList.remove('no-adimg')
            //             }
            //             imgDom.setAttribute('src', setImgPath(res.filePath))
            //         } catch (error) {
            //             console.error(error)
            //         }
            //         _this.uploading = false
                    
            //     };
            //     image.src = data
            // };
            // reader.readAsDataURL(file.raw)
        },
        // 实时预览函数
        realTime(data) {
            const h = 0.5;
            const w = 0.2;
            const params = {
                width: data.w + "px",
                height: data.h + "px",
                overflow: "hidden",
                margin: "0",
                '-moz-transform': '-moz-transform-origin',
                '-moz-transform': 'scale(0.5)',
        　　    '-moz-transform-origin': 'top left',
                zoom: h
            };

            this.previewStyle = params
            this.previews = data
        },
        uploadCropperImg() {
            this.$refs.cropper.getCropData(async (data) => {
                this.cropperUploading = true
                try {
                    const res = await uploadPic({picUrl: data})
                    this.queryParams.picture = res.filePath

                    // 设置预览图片
                    const imgDom = this.$refs.preview.querySelector('.previwe-img')
                    if(imgDom.parentNode.classList.contains('no-adimg')){
                        imgDom.parentNode.classList.remove('no-adimg')
                    }
                    imgDom.setAttribute('src', setImgPath(res.filePath))
                } catch (error) {
                    console.error(error)
                }
                this.cropperUploading = false
                this.cropperDialogVisible = false
            })
        },
        isErrorTxt(file, size = 2) {
            const isFileType =
                file.raw.type &&
                "image/jpg,image/jpeg,image/gif,image/png".indexOf(file.raw.type) > -1;

            if (!isFileType) {
                this.$message.error("仅支持上传jpg、png和gif格式的图片。");
                return true;
            }

            const isSize = file.size / 1024 / 1024 < size;
            if (!isSize) {
                const _size = size >= 1 ? size + "M" : size * 1000 + "K";
                this.$message.error(`上传图片大小不能超过 ${_size}！`);
                return true;
            }

            return false;
        },
        getCopperSize(type) {
            const o = {
                1: {width: 600, height:345},
                2: {width: 600, height:325},
                3: {width: 600, height:360},
                4: {width: 600, height:175},
                5: {width: 600, height:175},
                6: {width: 600, height:325},
                7: {width: 600, height:325},
                8: {width: 600, height:325},
                9: {width: 600, height:325},
            }
            return o[type]
        }
    },
    filters: {
        getStatus(status) {
            if(!status) return '无'

            return ['待投放', '投放中', '已停用'][status]
        },
        getStatusType(status) {
            if(!status) return 'info'

            return ['info', 'success', 'danger'][status]
        },
        getUploadSize(type) {
            const o = {
                1: '600像素 * 345像素',
                2: '600像素 * 325像素',
                3: '600像素 * 360像素',
                4: '600像素 * 175像素',
                5: '600像素 * 175像素',
                6: '600像素 * 325像素',
            }
            return o[type]
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/var';

.advert-list {
    li {
        float: left;
        width: 450px;
        margin:15px;
        border:1px solid #ddd;
        transition: background .3s;
        box-shadow: 0 0 5px rgba(0,0,0,.2);

        &:hover {
            background:#f5f5f5;
        }

        .head {
            padding:10px;
            text-align: center;
            font-size: 16px;
        }

        .content {
            padding:15px;
            border-top:1px solid #ddd;

            .right {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin-left:15px;
            }
        }
    }
}

// 广告位显示
.ad-show-area {
    position: relative;
    width: 220px;
    height: 400px;

    &:hover {
        .ad-show-mask {
            transition: background .3s;
            background:rgba(0,0,0,.85);
        }
    }

    img {
        display: block;
        width:100%;
        height:100%;
    }

    .ad-show-mask {
        position: absolute;
        left:0;
        top:0;
        width:100%;
        height: 100%;
        background:rgba(0,0,0,.7);
    }

    .ad-child {
        position:absolute;
        top: 100px;
        left: 50%;
        width: 210px;
        transform:translate(-50%, 0);
        &.radius {
            &,.no-adimg, img {
                border-radius: 6px;
            }
        }

        .no-adimg {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #eee;
            
            img {
                width:auto;
                height:auto;
                max-width: 100%;
                max-height: 100%;
            }
        }

        .ad-img-close {
            position:absolute;
            content:"";
            width: 20px;
            height: 20px;
            bottom: -30px;
            left:50%;
            transform:translate(-50%, 0);
            color:#aaa;
            font-size: 24px;
            cursor: pointer;
        }

        img {
            background: #f8f8f8;
            cursor: pointer;
        }
    }
    
}

.ad-upload {

    &__left {
        .ad-uploader {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border:1px dashed #ddd;
            width: 200px;
            height:120px;
            background-color: #f8f8f8;
            transition: .3s all;
            cursor: pointer;
    
            &:hover {
                border-color: $orange;
                .uploader-icon {
                    color: $orange;
                }
            }
    
            .upload-img {
                display: block;
                max-width:100%;
                max-height: 100%;
            }
    
            .uploader-icon {
                font-size: 30px;
            }
        }

        .txt {
            margin-top:10px;
            font-size: 12px;

            span {
                color: $red;
            }
        }
    }

    &__right {
        width: 220px;
        .ad-preview {
            zoom:.7
        }
    }
}

.cropper-dialog {
    overflow: hidden;
    &-left {
        float: left;
        width:600px;
        
        .cropper-box {
            height: 500px;

            .adCropper {
                width:100%;
                height: 100%;
            }
        }

        .use-tip {
            margin-top:10px;
            text-align: center;
            font-weight: 700;
            color:#ff0000;
        }
    }

    &-right {
        float: left;
        width: 300px;
        margin-left:50px;

        h2 {
            margin-bottom: 10px;
            font-size: 20px;
            color:#333;
        }

        .show-preview {
            border:2px solid #ddd;
            img {
                max-width: none;
            }
        }
    }
    
}
</style>

<style lang="scss">

.advert-list {
    .el-form-item__label {
        padding: 0!important;
        font-weight: 400;
        color: #999;
        font-size:12px;
    }
    
    .el-form-item__content {
        line-height: 20px;
    }
    .el-form-item {
        margin-bottom: 10px;
    }
}


.car-type-list {
    li {
        float:left;
        margin:5px;
    }
}

.ad-upload .el-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height:100%;
}

.ad-dialog .el-dialog__body {
    height: 550px;
    padding:15px 30px;
}
</style>

