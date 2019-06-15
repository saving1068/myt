<template>
	<div class="log-record page-container" v-loading='loading'>
		<panel>
			<template slot="head">
				<div class="title shadow">
					<div class="title-name">
						<div style="font-size: 20px;">当前车系</div>
						<div style="padding-top: 10px;">{{content.statuStr}}</div>
					</div>
					<div class="title-img">
						<img v-if="content.brandImg" :src="setImgPath(content.brandImg)">
					</div>
					<div class="title-massage">
						<div class="name">{{content.brandName}}</div>
						<div>{{content.brandLevelStr}}</div>
						<div>{{content.minPrice}} ~{{content.maxPrice}}</div>
						<div>{{content.netStr}}</div>
						<div>{{content.carTypeNum}}款车型</div>
					</div>
					<div class="bcakBtn" @click="back">
						<el-button  size="mini" type="info">返回</el-button>
					</div>
				</div>
			</template>
			<div class="detail">
			<el-form ref="form" label-width="100px">
				<el-form-item label="是否详细描述">

					<div class="detail-val">
						<div class="font">
							<div>主图可上传长图片，至少上传1组,</div>
							<div>可单独上传一组纯图片 或 单独上传一组纯文字</div>
							<!-- <div>模块可拖拽,点击可更改</div> -->
						</div>
						<div class="textList">
							<div class="bg" style="padding: 10px 20px;">
								<div class="valList" v-loading='detailArryLoding'>
									<!-- <vuedraggable class="wrapper" v-model="detailArry"> -->
										<!-- <transition-group :key='1'> -->
											<div class="item" v-for="(item,index) in detailArry" :key='index'  @click="itemClick(index)"  @mouseleave="itemOut(index,item)">
												<div v-if="item.isDelete == 0">
													<div class="item-img" v-if="item.mediaUrl">
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
														<p v-else v-html='item.contentTwo' style="padding: 5px 15px;border: 1px solid transparent;"></p>
													</div>
													
													
													<div class="delete-icon" @click="delTextList(index)">
														<icon-svg icon-class="delete" />
													</div>
												</div>
											</div>
										<!-- </transition-group> -->
									<!-- </vuedraggable> -->
								</div>
								<div class="val-bg" v-loading='textImgUrlLoding'>
									<div class="appImg" v-if="!textImgUrl">
										<div class="tupianBG">
											<icon-svg icon-class="tupianBG" />
										</div>
										<input type="file" accept="image/*" @change="textImg">
									</div>
									<div class="appImg-active" v-else>
										<img :src='setImgPath(textImgUrl)'>
										<!-- <div class="imgBgSize" :style="[{'background':'url('+setImgPath(textImgUrl)+')'}]"></div> -->
										<input type="file" accept="image/*" @change="textImg">
										<div class="delete-icon" @click="delTextImg()">
											<icon-svg icon-class="delete" />
										</div>
									</div>
									<div class="appText">
										<el-input type="textarea" :autosize='{ minRows: 4}' placeholder="请输入内容" resize="none" v-model="textValue">
										</el-input>
									</div>
								</div>
								<div class="valAddBtn" @click="addTextList" v-loading='textImgUrlLoding'>
									<div class="add-icon">
										<icon-svg icon-class="addIcon" />
									</div>
								</div>
							</div>
							<div class="bg-img" style="padding: 0 10px;">
								<div>前端展示效果</div>
								<div class="img">
									<img src="../../../images/uploadP.png" alt="">
								</div>
							</div>
						</div>
					</div>
				</el-form-item>
			</el-form>
				<div class="bottom">
					<div class="bottom-btn">
						<!-- <div class="left">预览前端</div> -->
						<div class="right" @click="keep">保存</div>
						<div class="back" @click="back">返回</div>
					</div>
				</div>
			</div>

		</panel>
		
	</div>

</template>

