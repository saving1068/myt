<template>
    <div class="store-aricle page-container" v-loading="loading">
        <panel>
            <template slot="head">
                <div class="left">
                    <span class="title">销售分组 &gt;  <em class="small-txt">{{isEdit ? '编辑' : '新增'}}分组</em></span>
                </div>
                <div class="right">
                    <el-button type="info" size="mini" @click="$router.go(-1)">返回</el-button>
                </div>
            </template>
            <div class="store-aricle__content">
                    <box title="基础信息">
						<el-form :label-position='labelPosition' :model="ruleForm" size="small"label-width="150px" >
							 <el-form-item label="销售分组名称" prop="name" >
							    <form-input classType='input' v-model="ruleForm.name" :max="16" />
							    <el-button v-if="isEdit" :type="storeStatus | getStatusType" style="cursor:default">{{storeStatus|getStatus}}</el-button>
							</el-form-item>
							 <el-form-item label="分组组长姓名" prop="name" v-if='isEdit&&ruleForm.userName&&ruleForm.nickName'>
								 {{ruleForm.userName}}
							    <!-- <el-button v-if="isEdit" :type="storeStatus | getStatusType" style="cursor:default">{{storeStatus | getStatus}}</el-button> -->
							</el-form-item> 
							<el-form-item label="分组组长手机" prop="name" v-if='isEdit&&ruleForm.mobile'>
								 {{ruleForm.mobile}}
							    <!-- <el-button v-if="isEdit" :type="storeStatus | getStatusType" style="cursor:default">{{storeStatus | getStatus}}</el-button> -->
							</el-form-item>
							<el-form-item label="旗下顾问数量" prop="name" v-if='isEdit'>
							    {{ruleForm.adviserNum||0}}
							</el-form-item>
							<el-form-item label="当前月目标" prop="name" v-if='isEdit'>
							    总成交  {{ruleForm.targetDealTotal||0}}  ，分销成交{{ruleForm.targetDealFx||0}}
							</el-form-item>
							<el-form-item label="创建分组时间" prop="name" v-if='isEdit'>
								{{ruleForm.dayTime}}{{ruleForm.hourTime}}
							</el-form-item>
						</el-form>
                    </box>
					<div class="codeBox flex" v-if="isEdit">
						<div class="code" v-if="managerInfo.codePath">
							<div class="codeName">分组「{{managerInfo.codeDesc}}」</div>
							<div class="codeValue"><img :src='setImgPath(managerInfo.codePath)'></div>
							<div class="codeDown">
								<el-button @click='downManagerQrcode()' type="warning"  size="mini">下载</el-button>
							</div>
						</div>
						<div class="code" v-if="adviserInfo.codePath">
							<div class="codeName">分组「{{adviserInfo.codeDesc}}」</div>
							<div class="codeValue"><img :src='setImgPath(adviserInfo.codePath)'></div>
							<div class="codeDown">
								<el-button type="warning" @click='downAdviserInfoQrcode' size="mini">下载</el-button>
							</div>
						</div>
					</div>
                    <!-- <box title="门店地址设置">
                        <div style="width:800px">
                            <el-form-item label="所属地域" prop="selectedOptions">
                                <el-cascader
                                    style="width:450px"
                                    size="small"
                                    placeholder="请选择省市区"
                                    :options="regionOptions"
                                    v-model="ruleForm.selectedOptions"
                                    @change="changeArea">
                                </el-cascader> 
                            </el-form-item>
                            <el-form-item label="门店地址" prop="address">
                                <el-input id="suggestId" v-model="ruleForm.address" @blur="searchBlur" @input="searchInput" />
                            </el-form-item>
                            <el-form-item>
                                <baidu-map :ak="baiduKey" class="baidu-map" center="广州" :zoom="baiduZoom" :scroll-wheel-zoom="true" @click="getPoint">
                                    <bm-view class="bm-view" style="height:400px"></bm-view>
                                    <bm-local-search v-show="showSeachView" class="keyword-view" :auto-viewport="true" :keyword="ruleForm.address" :location="loaction" @infohtmlset="searchHandler"></bm-local-search>
                                </baidu-map>
                            </el-form-item>
                            <el-form-item label="地址描述" prop="loaction">
                                <el-input type="textarea" :rows="3" v-model="ruleForm.loaction"  />
                            </el-form-item>
                        </div>
                    </box> -->
            </div>
            <div class="hr"></div>
            <div class="store-code-button flex justify-content-center mt10" style="padding-bottom:20px;">
                <el-button type="primary" size="mini" plain @click="save(1)">仅保存</el-button>
                <el-button type="primary" size="mini" v-if="!isEdit" @click="save(2)">保存并启用</el-button>
            </div>
        </panel>
    </div>
