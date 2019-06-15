<template>
    <div class="car-product">
        <panel>
            <template slot="head">
                <div class="left">
					<!-- <span class="title">新车库</span> -->
					<el-select v-model="typeValue" size="mini" @change="radioChange" placeholder="请选择">
						<el-option
						  v-for="item in typeOptions"
						  :key="item.value"
						  :label="item.label"
						  :value="item.value">
						</el-option>
					  </el-select>
					  <el-select v-model="stateValue"  size="mini" @change="stateChange" placeholder="请选择">
						<el-option
						  v-for="item in stateOptions"
						  :key="item.value"
						  :label="item.label"
						  :value="item.value">
						</el-option>
					  </el-select>
				</div>
                <div class="right">
                    <!-- <el-button type="warning" size="mini" v-if="isBtnPower('040105')" @click="carTypeDialog">选入车库</el-button> -->
					 <el-button type="warning" size="mini"  @click="goTo('addCarSystem')">新增车系</el-button>
                </div>
            </template>
            <div class="car-table">
                <!-- :header-cell-style="{background:'#eef1f6',color:'#606266'}" -->
                <el-table :data="tableData" style="width: 100%" fit v-loading="loading" :height="sideHeight">
                    <el-table-column label="车系" width="140" align="center" >
                        <template slot-scope="scope">
                            <img :src="setImgPath(scope.row.brandImg)" width="120" /> 
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" label="名称" min-width="120" align="center" />
                    <el-table-column prop="brandLevelStr" label="结构" align="center" />
                    <el-table-column label="官价" width="180" align="center">
                        <template slot-scope="scope">
                            ￥{{scope.row.minPrice}} - ￥{{scope.row.maxPrice}}
                        </template>
                    </el-table-column>
                    <el-table-column label="销售类型" align="center" width="120" >
                        <template slot-scope="scope">
                            <!-- {{scope.row.saleStatus | getSaleStatus}} -->
							<el-select v-model="scope.row.saleStatuStr" style='width: 90px;'  @change="saleChange($event, scope.row.saleBrandId)"  size="mini" placeholder="请选择" class="reserve-type">
								<el-option
								  v-for="item in saleOptions"
								  :key="item.value"
								  :label="item.label"
								  :value="item.value">
								</el-option>
							  </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="spreadDesc" label="推广" align="center">
						<template slot-scope="scope">
							<span>{{scope.row.mainPush == 1?'主推':'新车'}}</span>
						</template>
					 </el-table-column>
                    <!-- <el-table-column prop="carTypeNum" label="车型数量" align="center" /> -->
                    <el-table-column label="预订方式" width="120" align="center">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.saleMode" size="mini" placeholder="预订方式" @change="saveReserveType($event, scope.row.saleBrandId)" class="reserve-type">
                                <el-option
                                    v-for="item in typeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
					<el-table-column label="是否可试驾" width="120"  align="center">
					    <template slot-scope="scope">
							<span>{{scope.row.testDrive == 1? '是':'否'}}</span>
					        <!-- <el-select v-model="tryDriveValue" size="mini" @change="setTryDrive" placeholder="预订方式" class="reserve-type">
					            <el-option
					                v-for="item in tryDrive"
					                :key="item.value"
					                :label="item.label"
					                :value="item.value">
					            </el-option>
					        </el-select> -->
					    </template>
					</el-table-column>
					<el-table-column prop="intentionNum" label="意向客户量" width="120"  align="center" />
					<el-table-column prop="testDriveNum" label="试驾量" align="center" />
					<el-table-column prop="dealNum" label="成交量"  align="center" />
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            <el-tag size="mini" :type="scope.row.status | getStatusType">{{scope.row.status | getStatus}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="250">
                        <template slot-scope="scope">
                            <div class="operate">
								<span v-if="isBtnPower('040106')"  @click="goTo('addCarSystem',scope.row)">编辑车系</span>
								<!-- <span v-if="isBtnPower('040117')"  @click="goTo('makeParameters',scope.row)">制作参数模板</span> -->
								<span v-if="isBtnPower('040117')" @click="choiceItem(scope.row)">产品参数编辑模式</span>
								<span v-if="isBtnPower('040114')" @click="goTo('carAdmin',scope.row)">车型管理</span>
								<!-- <span>编辑销售类型</span> -->
								<span v-if="isBtnPower('040102') && scope.row.saleStatus != 3" @click="setBrandStatus(scope.row.id, scope.row.status)">
								    {{scope.row.status == 1 ? '下架' : '上架' }}
								</span>
								<!-- <span>预览</span> -->
								<!-- <span>预订方式</span> -->
								<span v-if="isBtnPower('040122')" @click="openTry(scope.row)">试驾设置</span>
								 <span v-if="isBtnPower('040109')" @click="spreadHandle(1, scope.row)">试驾推广语</span>
								<span v-if="isBtnPower('040110')" @click="spreadHandle(2, scope.row)">{{scope.row.saleMode == 1 ? '选车' : '领券'}}推广语</span>
								<span v-if="isBtnPower('040111')" @click="spreadHandle(3, scope.row)">分享推广语</span>
                                <!-- <span v-if="isBtnPower('040104')" @click="previewCode(scope.row)">预览</span> -->
                                <!-- <span v-if="isBtnPower('040107')" @click="carBrandDialog(scope.row)">选入车型</span> -->
                                <!-- <span v-if="isBtnPower('040103')" @click="sortTop(scope.row.id)">置顶</span> -->
                                <!-- <span v-if="isBtnPower('040102') && scope.row.saleStatus != 3" @click="setBrandStatus(scope.row.id, scope.row.status)">
                                    {{scope.row.status == 1 ? '下架' : '上架' }}
                                </span> -->
                                <span v-if="isBtnPower('040101')&&scope.row.status == 0" @click="delBrand(scope.row.saleBrandId)">删除</span>
                               <!-- <span v-if="isBtnPower('040109')" @click="spreadHandle(1, scope.row)">试驾推广语</span>
                                <span v-if="isBtnPower('040110')" @click="spreadHandle(2, scope.row)">{{scope.row.saleMode == 1 ? '选车' : '领券'}}推广语</span>
                                <span v-if="isBtnPower('040111')" @click="spreadHandle(3, scope.row)">分享推广语</span> -->
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <div class="flex justify-content-end mt15">
                    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :current-page.sync="curPage" :total="total" ></el-pagination>
                </div> -->
            </div>
        </panel>
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
				<el-button v-if="metersChange" style="display:block; width:100%;" type="warning"  @click="setType(choiceItemValue)">确认提交</el-button>
				<el-button v-else style="display:block; width:100%;" type="warning" @click="goTo('makeParameters',choiceItemValue)">开始制作「参数模板」</el-button>
		  </div>
		</el-dialog>


		


        <!-- 车系 -->
       <!-- <el-dialog :visible.sync="carTypeDialogVisible" width="800px" top="50px" center class="car-dialog" :close-on-click-modal="false">
            <div slot="title" class="flex justify-content-spacebetween cartType-dialog-head">
                <span class="left">选入车系</span>
                <span class="right">可同时选入多个车系</span>
            </div>
            <div class="car-type-content" v-loading="dialogLoading">
                <ul class="car-type-list clearfix" v-if="carTypeList.length">
                    <li v-for="(item,index) in carTypeList" :key="index">
                        <car-type-item :item="item" :isSelected="item.isSelected" @select="selectTypeHandle" />
                    </li>
                </ul>
                <no-data v-if="!carTypeList.length && !dialogLoading">暂无车系数据</no-data>
            </div>
            <div slot="footer" class="dialog-footer" v-if="carTypeList.length">
                <el-button style="display:block; width:100%;" type="warning" :loading="addLoading" @click="addBrandHandle">确认提交</el-button>
            </div>
        </el-dialog> -->

        <!-- 车型 -->
        <el-dialog :visible.sync="carBrandDialogVisible" width="700px" top="40px"  center class="car-dialog" :close-on-click-modal="false">
            <div slot="title" class="cartType-dialog-head" style="text-align: left;">
                <span class="left">车系试驾设置</span>
            </div>
			<div class="tryCar">
				<span>「{{tryCarInfo.brandName}}」是否可试驾</span>
				<el-radio-group v-model="ifTry">
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
				<div style="padding-top: 20px;" v-if="!carBrandList.length && !dialogLoading">「{{tryCarInfo.brandName}}」当前无任何可选择的试驾车型，请马上添加车型！</div>
                <!-- <no-data v-if="!carBrandList.length && !dialogLoading">暂无车型数据</no-data> -->
            </div>
			<div v-show="!ifTry" style="padding: 10px 8px;">
				设置「{{tryCarInfo.brandName}}」不可试驾并保存后：<br /> 1、客户在小程序中的「{{tryCarInfo.brandName}}」车系详情页面「试驾」按钮将不可点击，<br />2、客户与顾问在下单试驾时，将无法选择「{{tryCarInfo.brandName}}」。<br />点击「确定提交」前请悉知哦！

			</div>
            <div slot="footer" class="dialog-footer" >
                <el-button v-if="carBrandList.length&&ifTry" style="display:block; width:100%;" type="warning"  @click="addTypeHandle">确认提交</el-button>
				<el-button v-if="carBrandList.length == 0&&ifTry" style="display:block; width:100%;" type="warning" @click="goTo('addCarModel')">添加车型</el-button>
				<el-button v-if="!ifTry" style="display:block; width:100%;" type="warning"  @click="cancalTypeHandle">确认提交</el-button>
            </div>
        </el-dialog>

        <!-- 推广语 '试驾推广语', '预订推广语', '分享推广语'-->
        <el-dialog :visible.sync="spreadDialogVisible" :title="spreadType | getSpreadTitle(carInfo.saleMode)" width="580px" top="40px" :close-on-click-modal="false">
            <div class="spread-content flex">
                <template v-if="spreadType == 1">
                    <img src="~assets/config_txt_01.png" width="220" height="320" />
                </template>
                <template v-else-if="spreadType == 2">
                    <img src="~assets/config_txt_02.png" width="220" height="320" />
                </template>
                <template v-else-if="spreadType == 3">
                    <img src="~assets/config_txt_03.png" width="220" height="320" />
                </template>
                <div class="spread-right col ml20">
                    <p>编辑<strong>「{{carInfo.brandName}}」</strong>详情内的{{spreadType | getSpreadTxt(carInfo.saleMode)}}中显示的推广文字</p>
                    <form-input classType='input' v-if="spreadType != 3"  class="mt15" v-model="spreadTxt" :max="spreadType == 3 ? 20 : 10" :placeholder="spreadType == 3 ? '请输入20个字以内' : '请输入10个字以内'" />
					<form-input classType='textarea' v-else  class="mt15" v-model="spreadTxt" :max="spreadType == 3 ? 20 : 10" :placeholder="spreadType == 3 ? '请输入20个字以内' : '请输入10个字以内'" />
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button style="display:block; width:100%;" type="warning" :disabled="spreadTxt.length == 0" :loading="addLoading" @click="saveSpread">保存</el-button>
            </div>
        </el-dialog>

        <!-- 小程序二维码 -->
        <qr-code-dialog :visible.sync="qrCodeDialogVisible" :title="brandName" :src="qrCodePath"></qr-code-dialog>

    </div>
</template>


<script>
import Panel from '@/components/Panel'
import CarTypeItem from '@/components/CarTypeItem'
import NoData from '@/components/NoData'
import FormInput from '@/components/FormInput'
import QrCodeDialog from '@/components/QrCodeDialog'

import power from '@/mixins/power'
import {message} from '@/mixins'

import {setImgPath} from '@/utils'
import {editSaleStatus} from '@/api/newCar';
import {
    getSaleBrands, 
    getCorporationBrands, 
    topBrand, 
    editBrandStatus, 
    delBrand, 
    addBrand,
    getCorporationCarTypes,
    addCarType,
    getPreviewCode,
    editReserveCarDesc,
    editTestDriveDesc,
    editShareDesc,
    editSaleMode,
	editCarTypeTestDrive,
	editCarConfigType
} from '@/api/product'

export default {
    components: {Panel, CarTypeItem, NoData, FormInput, QrCodeDialog},
    mixins: [power, message],
    data() {
        return {
			ifTry:false,
			ifChange:false,
			initList:[],
			tryCarInfo:{},
			choiceCarsaleBrandId:null,
			typeOptions:[
				{label:'按上架时间',value:"1"},
				{label:'按车型数量',value:'2'},
				{label:'按意向客户量',value:'3'},
				{label:'按试驾量',value:'4'},
				{label:'按成交量',value:'5'},
			],
			typeValue:"1",
			stateOptions:[
				{label:'未上架',value:'0'},
				{label:'已上架',value:'1'},
				{label:'已下架',value:'2'}
			],
			stateValue:"",
			saleOptions:[
				{label:'在售',value:'1'},
				{label:'预售',value:'2'},
				{label:'退市',value:'3'}
			],
			saleValue:"1",
			tryDrive:[
				{label:'是',value:'1'},
				{label:'否',value:'2'},
			],
			tryDriveValue:'1',
			tableData:[],
			changParameters:false,
			metersChange:false,
			choiceIndex:0,
			choiceItemValue:{},
			
			choiceCarList:[],
			
			
			
            loading: false,
            dialogLoading: false,
            addLoading: false,
            carList: [],
            pageSize: 10,
            curPage: 1,
            total: 0,
            setImgPath: setImgPath,
            carTypeList: [], // 车系列表
            carTypeDialogVisible: false, // 车系
            carBrandList: [],
            carBrandDialogVisible: false, // 车型
            selectBrandId: '', // 选中车系ID

            typeList: [
				// {label: '请选择', value: 0},
                {label: '选车下单', value: 1},
                {label: '领券下单', value: 2},
            ],

            qrCodeDialogVisible: false,
            brandName: '',
            qrCodePath: '', // 小程序二维码

            carInfo: '',
            spreadDialogVisible: false, // 推广窗口
            spreadTxt: '', // 推广语
            spreadType: 1, // 推广类型 1试驾推广语 2预订推广语 3分享推广语
        }
    },
    async created() {
        await this.getPower('040101,040102,040106,040107,040108,040109,040110,040111,040112,040114,040117,040122,040124,040125')
        // this.getData()
		 let obj ={
			sortType:1,
			status:''
		}
		this.getCorporationBrands(obj)
    },
	computed:{
		sideHeight(){
// 			console.log(111)
// 			console.log(this.$store.state.getContentSize)
				return this.$store.state.getContentSize - 75
		}
	},
    methods: {
		async setType(item){
			this.$loading.show('请稍等')
			try{
				// console.log(item)
				await editCarConfigType({shopBrandId:item.id,configType:2})
				item.configType = 2;
				this.$message.success('设置成功,可到车型管理处上传图片')
				this.changParameters = false;
				this.$loading.hide()
			}catch(e){
				this.$loading.hide()
				//TODO handle the exception
			}
			
			
		},
		async cancalTypeHandle(){
			let send = []
			this.initList.forEach(item =>{
				if(item.allowTestDrive == 1){
					let obj = {
						allowTestDrive:0,
						id:item.saleCarTypeId
					}
					send.push(obj)
				}
			})
			let sendObj ={
				paramStr:JSON.stringify(send)
			}
			await editCarTypeTestDrive(sendObj)
			this.$message.success('设置成功')
			this.carBrandDialogVisible = false;
			let obj = {
				sortType:this.typeValue,
				status:this.stateValue
			}
			this.getCorporationBrands(obj)
		},
		async addTypeHandle(){//确认可试驾车型
			let choice = [];
			this.carBrandList.forEach( item =>{
				if(item.checked){
					choice.push(item)
				}
			})
			// console.log(choice)
			// console.log(this.choiceCarList)
			
			this.choiceCarList.forEach(v => {
				const findObj = choice.find(k => k.id == v.id)
				if(!findObj){
					choice.push({
						...v,
						isDel: true
					})
				}
				
			})
			const sendList = []
			choice.forEach(item =>{
				const obj = {
					id:item.saleCarTypeId,
					allowTestDrive:item.isDel?0 :1
				}
				sendList.push(obj)
			})
			
			// console.log(sendList)
			let sendObj ={
				paramStr:JSON.stringify(sendList)
			}
			// console.log(sendObj)
			try{
				await editCarTypeTestDrive(sendObj)
				this.dialogLoading = false;
				this.carBrandDialogVisible = false;
				this.$message.success('设置成功')
				let send = {
					sortType:this.typeValue,
					status:this.stateValue
				}
				this.getCorporationBrands(send)
			}catch(e){
				//TODO handle the exception
			}
			
			
		},
		selectTypeHandle(item) {
		},
		 // 选择车型
		selectCarBrandItem(item, index) {
			this.ifChange= true;
			item.checked = !item.checked;
		},
		async openTry(item){
			this.tryCarInfo = item;
			this.carBrandList = [];
			this.choiceCarList = [];
			this.dialogLoading = true
			this.carBrandDialogVisible = true;
			this.ifTry = item.testDrive == 1?true:false;
			try{
				let res =  await getCorporationCarTypes({shopBrandId:item.id})
				this.choiceCarsaleBrandId = res.saleBrandId;
				this.carBrandList = res.corporationCarTypeDtos.map(v => {
					
				                    // 有allowTestDrive则已经选过了
					v.checked = v.allowTestDrive  == 1? true : false
					if(v.checked){
						this.choiceCarList.push(v);
						let obj ={
							allowTestDrive:1,
							saleCarTypeId:v.saleCarTypeId
						}
						this.initList.push(obj);
					}
					return v
				})
				
				this.dialogLoading = false;
			}catch(e){
				//TODO handle the exception
			}
			
		},
		choiceItem(item){
			this.choice = item.index;
			this.changParameters  = true;
			this.metersChange = item.configType != 2?false:true;
			this.choiceItemValue = item;
		},
		goTo(place,item){
			// console.log(place)
			if(place == 'addCarSystem'){
				if(item){
					this.$router.push({
						name:place,
						query:{
							carId:item.id
						}
					})
				}else{
					this.$router.push({
						name:place,
					})
				}
				
			}else if(place == 'addCarModel'){
				let carInfo = {
					brandName: this.tryCarInfo.brandName,
					statuStr: this.tryCarInfo.statuStr,
					status: this.tryCarInfo.status,
					saleBrandId:this.choiceCarsaleBrandId 
				}
				// console.log(carInfo)
				this.$router.push({
					name:place,
					query:{
						carId:this.tryCarInfo.id,
						carInfo
					}
				})
				
				
			}else if(place == 'makeParameters'){
				this.$loading.show('请稍等')
				try{
					editCarConfigType({shopBrandId:item.id,configType:1})
					this.$message.success('设置参数模式成功')
					this.changParameters = false;
					this.$loading.hide()
					this.$router.push({
						name:place,
						query:{
							carId:item.id
						}
					})
				}catch(e){
					this.$loading.hide()
					//TODO handle the exception
				}
				
			}else{
				this.$router.push({
					name:place,
					query:{
						carId:item.id
					}
				})
			}
			
			
		},
		setTryDrive(){
			if(this.isBtnPower('040122')){
				
			}else{
				this.$message.wraning("您暂无权限")
			}
		},
		async saleChange(saleStatus, saleBrandId){
			if(this.isBtnPower('040124')){
				  this.$loading.show()
				try{
					let obj = {
						saleBrandId,
						saleStatus
					}
					await editSaleStatus(obj)
					console.log('是否继续下去')
					this.tableData.find(v => v.saleBrandId == saleBrandId).saleStatus = saleStatus
					this.$message.success('修改成功')
				}catch(e){
					//TODO handle the exception
				}
				this.$loading.hide()
			}else{
				this.$message.wraning("您暂无权限")
			}
			
		},
		stateChange(value){
			// console.log(value)
			let obj = {
				sortType:this.typeValue,
				status:value
			}
			this.getCorporationBrands(obj);
		},
		radioChange(value){
			// console.log(value)
			let obj = {
				sortType:value,
				status:this.stateValue
			}
			
			this.getCorporationBrands(obj);
		},
		
//         async getData() {
//             try {
//                 const {pageSize, curPage} = this
//                 this.loading = true
//                 const res = await getSaleBrands({pageSize, curPage})
//                 this.carList = res.items
//                 this.total = res.total
//             } catch (error) {
//                 
//             }
//             this.loading = false
//         },
        // 保存预订方式
        async saveReserveType(saleMode, saleBrandId) {
			if(this.isBtnPower('040125')){
				  this.$loading.show()
				try {
				  await  editSaleMode({saleBrandId, saleMode}).then(res => {
				        // 这里不做重新请求刷新列表了，直接改列表的数据
						// console.log(saleMode,saleBrandId)
				        this.tableData.find(v => v.saleBrandId == saleBrandId).saleMode = saleMode
						
				        this.$message.success('修改成功')
				    })
				} catch (error) {
				    console.error(error)
				}
				this.$loading.hide()
			}else{
				this.$message.warning('您暂无权限')
			}
          
        },
        // 置顶
        sortTop(id) {
            this.message('是否将该车系置顶?').then(async () => {
                const res = await topBrand({brandId: id})
                this.getData()
                this.$message.success('置顶成功')
            }).catch(() => {

            })
        },
        // 上下架
        setBrandStatus(id, status) {
            const txt = status == 1 ? '下架' : '上架'

            this.message(`是否将该车系${txt}?`).then(async () => {
                const res = await editBrandStatus({shopBrandId: id, status: status == 1 ? 2 : 1})
                // this.getData()
				 let obj ={
					sortType:this.typeValue,
					status:this.stateValue
				}
				this.getCorporationBrands(obj);
                this.$message.success(`${txt}成功`)
            }).catch(() => {

            })
        },
        // 删除
        delBrand(id) {
            this.message(`是否将该车系删除?`).then(async () => {
				
                const res = await delBrand({saleBrandId: id})
				 let obj ={
					sortType:this.typeValue,
					status:this.stateValue
				}
                this.getCorporationBrands(obj);
                this.$message.success(`删除成功`)
            }).catch(() => {

            })
        },
        // 获取车系
		async getCorporationBrands(obj){
			this.loading = true;
			 try {
				
				const res = await getCorporationBrands(obj)
				// console.log(res)
				for(let i=0;i<res.length;i++){
					res[i].ifoperation = false;
					res[i].index = i;
				}
				
				this.loading = false;
				this.tableData =res;
				this.total = res.total
				
			} catch (error) {
				console.error(error)
			}
		},
//         async carTypeDialog() {
//             try {
//                 this.carTypeList.length = 0
// 
//                 this.dialogLoading = true
//                 this.carTypeDialogVisible = true
//                 const res = await getCorporationBrands()
//                 this.carTypeList = res.map(v => {
//                     v.isSelected = false
//                     return v
//                 })
//             } catch (error) {
//                 console.error(error)
//             }
//             this.dialogLoading = false
//         },

        // 添加车系
//         async addBrandHandle() {
//             const {carTypeList} = this
//             const isSelecteItems = carTypeList.filter(v => v.isSelected).map(v => v.id)
// 
//             if(!isSelecteItems.length){
//                 return this.$message.error('请至少选择一款车系')
//             }
// 
//             this.addLoading = true
// 
//             try {
//                 const res = await addBrand({brandIds: isSelecteItems.join(',')})
//                 this.$message.success('添加成功')
//                 this.getCorporationBrands(this.typeValue);
//                 this.carTypeDialogVisible = false
//             } catch (error) {
//                 console.error(error)
//             }
//             this.addLoading = false
//         },
//         弹出车型
//         async carBrandDialog(item) {
// 
//             try {
//                 this.carBrandList.length = 0
//                 
//                 this.dialogLoading = true
//                 this.carBrandDialogVisible = true
// 
//                 const {corporationBrandId, id} = item
//                 this.selectBrandId = id
// 
//                 const res = await getCorporationCarTypes({corporationBrandId, brandId: id})
//                 this.carBrandList = res.map(v => {
//                     // 有saleCarTypeId则已经选过了
//                     v.checked = v.saleCarTypeId ? true : false
//                     return v
//                 })
//             } catch (error) {
//                 console.error(error)
//             }
//             this.dialogLoading = false
//         },
       
        // 添加车型
//         async addTypeHandle() {
//             const {carBrandList, selectBrandId} = this
//             
//             const carTypeIds = [...new Set(carBrandList.filter(v => v.checked).map(v => v.id))]
// 
//             if(!selectBrandId){
//                 return this.$message.error('请选择车系')
//             }
// 
//             if(!carTypeIds.length){
//                 return this.$message.error('请选择至少一款车型')
//             }
// 
//             this.addLoading = true
// 
//             try {
//                 const res = await addCarType({brandId: selectBrandId, carTypeIds: carTypeIds.join(',') })
//                 this.$message.success('选入车系成功')
//                 this.getCorporationBrands(this.typeValue);
//                 this.carBrandDialogVisible = false
//             } catch (error) {
//                 console.error(error)
//             }
//             this.addLoading = false
//         },
        // 生成小程序二维码
        async previewCode({id, brandName}) {
            this.$loading.show()
            try {
                const res = await getPreviewCode({brandId: id})
                this.qrCodePath = res
                this.brandName = brandName
                this.qrCodeDialogVisible = true
            } catch (error) {
                console.error(error)
            }
            this.$loading.hide()
        },
        // 推广语设置 1试驾 2选车 3 分享
        spreadHandle(type, item) {
            this.carInfo = item
            this.spreadType = type
			
            // 文本字段
            const ajaxProp = {
                1: item.testDriveDesc,
                2: item.reserveCarDesc,
                3: item.shareDesc,
            }
            this.spreadTxt = ajaxProp[type] || ''
			console.log( this.spreadTxt)
            this.spreadDialogVisible = true
        },
        // 保存推广语
        async saveSpread(){
            try {
                
                const {carInfo, spreadTxt, spreadType} = this
                // 文本字段
                const ajaxProp = {
                    1: 'testDriveDesc',
                    2: 'reserveCarDesc',
                    3: 'shareDesc',
                }

                // 请求方法
                const ajaxFn = {
                    1: editTestDriveDesc,
                    2: editReserveCarDesc,
                    3: editShareDesc,
                }

                if(spreadTxt == ''){
                    return this.$message.error('请输入推广语')
                }

                this.addLoading = true

                const params = {brandId: carInfo.saleBrandId}
                params[ajaxProp[spreadType]] = spreadTxt

                const res = await ajaxFn[spreadType](params)
                this.$message.success('设置成功')
				let obj = {
					sortType:this.typeValue,
					status:this.stateValue
				}
                this.getCorporationBrands(obj);
                this.spreadDialogVisible = false
            } catch (error) {
                console.error(error)
            }

            this.addLoading = false
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.curPage = 1
            this.getCorporationBrands(this.typeValue);
        },
        handleCurrentChange(pageNum) {
            this.curPage = pageNum
            this.getCorporationBrands(this.typeValue);
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
            const arr = ['', '试驾推广语', '选车或领券推广语', '分享推广语']
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


<style lang="scss" scoped>
@import '../../../styles/var';
.spread-right{
	.account-form-input{
		width: 280px;
		.input-box{
			.el-textarea{
				.el-textarea__inner{
					padding-right: 60px !important;
				}
			}
			
		}
		
	}
}
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


.car-type-list {
    li {
        float:left;
        margin:5px;
    }
}
.car-brand-list {
	padding-top: 20px;
    li {
        float: left;
        display: flex;
        justify-content: space-between;
        padding:5px;
        margin:5px 10px;
        width:300px;
        cursor: pointer;
        border:2px solid transparent;
        transition: .3s all;
        box-shadow: 0 0 5px rgba(0,0,0,.2);

        &.on {
            border-color: $orange;
        }

        .right {
            color: $red;
        }
    }
}
</style>

<style lang="scss">
	.spread-right{
		.account-form-input{
			width: 280px;
			.input-box{
				.el-textarea{
					.el-textarea__inner{
						padding-right: 60px !important;
					}
				}
				
			}
			
		}
	}
.reserve-type {
    .el-input {
        &__inner {
            border-color:#fff;

            &::-webkit-input-placeholder{
                color:#333;
            }

            &:focus{
                border-color:transparent!important;
            }
        }

        .el-icon-arrow-up:before {
            opacity: 0;
        }
    }

}

.el-table--enable-row-hover .el-table__body tr:hover>td {
    .reserve-type {
        .el-input {
            &__inner {
                border-color:#dcdfe6!important;
            }

            .el-icon-arrow-up:before {
                opacity: 1;
            }
        }
    }
}
</style>