<script>
	import vuedraggable from 'vuedraggable';
	import Panel from '@/components/Panel'
	import NoData from '@/components/NoData'
	import {getCorporationCarTypeConfigs,editCarTypeConfig,editCarTypeImage,queryCarTypeImage} from '@/api/carAdmin'
	import {getCorporationBrandConfigs} from '@/api/newCar'
	import {
		uploadPic,
	} from '@/api/common'
	import {
		setImgPath,
	} from '@/utils'

	export default {
		components: {
			vuedraggable,
			Panel,
			NoData
		},
		data() {
			return {
				loading:false,
				content: {},
				setImgPath: setImgPath,
				detailArry: [],
				detailArryIndex: 0,
				textImgUrlLoding: false,
				mgImgsLoding: false,
				detailArryLoding: false,
				textImgUrl: '',
				textValue: '',
				textImgPicId:'',
			}
		},
		created() {
			let query = this.$route.query;
			let obj = {
				shopBrandId:query.carId,
				carTypeId:query.carTypeId,
				type:2
			}
			this.getCarInfo(obj)
		},
		methods: {
			async keep() {
				this.loading = true;
				if(this.detailArry.length){
					let obj = {
						mediaUrl: this.textImgUrl,
						content: this.textValue,
						mediaFileId:this.textImgPicId,
						busId:this.$route.query.carTypeId,
						type:1,
						isDelete:0
					}
					if(this.textImgUrl||this.textValue){
						this.detailArry.push(obj)
					}
					this.textImgUrl = '';
					this.textValue = '';
					let send = {
						jsonStr:JSON.stringify(this.detailArry),
					}
					console.log(this.detailArry)
					try{
						await editCarTypeImage(send);
						this.$message.success('设置参数成功')
						this.$router.go(-1)
						this.loading = false;
					}catch(e){
						this.loading = false;
					}
					
				}else{
					this.$message.warning('请完善信息')
				}
				
				console.log(this.detailArry)
			},
			async getCarInfo(obj) {
				this.loading = true;
				try {
					let res = await getCorporationBrandConfigs({shopBrandId:obj.shopBrandId});
					this.content = { ...res
					};
					let imgInfo = await queryCarTypeImage({carTypeId:obj.carTypeId})
					imgInfo.forEach(item =>{
						item.clickFlag = false
					})
					this.detailArry = imgInfo;
					this.detailArry.forEach(item =>{
						if(item.content){
							item.contentTwo=item.content.replace(/\n/g,"<br/>")
							console.log(item)
						}
					})
					this.loading = false;
					console.log(this.content)
				} catch (e) {
					this.loading = false;
					//TODO handle the exception
				}
				
			},
			back(){
				this.$router.go(-1);
			},
			delTextImg() {
				this.textImgUrl = '';
			},
			textImg(e) {
				let oFReader = new FileReader();
				oFReader.readAsDataURL(e.target.files[0]);
				var fileSize = e.target.files[0].size / 1048576;
				console.log(fileSize)
				if (fileSize > 0.5) {
					this.$message({
						message: '图片大小不超过500kb，请重新选择',
						type: 'warning'
					})
					return
				}
				oFReader.onload = (async (oFREvent) => {
					this.textImgUrlLoding = true;
					let imgData = oFREvent.currentTarget.result;
					let obj = {
						busType: 8,
						picUrl: imgData,
						
					}
					try {
						const info = await uploadPic(obj)
						console.log(info)
						this.textImgUrl = info.filePath;
						this.textImgUrlLoding = false;
						this.textImgPicId = info.picId
						
					} catch (err) {
						this.textImgUrlLoding = false;
						// this.$message.error(err)
						//TODO handle the exception
					}
					// console.log(obj)

				})
			},
			delTextList(index) {
				this.detailArry[index].isDelete = 1;
				console.log(this.detailArry[index])
			},
			addTextList() {
				let obj = {
					mediaUrl: this.textImgUrl,
					content: this.textValue,
					contentTwo: this.textValue.replace(/\n/g,"<br/>"),
					mediaFileId:this.textImgPicId,
					busId:this.$route.query.carTypeId,
					clickFlag:false,
					isDelete:0,
					type:1,
				}
				if (!this.textImgUrl && !this.textValue) {
					this.$message({
						message: "请填写文章内容",
						type: 'warning'
					})
				} else {

					this.detailArry.push(obj);
				}
				this.textImgUrl = '';
				this.textValue = '';
			},
			upImgSuccess(e) {
				let oFReader = new FileReader();
				oFReader.readAsDataURL(e.target.files[0]);
				var fileSize = e.target.files[0].size / 1048576;
				console.log(fileSize)
				if (fileSize > 0.5) {
					this.$message({
						message: '图片大小不超过500kb，请重新选择'
					})
					return
				}
				oFReader.onload = (async (oFREvent) => {
					this.detailArryLoding = true;
					let imgData = oFREvent.currentTarget.result;
					let obj = {
						busType: 8,
						picUrl: imgData
					}
					// console.log(obj)
					try {
						const info = await uploadPic(obj);
						this.detailArry[this.detailArryIndex].mediaUrl = info.filePath;
						this.detailArryLoding = false;
						// console.log(info)
					} catch (err) {
						this.detailArryLoding = false;
					}
				})
			},
			itemClick(index) {
				console.log(index)
				this.detailArryIndex = index;
				this.detailArry[index].clickFlag = true;
			},
			itemMove(index) {
				// console.log(index)
				for (let i = 0; i < this.detailArry.length; i++) {
					this.detailArry[i].moveFlag = false
				}
				this.detailArry[index].moveFlag = true;
				console.log('show', index)

			},
			itemOut(index,item) {
				// console.log(this.timer)
				// clearInterval(this.timer)
					// console.log('出去了')
					if(item.content){
						item.contentTwo=item.content.replace(/\n/g,"<br/>");
					}
				
				this.detailArry[index].clickFlag = false;
			},
			deleteListImg(index) {
				this.mgImgs.splice(index, 1)
			},
		}
	}
