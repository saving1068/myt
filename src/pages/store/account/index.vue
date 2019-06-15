<template>
    <div class="store-account page-container">
		<!-- 123124<img style="width: 100px;height: 100px;" src="http://192.168.3.102:8082/welfare/qrcode?cateogry=49133066253238272" alt=""> -->
        <panel :show-head="false" class="store-step">
            <el-steps class="mt10" :active="stepActive" align-center>
                <el-step :title="item.label" v-for="(item, index) in stepList" :key="index" :class="{'step-finished': stepActive > index + 1}">
                    <span slot="icon" class="el-step-custom__icon">
                        <icon-svg class="finish-svg" v-if="stepActive > index + 1" icon-class="store_step_checkbox" />
                        <i v-else>{{index + 1}}</i>
                        <icon-svg :icon-class="item.icon" />
                    </span>
                </el-step>
            </el-steps>
        </panel>
		
        <div class="store-account-content mt10" v-loading="loading">
            <panel>
                <template slot="head">
                    <span class="left">{{panelTitle}}</span>
                    <!-- <span class="right" v-if="stepActive == 1">注册手机号 {{userInfo.mobile}} </span> -->
					
                </template>
                <div class="store-account-info">
					
                    <div class="store-account-step1 mt20" v-if="stepActive == 1">
                        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" size="small" label-width="150px" class="account-ruleForm">
                            <el-form-item label="商户简称" prop="name">
                                <form-input classType='input' v-model="ruleForm.name" :max="11" />
                            </el-form-item>
                            <el-form-item label="企业Logo" prop="logo" v-loading='logoLoading'>
                                <div class="company-logo">
                                    <el-upload
                                        class="logo-uploader"
                                        action=""
                                        :auto-upload="false" 
                                        :show-file-list="false" 
                                        :on-change="handleLogoChange"
                                    >
									<div v-if="ruleForm.logo" class="img-logo" style="width: 180px;height: 180px;">
										<img  :src="setImgPath(ruleForm.logo)"  />
									</div>
                                        <img v-else src="~assets/no_logo_pic.jpg" class="no-logo-pic" width="180" height="180" />
                                        <el-button type="warning" class="upload-btn">{{ruleForm.logo ? '重新上传' : '上传LOGO'}}</el-button>
                                    </el-upload>
                                </div>
                            </el-form-item>
							 <el-form-item label="注册邮箱" prop="regEmail">
							    <form-input classType='input' v-model="ruleForm.regEmail" :max="30" />
							</el-form-item>
							<el-form-item label="注册手机" prop="regMobile">
							    <form-input classType='input' @input='regMobile' v-model="ruleForm.regMobile" :max="11" />
								<el-button type="warning" class="upload-btn" v-if="!ifgetCode" @click='getPhoneCode'>发送验证码</el-button>
								<el-button type="info" style='cursor: none;' v-else >{{seconds}}秒</el-button>
							</el-form-item>
							<el-form-item label="短信验证码" prop="mobileCode">
							    <form-input classType='input' v-model="ruleForm.mobileCode" :max="6" />
							</el-form-item>
							 <div class="hr"></div>
                            <el-form-item label="紧急联系人" prop="urgentName">
                                <form-input classType='input' v-model="ruleForm.urgentName" :max="6" />
                            </el-form-item>
                            <el-form-item label="联系人职务" prop="urgentJob">
                                <form-input classType='input' v-model="ruleForm.urgentJob" :max="10" />
                            </el-form-item>
                            <el-form-item label="手机号码" prop="urgentPhone">
                                <form-input classType='input' v-model="ruleForm.urgentPhone" :max="11" />
                            </el-form-item>
							 <el-form-item label="客服电话" prop="baseDictInfoDto">
							    <form-input classType='input' v-model="ruleForm.baseDictInfoDto.content" :max="12" />
							</el-form-item>
                            <div class="hr"></div>
                            <el-form-item label="添加销售分组" prop="sellerStoreDTOs" style="margin-bottom:0;">
                                <form-input classType='input' v-model="storeName" :max="10" />
                               <!-- <el-select v-model="ruleForm.storeType" placeholder="请选择门店" style="width:150px;">
                                    <el-option v-if="!isShowStore" label="4S店" :value="1">4S店</el-option>
                                    <el-option label="直营店" :value="2">直营店</el-option>
                                    <el-option label="二网店" :value="3">二网店</el-option>
                                </el-select> -->
                                <el-button type="warning" @click="addStoreTag">添加</el-button>
                                <div class="store-tag" v-if="ruleForm.sellerStoreDTOs.length">
                                    <div class="store-tag__item" v-for="(tag,index) in ruleForm.sellerStoreDTOs" v-if="tag.isDelete == 0" :key="index">
											 <span class="name">{{tag.name}}</span>
											<!-- <span class="type">[{{tag.typeName}}]</span> -->
											<i class="el-icon-circle-close close" @click="removeStoreTag(tag,index)"></i>
                                       
                                    </div>
                                </div>
                            </el-form-item>
                            <div class="hr"></div>
                            <el-form-item class="mt10" align="center" label-width="0">
                                <el-button type="primary" plain @click="resetForm('ruleForm')">清空</el-button>
                                <el-button type="primary"  @click="submitForm('ruleForm')" >保存，下一步</el-button>
								 <!-- <el-button type="primary"  @click="submitForm('ruleForm')">保存，下一步</el-button> -->
                            </el-form-item>
                        </el-form>
                    </div><!--step1-->

                    <div class="store-account-step2" v-if="stepActive == 2">
						<div v-if="openMarketing !=0&&ruleForm.status == 1" class="openMarketing"> <!-- 开通过完善过 -->
							<h6>如需将「小程序」关联到「贵司公众号」进行推广请按提示操作：</h6>
							<div class="mp-code">
							    <div class="mp-code__title">公众平台账号授权</div>
							    <div class="mp-code__content">
							        <div class="img">
							            <img src="http://cdn2.guopan.cn/frontend/pc/static/img/weixin-qrcode-1_22d9112.jpg" />
							        </div>
							        <p class="txt">使用公众平台绑定的管理员个人微信号扫描</p>
							    </div>
							</div>
							<div class="hr"></div>
							<el-button type="primary" size="mini" @click="nextStoreCode">下一步</el-button>
						</div>
						<div class="store-account-step3"  v-if="openMarketing ==0&&ruleForm.status == 1"><!-- 未通过完善过 -->
						    <h6>第二步：开始创建销售团队</h6>
							 <div class="store-code">
							    <div class="store-code__item" >
							        <div class="title">店总BOSS码</div>
							        <div class="img">
							            <img :src="setImgPath(bossCode)" />
							        </div>
							        <div class="bottom">
							           <a :href="setImgPath(bossCode)" target="_blank">
							                <el-button type="warning" size="mini">下载</el-button>
							            </a>
							        </div>
							    </div>
							</div>
							 <div class="hr"></div>
						    <div class="store-code" v-if="groudList.length">
						        <div class="store-code__item" v-for="(item,index) in groudList" :key="index" v-if="item">
						            <div class="title">分店：{{item.name}}</div>
						            <div class="img">
						                <img :src="setImgPath(item.codePath)" />
						            </div>
						            <div class="bottom">
						                <a :href="setImgPath(item.codePath)" target="_blank">
						                    <el-button type="warning" size="mini">下载</el-button>
						                </a>
						            </div>
						        </div>
						    </div>
						    <div class="hr"></div>
							<div class="store-code" v-if="adviser.length">
							    <div class="store-code__item" v-for="(item,index) in adviser" :key="index" v-if="item">
							        <div class="title">分店：{{item.name}}</div>
							        <div class="img">
							            <img :src="setImgPath(item.codePath)" />
							        </div>
							        <div class="bottom">
							            <a :href="setImgPath(item.codePath)" target="_blank">
							                <el-button type="warning" size="mini">下载</el-button>
							            </a>
							        </div>
							    </div>
							</div>
						    <div class="store-code-button flex justify-content-center mt10">
						        <!-- <el-button type="primary" size="mini" plain>预览前端</el-button> -->
						        <el-button type="primary" size="mini" @click="$router.push({name: 'storelist'})">去完善车型商品资料</el-button>
						    </div>
						</div><!--step3-->
						<div v-if="openMarketing ==0&&ruleForm.status == 0" class="closeMarketing"> <!-- 未开通未完善 -->
							<p class="title">开通前确认是否马上使用「蚂蚁淘」的分润功能：</p>
							<div class="font">·选择<span>「现在开通」</span>后，须在后台的「营销 — 分润管理」模块设置各车系车型的推手分润和代理商分润 <br/>门店用户即可在小程序开始使用「求线索」、「求推手」、「邀请代理商」、「领金结算」等分销功能</div>
							<div class="font">·选择<span>「暂不开通」</span>后，日后可再「营销 — 分润管理」模块进行开通； <br/>暂不开通时，小程序则无分销功能</div>
							<div class="openMarketingBtn">
								<div class="open btn " @click="ifOpenM=true" :class="{'btnActive':ifOpenM}">现在开通</div>
								<div class="close btn"  @click="ifOpenM=false" :class="{'btnActive':!ifOpenM}">暂不开通</div>
							</div>
							<div style="display: flex;justify-content: center;padding-top: 40px;">
								<el-button type="primary" size="mini" @click="nextStoreCode">下一步</el-button>
							</div>
							
						</div>
                      
                    </div><!--step2-->

                    <div class="store-account-step3" v-if="stepActive == 3">
                        <h6>第三步：开始创建销售团队</h6>
						 <div class="store-code">
						    <div class="store-code__item" >
						        <div class="title">店总BOSS码</div>
						        <div class="img">
						            <img :src="setImgPath(bossCode)" />
						        </div>
						        <div class="bottom">
						           <a :href="setImgPath(bossCode)" target="_blank">
						                <el-button type="warning" size="mini">下载</el-button>
						            </a>
						        </div>
						    </div>
						</div>
						 <div class="hr"></div>
                        <div class="store-code" v-if="groudList.length">
                            <div class="store-code__item" v-for="(item,index) in groudList" :key="index" v-if="item">
                                <div class="title">分店：{{item.name}}</div>
                                <div class="img">
                                    <img :src="setImgPath(item.codePath)" />
                                </div>
                                <div class="bottom">
                                    <a :href="setImgPath(item.codePath)" target="_blank">
                                        <el-button type="warning" size="mini">下载</el-button>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="hr"></div>
						<div class="store-code" v-if="adviser.length">
						    <div class="store-code__item" v-for="(item,index) in adviser" :key="index" v-if="item">
						        <div class="title">分店：{{item.name}}</div>
						        <div class="img">
						            <img :src="setImgPath(item.codePath)" />
						        </div>
						        <div class="bottom">
						            <a :href="setImgPath(item.codePath)" target="_blank">
						                <el-button type="warning" size="mini">下载</el-button>
						            </a>
						        </div>
						    </div>
						</div>
                        <div class="store-code-button flex justify-content-center mt10">
                            <!-- <el-button type="primary" size="mini" plain>预览前端</el-button> -->
                            <el-button type="primary" size="mini" @click="$router.push({name: 'storelist'})">去完善车型商品资料</el-button>
                        </div>
                    </div><!--step3-->

                </div>
            </panel>
        </div>
    </div>
