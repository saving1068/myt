<template>
	<div class="warp">
		<div class="log-record page-container">
			<panel v-loading="loading">
				<template slot="head">
					<!-- <div class="title shadow"> -->
					<div class="title">
						<div class="title-big">新车库</div>
						<i class="el-icon-arrow-right"></i>
						<div v-if="this.$route.query.carId">编辑车系</div>
						<div v-else>新增车系</div>
					</div>
					<div class="bcakBtn" @click="back">
						<el-button size="mini" type="info">返回</el-button>
					</div>
					<!-- </div> -->
				</template>

				<div class="shadow">
					<div class="massge">
						<div class="massge-title">基础信息</div>
						<div class="massge-Basics">
							<el-form ref="form" style='flex: 1;' :model="InfoForm" label-width="100px">
								<el-form-item label="车系名称">
									<div class="massge-item">
										<div>
											<from-input classType='input' v-model="brandName" :max="12"></from-input>
										</div>
										<div class="btn" v-if="statuStr">
											{{statuStr}}
										</div>
									</div>
								</el-form-item>
								<el-form-item label="所属结构" v-loading="structureLoding">
									<div class="massge-item">
										<div class="cheak-box">
											<el-radio-group v-model="brandLevel">
												<el-radio v-for='(v,i) in structure' :key='i' :label="v.id">{{v.content}}</el-radio>
											</el-radio-group>
										</div>
									</div>
								</el-form-item>
								<el-form-item label="销售类型">
									<div class="massge-item">
										<div class="cheak-box">
											<el-radio-group v-model="saleStatus">
												<el-radio :label="1">在售</el-radio>
												<el-radio :label="2">预售</el-radio>
												<el-radio v-if="this.$route.query.carId" :label="3">退市</el-radio>
											</el-radio-group>
										</div>
									</div>
								</el-form-item>
								<el-form-item label="是否可试驾" v-if="this.$route.query.carId">
									<div class="massge-item">
										<div class="cheak-box">
											<el-radio-group v-model="tryCar" @change="ifChoiceCar">
												<el-radio :label="true">是</el-radio>
												<el-radio :label="false">否</el-radio>
											</el-radio-group>
										</div>
										<div class="iftry" v-if="this.$route.query.carId&&tryCar == 1">
											<el-button type="warning" @click='carBrandDialog'>可试驾车型</el-button>
										</div>
									</div>
								</el-form-item>
								<el-form-item label="官方价格">
									<div class="massge-item">
										<div class="price-box">
											<el-input placeholder="请输入内容" type='number' @change='minPriceInp' max='1000000' v-model="minPrice">
											</el-input>
											<span>元</span>
										</div>
										<div class="price-heng"></div>
										<div class="price-box">
											<el-input placeholder="请输入内容" type='number' max='1000000' @change='maxPriceInp' v-model="maxPrice">
											</el-input><span>元</span>
										</div>
									</div>
								</el-form-item>
								<el-form-item label="官方主图" v-loading='brandImgLoding'>
									<div class="massge-item">
										<div class="img" style="position: relative;" :style="{border:brandImg?'none':''}">
											<input type="file" accept="image/*" @change="officialImg">
											<div v-if="!brandImg" class="tupianBG">
												<icon-svg icon-class="tupianBG" />
											</div>
											<div style="width: 100%;height: 100%;" class="center">
												<img v-if="brandImg" :src="setImgPath(brandImg)">
											</div>
										</div>
										<div class="font">
											<div>最优建议尺寸：660*235</div>
											<div>大小不超过2M，只能上传一张，点击可更换</div>
										</div>
									</div>
								</el-form-item>
							</el-form>
							<div class="showImg pd10">
								<div class="showImg-title">
									前端展示效果
								</div>
								<div  style="height:400px">
									<img src="../../../images/newCar-4.png" alt="">
								</div>
								
							</div>
						</div>
						<div class="massge-title">车系详情信息</div>
						<div class="upload-img">
							<el-form ref="form" :model="InfoForm" label-width="100px" v-loading='mgImgsLoding' style='flex: 1;'>
								<el-form-item label="上传主图">
									<div class="upload-font">
										<div class="uploadBtn">
											<el-button size="small" type="warning">点击上传</el-button>
											<input type="file" accept="image/*" @change="uploadImg">
										</div>
										<div class="tips">
											<div>主图建议尺寸：630*400</div>
											<div>大小不超过500kb，至少上传1张，最多上传10张</div>
										</div>
									</div>
									<div class="img-list">
										<vuedraggable class="wrapper" v-model="mgImgs">
											<!-- <transition-group :key='1'> -->
											<div class="item" v-for="(v,i) in mgImgs" :key='i'>
												<img :src="setImgPath(v.filePath)">
												<div @click="deleteListImg(i)" class="delete-icon">
													<icon-svg icon-class="delete" />
												</div>
											</div>
											<!-- </transition-group> -->
										</vuedraggable>
									</div>
								</el-form-item>
							</el-form>
							<div class="showImg pd10">
								<div class="showImg-title">
									前端展示效果
								</div>
								<div  style="height:385px">
									<img src="../../../images/newCar-1.png" alt="">
								</div>
								
							</div>
						</div>
						<div class="upload-video">
							<el-form ref="form" label-width="100px">
								<el-form-item label="是否上传视频">
									<div class="cheak-box">
										<el-radio-group v-model="hasVideo">
											<el-radio :label="1">上传</el-radio>
											<el-radio :label="0">不上传</el-radio>
										</el-radio-group>
									</div>
								</el-form-item>
							</el-form>
							<div style="display: flex;" v-if="hasVideo == 1" >
								<el-form ref="form" :model="InfoForm" label-width="100px" style='flex: 1;'> 
									<el-form-item label="上传视频" v-loading='videoPathLoding'>
										<div class="video">
											<div class="video-box" v-if="!videoPath">
												<el-upload multiple class="upload-demo" :action="uploadUrl" :before-upload='beforeUploadVideo' :on-success="handleAvatarSuccess"
												 :on-progress='uploadVideoIng' :on-error='uploadError' multiple>
													<i class="el-icon-upload"></i>
													<div class="el-upload__text"><em>点击上传</em></div>
													<div class="el-upload__tip" slot="tip">上传视频文件，且不超过10M</div>
												</el-upload>
											</div>
											<div class="videoValue" v-else>
												<video :src="setImgPath(videoPath)" controls></video>
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
										<div class="img" v-loading='videoCoverLoding'>
											<div class="img-box" v-if="!videoCover">
												<div class="tupianBG">
													<icon-svg icon-class="tupianBG" />
												</div>
												<input type="file" accept="image/*" @change="uploadVideoImg">
											</div>

											<div class="videoValue" v-else>
												<img :src="setImgPath(videoCover)"></img>
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
												<from-input classType='textarea' placeholder="请输入内容" v-model="videoDesc" :max="50"></from-input>
												<!-- <el-input type="textarea" autosize placeholder="请输入内容" maxlength=50 resize="none" v-model="videoDesc">
											
											</el-input>
											<div class="inpLength">
												<span class="tips" v-if="videoDesc">{{videoDesc.length}}</span>
												<span class="tips" v-else>0</span>
												/50</div> -->
											</div>
										</div>
									</el-form-item>
								</el-form>
								<div class="showImg pd10">
									<div class="showImg-title">
										前端展示效果
									</div>
									<div  style="height:400px">
										<img src="../../../images/newCar-3.png" alt="">
									</div>
									
								</div>
							</div>
						</div>
						<div class="detail">
							<el-form ref="form" :model="InfoForm" label-width="100px" style='flex: 1;'>
								<el-form-item label="是否详细描述">
									<div class="cheak-box">
										<el-radio-group v-model="hasDetail">
											<el-radio :label="1">需要</el-radio>
											<el-radio :label="0">不需要详情描述</el-radio>
										</el-radio-group>
									</div>
									<div class="detail-val" v-show="hasDetail == 1">
										<div class="font">
											<div>主图可上传长图片，至少上传1组,</div>
											<div>可单独上传一组纯图片 或 单独上传一组纯文字</div>
											<div>点击可更改</div>
										</div>
										<div class="textList">
											<div class="bg" style="padding: 10px 20px;">
												<div class="valList" v-loading='detailArryLoding'>
													<!-- <vuedraggable class="wrapper" v-model="detailArry"> -->
														<!-- <transition-group> -->
														<div class="item" v-for="(item,index) in detailArry" :key='index' @mouseleave="itemOut(index,item)" @click="itemClick(index)">

															<div class="item-img" v-if="item.mediaUrl">
																<div class="itemChangeImg">
																	<input type="file" accept="image/*" @change="upImgSuccess">
																</div>
																<img :src="setImgPath(item.mediaUrl)">
															</div>
															<div class="item-text" v-if="item.content">
																<!-- <div style="background: #195DEA;" > -->
																	
																	<el-input v-if="item.clickFlag" type="textarea" autosize placeholder="请输入内容" resize="none" v-model="item.content">
																	</el-input>
																<!-- </div> -->
																<p style="padding: 5px 15px;border: 1px solid transparent;" v-html="item.contentTwo" v-else></p>
															</div>


															<div class="delete-icon" @click="delTextList(index)">
																<icon-svg icon-class="delete" />
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
												<div class="valAddBtn" @click="addTextList">
													<div class="add-icon">
														<icon-svg icon-class="addIcon" />
													</div>
												</div>
											</div>
										</div>
									</div>
								</el-form-item>
							</el-form>
							<div class="showImg pd10" style="height: 665px;">
								<div class="showImg-title">
									前端展示效果
								</div>
								<div style="height:615px;">
									<img src="../../../images/newCar-2.png" alt="">
								</div>
								
							</div>
						
						</div>
					</div>
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
		<!-- 车型 -->
		<el-dialog :visible.sync="carBrandDialogVisible" width="700px" top="40px" center class="car-dialog">
			<div slot="title" class="cartType-dialog-head" style="text-align: left;">
				<span class="left">车系试驾设置</span>
			</div>
			<div class="tryCar">
				<span>「{{brandName}}」是否可试驾</span>
				<el-radio-group v-model="ifTry" @change="ifChoiceCar">
					<el-radio :label="true">是</el-radio>
					<el-radio :label="false">否</el-radio>
				</el-radio-group>
			</div>
			<div class="car-type-content" v-show="ifTry" v-loading="dialogLoading">
				<ul class="car-brand-list clearfix" v-if="carBrandList.length">
					<li v-for="(item,index) in carBrandList" :key="index" :class="{on: item.checked}" @click="selectCarBrandItem(item,index)">
						<span class="left">{{item.years}} {{item.sweptVolume}} {{item.model}}</span>
						<span class="right">{{item.price >10000?(((item.price-item.price%1000)/10000+'万')):item.price}}</span>
					</li>
				</ul>
				<div style="padding-top: 20px;" v-if="!carBrandList.length && !dialogLoading">「{{brandName}}」当前无任何可选择的试驾车型，请马上添加车型！
				</div>
				<!-- <no-data v-if="!carBrandList.length && !dialogLoading">暂无车型数据</no-data> -->
			</div>
			<div v-show="!ifTry" style="padding: 10px 8px;">
				设置「{{brandName}}」不可试驾并保存后：<br /> 1、客户在小程序中的「{{brandName}}」车系详情页面「试驾」按钮将不可点击，<br />2、客户与顾问在下单试驾时，将无法选择「{{brandName}}」。<br />点击「确定提交」前请悉知哦！

			</div>
			<div slot="footer" class="dialog-footer">
				<el-button v-if="carBrandList.length&&ifTry" style="display:block; width:100%;" type="warning" @click="addTypeHandle">确认提交</el-button>
				<el-button v-if="carBrandList.length == 0&&ifTry" style="display:block; width:100%;" type="warning" @click="goTo('addCarModel')">添加车型</el-button>
				<el-button v-if="!ifTry" style="display:block; width:100%;" type="warning" @click="carBrandDialogVisible = false">确认提交</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import vuedraggable from 'vuedraggable';
	import Panel from '@/components/Panel'
	import NoData from '@/components/NoData'
	import fromInput from '@/components/FormInput'
	import {
		addCorporationBrand,
		editCorporationBrand,
		getCorporationBrandDto,
		editCarTypeTestDrive
	} from '@/api/newCar'
	import {
		getCorporationCarTypes
	} from '@/api/carAdmin'
	import {
		uploadPic,
		getDictInfos
	} from '@/api/common'
	import {
		setImgPath,
		checkPrice
	} from '@/utils'
	export default {
		components: {
			vuedraggable,
			Panel,
			NoData,
			fromInput
		},
		data() {
			return {
				ifTry: false,
				InfoForm: {},
				setImgPath: setImgPath,
				carBrandDialogVisible: false,
				initList: [],
				// initArr:'',
				carBrandList: [],
				choiceCarList: [],
				choiceCarInfo: [],
				ifChange: false,
				// choiceCar:[],//判断是否有修改
				choiceCarsaleBrandId: '',
				tryCar: 1,
				dialogLoading: false,
				addLoading: false,

				uploadUrl: process.env.NODE_ENV === 'development' ? '/api/upload/uploadMv?busType=10' : '/backend/upload/uploadMv?busType=10',
				uploadImgUrl: process.env.NODE_ENV === 'development' ? '/api/upload/uploadPic?busType=8' : '/backend/upload/uploadPic?busType=8',
				upBrandImg: process.env.NODE_ENV === 'development' ? '/api/upload/uploadPic?busType=1' : '/backend/upload/uploadPic?busType=1',
				carDetail: {},
				videoCover: '',
				textImgUrl: '',
				textValue: '',
				structure: [],
				type: [],
				send: {},
				brandName: "",
				brandLevel: '',
				minPrice: '',
				maxPrice: '',
				saleStatus: 1,
				statuStr: '',
				brandImg: '',
				hasVideo: 1,
				videoPath: "",
				videoDesc: '',
				hasDetail: 1,
				mgImgs: [],
				detailArry: [],
				detailArryIndex: 0,
				timer: '',
				minPriceFlag: true,
				maxPriceFlag: true,
				loading: false,
				videoCoverLoding: false,
				textImgUrlLoding: false,
				brandImgLoding: false,
				videoPathLoding: false,
				mgImgsLoding: false,
				detailArryLoding: false,
				structureLoding: false,
				netLoding: false,
				saleBrandId:null
				// moveFlag:false
				// addNewDetail:[]
			}
		},
		created() {
			// console.log(Number(12.12))
			if (this.$route.query.carId) {
				this.getCarType()
				this.carInfo(this.$route.query.carId);
			} else {
				this.loading = true;
				try{
					this.getcheakBoxValue(3)
				}catch(e){
					
				}
				this.loading = false;
				// this.getcheakBoxValue(1)
			}



		},
		computed: {

		},
		methods: {
			ifChoiceCar(value) {
				console.log(value)
				this.tryCar = value;
				this.ifTry = value;
				if (!value) {
					this.initList.forEach(item => {
						item.allowTestDrive = 0;
					})
				}
				console.log(this.initList)

			},

			canclTypeHandle() {

			},
			goTo(place) {
				let carInfo = {
					brandName: this.brandName,
					statuStr: this.statuStr,
					status: this.status,
					saleBrandId: this.choiceCarsaleBrandId
				}
				// console.log(carInfo)
				this.$router.push({
					name: place,
					query: {
						carId: this.tryCarInfo.id,
						carInfo
					}
				})
			},
			async getCarType() {
				try {
					let send = [];
					const res = await getCorporationCarTypes({
						shopBrandId: this.$route.query.carId
					})
					this.choiceCarsaleBrandId = res.saleBrandId;
					this.carBrandList = res.corporationCarTypeDtos.map(v => {
						// 有saleCarTypeId则已经选过了
						v.checked = v.allowTestDrive == 1 ? true : false
						if (v.checked) {
							this.choiceCarList.push(v); //已选中
							let obj = {
								allowTestDrive: 1,
								id: v.saleCarTypeId
							}
							send.push(obj);

							this.initList = send;
						}
						return v
					})
				} catch (error) {
					console.error(error)
				}
			},
			// 添加车型
			async addTypeHandle() {

				let choice = [];
				this.carBrandList.forEach(item => {
					if (item.checked) {
						choice.push(item)
					}
				})
				// 					console.log(choice)
				// 					console.log(this.choiceCarList)

				this.choiceCarList.forEach(v => {
					const findObj = choice.find(k => k.id == v.id)
					if (!findObj) {
						choice.push({
							...v,
							isDel: true
						})
					}

				})
				const sendList = []
				choice.forEach(item => {
					const obj = {
						id: item.saleCarTypeId,
						allowTestDrive: item.isDel ? 0 : 1
					}
					sendList.push(obj)
				})

				// console.log(sendList)
				// this.choiceCar = sendList;
				this.choiceCarInfo = JSON.stringify(sendList)

				try {
					if (sendList.length) {
						this.dialogLoading = false;
						this.carBrandDialogVisible = false;
						this.$message.success('设置成功')
					} else {
						this.$message.warning('最少设置一个车型')
						this.dialogLoading = false;
					}
					// await editCarTypeTestDrive(sendObj)

				} catch (e) {
					//TODO handle the exception
				}
			},
			async carBrandDialog() {
				// this.carBrandList = [];
				// this.choiceCarList = [];
				// 					try {
				// 						// this.carBrandList.length = 0
				// 						
				this.carBrandDialogVisible = true
				// 		
				// // 						const {corporationBrandId, id} = item
				// // 						this.selectBrandId = id
				// 		
				// 						const res = await getCorporationCarTypes({shopBrandId:this.$route.query.carId})
				// 						this.choiceCarsaleBrandId = res.saleBrandId;
				// 						this.carBrandList = res.corporationCarTypeDtos.map(v => {
				// 							// 有saleCarTypeId则已经选过了
				// 							v.checked = v.allowTestDrive  == 1? true : false
				// 							if(v.checked){
				// 								this.choiceCarList.push(v);
				// 							}
				// 							return v
				// 						})
				// 					} catch (error) {
				// 						console.error(error)
				// 					}
				// this.dialogLoading = false
			},
			// 选择车型
			selectCarBrandItem(item, index) {
				this.ifChange = true;
				item.checked = !item.checked
			},

			upImgSuccess(e) {
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
			itemMove(index,item) {
				// console.log(index)
				
				for (let i = 0; i < this.detailArry.length; i++) {
					this.detailArry[i].moveFlag = false
				}
				this.detailArry[index].moveFlag = true;
				console.log('show', index)

			},
			itemOut(index,item) {
				// console.log('出去了')
				if(item.content){
					item.contentTwo=item.content.replace(/\n/g,"<br/>");
				}
				// console.log(this.timer)
				// clearInterval(this.timer)
				// this.detailArry[index].moveFlag = false;
				this.detailArry[index].clickFlag = false;
			},
			deleteListImg(index) {
				this.mgImgs.splice(index, 1)
			},
			minPriceInp(e) {
				console.log(this.minPrice)
				if (checkPrice(this.minPrice)) {
					this.minPriceFlag = true;
				} else {
					this.minPriceFlag = false;
					this.$message({
						message: '请填写少于7位数的数字且保留两位小数',
						type: 'warning'
					})
				}
			},
			maxPriceInp(e) {

				if (checkPrice(this.maxPrice)) {
					this.maxPriceFlag = true;
				} else {
					this.maxPriceFlag = false;
					this.$message({
						message: '请填写少于7位数的数字且保留两位小数',
						type: 'warning'
					})
				}

			},

			async sendData() {
				let obj = {
					mediaUrl: this.textImgUrl,
					content: this.textValue,
					busType: 1,
					type: 1

				}
				if (this.textImgUrl || this.textValue) {
					this.detailArry.push(obj);
					this.textImgUrl = '';
					this.textValue = '';
				}
				if (this.minPriceFlag && this.maxPriceFlag) {
					if (this.$route.query.carId) { //修改
						// 						if(!this.ifTry){
						// 							if(this.choiceCarInfo.length){
						// 								this.choiceCarInfo.forEach(item =>{
						// 									item.allowTestDrive = 0
						// 								})
						// 							}
						// 						}
						let send = {
							brandName: this.brandName,
							netId: this.netId,
							brandLevel: this.brandLevel,
							minPrice: this.minPrice,
							maxPrice: this.maxPrice,
							saleStatus: this.saleStatus,
							brandImg: this.brandImg,
							hasVideo: this.hasVideo,
							videoCover: this.videoCover,
							videoPath: this.videoPath,
							videoDesc: this.videoDesc,
							hasDetail: this.hasDetail,
							mgImgs: JSON.stringify(this.mgImgs),
							detailArry: JSON.stringify(this.detailArry),
							id: this.$route.query.carId,
							testDrive: this.ifTry,
							saleBrandId:this.saleBrandId,
							paramStr: this.ifTry ? this.ifChange ? this.choiceCarInfo : JSON.stringify(this.initList) : this.ifChange ?
								JSON.stringify(this.initList) : ''
						}
						this.loading = true;
						try {
							console.log(send)
							let info = await editCorporationBrand(send);
							this.$message({
								message: '编辑成功',
								type: 'success'
							})
							this.loading = false;
							this.$router.replace({
								name: 'newCar'
							})
						} catch (err) {
							this.loading = false;
						}


					} else { //新增
						this.loading = true;
						let send = {
							brandName: this.brandName,
							netId: this.netId,
							brandLevel: this.brandLevel,
							minPrice: this.minPrice,
							maxPrice: this.maxPrice,
							saleStatus: this.saleStatus,
							brandImg: this.brandImg,
							hasVideo: this.hasVideo,
							videoCover: this.videoCover,
							videoPath: this.videoPath,
							videoDesc: this.videoDesc,
							hasDetail: this.hasDetail,
							mgImgs: JSON.stringify(this.mgImgs),
							detailArry: JSON.stringify(this.detailArry)
						}
						try {
							let info = await addCorporationBrand(send);
							this.$message({
								message: '新增成功',
								type: 'success'
							})
							this.loading = false;
							this.$router.replace({
								name: 'newCar'
							})
						} catch (err) {
							this.loading = false;
						}
					}
				} else {
					this.loading = false;
					this.$message({
						message: '请处理好金额信息',
						type: 'warning'
					})
				}


			},
			keep() {
				if (this.hasDetail == 0 && this.hasVideo == 0) {
					this.$message({
						message: "「视频」或「详细描述」请选其中一项",
						type: 'warning'
					})
					return
				}

				if (this.brandName) {
					// if (this.netId) {
					if (this.brandLevel) {
						if (this.saleStatus) {
							if (this.brandImg) {
								if (this.mgImgs.length != 0) {
									if (this.maxPrice > this.minPrice) {
										if (this.hasVideo == 1) { //需要视频
											if (this.videoPath && this.videoCover) {
												if (this.hasDetail == 1) { //需要详情
													this.sendData()
												} else { //不需要详情
													this.sendData()
												}
											} else {
												this.$message({
													message: "需要视频时,请填入视频和视频封面",
													type: 'warning'
												})
												return
											}
										} else { //不需要视频
											if (this.hasDetail == 1) { //需要详情
												this.sendData()
											} else { //不需要详情
												this.sendData()
											}

										}




									} else {
										console.log(this.maxPrice,this.minPrice,this.maxPrice > this.minPrice)
										this.$message({
											message: "最高价要比最低价高",
											type: 'warning'
										})
									}

									// 							
								} else {
									this.$message({
										message: "请添加车系主图",
										type: 'warning'
									})
								}
							} else {
								this.$message({
									message: "请选择官方主图",
									type: 'warning'
								})
							}

						} else {
							this.$message({
								message: "请选择销售类型",
								type: 'warning'
							})
						}
					} else {
						this.$message({
							message: "请选择结构",
							type: 'warning'
						})
					}
					// 					} else {
					// 						this.$message({
					// 							message: "请选择分网",
					// 							type: 'warning'
					// 						})
					// 					}

				} else {
					this.$message({
						message: "请输入名字",
						type: 'warning'
					})
				}


			},
			uploadError(err, file) {
				this.$message({
					message: '上传失败',
					type: 'error'
				})
			},
			handleAvatarSuccess(res) {
				console.log(res)
				if (res.success) {
					this.videoPath = res.content.filePath;
					this.videoPathLoding = false;
				}
			},
			brandImgSuccess(res) {
				console.log(res)
				if (res.success) {

					this.brandImg = res.content.filePath;
					this.brandImgLoding = false;
				}
			},

			beforeUpBrandImg(file) {
				this.brandImgLoding = true;
				console.log(file)
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) != -1) {
					this.$message({
						type: 'error',
						message: '请上传图片'
					})
					return false;
				}
				if (!isLt2M) {
					this.$message({
						type: 'error',
						message: '上传图片大小不能超过2MB哦!'
					})
					return false;
				}
			},
			uploadVideoIng(file) {
				console.log(file)
				this.videoPathLoding = true;
			},
			beforeUploadVideo(file) {
				const isLt10M = file.size / 1024 / 1024 < 10;
				if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) == -1) {
					this.$message({
						type: 'error',
						message: '请上传正确的视频格式'
					})
					return false;
				}
				if (!isLt10M) {
					this.$message({
						type: 'error',
						message: '上传视频大小不能超过10MB哦!'
					})
					return false;
				}
			},




			async carInfo(id) {

				this.loading = true;
				let obj = {
					shopBrandId: id
				}
				try {
					const info = await getCorporationBrandDto(obj)
					let data = { ...info
					};
					for (let i = 0; i < data.corporationImageTextDtos.length; i++) {
						data.corporationImageTextDtos[i].moveFlag = false;
						data.corporationImageTextDtos[i].clickFlag = false;
					}

					this.brandName = data.brandName;
					this.netId = data.netId;
					this.brandLevel = data.brandLevel
					this.minPrice = data.minPrice;
					this.maxPrice = data.maxPrice;
					this.saleStatus = data.saleStatus;
					this.statuStr = data.statuStr;
					this.brandImg = data.brandImg;
					this.hasVideo = data.hasVideo;
					this.videoCover = data.videoCover;
					this.videoPath = data.videoPath;
					this.videoDesc = data.videoDesc || '';
					this.hasDetail = data.hasDetail;
					this.saleBrandId = data.saleBrandId;
					this.mgImgs = data.corporationBrandPictureDtos;
					this.detailArry = data.corporationImageTextDtos;
					this.detailArry.forEach(item =>{
						if(item.content){
							item.contentTwo=item.content.replace(/\n/g,"<br/>")
							console.log(item)
						}
					})
					this.tryCar = data.testDrive == 1 ? true : false;
					this.ifTry = data.testDrive == 1 ? true : false;
					// this.addNewDetail= data.corporationImageTextDtos;
					this.getcheakBoxValue(3, 1)
					this.loading = false;
				} catch (err) {
					this.loading = false;
					//TODO handle the exception
				}

			},
			async getcheakBoxValue(type, state) {
				this.structureLoding = true;
				let obj = {
					type
				}
				console.log(obj)
				try {
					const info = await getDictInfos(obj)
					if (state != 1) { //新增
						if (type == 3) {
							this.structure = info;
							this.structureLoding = false;
							this.brandLevel = info[0].id;
						}
					} else { //修改
						if (type == 3) {
							this.structure = info;
							this.structureLoding = false;
						}
					}

				} catch (err) {
					console.log(err)
					//TODO handle the exception
				}
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
						picUrl: imgData
					}
					try {
						const info = await uploadPic(obj)
						console.log(info)
						this.textImgUrl = info.filePath;
						this.textImgUrlLoding = false;

					} catch (err) {
						// this.$message.error(err)
						//TODO handle the exception
					}
					// console.log(obj)

				})
			},
			delTextList(index) {
				this.detailArry.splice(index, 1)
			},
			addTextList() {
				let obj = {
					mediaUrl: this.textImgUrl,
					content: this.textValue,
					contentTwo: this.textValue.replace(/\n/g,"<br/>"),
					busType: 1,
					type: 1,
					moveFlag: false,
					clickFlag: false,
				}
				console.log(!this.textImgUrl && !this.textValue)
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
			uploadVideoImg(e) {
				// console.log(e, 1111)
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
					this.videoCoverLoding = true;
					let imgData = oFREvent.currentTarget.result;
					let obj = {
						busType: 9,
						picUrl: imgData
					}
					// console.log(obj)
					try {
						const info = await uploadPic(obj)
						this.videoCover = info.filePath;
						this.videoCoverLoding = false;
					} catch (err) {
						console.log(err)
						this.$message.error(err)
						//TODO handle the exception
					}

				})
			},
			deleteMadel(type) {
				console.log(type)
				if (type == 'video') {
					this.videoPath = '';
				} else {
					this.videoCover = '';
				}

			},
			officialImg(e) {
				// console.log(e)
				let oFReader = new FileReader();
				oFReader.readAsDataURL(e.target.files[0]);
				var fileSize = e.target.files[0].size / 1048576;
				console.log(fileSize)
				if (fileSize > 2) {
					this.$message({
						message: '图片大小不超过2M，请重新选择',
						type: 'warning'
					})
					return
				}
				oFReader.onload = (async (oFREvent) => {
					this.brandImgLoding = true;
					let imgData = oFREvent.currentTarget.result;
					let obj = {
						busType: 1,
						picUrl: imgData
					}
					try {
						let info = await uploadPic(obj)
						this.brandImg = info.filePath;
						this.brandImgLoding = false;
					} catch (err) {
						this.$message({
							message: err,
							type: 'error'
						})
						//TODO handle the exception
					}
					// console.log(obj)
					// 					this.$Api.uploadPic(obj).then((res) => {
					// 						console.log(res)
					// 						if (res.success) {
					// 							// 							let obj = {
					// 							// 								filePath:this.imgUrl+res.content.filePath
					// 							// 							}
					// 							this.brandImg = res.content.filePath;
					// 							this.brandImgLoding = false;
					// 						}
					// 					})
				})
			},
			uploadImg(e) {
				if (this.mgImgs.length < 10) {
					let oFReader = new FileReader();
					oFReader.readAsDataURL(e.target.files[0]);
					var fileSize = e.target.files[0].size / 1048576;
					console.log(fileSize)
					if (fileSize > 0.5) {
						this.$message({
							message: '图片大小不超过500kb，请重新选择',
							type: "warning"
						})
						return
					}
					oFReader.onload = (async (oFREvent) => {
						this.mgImgsLoding = true;
						let imgData = oFREvent.currentTarget.result;
						let obj = {
							busType: 7,
							picUrl: imgData
						}
						// console.log(obj)
						try {
							const info = await uploadPic(obj)
							this.mgImgs.push(info)
							this.mgImgsLoding = false;
						} catch (err) {
							this.$message.error(err)
							//TODO handle the exception
						}
						// 						
					})
				} else {
					this.$message({
						message: '图片数量不超过10张，请删除重新选择',
						type: "warning"
					})
				}


			},
			back() {
				this.$router.go(-1)
			}
		}
	}
