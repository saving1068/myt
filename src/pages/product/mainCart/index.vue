<template>
	<div class="log-record page-container" v-loading='loading'>
		<panel>
			<template slot="head">
				<div class="title shadow">
					<div style="display: flex;width: 100%;align-items: center;" v-if="Object.keys(nowInfo).length !=0">
						<div style="display: flex;flex:1;">
							<div style="display: flex;">
								<div class="title-name">
									<div style="font-size: 24px;line-height: 24px;">当前主推车系</div>
									<div style="padding-top: 10px;color: #999;font-size: 14px;" v-if='nowInfo.releaseTime'>推广启动日
										{{nowInfo.releaseTime.split(' ')[0]}} </div>
								</div>
								<div class="title-img">
									<img :src="setImgPath(nowInfo.brandImg)">
								</div>
							</div>
							<div class="title-massage">
								<div class="name">{{nowInfo.brandName}}</div>
								<div class="item">
									<div class="title">意向量</div>
									<div class="value">{{keepPoints(nowInfo.intentionNum)}}</div>
								</div>
								<div class="item">
									<div class="title">试驾量</div>
									<div class="value">{{keepPoints(nowInfo.testDriveNum)}}</div>
								</div>
								<div class="item">
									<div class="title">成交量</div>
									<div class="value">{{keepPoints(nowInfo.dealNum)}}</div>
								</div>
								<div class="item">
									<div class="title">浏览量</div>
									<div class="value">{{keepPoints(nowInfo.browseNum)}}</div>
								</div>
								<div class="item">
									<div class="title">点赞量</div>
									<div class="value">{{keepPoints(nowInfo.fabulouNum)}}</div>
								</div>
							</div>
						</div>
						<div class="btn">
							<div class="one yellow" v-if="isBtnPower('040301')" @click="openSystem()"><el-button type="warning" size="mini">选入或更换主推款</el-button></div>
							<div class="blue-btn blue" v-if="isBtnPower('040302')" @click="openTrait"><el-button type="primary" size="mini">特性参数</el-button></div>
							<div class="blue-btn blue" v-if="isBtnPower('040120')" @click="goTo('record')"><el-button type="primary" size="mini">主推记录</el-button></div>
							<div class="bcakBtn" v-if="nowInfo.status == 1">发布</div>
							<div class="bcakBtn" v-if="nowInfo.status == 2">已停用</div>
							<div class="blue-btn blue" @click="editPushMainStatus" v-if="nowInfo.status == 0&&isBtnPower('040303')"><el-button type="primary" size="mini">发布</el-button></div>

						</div>
					</div>
					<div class="btn" v-if='Object.keys(nowInfo).length  == 0'>
						<div class="one yellow" v-if="isBtnPower('040301')" @click="openSystem()"><el-button type="warning" size="mini">选入或更换主推款</el-button></div>
					</div>
				</div>
			</template>
			<div class="value">
				<div class="title">
					<div class="tab">
						<div class="item" @click="tabChange(0)">
							<font>全部素材</font>
						</div>
						<div class="item " @click="tabChange(1)">
							<font>视频素材</font>
						</div>
						<div class="item" @click="tabChange(2)">
							<font>文章素材</font>
						</div>
						<div class="line" :style="moveSide"></div>
					</div>
					<div class="choise">
						<div class="sel">
							<el-select v-model="selValue" clearable placeholder="请选择" @change='selValueChange' size='mini'>
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<div class="sel">
							<el-select v-model="selValueTwo" clearable placeholder="请选择" @change='selValueTwoChange' size='mini'>
								<el-option v-for="item in optionsTwo" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<div class="btn yellow" style="margin-left: 20px" v-if="isBtnPower('040304')" @click="openArticle(1)">
							<el-button type="warning" size="mini">新增文章</el-button>
							
						</div>
						<div class="btn yellow" v-if="isBtnPower('040304')" @click="openVideo(1)">
							<el-button type="warning" size="mini">新增视频</el-button>
							
						</div>
					</div>
				</div>
				<div class="list" v-loading='listLoading'>
					<div v-if="list.length !=0">
						<div class="item shadow" v-for="(v,i) in list">
							<div class="title">
								<div v-if="v.type ==1">视频素材</div>
								<div v-else>文章素材</div>
								<div>{{v.operaTime}}</div>
							</div>
							<div class="massge">
								<div class="media">
									<img :src="setImgPath(v.coverPic)">
								</div>
								<div class="data">
									<div v-if="v.type == 1" class="text">视频描述</div>
									<div v-else class="text">文章标题</div>
									<div class="inp" v-if='v.type == 1'>
										<div class="desc" v-html="v.desc" v-if="v.desc"></div>
										<div class="desc" v-else>
											<div >暂无视频描述</div>
										</div>
									</div>
									<div class="inp" v-else>
										<div class="desc" v-if="v.title">{{v.title}}</div>
										<div class="desc" v-else>
											<div>暂无文章标题</div>
										</div>
									
									</div>
									<div class="content">
										<div class="img">
											<img :src="setImgPath(v.headPic)">
										</div>
										<div class="name">{{v.author}}</div>
										<div class="num">
											<div v-if="v.type == 1">
												<div>播放数</div>
												<div class="number">{{keepPoints(v.playNum||0)}}</div>
											</div>
											<div v-else>
												<div>阅读数</div>
												<div class="number">{{keepPoints(v.readNum||0)}}</div>
											</div>

										</div>
										<div class="num">
											<div>点赞数</div>
											<div class="number">{{v.fabulouNum||0}}</div>
										</div>
										<div class="btn">
											<div v-if="v.type ==1&&isBtnPower('040304')" class="change yellow" @click="openVideo(2,v)"><el-button type="warning" size="mini">编辑视频</el-button></div>
											<div v-if="v.type ==2&&isBtnPower('040304')" class="change yellow" @click="openArticle(2,v)"><el-button type="warning" size="mini">编辑文章</el-button></div>
											<div class="up blue" v-if="v.status == 0&&isBtnPower('040305')||v.status == 2&&isBtnPower('040305')" @click="upperShelf(v,i)"><el-button type="primary" size="mini">上架</el-button></div>
											<div class="up blue" v-if="v.status == 1&&isBtnPower('040305')" @click="lowerShelf(v,i)"><el-button type="primary" size="mini">下架</el-button></div>
											<div class="delete" v-if="v.status == 0&&isBtnPower('040306')" @click="deleteItem(v,i)"><el-button type="info" size="mini">删除</el-button></div>
										</div>
									</div>
								</div>
								<div class="state">
									<el-tag  :type="v.status | getTagStatus" >
										{{v.statuStr}}
									</el-tag>
									
								</div>
							</div>
						</div>
					</div>
					<no-data v-if='list.length == 0'></no-data>
				
				</div>

			</div>
		</panel>
		<el-dialog :visible.sync="ifOpentrait" width="700px" top="40px" center title="设置主推车系特性参数" :close-on-click-modal="false">
			<div class="diamassge">
				<div class="trait">
					<div class="title">
						<div class="name">参数命名</div>
						<div class="numValue">参数值</div>
					</div>
					<div class="inp-box">
						<div class="item">
							<div>
								<el-input v-model="traitInfo.paramKeyOne" placeholder="请输入内容"></el-input>
							</div>
							<div>
								<el-input v-model="traitInfo.paramValueOne" placeholder="请输入数字内容" type="number"></el-input>
							</div>
						</div>
						<div class="item">
							<div>
								<el-input v-model="traitInfo.paramKeyTwo" placeholder="请输入内容"></el-input>
							</div>
							<div>
								<el-input v-model="traitInfo.paramValueTwo" placeholder="请输入数字内容" type="number"></el-input>
							</div>
						</div>
						<div class="item">
							<div>
								<el-input v-model="traitInfo.paramKeyThree" placeholder="请输入内容"></el-input>
							</div>
							<div>
								<el-input v-model="traitInfo.paramValueThree" placeholder="请输入数字内容" type="number"></el-input>
							</div>
						</div>
					</div>
				</div>
				<div class="img">
					<img src="../../../images/main.png" alt="">
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="ifOpentrait = false">取 消</el-button>
				<el-button type="primary" @click="editMainParam()">确 定</el-button>
			</div>
		</el-dialog>


		<!-- 选择车系 -->
		<el-dialog :visible.sync="ifOpenSystem" width="700px" top="40px" center class="car-dialog" :close-on-click-modal="false">
			<div slot="title" class="cartType-dialog-head">
				<span class="left">选择或更换主推车系</span>
				<div class="right">
					<span style="font-size: 12px;color: #ffcc00;">当前主推车系</span>
					<span style="color: #000;">{{nowInfo.brandName}}</span>
				</div>
			</div>
			<div class="car-type-content" v-loading="dialogLoading">
				<ul class="car-brand-list" v-if="system.length">
					<li v-for="(item,index) in system" :key="index" :class="{itemActive: item.checked}" @click="selectCarBrandItem(item,index)">
						<div class="systemName">{{item.brandName}}</div>
						<div class="systemPrice">￥{{item.minPrice}}起</div>
						<div class="systemImg">
							<img :src='setImgPath(item.brandImg)'>
						</div>
						<!-- <span class="left">{{item.years}} {{item.sweptVolume}} {{item.model}}</span>
		                <span class="right">{{item.price}}</span> -->
					</li>
				</ul>
				<no-data v-if="!system.length && !dialogLoading">暂无车型数据</no-data>
			</div>
			<div slot="footer" class="dialog-footer" v-if="system.length">
				<el-button style="display:block; width:100%;" type="warning" @click="ifSystem">确认提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import Panel from '@/components/Panel'
	import NoData from '@/components/NoData'
	import vuedraggable from 'vuedraggable';
	import power from '@/mixins/power'
	import {
		getPushMainCar,
		deleteBrandArticle,
		editBrandArticleStatus,
		editPushMainParam,
		editPushMainStatus,
		addPushMainCar,
		getCorporationBrands
	} from '@/api/mainCart'

	import {
		setImgPath,keepPoints
	} from '@/utils'
	export default {
		components: {
			Panel,
			NoData,
			vuedraggable
		},
		mixins: [power],
		data() {
			return {
				setImgPath: setImgPath,
				keepPoints:keepPoints,
				dialogLoading: false,
				keep: false,
				// ifOpenArticle: false,
				ifOpenSystem: false,
				system: [],
				ifOpentrait: false,
				input: "",
				list: [],
				listLoading: false,
				nowInfo: {},
				tabNum: 0,
				traitInfo: {},
				videoInfo: {},
				articleInfo: {},
				loading: false,
				options: [{
						value: '1',
						label: '按上架时间最新'
					},
					{
						value: '2',
						label: '按阅读或播放最多'
					},
					{
						value: '3',
						label: '按点赞数量最多'
					}

				],
				selValue: '',
				optionsTwo: [{
						value: '0',
						label: '未上架'
					},
					{
						value: '1',
						label: '已上架'
					},
					{
						value: '2',
						label: '已下架'
					}
				],
				selValueTwo: '',
				choisePushId:null
			}
		},
		computed: {
			moveSide() {
				let move = {
					"left": `${this.tabNum*33.33}%`
				}
				return move
			},
			netId() {
				return this.$route.query.netId
			}
		},
		async created() {
			// 		let nowInfo = {
			// 			netId: this.$route.query.netId,
			// 			// bannerType:0
			// 		}
			await this.getPower('040301,040302,040303,040304,040305,040306,040120')
			
			if(this.$route.query.choisePushId){
				this.choisePushId = this.$route.query.choisePushId;
				let send = {
					brandMainId: this.$route.query.choisePushId,
				}
				this.getPushMainCar(send)
			}else{
				this.getPushMainCar()
			}
			
			

		},
		methods: {
			async editMainParam() {
				try {
					// console.log(this.traitInfo)
					await editPushMainParam(this.traitInfo);
					this.$message.success('设置主推车系特性参数成功')
					this.ifOpentrait = false;
				} catch (e) {
					// this.ifOpentrait = false;
					//TODO handle the exception
				}

			},
			async editPushMainStatus() {
				let send = {
					pushMainId: this.nowInfo.id
				}
				try {
					await editPushMainStatus(send);
					this.nowInfo.status = 1;
					// console.log(this.nowInfo.state)
					this.$message({
						message: '发布成功',
						type: 'success'
					})
				} catch (e) {
					//TODO handle the exception
				}
			},
			selValueChange(value) {
				// console.log(value)
				let send = {
					// netId: this.$route.query.netId,
					bannerType: this.tabNum,
					brandMainId: this.nowInfo.id,
					sortType: this.selValue,
					status: this.selValueTwo
				}
				this.getMainCar(send)

			},
			selValueTwoChange(value) {
				// console.log(value)
				let send = {
					// netId: this.$route.query.netId,
					bannerType: this.tabNum,
					brandMainId: this.nowInfo.id,
					sortType: this.selValue,
					status: this.selValueTwo
				}
				this.getMainCar(send)
			},
			async upperShelf(item, index) {
				this.listLoading = true;
				let send = {
					brandArticleId: item.id,
					status: 1
				}
				try {
					await editBrandArticleStatus(send);
					let obj = {
						bannerType: this.tabNum,
						brandMainId: this.nowInfo.id,
						sortType: this.selValue,
						status: this.selValueTwo
					}
					this.$message.success('素材上架成功')
					this.getMainCar(obj)
				} catch (e) {
					this.listLoading = false;
					//TODO handle the exception
				}
			},
			async lowerShelf(item, index) {
				this.listLoading = true;
				let send = {
					brandArticleId: item.id,
					status: 2
				}
				try {
					await editBrandArticleStatus(send);
					let obj = {
						bannerType: this.tabNum,
						brandMainId: this.nowInfo.id,
						sortType: this.selValue,
						status: this.selValueTwo
					}
					this.$message.success('素材上架成功')
					this.getMainCar(obj)
				} catch (e) {
					this.listLoading = false;
					//TODO handle the exception
				}
			},
			async getPushMainCar(obj) {
				this.loading = true;
				try {
					if (!obj) {
						obj = {}
					}
					let info = await getPushMainCar(obj);
					this.nowInfo = info;
					this.traitInfo = {
						paramKeyOne: info.paramKeyOne,
						paramKeyTwo: info.paramKeyTwo,
						paramKeyThree: info.paramKeyThree,
						paramValueOne: info.paramValueOne,
						paramValueTwo: info.paramValueTwo,
						paramValueThree: info.paramValueThree,
						pushMainId: info.id
					}
					// console.log(info, this.traitInfo)
					this.loading = false;
					let send = {
						brandMainId: this.nowInfo.id,
					}
					if (Object.keys(info).length != 0) {
						this.getMainCar(send)
					} else {
						return
					}
				} catch (e) {
					//TODO handle the exception
				}
			},
			async getMainCar(obj) {
				this.listLoading = true;
				// console.log(obj)
				try {
					let res = await getPushMainCar(obj);
					this.list = res.brandArticleDtos;
					this.list.forEach(item =>{
						console.log(item)
						if(item.desc){
							item.desc = item.desc.replace(/\n/g,"<br/>")
						}
						
					})
					if (obj.type == 0) { //更换车系
						this.nowInfo = res;
						this.traitInfo = {
							paramKeyOne: res.paramKeyOne,
							paramKeyTwo: res.paramKeyTwo,
							paramKeyThree: res.paramKeyThree,
							paramValueOne: res.paramValueOne,
							paramValueTwo: res.paramValueTwo,
							paramValueThree: res.paramValueThree,
							pushMainId: res.id
						}
						// console.log(this.nowInfo)
					}
					this.listLoading = false;
				} catch (e) {
					this.listLoading = false;
					//TODO handle the exception
				}

			},

			ifKeep(value) {
				// console.log("接受参数")
				this.keep = value;
				let send = {
					netId: this.$route.query.netId,
					bannerType: 0,
					brandMainId: this.nowInfo.id,
					sortType: this.selValue,
					status: this.selValueTwo
				}
				this.getMainCar(send)
			},
			openVideo(type, item) {
				// console.log(item.id)

				if (type == 1) { //新增
					this.$router.push({
						name: 'addVideo',
						query: {
							carId: this.nowInfo.id,
							choisePushId:this.choisePushId?this.choisePushId:null
						}
					})
				} else { //编辑
					this.$router.push({
						name: 'addVideo',
						query: {
							carId: this.nowInfo.id,
							articleId: item.id,
							choisePushId:this.choisePushId?this.choisePushId:null
						}
					})
				}

			},
			openArticle(type, item) {
				console.log(this.nowInfo.id)
				if (type == 1) {
					this.$router.push({
						name: 'addArticle',
						query: {
							carId: this.nowInfo.id,
							choisePushId:this.choisePushId?this.choisePushId:null
						}
					})
				} else {
					this.$router.push({
						name: 'addArticle',
						query: {
							carId: this.nowInfo.id,
							articleId: item.id,
							choisePushId:this.choisePushId?this.choisePushId:null
						}
					})
				}
			},
// 			ifArticle(value) {
// 				// console.log("接受参数")
// 
// 				this.ifOpenArticle = value;
// 				let send = {
// 					// netId: this.$route.query.netId,
// 					brandMainId: this.nowInfo.id,
// 				}
// 				this.getMainCar(send)
// 			},
			async openSystem() {
				this.dialogLoading = true;
				let send = {
					sortType: 1,
					status:1
				}
				try {
					this.$loading.show()
					let res = await getCorporationBrands(send);
					// console.log(res)
					const _index = res.findIndex(item => item.id == this.nowInfo.corporationBrandId)
					console.log(_index)
					for (let i = 0; i < res.length; i++) {
						res[i].checked = false;
					}
					res[_index].checked = true;
					console.log(res)
					this.system = res;
					this.dialogLoading = false;
					this.$loading.hide()
					this.ifOpenSystem = true;

				} catch (err) {
					this.dialogLoading = false;
				}
			},
			selectCarBrandItem(item, index) {
				for (let i = 0; i < this.system.length; i++) {
					if (index == i) {
						this.system[index].checked = true;
					} else {
						this.system[i].checked = false;
					}
				}

			},
			async ifSystem() {
				// console.log(111)
				let id = null;
				for (let i = 0; i < this.system.length; i++) {
					if (this.system[i].checked) {
						id = this.system[i].id;
					}
				}
				if (id) {
					let send = {
						shopBrandId: id,

					}
					try {
						let res = await addPushMainCar(send)
						this.choisePushId = res;
						this.$message.success('设置主推成功')
						let obj = {
							brandMainId: res,
							type: 0
						}
						this.getMainCar(obj)
						this.ifOpenSystem = false;
					} catch (e) {
							this.ifOpenSystem = false;
						//TODO handle the exception
					}
				} else {
					this.$message.warning('请选择车系或取消')
				}
			},
			cancl(value) {
				this.ifOpenSystem = value;
			},
			openTrait() {
				// console.log(this.traitInfo)
				this.ifOpentrait = true;

			},
			ifTrait(value) {
				this.ifOpentrait = value
			},
			async deleteItem(item, index) {
				let send = {
					brandArticleId: item.id
				}
				this.listLoading = true;
				try {
					await deleteBrandArticle(send);
					this.$message.success('删除文章成功')
					this.list.splice(index, 1);
					this.listLoading = false;
				} catch (e) {
					this.listLoading = false;
					//TODO handle the exception
				}


				// this.list = list
				// console.log(this.list, index)
			},
			tabChange(index) {
				this.tabNum = index;
				let send = {
					netId: this.$route.query.netId,
					bannerType: this.tabNum,
					brandMainId: this.nowInfo.id,
					sortType: this.selValue,
					status: this.selValueTwo
				}
				this.getMainCar(send)
			},
			back() {
				this.$router.go(-1)
			},
			goTo(place) {
				this.$router.push({
					name: place,
				})
			}
		},
		filters: {
			 getTagStatus(status) {
			    return ['info','success'][status]
			}
		},
	}
