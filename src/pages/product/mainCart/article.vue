<template>
	<div class="log-record page-container" :loading='loading'>
		<panel>
			<template slot="head">
				<div class="left">
					<span class="title">编辑主推车系的文章</span>
				</div>
			</template>
			<div class="message">
				<div class="data">
					<el-form ref="form" label-width="100px">
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
									<img :src="setImgPath(headPic) " alt="">
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
						<el-form-item label="文章标题">
							<div class="describe">
								<div class="describe-font">
									<from-input classType='textarea' placeholder="请输入内容" v-model="title" :max="30"></from-input>
								</div>
							</div>
							<!-- <div class="item">
							   <div class="inp">
							   	<el-input v-model="title" maxlength='30' type='textarea' autosize resize='none' placeholder="请输入内容">
							   	</el-input>
							   	<div class="inpLength">
							   		<span class="tips" v-if="title">{{title.length}}</span>
							   		<span class="tips" v-else>0</span>/30
							   	</div>
							   </div>
						   </div> -->
						</el-form-item>
						<el-form-item label="文章封面">
							<div class="img" v-loading='coverPicLoding'>
								<div class="img-box" v-if="coverPic">
									<img :src="setImgPath(coverPic)" alt="">
									<input type="file" accept="image/*" @change="upCoverPic">
								</div>
								<div class="img-box" v-else>
									<div class="tupianBG">
										<icon-svg icon-class="tupianBG" />
									</div>
									<input type="file" accept="image/*" @change="upCoverPic">
								</div>
								<div class="tips">
									<div>封面建议尺寸：630*400</div>
									<div>大小不超过500KB，只能上传一张，点击可更换</div>
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
			<div class="detail">
				<div class="detail-val">

					<el-form label-width="100px">
						<el-form-item label="图文编辑">
							<div class="item">
								<div class="font">
									<div>主图可上传长图片，至少上传1组,</div>
									<div>可单独上传一组纯图片 或 单独上传一组纯文字</div>
									<div>点击可更改</div>
								</div>
							</div>
							<div class="img">
								<div style="width: 890px;">
									<div class="bg" style="padding: 10px 20px;">
										<div class="valList">
											<!-- <vuedraggable class="wrapper" v-model="textList"> -->
												<!-- <transition-group name="detailArry"> -->
													<div class="item" v-for="(item,index) in textList" :key='index' @mouseleave="itemOut(index,item)" @click="itemClick(index)">

														<div class="item-img" v-if="item.mediaUrl" v-loading='mediaUrlLoding'>
															<div class="itemChangeImg">
																<input type="file" accept="image/*" @change="upImgSuccess">
															</div>
															<img :src="setImgPath(item.mediaUrl)">
														</div>
														<div class="item-text" v-if="item.content">
															<div v-if="item.clickFlag">
																<el-input type="textarea" autosize placeholder="请输入内容" resize="none" v-model="item.content">
																</el-input>
															</div>
															<p style="padding: 5px 15px;border: 1px solid transparent;" v-html="item.contentTwo"  v-else></p>
														</div>

														<div class="delete-icon" @click="delTextsItem(item,index)">
															<icon-svg icon-class="delete" />
														</div>
													</div>
												<!-- </transition-group> -->
											<!-- </vuedraggable> -->
										</div>
										<div class="val-bg">
											<div class="appImg" v-if="!textImgUrl" v-loading='textImgUrlLoding'>
												<input type="file" accept="image/*" @change="textImg">
												<div class="tupianBG">
													<icon-svg icon-class="tupianBG" />
												</div>

											</div>
											<div class="appImg-active" v-else v-loading='textImgUrlLoding'>
												<img :src='setImgPath(textImgUrl)'>
												<!-- <div class="imgBgSize" :style="[{'background':'url('+setImgPath(textImgUrl)+')'}]"></div> -->
												<input type="file" accept="image/*" @change="textImg">
												<div class="delete-icon" @click="delTextImg()">
													<icon-svg icon-class="delete" />
												</div>
											</div>
											<div class="appText">
												<el-input type="textarea" :autosize='{ minRows: 4}' autosize placeholder="请输入内容" resize="none" v-model="textValue">
												</el-input>
											</div>
										</div>
										<div class="valAddBtn" @click="addTextList" v-loading='mediaUrlLoding||textImgUrlLoding'>
											<div class="add-icon">
												<icon-svg icon-class="addIcon" />
											</div>
										</div>
									</div>
								</div>

								<div class="bg-img">
									<div style="line-height: 20px;">前端主推车系文章展示效果</div>
									<div class="img">
										<img src="../../../images/mianBg-3.png" alt="">
									</div>
								</div>
							</div>
						</el-form-item>
					</el-form>

				</div>
			</div>
			<div class="bottom">
				<div class="bottom-btn">
					<!-- <div class="left">预览前端</div> -->
					<div class="right" @click="keep"><el-button style='width: 100%;height: 100%;' type="primary" size="mini">保存</el-button></div>
					<div class="back" @click="back"><el-button style='width: 100%;height: 100%;' type="info" size="mini">返回</el-button></div>
				</div>
			</div>
			<!-- <no-data>开发中....</no-data> -->
		</panel>
	</div>
