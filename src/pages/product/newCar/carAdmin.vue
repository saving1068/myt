<template>
	<div class="log-record page-container">
		<panel>
			<template slot="head">
				<div class="title">
					<div class="title-name">
						<div style="font-size: 20px;">当前车系</div>
						<div style="padding-top: 10px;">{{info.statuStr}}</div>
					</div>
					<div class="title-img" v-if="info.brandImg">
						<img :src="setImgPath(info.brandImg)">
					</div>
					<div class="title-img" v-else>
					</div>
					<div class="title-massage">
						<div class="name">{{info.brandName}}</div>
						<div>{{info.brandLevelStr}}</div>
						<div>{{info.minPrice}} ~{{info.maxPrice}}</div>
						<div>{{info.netStr}}</div>
						<div>{{info.carTypeNum}}款车型</div>
					</div>
					<div class="btn">
						<div v-if="isBtnPower('040115')"  @click="goTo('addCarModel')">
							<el-button type="warning" size="mini"> 新增车型</el-button>
						</div>
						<div style="margin-left: 15px;" @click="back">
							<el-button size="mini" type="info">返回</el-button>
						</div>
					</div>
				</div>
			</template>
			<div class="value shadow" v-loading='tableLoding'>
				<template>
					<el-table :data="info.corporationCarTypeDtos" :height='sideHeight' style="width: 100%;" fit @cell-mouse-enter="cellEnter"
					 @cell-mouse-leave="cellLeave">
						<el-table-column prop='name' label='车型名称' align="center">
							
						</el-table-column>
						<el-table-column prop='price' label='市场指导价（元）' align="center" width="150">
							<template slot-scope="scope">
								<el-input maxlength="9" v-if='scope.row.ifChangePrice' size="mini" @blur='itemBlur(scope.row)' v-model="scope.row.price"
								 placeholder="请输入内容"></el-input>
								<span v-else v-text="scope.row.price"></span>
							</template>
						</el-table-column>
						<el-table-column prop='saleStatuStr' label='销售类型' align="center">
							<template slot-scope="scope">
								<el-select v-model="scope.row.saleStatuStr" style='width: 75px;' size="mini" placeholder="请选择" class="reserve-type" @change="saleChange(scope.row)">
									<el-option v-for="item in saleOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column label="是否可试驾" align="center" >
							<template slot-scope="scope">
								{{scope.row.allowTestDrive == 1? '是':'否'}}
								<!-- <el-select v-model="tryDriveValue" size="mini" placeholder="预订方式" class="reserve-type" @change="changeTry">
									<el-option v-for="item in tryDrive" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select> -->
							</template>
						</el-table-column>
						<el-table-column prop='releaseNum' label='已上架商户数量' align="center">

						</el-table-column>
						<el-table-column prop='intentionNum' label='意向客户量' align="center">

						</el-table-column>
						<el-table-column prop='testDriveNum' label='试驾量' align="center">

						</el-table-column>
						<el-table-column prop='dealNum' label='成交量' align="center">

						</el-table-column>
						<el-table-column prop='statuStr' label='状态' align="center">
							<template slot-scope="scope">
								<el-tag size="mini" :type="scope.row.status | getStatusType">{{scope.row.status | getStatus}}</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop='ifoperation' label='操作' align="center" width="180">
							<template slot-scope="scope">
								
								<div class="operate" :style="{'opacity':scope.row.ifoperation? 1:0}">
									
									<span v-if="isBtnPower('040115')" @click="salesName(scope.row)">编辑车型名称</span>
									<span v-if="isBtnPower('040127')" @click="salesprice(scope.row)">编辑指导价</span>
									<!-- <span @click="salesType(scope.row)">编辑销售类型</span> -->
									<!-- <span  @click="salesparaMeter(scope.row,scope.$index)">要删除得上传图片</span> -->
									<span v-if="isBtnPower('040128')&&scope.row.configType == 0" @click="choiceItem(scope.row)">产品参数编辑模式</span>
									<span v-if="isBtnPower('040128')&&scope.row.configType == 2" @click="goTo('addPicModel',scope.row)">上传图片</span>
									<span v-if="isBtnPower('040128')&&scope.row.configType == 1" @click="salesparaMeter(scope.row,scope.$index)">编辑模板参数</span>
									<!-- <span v-if="scope.row.configType ==1&&isBtnPower('040128')" @click="salesparaMeter(scope.row,scope.$index)">产品参数</span> -->
									<span v-if="scope.row.status == 2&&isBtnPower('040129')||scope.row.status == 0&&isBtnPower('040129')" @click="upEditCarTypeStatus(scope.row,scope.$index)">上架</span>
									<span v-if="isBtnPower('040129')&&scope.row.status == 1" @click="downEditCarTypeStatus(scope.row,scope.$index)">下架</span>
									
									<span v-if="isBtnPower('040130')&&scope.row.status == 0" @click="deleteCarType(scope.row,scope.$index)" >删除</span>
									<!-- <span>是否可试驾</span> -->
								</div>
							</template>
						</el-table-column>

					</el-table>
				</template>
			</div>
			<!-- 编辑参数模式 -->
			<el-dialog
			  :visible.sync="changParameters"
			   width="445px" top="50px" center
			  >
			  <div slot="title" class="cartType-dialog-head" style="text-align: left;">
			      <span class="left">选择编辑产品参数的模式</span>
			  </div>
			  <div class="parameters">
				  <div class="head">
					  <span style="font-size: 18px;">「{{choiceItemValue.brandName}}」</span>
					  <span>您希望用哪一种模式进行编辑呢？</span>
				  </div>
				  <div class="metersChange">
					  <el-radio-group v-model="metersChange">
						<el-radio :label="true">上传长图片</el-radio>
						<el-radio :label="false">手动编辑参数</el-radio>
					  </el-radio-group>
				  </div>
				  <div class="font" v-if="metersChange">
					  选择你「上传图片」的模式管理「{{choiceItemValue.brandName}}」所有车型的产品参数此后「{{choiceItemValue.brandName}}」各车型的参数均只能通过上传图片完善哦点击「确定提交」前请悉知！
				  </div>
				   <div class="font" v-else>
				  		选择你「手动输入参数」的模式管理「{{choiceItemValue.brandName}}」所有车型的产品参数需要先编辑一份「{{choiceItemValue.brandName}}」参数模板，此后「{{choiceItemValue.brandName}}」各车型的参数均可在「参数模板」基础上手动进行编辑完善哦点击「确定提交」前请悉知！
				  </div>
			  </div>
			   <div class="parametersFooter">
					<el-button v-if="metersChange" style="display:block; width:100%;" type="warning"  @click="goTo('addPicModel',choiceItemValue)">确认提交</el-button>
					<el-button v-else style="display:block; width:100%;" type="warning" @click="salesparaMeter(choiceItemValue)">开始制作「参数模板」</el-button>
			  </div>
			</el-dialog>
			
			<el-dialog :visible.sync="ifAlertP" width="50%" center>
				<div class="dialogBox" v-loading='ParaMeter'>
					<div class="title">
						<div style="color: #666666;">所属车系车型</div>
						<div class="name">{{list.brandName}}</div>
						<div>{{list.years}}</div>
						<div>{{list.sweptVolume}}</div>
						<div>{{list.model}}</div>
					</div>
					<div class="massge" v-if="list.corporationCarTypeConfigDtos">
						<div class="list" v-if="list.corporationCarTypeConfigDtos.length !=0" v-for="(v,i) in list.corporationCarTypeConfigDtos">
							<div class="value-title">
								<div class="text">
									{{v.title}}
								</div>
							</div>
							<div class="value-massage">
								<el-table :data="v.corporationCarTypeConfigDtos" style="width: 100%">
									<el-table-column prop="title" label="参数名称" fit align="center">
										<template slot-scope="scope">
			  						<el-input type="text" v-model="scope.row.title"></el-input>
			  					</template>
									</el-table-column>
									<el-table-column prop="content" label="参数值" fit align="center">
										<template slot-scope="scope">
											<el-input type="text" v-model="scope.row.content"></el-input>
										</template>
									</el-table-column>

								</el-table>
							</div>
						</div>
						<div v-if="list.corporationCarTypeConfigDtos.length ==0">
							暂无参数,请前往车系列表修改
						</div>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="ifAlertP = false">取 消</el-button>
					<el-button type="primary" @click="keepParaMeter">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog :visible.sync="ifAlert" width="800px" center title="编辑车型名称">
				<div class="nameChange">
					<div class="head">请「{{info.brandName}}」的车型名称：</div>
					<ul class="content">
						<li>
							<div>第一级名称</div>
							<div>
								<el-input v-model="first" placeholder="请输入内容" maxlength="12">
									<template slot="append">
										<span v-if="first.length != 0">{{first.length}}</span>
										<span v-if="first.length == 0">0</span>/12
									</template>
								</el-input>
							</div>
						</li>
						<li>
							<div>第二级名称</div>
							<div>
								<el-input v-model="second" placeholder="请输入内容" maxlength="6">
									<template slot="append">
										<span v-if="second.length != 0">{{second.length}}</span>
										<span v-if="second.length == 0">0</span>/6
									</template>
								</el-input>
							</div>
						</li>
						<li>
							<div>第三级名称</div>
							<div>
								<el-input v-model="third" placeholder="请输入内容" maxlength="6">
									<template slot="append">
										<span v-if="third.length != 0">{{third.length}}</span>
										<span v-if="third.length == 0">0</span>/6
									</template>
								</el-input>
							</div>
						</li>
					</ul>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="ifAlert = false">取 消</el-button>
					<el-button type="primary" @click="nameChange">确 定</el-button>
				</span>
				</el-dialog>
			</el-dialog>
			<!-- <no-data>开发中....</no-data> -->
		</panel>
	</div>
