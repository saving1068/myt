
<template>
    <div class="log-record page-container">
        <panel>
            <template slot="head">
                <div class="left">
                    <span class="title">编辑主推车系的视频</span>
                </div>
            </template>
			<div class="massge">
				<div class="data">
					<el-form ref="form"  label-width="100px">
						<el-form-item label="发布人昵称">
							<div class="item">
								<div class="inp">
									<from-input classType='input' v-model="author" :max="10" placeholder="请输入内容"></from-input>
									
								</div>
							</div>
						</el-form-item>
						<el-form-item label="发布人头像" v-loading='headPicLoding'>
							<div class="item">
								<div class="authorPic" v-if="!headPic">
									 <icon-svg icon-class="headPic" />
									 <input type="file" accept="image/*" capture="camcorder" @change="upAuthorImg">
								</div>
								<div class="authorPic" v-else>
									<img :src="setImgPath(headPic)" alt="">
									<input type="file" accept="image/*" capture="camcorder" @change="upAuthorImg">
								</div>
								<div class="tips">点击上传或更换</div>
							</div>
						</el-form-item>
						<el-form-item label="视频标签">
							<div class="item">
								<div class="inp">
									<from-input classType='input' v-model="tag" :max="6" placeholder="请输入内容"></from-input>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="上传视频">
							<div class="video">
								<!-- <div class="name">上传视频</div> -->
								<div class="video-box" v-if="!mediaUrl">
									<el-upload
										class="upload-demo"
										:action="uploadUrl" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
										:on-error='uploadError'
										multiple>
										  <i class="el-icon-upload"></i>
										  <div class="el-upload__text"><em>点击上传</em></div>
										  <div class="el-upload__tip" slot="tip">上传视频文件，且不超过10M</div>
										</el-upload>
								</div>
								<div class="videoValue" v-else>
									<video :src="setImgPath(mediaUrl) " controls></video>
									<div class="delete-icon" @click="deleteMadel('video')">
										<icon-svg icon-class="delete" />
									</div>
								</div>
								<div class="font">
									视频建议大小建议10兆以内,格式建议MP4
								</div>
							</div>
						</el-form-item>
						<el-form-item label="视频封面">
							<div class="img" v-loading='coverPicLoding'>
								<div class="img-box" v-if="!coverPic">
									<div class="tupianBG"><icon-svg icon-class="tupianBG" /></div>
									<input type="file" accept="image/*" @change="upCoverPic">
								</div>
										   
								<div class="videoValue" v-else>
									<!-- <div class="imgBgSize" :style="[{'background':'url('+$imgUrl+videoCover+')'}]"></div> -->
									<img :src="setImgPath(coverPic)"></img>
									<div class="delete-icon" @click="deleteMadel('img')">
										<icon-svg icon-class="delete" />
									</div>
								</div>
								<div class="font">
									<div>封面建议尺寸：630*400</div>
									<div>大小不超过500KB，只能上传一张，点击可更换</div>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="视频描述">
							<div class="describe">
								<div class="describe-font">
									<from-input classType='textarea' placeholder="请输入内容" v-model="desc" :max="50"></from-input>
								</div>
							</div>
						</el-form-item>
					</el-form>
				</div>
				<div class="show">
					<div>前端主推车系 文章入口位置</div>
					<div class="showImg">
						<img src="../../../images/mianBg-1.png" alt="">
					</div>
				</div>
			</div>
				<div class="bottom">
				<div class="bottom-btn">
					<!-- <div class="left">预览前端</div> -->
					<div class="right" @click="keep"><el-button style='width: 100%;height: 100%;' type="primary" size="mini">保存</el-button></div>
					<div class="back" @click="back"><el-button style='width: 100%;height: 100%;' type="info" size="mini">返回</el-button></div>
				</div>
			</div>
        </panel>
    </div>
</template>