</template>

<script>
	import Panel from '@/components/Panel'
	import NoData from '@/components/NoData'
	import vuedraggable from 'vuedraggable';
	import {
		addArticle,
		editArticle,
		getArticleInfo
	} from '@/api/mainCart'
	import {
		uploadPic
	} from '@/api/common'
	import {
		setImgPath
	} from '@/utils/index'
	import fromInput from '@/components/FormInput'
	export default {
		components: {
			Panel,
			NoData,
			vuedraggable,
			fromInput
		},
		data() {
			return {
				setImgPath: setImgPath,
				loading: false,
				coverPic: '',
				headPic: "",
				mediaUrl: '',
				author: "",
				tag: '',
				desc: '',
				title: '',
				uploadUrl: process.env.NODE_ENV === 'development' ? '/api/upload/uploadMv?busType=10' : '/upload/uploadMv?busType=10',
				textValue: '',
				textList: [],
				textImgUrl: '',
				textListIndex: '',
				delTexts: [],
				coverPicLoding: false,
				headPicLoding: false,
				mediaUrlLoding: false,
				textImgUrlLoding: false
			}
		},
		created() {
			// console.log(this.$route.query)
			if (this.$route.query.articleId) {
				this.getArticleInfo()
			}
		},
		methods: {
			delTextList(index) {
				this.detailArry.splice(index, 1)
			},
			upImgSuccess(e) {
				let oFReader = new FileReader();
				oFReader.readAsDataURL(e.target.files[0]);
				var fileSize = e.target.files[0].size / 1048576;
				// console.log(fileSize)
				if (fileSize > 0.5) {
					this.$message({
						message: '图片大小不超过500kb，请重新选择',
						type:'warning'
					})
					return
				}
				oFReader.onload = (async (oFREvent) => {
					this.mediaUrlLoding = true;
					let imgData = oFREvent.currentTarget.result;
					let obj = {
						busType: 8,
						picUrl: imgData
					}
					try {
						let res = await uploadPic(obj);
						this.textList[this.textListIndex].mediaUrl = res.filePath;
						this.$message({
							message: res.errorMsg,
							type: 'success'
						})
						this.mediaUrlLoding = false;
					} catch (e) {
						//TODO handle the exception
					}

				})
			},
			itemClick(index) {
				console.log(index)
				this.textListIndex = index;
				this.textList[index].clickFlag = true;
			},
			itemOut(index,item) {
				// console.log(this.timer)
				// clearInterval(this.timer)
				if(item.content){
					item.contentTwo=item.content.replace(/\n/g,"<br/>");
				}
				// this.textList[index].moveFlag = false;
				this.textList[index].clickFlag = false;
			},

			async getArticleInfo() {
				// this.$loading.service()
				this.loading = true;
				let send = {
					articleId: this.$route.query.articleId
				}
				// console.log(send)
				try {
					let res = await getArticleInfo(send);
					this.coverPic = res.coverPic;
					this.mediaUrl = res.mediaUrl;
					this.headPic = res.headPic;
					this.author = res.author;
					this.tag = res.tag;
					this.desc = res.desc;
					this.title = res.title;
					for (let i = 0; i < res.corporationImageTextDtos.length; i++) {
						res.corporationImageTextDtos[i].moveFlag = false;
						res.corporationImageTextDtos[i].clickFlag = false;
					}
					this.textList = res.corporationImageTextDtos;
					this.textList.forEach(item =>{
						if(item.content){
							item.contentTwo=item.content.replace(/\n/g,"<br/>")
							console.log(item)
						}
					})
					this.loading = false;
				} catch (e) {
					this.loading = false;
					//TODO handle the exception
				}
				// 			
			},
			textImg(e) {
				var fileSize = e.target.files[0].size / 1048576;
				// console.log(fileSize)
				if (fileSize > 0.5) {
					this.$message({
						message: '图片大小不超过500kb，请重新选择',
						type: 'warning'
					})
					return
				}
				console.log('执行')
				let oFReader = new FileReader();
				oFReader.readAsDataURL(e.target.files[0]);
				
				oFReader.onload = (async (oFREvent) => {
					this.textImgUrlLoding = true;
					let imgData = oFREvent.currentTarget.result;
					let obj = {
						busType: 8,
						picUrl: imgData
					}
					try {
						let res = await uploadPic(obj);
						this.textImgUrl = res.filePath;
						this.$message({
							message: '上传成功',
							type: 'success'
						})
						this.textImgUrlLoding = false;
					} catch (e) {
						this.textImgUrlLoding = false;
						//TODO handle the exception
					}

				})
			},
			addTextList() {

				// console.log(!this.textImgUrl && !this.textValue)
				if (!this.textImgUrl && !this.textValue) {
					this.$message({
						message: "请填写文章内容",
						type: 'warning'
					})
				} else {
					let obj = {
						mediaUrl: this.textImgUrl,
						content: this.textValue,
						contentTwo: this.textValue.replace(/\n/g,"<br/>"),
						moveFlag: false,
						clickFlag: false,
					}
					this.textList.push(obj)
				}
				this.textImgUrl = '';
				this.textValue = '';
			},
			delTextImg() {
				this.textImgUrl = '';
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
					try {
						let res = await uploadPic(obj);
						this.headPic = res.filePath;
						this.info.headPic = res.filePath;
						this.$message({
							message: '上传成功',
							type: 'success'
						})
						// console.log(this.info)
						this.headPicLoding = false;
					} catch (e) {
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
						type: 'error'
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
					try {
						let res = await uploadPic(obj);
						this.coverPic = res.filePath
						this.info.coverPic = res.filePath;
						this.$message({
							message: '上传成功',
							type: 'success'
						})
						this.coverPicLoding = false;
					} catch (e) {
						//TODO handle the exception
						this.coverPicLoding = false;
					}
					// console.log(obj)

				})

			},
			async addArticle(obj) {
				try {
					await addArticle(obj);
					this.$message({
						message: '新增车系文章成功',
						type: 'success'
					})
					this.back()
				} catch (e) {
					//TODO handle the exception
				}
				// 			this.$Api.newCar.addArticle(obj).then((res) => {
				// 				if (res.success) {
				// 					this.$message({
				// 						message: '新增车系文章成功',
				// 						type: 'success'
				// 					})
				// 					this.$emit('keep', false);
				// 				}
				// 			})
			},
			async editArticle(obj) {

				try {
					await editArticle(obj);
					this.$message({
						message: '修改车系文章成功',
						type: 'success'
					})
					this.back()
				} catch (e) {
					//TODO handle the exception
				}
				// 			this.$Api.newCar.editArticle(obj).then((res) => {
				// 				if (res.success) {
				// 					this.$message({
				// 						message: res.errorMsg,
				// 						type: 'success'
				// 					})
				// 					this.$emit('keep', false);
				// 				}
				// 			})
			},
			delTextsItem(item, index) {
				// console.log(item)
				if (item.id) {
					this.delTexts.push(item.id);
				}
				this.textList.splice(index, 1);

			},
			sendData() {

				if (this.$route.query.articleId) {
					if (this.textImgUrl || this.textValue) {
						let obj = {
							mediaUrl: this.textImgUrl,
							content: this.textValue,
						}
						this.textList.push(obj);
					}
					let obj = {
						type: 2,
						headPic: this.headPic,
						title: this.title,
						tag: this.tag,
						coverPic: this.coverPic,
						id: this.$route.query.articleId,
						author: this.author,
						pushMainId: this.$route.query.carId,
						delTexts: this.delTexts.join(','),
						imageTextArry: JSON.stringify(this.textList)
					}
					// console.log(obj)
					if (obj.headPic && obj.title && obj.tag && obj.coverPic && obj.author && obj.imageTextArry) {

						if (this.textList.length != 0) {
							this.editArticle(obj)
						} else {
							this.$message({
								message: '编辑文章时,必须添加文章内容',
								type: 'warning'
							})
						}

					} else {
						this.$message({
							message: '请完善信息',
							type: 'warning'
						})
					}

				} else {
					if (this.textImgUrl || this.textValue) {
						let obj = {
							mediaUrl: this.textImgUrl,
							content: this.textValue,
						}
						this.textList.push(obj);
					}
					let obj = {
						type: 2,
						headPic: this.headPic,
						title: this.title,
						tag: this.tag,
						coverPic: this.coverPic,
						author: this.author,
						pushMainId: this.$route.query.carId,
						imageTextArry: JSON.stringify(this.textList)
					}
					if (obj.headPic && obj.title && obj.tag && obj.coverPic && obj.author && obj.imageTextArry) {

						if (this.textList.length != 0) {
							this.addArticle(obj)
						} else {
							this.$message({
								message: '添加文章时,必须添加文章内容',
								type: 'warning'
							})
						}
					} else {
						this.$message({
							message: '请完善信息',
							type: 'warning'
						})
					}

				}

			},
			back() {
				this.$router.replace(
				{
					name:'mainCart',
					query:{
						choisePushId:this.$route.query.choisePushId
					}
				})
			},
			keep() {

				this.sendData()
				// console.log(this.info)
				// console.log("发生参数")
				// this.$emit('keep', false);
			},
			cancl() {
				// console.log("发生参数")
				this.$emit('keep', false);
			}
		}
	}