</template>

<script>
import Panel from '@/components/Panel'
import FormInput from '@/components/FormInput'

import {getSellerInfo, editSellerinfo, storeCodeList} from '@/api/account'
import {sendMobileCode} from '@/api/admin'
import {uploadPic,editEnableWelfare,} from '@/api/common'
import {setImgPath, validMobile,validPhone} from '@/utils'
import {getBossCode,querySellerQrcode,storeList,repealStore} from '@/api/store'

export default {
    components: {Panel, FormInput},
    data() {
        const validateMobile = (rule, value, callback) => {
            if(value == ''){
                callback(new Error('请输入联系方式！'))
            }else if(value.length < 11) {
                callback(new Error('联系方式不能小于11位！'))
            }else if(!validMobile(value)) {
                callback(new Error('联系方式格式不正确！'))
            }else{
                callback()
            }
        }

        return {
			openMarketing:0,
			ifOpenM:false,
            loading: false,
			ifgetCode:false,
			seconds:60,
            stepActive: 1,
            stepList: [
                {label: '完善信息', icon: 'store_step'},
                {label: '授权小程序', icon: 'store_step'},
                {label: '创建团队 平台启用', icon: 'store_step'},
            ],
			storeName:'',//销售分组内容名字
            ruleForm: {
                regEmail: '',//邮件
				mobileCode:'',//验证码
                regMobile: '',//注册手机
                urgentName: '',//紧急联系人
                logo: '',
                name: '',//简称
                urgentJob: '',//联系人植物
                urgentPhone: '',//手机号码
				baseDictInfoDto:{
					content:''
				},//客户电话
                sellerStoreDTOs: []//销售分组
            },
			initMobile:'',
			mobileChange:false,
            rules: {
                name: [{ required: true, message: '请输入商户简称', trigger: 'blur' }],
                logo: [{ required: true, type: 'string', message: '请上传企业Logo'}],
                urgentName: [{ required: true, message: '请输入紧急联系人', trigger: 'blur' }],
                urgentJob: [{ required: true, message: '请输入联系人职务', trigger: 'blur' }],
                urgentPhone: [{ required: true, validator: validateMobile, trigger: 'blur' }],
                // sellerStoreDTOs: [{ required: true, type: 'array', message: '请添加分店', trigger: 'click' }],
				regEmail:[{ required: true, message: '请输入电子邮箱', trigger: 'blur'}],
				regMobile: [{ required: true, message: '请输入注册手机', validator: validateMobile, trigger: 'blur' }],
            },
			logoList:[],
			logoLoading:false,
            isSubmit: false,
            setImgPath: setImgPath,

            storeCodeList: [],
			bossCode:'',
			groudList:[],
			adviser:[],
        }
    },
    computed: {
        panelTitle() {
			let t = {}
				if(this.ruleForm.status == 0){//未完善
					if(this.openMarketing == 0){//未开通
						 t = {
						    1: '第一步：完善账户信息',
						    2: '第二步：开通分润功能',
						    3: '第三步：开始创建销售团队',
						}
					}else{
						 t = {
						    1: '第一步：完善账户信息',
						    2: '第二步：开始创建销售团队',
						}
					}
					
				}else{
					if(this.openMarketing == 0){
						 t = {
						    1: '第一步：完善账户信息',
						    2: '第二步：开始创建销售团队',
						}
					}else{
						t = {
						    1: '第一步：完善账户信息',
						    2: '第二步：授权小程序',
						    3: '第三步：开始创建销售团队',
						}
					}
				}
				
				
			console.log(t)
            return t[this.stepActive]
        },
        // option是否显示4S门店
        isShowStore() {
            return this.ruleForm.sellerStoreJson.find(v => v.storeType == 1)
        },
        userInfo() {
            return this.$store.state.userInfo
        }
    },
//     async mounted() {
//         const {areaCode, sellerCode, status} = this.userInfo
//         this.ruleForm.area = areaCode
//         this.ruleForm.code = sellerCode
// 
//         this.loading = true
// 
//         try {
//             // 已经填过资料
//             if(status == 1){
//                 const sellerInfo = await getSellerInfo()
//                 this.ruleForm = Object.assign(this.ruleForm, sellerInfo)
//                 this.ruleForm.logo = sellerInfo.picDTOs
//             }
// 
//             const res = await storeCodeList()
//             this.storeCodeList = [...res]
//         } catch (error) {
//             console.error(error)
//         }
// 
//         this.loading = false
//     },
	created() {
		
		this.getSellerInfo()
		
	},
    methods: {
		regMobile(value){
			if(value != this.initMobile){
				this.mobileChange = true;
			}else{
				this.mobileChange = false;
			}
			console.log(this.mobileChange)
			console.log(value)
			
		},
		async getPhoneCode(){
			let mobile = this.ruleForm.regMobile;
			console.log(validMobile(mobile),mobile)
			if(validMobile(mobile)){
				this.$loading.show()
				try{
					await sendMobileCode({mobile})
					this.$loading.hide()
					this.ifgetCode = true;
					let timer = setInterval(()=>{
						this.seconds--;
						if(this.seconds<=0){
							this.seconds = 60;
							this.ifgetCode = false;
							clearInterval(timer)
						}
					},1000)
					this.$message.success('获取验证码成功')
				}catch(e){
					this.$loading.hide()
					//TODO handle the exception
				}
			}else{
				this.$message.warning('请输入正确的手机号码')
			}
			
		},
		async getSellerInfo(){
			this.loading = true;
			try{
				let info = await getSellerInfo()
				info.mobileCode = info.mobileCode?info.mobileCode:'';
				if(!info.baseDictInfoDto){
					info.baseDictInfoDto = {
						content:""
					}
				}
				
				info.name = info.name?info.name:'';
				info.regEmail = info.regEmail?info.regEmail:'';
				info.regMobile = info.regMobile?info.regMobile:'';
				info.urgentJob = info.urgentJob?info.urgentJob:'';
				info.urgentName = info.urgentName?info.urgentName:'';
				info.urgentPhone = info.urgentPhone?info.urgentPhone:'';
				info.logo = info.logo?info.logo:''
				this.ruleForm = {...info};
				this.initMobile = info.regMobile?info.regMobile:'';
				
				this.openMarketing = info.enableWelfare;
				// this.ruleForm.status = 0
				if(this.ruleForm.status == 0){//未完善
					if(this.openMarketing == 0){//未开通分润
						this.ifOpenM = false;
						this.stepList[1].label = '开通分润功能';
					}else{
						this.stepList =  [
							{label: '完善信息', icon: 'store_step'},
							{label: '创建团队 平台启用', icon: 'store_step'},
						]
					}
					
					console.log(this.stepList)
				}else{
					if(this.openMarketing == 0){//未开通分润
						this.stepList =  [
							{label: '完善信息', icon: 'store_step'},
							{label: '创建团队 平台启用', icon: 'store_step'},
						]
					}
						
				}
				this.loading = false;
			}catch(e){
				// this.$message.error(e)
				this.loading = false;
				//TODO handle the exception
			}
			
			console.log(this.ruleForm)
		},
        submitForm(formName) {
			if(!this.ruleForm.sellerStoreDTOs.length){
				this.$message.warning('请添加至少一个销售分组')
				return 
			}
			if(!validPhone(this.ruleForm.baseDictInfoDto.content)){
				this.$message.warning('请输入正确的客服电话')
				return 
			}
			
			
			if(this.mobileChange){
				if(!this.ruleForm.mobileCode){
					this.$message.warning('您已改变注册手机号，请输入验证码')
					return 
				}
				
			}
            this.$refs[formName].validate(async valid => {
				console.log(valid)
                if (!valid) {
					this.$message.warning('请输入完善所有信息')
                    console.log('error submit!!');
                    return false
                }

                this.isSubmit = true
                
                try {
                    let params = {...this.ruleForm}
//                     params.sellerStoreDTOs = JSON.stringify(params.sellerStoreDTOs.map( item => {
//                         const {storeName, storeType} = item
//                         return {
//                             name: name,
//                             type: storeType
//                         }
//                     }))

                    // params.logo = JSON.stringify(params.logo)
                    // delete params.picDTOs

                    // params.id = this.userInfo.id
					let ground = []
					params.sellerStoreDTOs.forEach((item)=>{
						if(item.isDelete == 0){
							ground.push(item)
						}
					})
					if(ground.length == 0){
						this.$message.warning('请添加至少一个销售分组')
						return 
					}
                    this.loading = true
					// delete params[enableWelfare];
					console.log(params)
					
					
					params.logo = this.logoList.length?this.logoList:params.picDTOs;
					let send = {
						jsonStr:JSON.stringify([params])
					}
					console.log(send)
                    const res = await editSellerinfo(send)
                    this.$message.success('编辑成功')
					// if(this.ruleForm.status == 0){//未完善
						this.stepActive = 2
						this.setHash(2)
// 					}else if(this.ruleForm.status == 1){
// 						this.stepActive = 3
// 						this.setHash(3)
// 					}

                    

                } catch (error) {
					console.log(this.ruleForm)
					this.ruleForm.sellerStoreDTOs.forEach((item)=>{
						item.isDelete = 0
					})
                    console.error(error)
                }
				 this.isSubmit = false
                this.loading = false

            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.isSubmit = false
        },
        // 上传企业LOGO图片
        handleLogoChange(file, fileList) {
            if (this.isErrorTxt(file, 2)){
                return false
            }
			this.logoLoading = true;
            let _this = this
            let reader = new FileReader()

            reader.onload = function (e) {
                let data = e.target.result
                //加载图片获取图片真实宽度和高度
                let image = new Image()
                image.onload = async function () {
                    console.log(image.width + 'x' + image.height)
                    const isPix = image.width >= 400 && image.height >= 400

                    try {
                        const res = await uploadPic({picUrl: this.src})
                        _this.ruleForm.logo = res.filePath
						_this.logoList = [{
							picId:res.picId,
							picUrl:res.filePath
						}]
						_this.logoLoading = false;
                    } catch (error) {
                        _this.logoLoading = false;
                    }
                    
                    // if (!isPix) {
                    //     _this.$message.error(`上传图片像素不能小于400x400 ！`);
                    //     return false;
                    // } else {

                        // _this.uploadImage(file, fileList)
                        //     .then(res => {
                        //         _this.ruleForm["logo"] = res.file;
                        //     })
                        //     .catch(err => {
                        //         _this.$message.error("上传失败，重新上传试试！");
                        //     });

                    // }
                };
                image.src = data
            };
            reader.readAsDataURL(file.raw)
        },
        isErrorTxt(file, size = 3) {
            const isFileType =
                file.raw.type &&
                "image/jpg,image/jpeg,image/gif,image/png".indexOf(file.raw.type) > -1;
            console.log(file.raw.type);

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
        // 添加分店标签
        addStoreTag() {
			if(this.storeName){
				 this.ruleForm.sellerStoreDTOs.push({
				                name:this.storeName,
								isDelete:0
				            })
				this.storeName = '';
				
			}else{
				this.$message.warning('请输入添加内容')
			}
                
//             if(storeName == '' ){
//                 this.$refs.ruleForm.validateField("sellerStoreJson")
//                 if(sellerStoreJson.length){
//                     this.$message.error(storeName ? '请选择门店类型' : '请输入分店')
//                 }
//                 return false
//             }
// 
//             this.ruleForm.sellerStoreJson.push({
//                 storeName,
//                 storeType,
//                 typeName: o[storeType]
//             })
// 
//             this.$refs.ruleForm.validateField("sellerStoreJson")
// 
//             this.ruleForm.storeName = ''
//             
//             // 如果4S店已经添加过，则不能添加了
//             if(this.isShowStore){
//                 this.ruleForm.storeType = 2
//             }

        },
        // 移除分店标签
        async removeStoreTag(item,index) {
				if(this.ruleForm.sellerStoreDTOs[index].id){
					 this.ruleForm.sellerStoreDTOs[index].isDelete = 1;
				}else{
					this.ruleForm.sellerStoreDTOs.splice(index,1)
				}
        },        
        // 路过授权
        async nextStoreCode() {
			this.loading = true;
			if(this.openMarketing == 0){
				if(this.ifOpenM){
					await editEnableWelfare()
				}
				
			}
			
			try{
				let bossImg	= await getBossCode();
				this.bossCode = bossImg;
				let groudList = await storeList({curPage:1,pageSize:100})
				console.log(groudList)
				groudList.items.forEach(async item =>{
					let groudImg = await querySellerQrcode({storeId: item.id,type: 12})
					if(groudImg){
						if(item.name){
							groudImg.name = item.name
						}
						this.groudList.push(groudImg);
					}
					
					
					let adviserImg = await querySellerQrcode({storeId: item.id,type: 1})
					if(adviserImg){
						if(item.name){
							adviserImg.name =  item.name
						}
						this.adviser.push(adviserImg)
					}
					
 				})
				console.log(this.groudList,this.adviser)
// 				groudList:[],
// 				adviser:[],
			}catch(e){
				
			}
			
			this.loading = false;
            this.stepActive = 3
            this.setHash(3)
        },
        setHash(step) {
            this.$router.push({
                name: 'account',
                query: Object.assign(this.$route.query, {step})
            })
        },

    }
}
</script>


<style lang="scss">
@import '../../../styles/var';
$color: #c2d3e1;
$finish: #39be9e;

img{
	max-height: 100%;
}
.store-account-info{
	.img-logo{
		width: 180px;
		height: 180px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.account-form-input{
		width: 300px
	}
}

.store-step {

    .el-step__line {
        background-color: $color;
    }

    .el-step__head {
        &.is-finish,&.is-process {
            border-color: $color;
        }
    }

    .el-step__icon.is-text {
        border:none;
    }

    .el-step__title {
        font-size: 14px;
        &.is-process {
            color:$color;
            font-weight: 400;
        }        
    }

    .el-step-custom__icon {
        position: relative;
        padding:0 10px;
        background:#fff;
        text-align: center;
        
        i {
            position: absolute;
            left:50%;
            top:50%;
            transform: translate(-50%,-50%);
            font-size: 18px;
            color: #fff;
        }

        .icon-svg {
            width: 40px;
            height: 40px;
            color: $color;
        }

        .finish-svg {
            position: absolute;
            left:50%;
            top:50%;
            transform: translate(-50%,-50%);
            color:#fff;
            width: 20px;
            height:20px;
        }
    }

    .is-finish .icon-svg {
        color: $primary;
    }

    .step-finished {
        .el-step__icon.is-text .icon-svg {
            color: $finish;

            &.finish-svg {
                color:#fff;
            }
        }

        .el-step__title.is-finish {
            color:$finish;
        }
    }
}


.account-ruleForm {
    .el-form-item__label {
        color:#999;
    }

    .company-logo .el-upload {
        position: relative;
        // display: flex;
        // align-items: flex-start;

        .upload-btn {
            position: absolute;
            left: 190px;
            top:0;
        }
    }
}

.store-tag {
    &__item {
        position: relative;
        display:inline-block;
        padding:8px 20px;
        margin:15px 15px 0 0;
        line-height:20px;
        background:#f4f6f9;
        color:#333;

        .type {
            margin-left:5px;
            color:#ff0000;
        }

        .close {
            position: absolute;
            width:20px;
            height:20px;
            right:-10px;
            top:-10px;
            font-size: 20px;
            color:#aaa;
            background-color: #fff;
            border-radius: 50%;
            cursor: pointer;
            &:hover {
                opacity: .8;
            }
        }
    }
}

.store-account-step2 {
	display: flex;
	flex-direction: column;
	align-items: center;
	.openMarketing{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding:30px;
	}
	.closeMarketing{
		padding:30px;
		.title{
			font-size: 18px;
		}
		.font{
			padding-top: 30px;
			font-size: 16px;
			span{
				color: #ff3769;
			}
		}
		.openMarketingBtn{
			display: flex;
			justify-content: center;
			padding-top: 30px;
			.open{
				margin-right: 10px;
			}
			.btn{
				width: 120px;
				height: 30px;
				font-size: 15px;
				box-shadow: 0 0 5px rgba(0,0,0,.2);
				background-color:#ffcc00;
				cursor: pointer;
				color: #666666;
				text-align: center;
				line-height: 30px;
			}
			.btnActive{
				color: #333333;
				border: 1px solid #000;
			}
		}
	}
    h6 {
        font-size: 18px;
        color:#ff3769;
        text-align: center;
    }

    .mp-code {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding:20px;
        margin-top:20px;
        background:#f4f6f9;
        border:1px solid $borderColor;

        &__title {
            font-size: 20px;
        }

        &__content {
            padding:10px 20px;
            margin-top:20px;
            background:#fff;
            text-align: center;
            .img {
                display: inline-block;
//                 img {
//                     width: 180px;
//                     height:180px;
//                 }
            }
            .txt {
                margin-top:10px;
                font-size: 12px;
            }
        }
    }
}

.store-account-step3 {
    padding:30px;

    h6 {
        font-size: 18px;
        color:#ff3769;
        text-align: center;
    }

    .store-code {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding:30px 0;

        &__item {
            width:220px;
            padding: 20px 0;
            margin:10px 20px;
            text-align: center;
            background:#f4f6f9;
            border:1px solid $borderColor;

            .title {
                font-size: 16px;
            }

            .img {
                display: inline-block;
                background:#fff;
                padding:10px;
                margin:10px 0;
                img {
                    width: 120px;
                    height:120px;
                }
            }
        }
    }
}
</style>