</script>
<style scoped="scoped" lang="scss">
	.shadow{
		box-shadow: 2px 2px 5px rgba(153,153,153,0.349019);
		-moz-box-shadow: 2px 2px 5px rgba(153,153,153,0.349019);
		-webkit-box-shadow: 2px 2px 5px rgba(153,153,153,0.349019);
	}
	.cartType-dialog-head {
		display: flex;
		justify-content: space-between;

		.right {
			font-size: 18px;
		}
	}

	.diamassge {
		padding: 5px 20px;
		display: flex;

		.trait {
			padding: 0 5px;
			border-bottom: 1px solid rgba(238, 241, 246, 1);

			.title {
				color: #999;
				display: flex;
				padding: 5px 0;

				div {
					width: 50%
				}
			}

			.inp-box {
				.item {
					display: flex;
					margin-top: 10px;

					div {
						padding-right: 5px;
					}
				}
			}
		}

		.img {
			margin-left: 5px;
			width: 180px;
			height: 200px;
			// background: url(../../images/newCar/u10079.png) no-repeat;
			background-size: 100% 100%;
			display: flex;
			justify-content: center
		}
	}

	.car-brand-list {
		display: flex;
		flex-wrap: wrap;

		.itemActive {
			border: #ffcc00 1px solid;
			box-shadow: 2px 2px 5px rgba(153, 153, 153, 0.349019);
			-moz-box-shadow: 2px 2px 5px rgba(153, 153, 153, 0.349019);
			-webkit-box-shadow: 2px 2px 5px rgba(153, 153, 153, 0.349019);
		}

		li {
			text-align: center;
			width: 150px;
			margin: 0 5px 10px;
			cursor: pointer;

			.systemImg {
				height: 120px;
				margin: 0 auto;
				position: relative;

				img {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);

				}
			}

		}
	}

	img {
		max-height: 100%;
		max-width: 100%;
	}

	.yellow {
		cursor: pointer;
		background: rgba(255, 204, 0, 1);
	}

	.blue {
		background: rgba(25, 93, 234, 1);
	}

	.title {
		width: 100%;
		text-align: left;
		padding: 10px;
		position: relative;
		// display: flex;
		// align-items: center;
		// justify-content: space-between;
		// flex-wrap: wrap;
		background: #fff;
		position: relative;

		.title-name {
			padding-right: 10px;
			max-width: 200px;
		}

		.title-img {
			width: 150px;
			height: 60px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.title-massage {
			// width: 630px;
			display: flex;
			align-items: center;
			text-align: center;
			flex: 1;
			padding-left: 10px;

			.item {
				padding: 0 5px;
				text-align: center;

				.title {
					padding: 0;
					color: #cccccc;
				}

				.value {
					padding: 0;
					padding-top: 5px;
					// text-align: left;
					line-height: 20px;
				}
			}


			.name {
				font-size: 20px;
				font-weight: 600;
				padding-right: 5px;
			}

		}

		.btn {
			// position: absolute;
			// right: 0;
			// padding-left: 19%;
			display: flex;
			align-items: center;
			text-align: center;

			div {
				margin: 0 2px
			}

			.one {
				// padding: 5px 10px;
				// color: #000;

			}

			.blue-btn {
// 				padding: 5px 10px;
// 				color: #fff;
// 				cursor: pointer;
			}

			.bcakBtn {
				// cursor: pointer;
				padding: 5px 10px;
				color: #fff;
				background: #666;
			}
		}

	}

	.value {
		background: #fff;
		margin-top: 10px;
		padding: 0 10px;

		.title {
			border-bottom: 1px solid rgba(238, 241, 246, 1);
			padding: 0;
			display: flex;
			justify-content: space-between;

			.tab {
				display: flex;
				position: relative;

				.item {
					padding: 15px 10px;
					cursor: pointer;
				}

				.line {
					width: 33.33%;
					height: 2px;
					background: rgba(25, 93, 234, 1);
					position: absolute;
					bottom: 0;
					transition: all .5s;
				}
			}

			.choise {
				display: flex;
				align-items: center;

				div {
					margin: 0 8px;
				}

				.btn {
					// padding: 5px 10px;
					// color: #000;
				}

				.sel {
					select {
						padding: 2px 5px;

					}
				}
			}
		}

		.list {
			padding-top: 20px;

			.item {
				border: rgba(238, 241, 246, 1) solid 1px;
				border-radius: 5px;
				margin-bottom: 10px;

				.title {
					padding: 15px 30px 15px 15px;
					display: flex;
					justify-content: space-between;
					color: #999999;
				}

				.massge {
					display: flex;
					padding: 10px 10px 15px 15px;
					position: relative;
					flex-wrap: wrap;

					.state {
						position: absolute;
						right: 20px;
						top: 20px;
						// color: #fff;
						// padding: 5px 20px;
						// background: #999;
					}

					.media {
						width: 250px;
						height: 150px;
						display: flex;
						justify-content: center;
						align-items: center;
						// background: salmon;
					}

					.data {
						padding-left: 10px;
						flex: 1;

						.text {
							color: #999999;
							font-size: 14px;
							text-align: left;
							padding: 5px 0;
						}

						.inp {
							// width: 350px;
							text-align: left;

							.desc {
								min-height: 45px;
							}
						}

						.content {
							display: flex;
							align-items: center;
							padding: 10px 0 0 0;

							.img {
								width: 50px;
								height: 50px;
								overflow: hidden;
								border-radius: 50%;
								display: flex;
								justify-content: center;
								align-items: center;
							}

							.name {
								font-size: 20px;
								color: #000;
								padding: 10px;
							}

							.num {
								padding: 0 10px;

								div {
									padding: 5px 0;
								}

								.number {
									text-align: left;
								}
							}

							.btn {
								display: flex;
								align-items: center;
								margin-left: 30px;

								div {
									// padding: 5px 20px;
									margin: 0 5px;
									cursor: pointer;
								}

								.change {
									// padding: 5px 20px;
									color: #000;
								}

								.up {
									// padding: 5px 20px;
									color: #fff;
								}

								.delete {
									// padding: 5px 20px;
									background: rgba(228, 228, 228, 1);
									color: #999;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