</script>
<style lang="scss">
	.describe-font{
		.account-form-input{
			.input-box{
				width: 280px;
				.el-textarea__inner{
					padding-right: 55px;
				}
			}
		}
	}
</style>
<style scoped="scoped" lang="scss">
	img {
		max-height: 100%;
		max-width: 100%;
		margin: 0 auto;
	}

	.imgBgSize {
		background-size: contain !important;
		height: 100px;
		background-position: center !important;
		background-repeat: no-repeat !important;
	}

	.message {
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
			width: 1000px;
			padding-right: 30px;

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

						.tips {
							color: #ff3366;
						}
					}
				}
			}

			.item {
				display: flex;

				.authorPic {
					position: relative;
					width: 30px;
					height: 30px;
					overflow: hidden;
					border-radius: 50%;

					svg {
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

			.name {
				color: #999999;
				font-size: 14px;
				padding-right: 19px;
			}

			.tips {
				padding-left: 10px;
			}

			.video {
				display: flex;
				padding: 10px 0 0 0;
				position: relative;

				.video-box {
					width: 180px;
					height: 100px;
					// background: url(../../images/newCar/u9019.png) no-repeat;
					background-position: center;
					background-size: 50% 50%;
					margin: 0 20px;

					input {
						width: 100%;
						height: 100%;
						opacity: 0;
						cursor: pointer;
					}
				}
			}

			.img {
				display: flex;
				// padding: 20px 0 0 0;
				// position: relative;

				.tips {
					line-height: 20px;
					color: #ff3366;
					padding-top: 60px
				}

				.img-box {
					width: 180px;
					height: 100px;
					background: rgba(244, 246, 249, 1);
					position: relative;

					.tupianBG {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);

						svg {
							width: 64px;
							height: 64px;
						}
					}

					input {
						width: 100%;
						height: 100%;
						opacity: 0;
						cursor: pointer;
						position: absolute;
						top: 0;
						left: 0;
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
					position: relative;

					input {
						width: 100%;
						height: 100%;
						opacity: 0;
						position: absolute;
						top: 0;
						left: 0;
					}
				}
			}
		}

	}

	.detail {
		padding-top: 50px;

		.font {
			color: #ff3366;
			font-size: 14px;
			line-height: 20px;
			text-align: left;
		}

		.ifdetail {
			display: flex;
			align-items: center;
			padding-left: 50px;

			.name {
				margin-right: 20px;
			}
		}

		.detail-val {
			padding: 5px 0 20px;

			.item {
				display: flex;
				align-items: center;

				.name {
					margin-right: 20px;
					color: #999999;
				}
			}

			.img {
				display: flex;
				// padding-left: 75px;

				.bg {
					// width: 100%;
					width: 700px;
					background: rgba(238, 241, 246, 1);

					.valList {
						.item {
							display: block;
							background: #fff;
							margin-bottom: 10px;
							position: relative;
							line-height: 20px;
							.item-img {
								position: relative;

								.itemChangeImg {
									width: 100%;
									height: 100%;
									position: absolute;
									top: 0;
									left: 0;
									opacity: 0;

									input {
										width: 100%;
										height: 100%;
									}
								}
							}

							.moveTips {
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								color: #ff3366;
								z-index: 10;
							}

							.item-text {
								text-align: left;
								padding: 20px 10px;
							}

							.delete-icon {
								width: 30px;
								height: 30px;
								// background: url(../../images/home/u178.png)no-repeat;
								background-size: 100% 100%;
								position: absolute;
								top: -10px;
								right: -10px;

								svg {
									width: 100%;
									height: 100%;
								}
							}
						}
					}

					.val-bg {
						padding: 10px;
						background: #fff;

						.tupianBG {
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);

							svg {
								width: 64px;
								height: 64px;
							}
						}

						.appImg {
							width: 100%;
							height: 100px;
							background: rgba(244, 246, 249, 1);
							position: relative;

							input {
								width: 100%;
								height: 100%;
								opacity: 0;
								cursor: pointer;
								position: absolute;
								top: 0;
								left: 0;
								z-index: 1;
							}
						}

						.appImg-active {
							position: relative;

							input {
								width: 100%;
								height: 100%;
								top: 0;
								left: 0;
								position: absolute;
								opacity: 0;
							}

							.delete-icon {
								width: 30px;
								height: 30px;
								border-radius: 50%;
								// background: url(../../images/home/u178.png) no-repeat;
								background-size: 100% 100%;
								cursor: pointer;
								position: absolute;
								top: -10px;
								right: -10px;

								svg {
									width: 100%;
									height: 100%;
								}
							}
						}

						.appText {
							width: 100%;
							padding: 10px 0;
						}
					}

					.valAddBtn {
						width: 100%;
						height: 80px;
						background: #fff;
						position: relative;
						margin-top: 10px;
						cursor: pointer;
						.add-icon {
							width: 35px;
							height: 35px;
							// background: url(../../images/newCar/u9067.png) no-repeat;
							background-size: 100% 100%;
							position: absolute;
							overflow: hidden;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);

							svg {
								width: 100%;
								height: 100%;
							}
						}
					}
				}

				.bg-img {
					background: rgba(238, 241, 246, 1);
					width: 260px;
					padding: 10px;
					height: 362px;
					text-align: center;
					.img {
						margin-top: 10px;
						display: block;
						
						// background: url(../../images/newCar/u8876.png) no-repeat;
						// background-size: 100% 100%;
						// height: 500px
						// min-height: 500px;
						// padding: 0;
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

			.back {
				// color: #fff;
				// background: #666;
			}

			.left {
				// border: 1px solid rgba(25, 93, 234, 1);
				// color: rgba(25, 93, 234, 1);
			}

			.right {
				// background: rgba(25, 93, 234, 1);
				// color: #fff;
			}
		}
	}
</style>