</script>

<style scoped="scoped" lang="scss">
	img{
		max-height: 100%;
		margin: 0 auto;
	}
	.title {
		text-align: left;
		display: flex;
		align-items: center;
		background: #fff;
		width: 100%;
		position: relative;

		.title-img {
			width: 150px;
			height: 60px;
			margin: 0 15px 0 50px;
		}

		.title-massage {
			display: flex;
			align-items: center;

			div {
				padding: 10px;
				line-height: 40px;
			}

			.name {
				font-size: 20px;
				font-weight: 600;
			}

		}

		.admin {
			display: flex;
			padding: 0 10px;
			align-items: center;

			.adminText {
				padding-right: 10px;
			}

			.adminClose {
				padding: 5px;
				border: 1px solid #666;
			}
		}

		.admin::after {
			border-left: 1px solid #666;
		}

		.bcakBtn {
			cursor: pointer;
			position: absolute;
			right: 1%;
		}
	}

	.detail {
		padding: 10px 60px 20px;

		.detail-val {
			width: 1000px;
			.font {
				line-height: 24px;
				color: #ff3366;
			}

			.textList {
				display: flex;
				margin-top: 20px;
			}

			.bg {
				width: 700px;
				background: rgba(238, 241, 246, 1);

				.valList {
					.item {
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
							top: 10px;
							left: 50%;
							transform: translateX(-50%);
							color: #ff3366;
							z-index: 10;
							display: flex;

							p {
								padding: 0 2px
							}
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
							right: -20px;
							z-index: 11;

							svg {
								width: 100%;
								height: 100%;
							}
						}

						.item-text {
							text-align: left;
							padding: 20px 10px;
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
						background-position: center;
						background-size: contain;
						position: relative;
						display: flex;
						align-items: center;
						justify-content: center;

						input {
							width: 100%;
							height: 100%;
							opacity: 0;
							cursor: pointer;
						}
					}

					.appImg-active {
						width: 100%;
						height: 100%;
						position: relative;
						display: flex;
						align-items: center;
						justify-content: center;

						input {
							width: 100%;
							height: 100%;
							opacity: 0;
							position: absolute;
							left: 0;
							top: 0;
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
							z-index: 11;

							svg {
								width: 100%;
								height: 100%;
							}
						}
					}

					.appText {
						width: 100%;
						margin-top: 10px;
					}
				}

				.valAddBtn {
					width: 100%;
					height: 80px;
					background: #fff;
					position: relative;
					cursor: pointer;
					margin-top: 10px;

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
						z-index: 0;
						svg {
							width: 100%;
							height: 100%;
						}
					}
				}
			}

			.bg-img {
				text-align: center;
				margin-left: 170px;
				background: rgba(238, 241, 246, 1);
				padding: 0 10px 20px;
				width: 260px;
				height:595px;
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
				color: #fff;
				background: #666;
			}
	
			.left {
				border: 1px solid rgba(25, 93, 234, 1);
				color: rgba(25, 93, 234, 1);
			}
	
			.right {
				background: rgba(25, 93, 234, 1);
				color: #fff;
			}
		}
	}
</style>