</script>


<style scoped="scoped" lang="scss">
	@import '../../../styles/var';

	.pd10 {
		padding: 10px;
	}

	.showImg {
		background: #eef1f6;
		// width: 260px;
		// min-width: 200px;
		// max-height: 570px;
		text-align: center;

		.showImg-title {
			padding-bottom: 10px;
		}
	}

	.car-brand-list {
		padding-top: 20px;

		li {
			float: left;
			display: flex;
			justify-content: space-between;
			padding: 5px;
			margin: 5px 10px;
			width: 300px;
			cursor: pointer;
			border: 2px solid transparent;
			transition: .3s all;
			box-shadow: 0 0 5px rgba(0, 0, 0, .2);

			&.on {
				border-color: $orange;
			}

			.right {
				color: $red;
			}
		}
	}

	img {
		max-height: 100%;
		max-width: 100%;
		margin: 0 auto;
	}

	video {
		max-height: 100%;
		max-width: 100%;
	}

	.imgBgSize {
		background-size: contain !important;
		height: 100px;
		background-position: center !important;
		background-repeat: no-repeat !important;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 180px;
		height: 100px;
		line-height: 100px;
		text-align: center;
		opacity: 0;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	.warp {
		.center {
			display: flex;
			justify-content: center;
			align-items: center;
			// 			position: absolute;
			// 			top: 50%;
			// 			left: 50%;
			// 			transform: translate(-50%, -50%)
		}

		.font {
			color: #ff3366;
			text-align: left;
		}

		background: #fff;
		margin-left: 5px;

		.title {
			display: flex;
			align-items: center;

			.title-big {
				font-size: 24px;
			}
		}

		.massge {

			.massge-title {
				text-align: left;
				background: rgba(238, 241, 246, 1);
				padding: 10px;
			}

			.massge-Basics {
				padding: 10px 80px;
				display: flex;

				.massge-item {
					// padding: 20px 0;
					display: flex;
					align-items: center;

					.iftry {
						margin-left: 30px;
					}

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

					.btn {
						background: #ccc;
						color: #000;
						padding: 10px 20px;
						margin-left: 20px;
						line-height: 20px;
					}

					.price-box {
						position: relative;
						width: 200px;

						span {
							position: absolute;
							right: 0;
							bottom: 0;
							line-height: 20px;
						}

						.el-input__inner {
							padding-right: 20px;
						}
					}

					.price-heng {
						width: 30px;
						height: 2px;
						background: #ccc;
						margin: 0 10px;
					}

					.img {
						width: 200px;
						height: 100px;
						// border: 1px solid #ccc;
						background: #f4f6f9;
						// background: url(../../images/newCar/u9025.png) no-repeat;
						background-position: center;
						background-size: contain;
						position: relative;

						input {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							opacity: 0;
							z-index: 1;
						}
					}

					.font {
						color: #ff3366;
						text-align: left;
						padding-left: 20px;
						line-height: 20px;
						padding-top: 60px;
					}
				}

				// 				.massge-name {
				// 
				// 					.name {
				// 						margin-right: 20px;
				// 					}
				// 
				// 					.btn {
				// 						background: #ccc;
				// 						color: #000;
				// 						padding: 10px 20px;
				// 						margin-left: 20px;
				// 					}
				// 				}
				// 
				// 				.massge-net {
				// 					.name {
				// 						margin-right: 20px;
				// 					}
				// 				}
				// 
				// 				.massge-structure {
				// 					.name {
				// 						margin-right: 20px;
				// 					}
				// 				}
				// 
				// 				.massge-type {
				// 					.name {
				// 						margin-right: 20px;
				// 					}
				// 				}
			}

			.massge-type {
				padding: 0 30px;

				.massge-product {
					padding: 20px 0;
					display: flex;
					align-items: center;

					.name {
						margin-right: 40px;
					}
				}

				.massge-price {
					padding: 0 52px;
					display: flex;
					align-items: center;

					.name {
						margin-right: 40px;
					}

					.price-heng {
						width: 30px;
						height: 2px;
						background: #ccc;
						margin: 0 10px;
					}
				}

				.massge-img {
					display: flex;
					padding: 20px 52px;

					.img {
						width: 200px;
						height: 100px;
						border: 1px solid #ccc;
						// background: url(../../images/newCar/u9025.png) no-repeat;
						background-position: center;
						background-size: contain;
						position: relative;

						input {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							opacity: 0;
						}
					}

					.font {
						color: #ff3366;
						font-size: 16px;
						text-align: left;
						padding-left: 20px;
					}
				}
			}

			.upload-img {
				padding: 10px 80px 10px;
				border-bottom: 1px solid #ccc;
				display: flex;

				.upload-font {
					// padding: 0 32px;
					display: flex;
					align-items: center;
					line-height: 20px;
					// 					.name {
					// 						margin-right: 20px;
					// 					}

					.uploadBtn {
// 						background: rgba(255, 204, 0, 1);
// 						text-align: center;
// 						color: #000;
						position: relative;
// 						width: 100px;
// 						height: 45px;
						// line-height: 45px;

						// 						font{
						// 							position: absolute;
						// 							width: 100%;
						// 							height: 100%;
						// 						}
						input {
							height: 100%;
							position: absolute;
							top: 0;
							left: -12px;
							width: 93px;
							cursor: pointer;
							opacity: 0;
						}
					}

					.tips {
						color: #ff3366;
						text-align: left;
						padding-left: 20px;
					}
				}

				.img-list {
					padding-top: 20px;
					padding-left: 100px;
					display: flex;
					flex-wrap: wrap;

					.wrapper {
						display: flex;
						flex-wrap: wrap;
					}

					.item {
						width: 200px;
						height: 100px;
						background: rgba(244, 246, 249, 1);
						margin: 20px;
						position: relative;
						display: flex;
						align-items: center;
						justify-content: center;

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
							z-index: 11;

							svg {
								width: 100%;
								height: 100%;
							}
						}
					}
				}
			}

			.upload-video {
				padding: 10px 80px 20px;
				border-bottom: 1px solid #ccc;

				.upload-font {
					display: flex;
					align-items: center;
					padding: 10px 50px;
				}

				.font {
					padding: 80px 0 0 10px;
					line-height: 20px;
				}

				.video {
					display: flex;
					// padding: 10px 0 0 82px;

					.video-box {
						width: 200px;
						height: 100px;
						background: rgba(244, 246, 249, 1);
						// margin: 0 20px;

						input {
							width: 100%;
							height: 100%;
							opacity: 0;
							cursor: pointer;
						}

						.upload-demo {
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
						background: rgba(244, 246, 249, 1);
						display: flex;
						align-items: center;
						justify-content: center;

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
							z-index: 11;

							svg {
								width: 100%;
								height: 100%;
							}
						}
					}
				}

				.img {
					display: flex;

					// padding: 20px 0 0 82px;
					.font {
						padding-top: 60px;
					}

					.img-box {
						width: 200px;
						height: 100px;
						position: relative;
						background: rgba(244, 246, 249, 1);

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
						}
					}

					.videoValue {
						// margin: 0 20px;
						width: 200px;
						height: 100px;
						position: relative;
						background: rgba(244, 246, 249, 1);
						display: flex;
						align-items: center;
						justify-content: center;

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
							z-index: 11;

							svg {
								width: 100%;
								height: 100%;
							}
						}
					}
				}

			}

			.describe {
				display: flex;
				// padding: 20px 0 0 82px;

				.name {
					margin-right: 20px;
				}

				.describe-font {

					.inpLength {
						position: absolute;
						bottom: 5px;
						right: 10px;
						line-height: 20px;

						.tips {
							color: #ff3366;
						}
					}
				}
			}

			.detail {
				// padding-top: 100px;
				padding: 10px 80px 20px;
				display: flex;
				.ifdetail {
					display: flex;
					align-items: center;
					padding-left: 50px;

					.cheak-box {
						display: flex;
					}

					.name {
						margin-right: 20px;
					}
				}

				.detail-val {
					.font {
						line-height: 24px;
					}

					// padding: 5px 0 20px 82px;
					.textList {
						display: flex;
						// justify-content: space-between;
						margin-top: 20px;
					}

					.bg {
						// width: 60%;
						width: 700px;
						// flex: 1;
						background: rgba(238, 241, 246, 1);

						.valList {
							.item {
								background: #fff;
								margin-bottom: 10px;
								position: relative;

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
									line-height: 20px;
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

								svg {
									width: 100%;
									height: 100%;
								}
							}
						}
					}

					.bg-img {
						// width: 35%;
						margin-left: 170px;
						background: rgba(238, 241, 246, 1);
						// max-height: 1000px;
						padding: 0 10px 20px;
						width: 260px;
						// 						.img {
						// 							background: url(../../images/newCar/u8876.png) no-repeat;
						// 							background-size: 100% 100%;
						// 							height: 100%;
						// 						}
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
	}
</style>
<style lang="scss">
	.video-box {
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
	}


	.describe-font {
		.el-textarea__inner {
			padding-right: 55px !important;
		}
	}

	.price-box {
		.el-input__inner {
			width: 180px !important;
		}
	}
</style>
