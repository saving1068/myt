<template>
    <div class="log-record page-container" v-loading='loading'>
        <panel>
            <template slot="head">
               <div class="title shadow">
				   <div class="left">
					   <div class="title-big">新车库</div>
					   <i class="el-icon-arrow-right"></i>
					   <div class="title-small">车型管理</div>
					   <i class="el-icon-arrow-right"></i>
					   <div class="title-small">新建车型</div>
				   </div>
               	<div class="bcakBtn" @click="back"><el-button size="mini" type="info">返回</el-button></div>
               </div>
            </template>
			<div class="shadow">
				<div class="massge ">
					<div class="title"></div>
					<div class="value">
						<div class="series">
							<div class="Myseries">所属车系</div>
							<div class="name">{{info.brandName}}</div>
							<div class="btn">{{info.statuStr}}</div>
						</div>
						<div class="typeName">
							<div class="myName">车型名称</div>
							<div class="name first ">
								<div class="text">第一级名称</div>
								<div class="inp">
									<from-input classType='input' v-model="firstName" :max="12"></from-input>
								</div>
							</div>
							<div class="Second name">
								<div class="text">第二级名称</div>
								<div class="inp">
									<from-input classType='input' v-model="secondName" :max="6"></from-input>
								</div>
							</div>
							<div class="three name">
								<div class="text">第三级名称</div>
								<div class="inp">
									<from-input classType='input' v-model="threeName" :max="6"></from-input>
								</div>
							</div>
						</div>
						<div class="sellType">
							<div class="name">销售类型</div>
							<div class="cheak">
								<template>
									<el-radio v-model="radio" label="1">在售</el-radio>
									<el-radio v-model="radio" label="2">预售</el-radio>
								</template>
							</div>
						</div>
					</div>
					<div class="price">
						<div class="name">官方指导价</div>
						<div class="inp">
							<!-- <input type="tel"  v-model="price" @input='maxPrice' > -->
							<el-input v-model="price" type='number'  @input='maxPrice'  placeholder="请输入内容">
							</el-input>
							<span>元</span>
						</div>
					</div>
				</div>
			
				<div class="bottom">
					<div class="right" @click="keep">保存</div>
				</div>
			</div>
        </panel>
		
	</div>
</template>

<script>
import Panel from '@/components/Panel'
import NoData from '@/components/NoData'
import {addCorporationCarType}from "@/api/carAdmin"
import fromInput from '@/components/FormInput'
import {checkPrice} from '@/utils'
export default {
    components: {Panel, NoData,fromInput},
	created() {
		this.info.brandName = this.$route.query.carInfo.brandName;
		this.info.statuStr = this.$route.query.carInfo.statuStr;
		this.info.carId  = this.$route.query.carId,
		this.info.saleBrandId = this.$route.query.carInfo.saleBrandId
	},
	data(){
		return{
			firstName: "",
			secondName: "",
			threeName: "",
			radio: "1",
			price:'',
			info:{},
			maxPriceFlag:false,
			loading:false,
		}
	},
	methods: {
			maxPrice(e){
				if(checkPrice(this.price)){
					this.maxPriceFlag = true;
				}else{
					this.maxPriceFlag = false;
					this.$message({
						message: '请填写少于7位数的数字且保留两位小数',
						type: 'warning'
					})
				}
// 				
			},
			async keep(){
				if(this.firstName&&this.secondName&&this.threeName&&this.price&&this.maxPriceFlag){
					this.loading = true;
					let send = {
						years:this.firstName,
						sweptVolume:this.secondName,
						model:this.threeName,
						price:Number(this.price),
						corporationBrandId:String(this.info.carId),
						saleStatus:this.radio,
						saleBrandId:String(this.info.saleBrandId),
						configType:0
					}
					// console.log(send)
					try{
						await addCorporationCarType(send);
						this.$message.success('添加车型成功')
						this.loading = false;
						this.$router.go(-1)
					}catch(err){
						this.loading = false;
						console.log(err)
					}
				}else{
					this.$message({
						message:'请完善所有信息',
						type:'warning'
					})
				}
				
				
			},
			back() {
				this.$router.go(-1)
			}
		}
}
</script>
<style lang="scss">
	.typeName{
		.account-form-input{
			width: 280px !important;
		}
	}
</style>
<style scoped="scoped" lang="scss">
	.title {
		width: 100%;
		text-align: left;
		display: flex;
		align-items: center;
		position: relative;
		.title-big {
			font-size: 18px;
		}
		.title-small{
			font-size: 14px
		}
		.left{
			display: flex;
			flex: 1;
			align-items: center;
		}

		.bcakBtn {
			cursor: pointer;
		}
	}
	.massge {
		padding: 10px;
		min-height: 500px;

		.title {
			height: 30px;
			background: rgba(238, 241, 246, 1);
		}

		.value {
			padding: 20px 0 20px 100px;

			.series {
				display: flex;
				align-items: center;
				padding: 10px 0;

				.Myseries {
					color: #999;
					font-size: 14px;
				}

				.name {
					padding: 0 20px;
				}

				.btn {
					background: #999;
					font-size: 14px;
					padding: 5px 20px;
				}
			}

			.typeName {
				display: flex;
				align-items: center;
				padding: 10px 0;

				.myName {
					color: #999;
					font-size: 14px;
				}

				.first {
					padding-left: 20px !important;
				}

				.name {
					padding: 0 10px;

					.text {
						text-align: left;
						color: #999;
						font-size: 14px;
					}
				}
			}

			.sellType {
				display: flex;
				align-items: center;
				padding-top: 10px;

				.name {
					font-size: 14px;
					color: #999;
				}

				.cheak {
					padding-left: 20px;
				}
			}
		}

		.price {
			padding-left: 85px;
			display: flex;
			align-items: center;
			.name {
				font-size: 14px;
				color: #999;
			}

			.inp {
				padding-left: 20px;
				width: 250px;
				.el-input{
					width: 200px;
				}
				position: relative;
				span{
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}
		}
	}

	.bottom {
		border-top: rgba(238, 241, 246, 1) solid 1px;
		height: 100px;
		position: relative;

		.right {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding: 5px 70px;
			background: rgba(25, 93, 234, 1);
			color: #fff;
			cursor: pointer;
		}

	}
</style>