<script>
import Panel from '@/components/Panel'
import NoData from '@/components/NoData'
import {addVideo,editVideo,getArticleInfo} from '@/api/mainCart'
import {setImgPath} from '@/utils/index'
import {uploadPic} from '@/api/common'
import fromInput from '@/components/FormInput'
export default {
    components: {Panel, NoData,fromInput},
	data(){
		return {
			setImgPath:setImgPath,
			coverPic: '',
			headPic: "",
			mediaUrl: '',
			author: "",
			tag: '',
			desc: '',
			uploadUrl: process.env.NODE_ENV === 'development' ? '/api/upload/uploadMv?busType=10' : '/backend/upload/uploadMv?busType=10',
			coverPicLoding: false,
			headPicLoding: false,
			loading:false
			}
	},
		
	created(){
			if(this.$route.query.articleId){
				this.getArticleInfo()
			}
	},
	methods: {
			async getArticleInfo() {
				this.loading = true;
				let send = {
					articleId: this.$route.query.articleId
				}
				try{
					let res = await getArticleInfo(send);
					this.coverPic = res.coverPic;
					this.mediaUrl = res.mediaUrl;
					this.headPic = res.headPic;
					this.author = res.author;
					this.tag = res.tag;
					this.desc = res.desc;
				}catch(e){
					//TODO handle the exception
				}
				// console.log(send)
			},
			uploadError(err, file) {
				this.$message({
					message: '上传失败',
					type: 'error'
				})
			},
			handleAvatarSuccess(res) {
				// console.log(res)
				if (res.success) {
					this.mediaUrl = res.content.filePath;
					this.$message({
						message: res.errorMsg,
						type: 'success'
					})
				} else {
					this.$message({
						message: res.errorMsg,
						type: 'warning'
					})
				}
			},
			beforeAvatarUpload(file) {
				// console.log(file)
				const isMp4 = file.type === 'video/mp4';
				const isLt10M = file.size / 1024 / 1024 < 10;
				if (!isMp4) {
					this.$message.error('上传视频只能是 MP4格式!');
				}
				if (!isLt10M) {
					this.$message.error('上传视频大小不能超过10MB!');
				}
				return isMp4 && isLt10M;
			},
			deleteMadel(type) {
				console.log(type)
				if (type == 'video') {
					this.mediaUrl = '';
				} else {
					this.coverPic = '';
				}
			
			},
			upAuthorImg(e) {
				// console.log(e)
				let oFReader = new FileReader();
				oFReader.readAsDataURL(e.target.files[0]);
				var fileSize = e.target.files[0].size / 1048576;
				// console.log(fileSize)
				if (fileSize > 0.5) {
					this.$message({
						message: '图片大小不超过500kb，请重新选择',
						type: 'warning'
					})
					return
				}
				oFReader.onload = (async (oFREvent) => {
					this.headPicLoding = true;
					let imgData = oFREvent.currentTarget.result;
					let obj = {
						busType: 6,
						picUrl: imgData
					}
					try{
						let res = await uploadPic(obj);
						this.headPic = res.filePath;
						this.$message({
							message: '上传成功',
							type: 'success'
						})
						// console.log(this.info)
						this.headPicLoding = false;
					}catch(e){
						this.headPicLoding = false;
						//TODO handle the exception
					}
				})
	
			},
			upCoverPic(e) {
				// console.log(e)
				let oFReader = new FileReader();
				oFReader.readAsDataURL(e.target.files[0]);
				var fileSize = e.target.files[0].size / 1048576;
				// console.log(fileSize)
				if (fileSize > 0.5) {
					this.$message({
						message: '图片大小不超过500kb，请重新选择',
						type: 'warning'
					})
					return
				}
				oFReader.onload = (async (oFREvent) => {
					this.coverPicLoding = true;
					let imgData = oFREvent.currentTarget.result;
					let obj = {
						busType: 7,
						picUrl: imgData
					}
					// console.log(obj)
					try{
						let res = await uploadPic(obj);
						this.coverPic = res.filePath
						this.info.coverPic = res.filePath;
						this.$message({
							message: '上传成功',
							type: 'success'
						})
						// console.log(this.info)
						this.coverPicLoding = false;
					}catch(e){
						this.coverPicLoding = false;
						//TODO handle the exception
					}
				})
	
			},
			async addVideo(obj) {
				if (this.headPic && this.tag && this.mediaUrl && this.coverPic && this.author && this.desc) {
					// this.$loading.service()
					try{
						await addVideo(obj)
						this.$message({
							message: '添加视频成功',
							type: 'success'
						})
						this.back()
					}catch(err){
						
					}
				} else {
					this.$message({
							message: '请完善信息',
							type: 'warning'
					})
					// this.$emit('keep', false);
				}
	
			},
			async editVideo(obj) {
				if (this.headPic && this.tag && this.mediaUrl && this.coverPic && this.author && this.desc) {
					// this.$loading.service()
					try{
						await editVideo(obj)
						this.$message({
							message: '添加视频成功',
							type: 'success'
						})
						this.back()
					}catch(err){
						
					}

				} else {
					this.$message({
							message: '请完善信息',
							type: 'warning'
					})
				}
	
			},
			keep() {
				if (this.$route.query.carId) {
					if (this.headPic && this.tag && this.mediaUrl && this.coverPic && this.author && this.desc) {
						let obj = {
							type: 1,
							headPic: this.headPic,
							tag: this.tag,
							mediaUrl: this.mediaUrl,
							coverPic: this.coverPic,
							desc: this.desc,
							id: this.$route.query.articleId,
							author: this.author,
							pushMainId: this.$route.query.carId
						}
						// console.log(obj)
						this.editVideo(obj)
					} else {
						this.$message({
							message: '请完善所有信息'
						})
					}
	
				} else {
					if (this.headPic && this.tag && this.mediaUrl && this.coverPic && this.author) {
						let obj = {
							type: 1,
							headPic: this.headPic,
							tag: this.tag,
							mediaUrl: this.mediaUrl,
							coverPic: this.coverPic,
							desc: this.desc,
							author: this.author,
							pushMainId: this.$route.query.carId
						}
						this.addVideo(obj)
					} else {
						this.$message({
							message: '请完善所有信息'
						})
					}
	
				}
			},
			back(){
				this.$router.replace(
				{
					name:'mainCart',
					query:{
						choisePushId:this.$route.query.choisePushId
					}
				})
			}
		}
	
}
</script>
<style scoped="scoped" lang="scss">
	img {
		max-height: 100%;
		max-width: 100%;
		margin: 0 auto;
	}
	video{
		height: 100%;
		width: 100%;
		margin: 0 auto;
	}
	.massge {
				// padding: 10px 15px;
				display: flex;

				.text {
					color: #999999;
					font-size: 14px;
					padding-right: 20px;
				}

				.item {
					display: flex;
					align-items: center;
					margin-bottom: 10px;
				}

				.show {
					padding: 10px;
					background: rgba(238, 241, 246, 1);
					text-align: center;
					height: 350px;
					.showImg {
						margin-top: 10px;
						width: 260px;
						// height: 100%;
						// background: url(../../images/newCar/u9937.png) no-repeat;
						// background-position: center;
						// background-size: 100% 100%;
					}
				}

				.data {
					.el-form-item__label{
						line-height: 20px;
					}
					width: 1000px;
					padding-right: 30px;
					.item{
						display: flex;
						.authorPic{
							display: flex;
							justify-content: center;
							align-items: center;
							position: relative;
							width: 30px;
							height: 30px;
							border-radius: 50%;
							overflow: hidden;
							svg{
								width: 100%;
								height: 100%;
							}
							input {
								width: 100%;
								height: 100%;
								opacity: 0;
								position: absolute;
								top: 0;
								left: 0;
							}
						}
						.tips {
							color: #ff3366;
							padding-left: 10px;
						}
						
					}
// 					.name {
// 						color: #999999;
// 						padding-right: 19px;
// 					}

// 					.tips {
// 						color: #ff3366;
// 						font-size: 12px;
// 						position: relative;
// 
// 						input {
// 							width: 100%;
// 							height: 100%;
// 							opacity: 0;
// 							position: absolute;
// 							top: 0;
// 							left: 0;
// 						}
// 					}
					.font{
						line-height: 20px;
						padding-left: 10px;
						color: #ff3366;
					}
					.video {
						display: flex;
						// padding: 10px 0 0 82px;
					.font{
						line-height: 20px;
						padding-top: 80px;
					}
						.video-box {
							width: 200px;
							height: 100px;
							background: rgba(244, 246, 249, 1);
							input {
								width: 100%;
								height: 100%;
								opacity: 0;
								cursor: pointer;
							}
							.upload-demo{
								width: 100%;
								height: 100%;
								line-height: 20px;
								position: relative;
									
								
							}
						}
					
						.videoValue {
							// margin: 0 20px;
							width: 200px;
							height: 100px;
							position: relative;
					
							.delete-icon {
								width: 30px;
								height: 30px;
								border-radius: 50%;
								// background: url(../../images/home/u178.png) no-repeat;
								background-size: 100% 100%;
								cursor: pointer;
								position: absolute;
								top: -20px;
								right: -20px;
								svg{
									width: 100%;
									height: 100%
								}
							}
						}
					}
					
					.img {
						display: flex;
						// padding: 20px 0 0 82px;
						.font{
							padding-top: 60px;
						}
						.img-box {
							width: 200px;
							height: 100px;
							position: relative;
							background: rgba(244, 246, 249, 1);
							.tupianBG{
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%,-50%);
								svg{
									width: 64px;
									height: 64px;
								}
							}
							input {
								width: 100%;
								height: 100%;
								opacity: 0;
								cursor: pointer;
							}
						}
					
						.videoValue {
							// margin: 0 20px;
							width: 200px;
							height: 100px;
							position: relative;
							display: flex;
							justify-content: center;
							align-items: center;
							background: rgba(244, 246, 249, 1);
							.delete-icon {
								width: 30px;
								height: 30px;
								border-radius: 50%;
								// background: url(../../images/home/u178.png) no-repeat;
								background-size: 100% 100%;
								cursor: pointer;
								position: absolute;
								top: -20px;
								right: -20px;
								svg{
									width: 100%;
									height: 100%;
								}
							}
						}
					}

					.portrait {
						position: relative;

						.img {
							width: 50px;
							height: 50px;
							// background: url(../../images/newCar/u9929.png) no-repeat;
							background-size: 100% 100%;
							border-radius: 50%;
							padding: 0;
							overflow: hidden;

							input {
								width: 100%;
								height: 100%;
								opacity: 0;
							}
						}
					}
				}

				.describe {
					display: flex;
					position: relative;

					.name {
						margin-right: 20px;
					}

					.describe-font {
						width: 300px;
						// height: 80px;
						position: relative;

						textarea {
							width: 100%;
							height: 100%;
							resize: none;
							padding: 10px;
						}

						.inpLength {
							line-height: 20px;
							position: absolute;
							bottom: 5px;
							right: 10px;
							.tips{
								color: #ff3366;
							}
						}
					}
				}
			}
	.bottom {
			border-top: rgba(238, 241, 246, 1) solid 1px;
			height: 100px;
			position: relative;

			.bottom-btn {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				display: flex;

				div {
					margin: 10px;
					width: 125px;
					text-align: center;
					line-height: 30px;
					cursor: pointer;
				}
// 				.back{
// 					color: #fff;
// 					background: #666;
// 				}
// 				.left {
// 					border: 1px solid rgba(25, 93, 234, 1);
// 					color: rgba(25, 93, 234, 1);
// 				}
// 
// 				.right {
// 					background: rgba(25, 93, 234, 1);
// 					color: #fff;
// 				}
			}
		}
</style>
<style lang="scss">
	.upload-demo {
		.el-upload {
			width: 100%;
			height: 100%;
			padding-top: 30px;
		}
	
		.el-upload__tip {
			position: absolute !important;
			margin: 0;
			width: 100%;
			bottom: 0;
			text-align: center;
		}
	}
</style>