</template>

<script>
import Panel from '@/components/Panel'
import Box from '@/components/Box'
import formInput from '@/components/FormInput'

import {BaiduMap, BmView, BmLocalSearch} from 'vue-baidu-map'

import {validMobile, validTel, setImgPath} from '@/utils'

import {storeList, querySellerStoreById, addStore, editStore,addSellerStoreGroup,querySellerQrcode,editSellerStoreName} from '@/api/store'
import { regionData } from 'element-china-area-data'

export default {
    components: {Panel, Box, formInput, BaiduMap, BmView, BmLocalSearch},
    data() {

        const validateMobile = (rule, value, callback) => {
            if(value == ''){
                callback(new Error('请输入客服电话！'))
            }if(!validMobile(value) && !validTel(value)) {
                callback(new Error('客服电话格式不正确！'))
            }else{
                callback()
            }
        }

        return {
			managerInfo:{},
			adviserInfo:{},
            loading: false,
            storeStatus: 0, // 门店状态
            has4sStore: false, // 是否已经添加过4S店了，如果添加就不能再添加了
			labelPosition:'right',
            ruleForm: {
                name: '',
                type: 1,
                customPhone: '',
                address: '',
                loaction: '',
                longitude: '',
                latitude: '',
                selectedOptions: [],
            },
            rules: {
                name: [{ required: true, message: '分店名称', trigger: 'blur' }],
                customPhone: [{ required: true, validator: validateMobile, trigger: 'blur' }],
                address: [{ required: true, message: '请输入门店地址', trigger: 'blur' }],
                loaction: [{ required: true, message: '请输入地址描述', trigger: 'blur' }],
                selectedOptions: [{type: 'array', required: true, message: '请选择所属区域', trigger: 'change' }],
            },
            baiduKey: 'GXE6OOuWcRgoKzQ3HHrAaYhIhZUllFdF',
            baiduZoom: 16,
            showSeachView: false,
            loaction: '广州',

            regionOptions: regionData,
            

            setImgPath: setImgPath
        }
    },
    computed: {
        isEdit() {
            return ~~this.$route.query.id
        }
    },
    async created() {
//         const stores = await storeList({curPage: 1, pageSize: 10})
// 
//         // 已经添加过4S店了，如果添加就不能再添加了
//         if(stores.items.some(v => v.type == 1)){
//             this.has4sStore = true
//             this.ruleForm.type = 2
//         }

        // 编辑状态
        if(this.isEdit){
            this.getStoreInfo()
        }
    },
    methods: {
        // 获取门店信息
        async getStoreInfo() {
            try {
                this.loading = true;
                const res = await querySellerStoreById({id: this.$route.query.id});
				let managerInfo = await querySellerQrcode({storeId:this.$route.query.id,type:12});
				let adviserInfo = await querySellerQrcode({storeId:this.$route.query.id,type:1})
				this.adviserInfo ={...adviserInfo};
				this.managerInfo ={...managerInfo};
                this.ruleForm = {...this.ruleForm, ...res}
//                 // 省市区
//                 const {provinceId, cityId, districtId} = res
//                 this.ruleForm.selectedOptions = [String(provinceId), String(cityId), String(districtId)]

                // 由于保存的时候 (仅保存与保存并启用) 这个后端也是用status的字段区分的，所以这里不可合并进来
//                 this.storeStatus = res.status
//                 delete this.ruleForm.status
            } catch (error) {
                
            }
            this.loading = false
        },
        getPoint(e) {
        
            let geocoder= new BMap.Geocoder();  //创建地址解析器的实例
            geocoder.getLocation(e.point, rs=>{
                console.log(rs)
                const {point, address} = rs
                this.ruleForm.loaction = address
                this.ruleForm.longitude = point.lng
                this.ruleForm.latitude = point.lat
            })

        },
        changeArea(value) {
            console.log(value)
        },
        searchInput() {            
            this.showSeachView = true
        },
        searchHandler(e){
            const {point, address, title} = e
            this.ruleForm.loaction = address
            this.ruleForm.address = title
            this.ruleForm.longitude = point.lng
            this.ruleForm.latitude = point.lat
            this.baiduZoom = 18 + Math.random()
            this.$refs.ruleForm.validateField('longitude')
            this.showSeachView = false
        },
        searchBlur() {
            setTimeout(_ => {
                this.showSeachView = false
            }, 200)
        },
		 downManagerQrcode() {
		    const a = document.createElement("a"); // 生成一个a元素
		    const event = new MouseEvent("click"); // 创建一个单击事件
		    a.download = "photo"; // 设置图片名称
		    a.href = setImgPath(this.managerInfo.codePath); // 将生成的URL设置为a.href属性
		    a.dispatchEvent(event);
		
		    this.qrCodeDialogVisible = false
		},
		 downAdviserInfoQrcode() {
		    const a = document.createElement("a"); // 生成一个a元素
		    const event = new MouseEvent("click"); // 创建一个单击事件
		    a.download = "photo"; // 设置图片名称
		    a.href = setImgPath(this.adviserInfo.codePath); // 将生成的URL设置为a.href属性
		    a.dispatchEvent(event);
		
		    this.qrCodeDialogVisible = false
		},
        // 1－仅保存；2-保存并启用;
        async save(status) {
			if(this.isEdit){
				if(this.ruleForm.name){
					this.$loading.show('请稍等。。。')
					await editSellerStoreName({name: this.ruleForm.name,id:this.$route.query.id})
					this.$router.go(-1)
					this.$loading.hide()
				}else{
					this.$message.warning('请输入销售分组名称')
				}
			}else{
				if(this.ruleForm.name){
					try{
						this.$loading.show('请稍等。。。')
						await addSellerStoreGroup({name: this.ruleForm.name,type:status})
						this.$router.go(-1)
						this.$loading.hide()
					}catch(e){
						this.$loading.hide()
						//TODO handle the exception
					}
					
				}else{
					this.$message.warning('请输入销售分组名称')
				}
			}
			
            
        }
    },
    filters: {
        // 状态 0-待启用,1-已启用,2-已停用
        getStatus() {
			if(!status){
				return '待启用'
			}
            return ['待启用', '启用中', '已停用'][status]
        },
        getStatusType(status){
			if(!status){
				return 'info'
			}
            return ['info', 'success', 'danger'][status]
        }
    }
}
</script>


<style lang="scss" scoped>
	.codeBox{
		width: 500px;
		margin: 0 auto;
		padding: 20px;
			
		.code{
			margin-left: 50px;
			text-align: center;
			.codeName{
				padding-left: 5px;
				color: #999999;
				padding-bottom: 10px;
			}
			.codeValue{
				width: 120px;
				height: 120px;
				margin: 0 auto;
			}
			.codeDown{
				margin-top: 5px
			}
		}
		
	}
.store-aricle{
    .small-txt {
        font-size: 14px;
        color: #666;
    }

    .baidu-map {
        position: relative;

        .keyword-view {
            position: absolute;
            width:100%;
            height: 200px;
            top:-19px;
            left:0;
            overflow-y: auto;
        }
    }
}
</style>