</template>

<script>
	import Panel from '@/components/Panel'
	import NoData from '@/components/NoData'
	import {getCorporationCarTypes,editCorporationCarType,editCarTypeSalePrice,editCarTypeSaleStatu,editCarTypeStatus,deleteCarType,getCorporationCarTypeConfigs,editCarTypeConfig} from '@/api/carAdmin'
	import {setImgPath} from '@/utils'
	import power from '@/mixins/power'
	export default {
		components: {
			Panel,
			NoData
		},
		computed:{
				sideHeight(){
		// 			console.log(111)
		// 			console.log(this.$store.state.getContentSize)
						return this.$store.state.getContentSize - 105
				}
			},
		mixins: [power],
		data() {
			return {
				choiceItemValue:{},
				changParameters:false,
				metersChange:false,
				choice:'',
				
				first:'',
				second:'',
				third:"",
				choiseId:'',
				choiseIndex:null,
				ParaMeter:false,
				
				setImgPath:setImgPath,
				info: {},
				ifAlert: false,
				ifAlertP: false,
				type: 1,
				alertInfo: {},
				carTypeId: 0,
				warpLoding: false,
				tableLoding: false,
				stateValue: "1",
				saleValue:'1',
				saleOptions: [{
						label: '在售',
						value: '1'
					},
					{
						label: '预售',
						value: '2'
					},
					{
						label: '退市',
						value: '3'
					}
				],
				tryDrive: [{
						label: '是',
						value: '1'
					},
					{
						label: '否',
						value: '2'
					},
				],
				tryDriveValue: '1',
				list:{}
			}
		},
		async created() {
			await this.getPower('040115,040126,040127,040129,040128,040130,040131')
			console.log(this.$route.query.carId)
			this.getCorporationCarTypes(this.$route.query.carId)
		},
		methods: {
			choiceItem(item){
				console.log(item)
				if(item.configType == 2){
					this.metersChange = true;
				}else{
					this.metersChange = false;
				}
				this.choice = item.index;
				this.changParameters  = true;
				this.choiceItemValue = item;
			},
			changeTry(){
				if(this.isBtnPower('040131')){
					
				}else{
					this.$message.warning("您暂无权限")
				}
			},
			async saleChange(item){
				if(this.isBtnPower('040126')){
					this.tableLoding = true;
					let send = {
						saleStatus:item.saleStatuStr,
						id: item.id
					}
					try{
						let res = await editCarTypeSaleStatu(send);
						// this.getCorporationCarTypes(this.$route.query.carId)
						if (send.saleStatus == 1) {
							this.info.corporationCarTypeDtos[item.index].saleStatuStr = '在售'
						} else if (send.saleStatus == 2) {
							this.info.corporationCarTypeDtos[item.index].saleStatuStr = '预售'
						}else{
							this.info.corporationCarTypeDtos[item.index].saleStatuStr = '退市'
						}
						this.tableLoding = false;
						
							this.$message.success('编辑成功')
					}catch(e){
						this.tableLoding = false;
						//TODO handle the exception
					}
				}else{
					this.$message.warning("您暂无权限")
				}

				
			},
			
			async deleteCarType(item, index) {
				this.tableLoding = true;
				let obj = {
					carTypeId: item.id
				}
				try{
					let res = await deleteCarType(obj)
					this.$message.success('删除成功')
					this.info.corporationCarTypeDtos.splice(index, 1)
					this.tableLoding = false;
				}catch(e){
					//TODO handle the exception
				}
			},
			async downEditCarTypeStatus(item, index) {
				this.tableLoding = true;
				let obj = {
					carTypeId: item.id,
					status: 2,
				}
				try{
					let res = await editCarTypeStatus(obj);
					console.log(res)
					this.$message({
						message:'下架成功',
						type:'success'
					})
					this.info.corporationCarTypeDtos[index].statuStr = '已下架';
					this.info.corporationCarTypeDtos[index].status = 2;
					this.tableLoding = false;
				}catch(err){
					
				}
				
			},
			async upEditCarTypeStatus(item, index) {
				this.tableLoding = true;
				let obj = {
					carTypeId: item.id,
					status: 1,
				}
				try{
					let res = await editCarTypeStatus(obj);
					console.log(res)
					this.$message({
						message:'上架成功',
						type:'success'
					})
					this.info.corporationCarTypeDtos[index].statuStr = '已上架';
					this.info.corporationCarTypeDtos[index].status = 1;
					this.tableLoding = false;
				}catch(err){
					
				}
			},
			async keepParaMeter(){
				this.$loading.show('请稍等')
				// console.log(this.list.corporationCarTypeConfigDtos)
				try{
					let send ={
						carTypeId:this.choiseId,
						carTypeConfigArrs:JSON.stringify(this.list.corporationCarTypeConfigDtos),
						type:1
					}
					let res = await editCarTypeConfig(send)
					// console.log(res)
					this.$message.success('设置成功')
					this.$loading.hide()
					this.ifAlertP = false;
					this.getCorporationCarTypes(this.$route.query.carId)
				}catch(e){
					this.$loading.hide()
					//TODO handle the exception
				}
			},
			async salesparaMeter(item) {
				console.log(item)
					this.ifAlertP = true;
					this.alertInfo = item;
					this.choiseId = item.id;
					this.ParaMeter = true;
					try{
						let send = {
							shopBrandId:this.info.id,
							carTypeId:item.id,
							type:1
						}
						let info = await getCorporationCarTypeConfigs(send);
						this.list = {...info}//请求接口再处理
						this.ParaMeter = false;
						console.log(info)
					}catch(err){
						this.ifAlertP = false;
						this.ParaMeter = false;
					}
				
				
				
			},
			salesType(item) {
				this
				this.type = 1;
				this.ifAlert = true;
				this.alertInfo = item;
			},
			
			
			async nameChange(){
				this.tableLoding = true;
				try{
					let send = {
						years: this.first,
						sweptVolume: this.second,
						model:this.third,
						id: this.choiseId
					}
					let res  = await editCorporationCarType(send);
					let name = `${send.years}${send.sweptVolume}${send.model}`;
					console.log(name)
					this.info.corporationCarTypeDtos[this.choiseIndex].name = name;
					console.log()
					this.tableLoding = false;
				}catch(e){
					this.tableLoding = false;
					//TODO handle the exception
				}
				
				this.ifAlert = false;
			},
			salesName(item) {
				this.type = 3;
				this.ifAlert = true;
				this.first = item.years;
				this.second = item.sweptVolume;
				this.third = item.model;
				this.choiseId = item.id
				this.choiseIndex = item.index
				// item.name = this.info.brandName;
				// this.alertInfo = item;
			},
			salesprice(item) {
				console.log(item)
				for (let i = 0; i < this.info.corporationCarTypeDtos.length; i++) {
					if (item.index == i) {
						this.info.corporationCarTypeDtos[item.index].ifChangePrice = true;
					} else {
						this.info.corporationCarTypeDtos[i].ifChangePrice = false;
					}
				}

				// 				this.type = 4 ;
				// 				this.ifAlert = true;
				// 				this.alertInfo = item;
			},
			offAlert(value) {
				console.log(value)
				this.ifAlert = value;
			},
			offAlertP(value) {
				this.ifAlertP = value;
			},
			keepAlert(value) {
				this.ifAlertP = value;
			},
			goTo(place,item) {
				console.log(item)
				if(place == 'addCarModel'){
					let carInfo = {
						brandName: this.info.brandName,
						statuStr: this.info.statuStr,
						status: this.info.status,
						saleBrandId: this.info.saleBrandId
					}
					console.log(carInfo)
					this.$router.push({
						name: 'addCarModel',
						query: {
							carId: this.$route.query.carId,
							carInfo,
						}
					})
				}else{
					this.$router.push({
						name:place,
						query:{
							carId:this.$route.query.carId,
							carTypeId:item.id?item.id:''
						}
					})
				}
				
			},
			getData(value) {
				let data = value[0];
				console.log(data);
				if (data.type == 1) { //销售类型
					let send = {
						saleStatus: data.sales,
						id: this.info.corporationCarTypeDtos[data.index].id
					}
					this.editCarTypeSaleStatu(send, data)
				} else if (data.type == 2) {

				} else if (data.type == 3) {
					let send = {
						years: data.years,
						sweptVolume: data.sweptVolume,
						model: data.model,
						id: this.info.corporationCarTypeDtos[data.index].id
					}
					// this.editCorporationCarType(send, data)
				} else if (data.type == 4) {
					let send = {
						price: data.price,
						id: this.info.corporationCarTypeDtos[data.index].id
					}
					this.editCarTypeSalePrice(send, data)
				}

				this.ifAlert = value[1];
			},
			async getCorporationCarTypes(id) {
				this.tableLoding = true;
				let obj = {
					shopBrandId: id
				}
				try{
					let res = await getCorporationCarTypes(obj);
					console.log(res)
					for (let i = 0; i < res.corporationCarTypeDtos.length; i++) {
						res.corporationCarTypeDtos[i].ifoperation = false;
						res.corporationCarTypeDtos[i].ifChangePrice = false;
						res.corporationCarTypeDtos[i].index = i;
					}
					this.info = res;
					this.tableLoding = false;
				}catch(err){
					console.log(err)
					//TODO handle the exception
				}
				
				
// 				this.$Api.newCar.getCorporationCarTypes(obj).then((res) => {
// 					console.log(res)
// 					if (res.success) {
// 						for (let i = 0; i < res.content.corporationCarTypeDtos.length; i++) {
// 							res.content.corporationCarTypeDtos[i].ifoperation = false;
// 							res.content.corporationCarTypeDtos[i].ifChangePrice = false;
// 							res.content.corporationCarTypeDtos[i].index = i;
// 						}
// 						this.info = res.content;
// 					}
// 					this.warpLoding = false;
// 				})
			},
			cellEnter(row, column, cell, event) {

				this.info.corporationCarTypeDtos[row.index].ifoperation = true;
			},
			cellLeave(row, column, cell, event) {
				this.info.corporationCarTypeDtos[row.index].ifoperation = false;

			},
			async itemBlur(item) {
				this.info.corporationCarTypeDtos[item.index].ifChangePrice = false;
				let integer, decimal = null;
				const checkPrice = (price) => {
					return /(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/.test(price) && price > 0
				}
				
				if (checkPrice(item.price)) {
					if (typeof(item.price) == 'string') {
						this.tableLoding = true;
						let send = {
							price: item.price,
							id: this.info.corporationCarTypeDtos[item.index].id
						}
						try{
							let res = await editCarTypeSalePrice(send);
							console.log(res)
							this.$message({
								message: '修改价钱成功',
								type: 'success'
							})
							this.info.corporationCarTypeDtos[item.index].price = send.price;
							this.tableLoding = false;
						}catch(err){
							this.tableLoding = false;
						}
						
						// }
					}
				} else {
					this.getCorporationCarTypes(this.$route.query.carId)
					this.$message({
						message: '请填写正确的格式',
						type: 'warning'
					})
				}




				// console.log(send)

			},
			back() {
				this.$router.go(-1)
			}
		},
		filters: {
		    getStatus(status) {
		        return ['待上架', '已上架', '已下架'][status]
		    },
		    getStatusType(status) {
		        return ['info', 'success', 'danger'][status]
		    },
		    getSaleStatus(status) {
		        return ['--', '在售', '预售', '退市'][status]
		    },
		    getSpreadTitle(type, saleMode) {
		        const arr = ['', '试驾推广语', '选车推广语', '分享推广语']
		        if(saleMode == 2){
		            arr[2] = '领券推广语'
		        }
		        return arr[type]
		    },
		    getSpreadTxt(type, saleMode) {
		        const arr = ['', '试驾按钮', '选车按钮', '分享区域']
		        if(saleMode == 2){
		            arr[2] = '领券按钮'
		        }
		        return arr[type]
		    }
		}
	}
</script>
<style scoped="scoped" lang="scss">
	.parameters{
		.head{
			display: flex;
			align-items:center;
		}
		.metersChange{
			padding: 10px 8px;
		}
		.font{
			padding: 0 8px 20px;
			line-height: 30px;
			}
	}
	.parametersFooter{
		position: absolute;
		bottom: 0;left: 0;
		width: 100%;
	}
	
	
	
	img{
		max-height: 100%;
		max-width: 100%;
	}
	.title {
		width: 100%;
		text-align: left;
		display: flex;
		align-items: center;
		background: #fff;
		position: relative;

		.title-img {
			width: 150px;
			// background: salmon;
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

		.btn {
			position: absolute;
			right: 1%;
			display: flex;
			line-height: 40px;

			.addBtn {
				padding: 0 30px;
				background: rgba(255, 204, 0, 1);
				color: #000;
				margin-right: 20px;
				cursor: pointer;
			}

			.bcakBtn {
				cursor: pointer;
				padding: 0 15px;
				color: #fff;
				background: #666;
			}
		}

	}
	.dialogBox{
		
		background: #fff;
		
		position: relative;
		.title{
			display: flex;
			align-items: center;
			color: #000000;
			line-height: 40px;
			border-bottom: 1px solid rgba(238, 241, 246, 1);
			div{
				padding: 0 10px;
			}
			.name{
				font-size: 20px;
				font-weight: 600;
			}
		}
		.massge{
			padding: 10px 30px;
			max-height: 500px;
			overflow-y:scroll;
			.value-title {
				background: rgba(238, 241, 246, 1);
				padding: 0 10px;
				.text {
					color: #333333;
					line-height: 40px;
					text-align: left;
				}
			}
			.value-massage {
				padding: 30px;
				margin: 0 0 20px;
				.btn {
					display: flex;
					align-items: center;
					background: rgb(240, 240, 240);
					border-top-left-radius: 5px;
					border-top-bott-radius: 5px;
				
					i {
						font-size: 20px;
						font-weight: 600;
						line-height: 40px;
						
					}
				
					.up {
						width: 40px;
						height: 40px;
						border-right: 1px solid rgb(229, 229, 229);
				text-align: center;
						i {
							transform: rotate(90deg);
						}
					}
				
					.down {
						width: 40px;
						height: 40px;
						border-right: 1px solid rgb(229, 229, 229);
				text-align: center;
						i {
							transform: rotate(-90deg);
						}
					}
				
					.delete {
						padding: 0 20px;
						color: rgb(225, 91, 86)
					}
				}
			}
		}
	}
	.nameChange{
		.head{
		}
		.content{
			display: flex;
			justify-content: space-between;
			li{
				width: 230px;
				span{
					color: #ff3366;
				}
			}
		}
	}
</style>
