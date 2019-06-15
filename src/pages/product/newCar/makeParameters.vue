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
					<!-- <div class="admin">
						<div class="adminText">管理方式</div>
						<div class="adminClose">
							<el-radio-group v-model="adminValue">
								<el-radio :label="1">输入参数</el-radio>
								<el-radio :label="2">上传图片</el-radio>
							</el-radio-group>
						</div>
					</div> -->
					<div class="bcakBtn" @click="back"><el-button size="mini" type="info">返回</el-button></div>
				</div>
			</template>
			<div class="shadow">
				<div class="value">
					<vuedraggable class="wrapper" v-model="content.corporationBrandConfigDtos">
						<!-- <transition-group :key='1'> -->
							<div class="list" v-for="(v,i) in content.corporationBrandConfigDtos" :key="i">
								<div class="value-title">
									<div class="text">
										{{v.title}}
									</div>
									<!-- <div class="moveTips"><p>模块可拖拽</p></div> -->
									<div class="btn">
										<div class="up" @click="moveWarpItem(i,'up')">
											<i class="el-icon-back"></i>
										</div>
										<div class="down">
											<i class="el-icon-back" @click="moveWarpItem(i,'down')"></i>
										</div>
										<div class="delete" @click="deleteItem(v,i)">删除类型</div>
									</div>
								</div>
								<div class="value-massage">
									<el-table :data="v.corporationBrandConfigDtos" style="width: 100%">
										<el-table-column prop="title" label="参数名称" fit align="center">

										</el-table-column>
										<el-table-column prop="content" label="参数值" fit align="center">
											<template slot-scope="scope">

												<el-input type="text" v-model="scope.row.content"></el-input>
											</template>
										</el-table-column>
										<el-table-column prop="name" label="操作" fit align="center" width="170">
											<template slot-scope="scope">
												<div class="btn">
													<div class="up" @click="moveItem(scope.$index,i,'up')">
														<i class="el-icon-back"></i>
													</div>
													<div class="down" @click="moveItem(scope.$index,i,'down')">
														<i class="el-icon-back"></i>
													</div>
													<div class="delete" @click="deleteItem(scope.row,scope.$index,i)">删除</div>
												</div>
											</template>
										</el-table-column>
									</el-table>
									<div class="add" @click="addValue(i)">
										<div class="add-icon">
											<icon-svg icon-class="addBtn" />
										</div>
										<i>添加</i>
									</div>
								</div>
							</div>
						<!-- </transition-group> -->
					</vuedraggable>

					<div class="add">
						<div class="value-title">
							<div class="text">
								添加一个参数类型
							</div>
						</div>
						<div class="addbox">
							<div class="inp">
								<el-input v-model="addTitle" placeholder="请输入内容"></el-input>
							</div>
							<div class="addBtn" @click="appendItem">添加类型</div>
						</div>
					</div>
				</div>
				<div class="bottom">
					<div class="right" @click="keep">保存</div>
				</div>

			</div>

		</panel>
		<el-dialog title="添加参数" :visible.sync="openData">
		  <el-form :model="form">
			<el-form-item label="参数名称" label-width="100px">
			  <el-input v-model="form.title" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="参数值" label-width="100px">
			  <el-input v-model="form.content" autocomplete="off"></el-input>
			</el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
			<el-button @click="openData = false">取 消</el-button>
			<el-button type="primary" @click="getData">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	import Panel from '@/components/Panel'
	import NoData from '@/components/NoData'
	import vuedraggable from 'vuedraggable';
	import {getCorporationBrandConfigs,editCorporationBrandConfig} from '@/api/newCar'
	import {setImgPath} from '@/utils/index'
	export default {
		components: {
			Panel,
			NoData,
			vuedraggable
		},
		data() {
			return {
				setImgPath:setImgPath,
				loading:false,
				addTitle: '',
				openData: false,
				deleteList: [],
				addItemNum: 0,
				list: [],
				content: {},
				form:{
					title:'',
					content:''
				}
			}
		},
		created() {
			this.getCorporationBrandConfigs(this.$route.query.carId)
		},
		methods: {
			moveWarpItem(index, type) {
				let list = this.content.corporationBrandConfigDtos;
				if (type == 'up') {
					if (index == 0) {
						list.push(list[index]);
						list.splice(index, 1)
					} else {
						list.splice(index - 1, 1, list[index], list[index - 1])
						list.splice(index + 1, 1)
					}
				} else {
					if (index == list.length - 1) {
						list.unshift(list[index]);
						list.splice(index + 1, 1)
					} else {
						list.splice(index, 2, list[index + 1], list[index])
						// itemList.splice(itemList.length-1,1)
					}
				}
			},
			deleteItem(item, index, parentIndex) {
				console.log(item, index, parentIndex)
				// console.log(item,index,parentIndex)
				if(item.id){//修改
					if (item.hasOwnProperty('parentId')) {
						this.content.corporationBrandConfigDtos[parentIndex].corporationBrandConfigDtos.splice(index, 1);
						this.deleteList.push(item.id)
						console.log(this.content.corporationBrandConfigDtos[parentIndex])
					} else {
						this.content.corporationBrandConfigDtos.splice(index, 1)
						this.deleteList.push(item.id)
					}
				}else{//新增
					if (item.hasOwnProperty('parentId')) {
						this.content.corporationBrandConfigDtos[parentIndex].corporationBrandConfigDtos.splice(index, 1);
					} else {
						this.content.corporationBrandConfigDtos.splice(index, 1)
					}
				}
				

				// console.log(id)
			},
			getData() {
				let data ={...this.form,index:this.addItemNum,parentId:'0'}
				let index = this.addItemNum;
				console.log(index, data)
				this.content.corporationBrandConfigDtos[index].corporationBrandConfigDtos.push(data)
				this.openData = false;
				this.initForm()
			},
			initForm(){
				this.form = {
					title:'',
					content:''
				}
			},
			moveItem(index, parentIndex, type) {
				console.log(index, parentIndex, type)
				let list = this.content.corporationBrandConfigDtos;
				let itemList = list[parentIndex].corporationBrandConfigDtos;
				if (type == 'up') {
					if (index == 0) {
						itemList.push(itemList[index]);
						itemList.splice(index, 1)
					} else {
						itemList.splice(index - 1, 1, itemList[index], itemList[index - 1])
						itemList.splice(index + 1, 1)
					}
				} else {
					if (index == itemList.length - 1) {
						itemList.unshift(itemList[index]);
						itemList.splice(index + 1, 1)
					} else {
						itemList.splice(index, 2, itemList[index + 1], itemList[index])
						// itemList.splice(itemList.length-1,1)
					}
				}
			},
			async keep() {
				let data = this.content;
				console.log(data)
				let obj = {
					delbrandConfig: this.deleteList.join(','),
					shopBrandId: this.$route.query.carId,
					brandConfigArry: JSON.stringify(data.corporationBrandConfigDtos)
				}
				try{this.$loading.show('请稍等。。。')
					await editCorporationBrandConfig(obj);
					this.$loading.hide()
					this.$message({
						message: '编辑参数成功',
						type: 'success'
					})
					this.$router.replace({
						name: 'newCar'
					})
				}catch(e){
					this.$loading.hide()
					//TODO handle the exception
				}
// 				console.log(obj)
// 				this.$Api.newCar.editCorporationBrandConfig(obj).then((res) => {
// 					console.log(res)
// 					if (res.success) {
// 						this.$message({
// 							message: res.errorMsg,
// 							type: 'success'
// 						})
// 						this.$router.replace({
// 							name: 'newCar'
// 						})
// 					}
// 				})
			},
			async getCorporationBrandConfigs(id) {
				this.loading = true;
				let obj = {
					shopBrandId: id
				}
				try {
					let res = await getCorporationBrandConfigs(obj);
					for (let i = 0; i < res.corporationBrandConfigDtos.length; i++) {
						res.corporationBrandConfigDtos[i].ifoperation = false;
						res.corporationBrandConfigDtos[i].index = i;
						res.corporationBrandConfigDtos[i].moveFlag = false;
					}
					this.content = { ...res
					};
					this.loading = false;
					console.log(this.content)
				} catch (e) {
					//TODO handle the exception
				}
				
			},
			appendItem() {
				console.log(this.content.corporationBrandConfigDtos)
				if (this.addTitle) {
					let obj = {
						"corporationBrandConfigDtos": [
						],
						"title": this.addTitle,
						
					}
					this.content.corporationBrandConfigDtos.push(obj)
					this.addTitle = '';
					console.log(this.content.corporationBrandConfigDtos)
				} else {
					this.$message({
						message: '输入内容',
						type: 'warning'
					})
				}

			},
			addValue(index) {
				this.openData = true;
				this.addItemNum = index;
				console.log(index)
				console.log(this.content.corporationBrandConfigDtos)
			},
			back() {
				this.$router.go(-1)
			},


		}
	}
</script>
<style scoped="scoped" lang="scss">
	img{
		max-width: 100%;
		max-height: 100%;
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

	.value {
		margin-top: 10px;
		padding: 20px 10px;
		background: #fff;

		.value-title {
			background: rgba(238, 241, 246, 1);
			position: relative;
			padding: 0 10px;

			.text {
				color: #333333;
				line-height: 40px;
				text-align: left;
			}

			.moveTips {
				color: #ff3366;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}

			.btn {
				position: absolute;
				right: 0;
				top: 0;
				display: flex;
				align-items: center;
				background: rgb(240, 240, 240);
				border-top-left-radius: 5px;
				border-top-bott-radius: 5px;
				height: 100%;

				i {
					font-size: 20px;
					font-weight: 600;
					line-height: 40px;
				}

				.up {
					width: 40px;
					height: 40px;
					border-right: 1px solid rgb(229, 229, 229);
					cursor: pointer;
					i {
						transform: rotate(90deg);
					}
				}

				.down {
					width: 40px;
					height: 40px;
					border-right: 1px solid rgb(229, 229, 229);
					cursor: pointer;
					i {
						transform: rotate(-90deg);
					}
				}

				.delete {
					padding: 0 20px;
					color: rgb(225, 91, 86);
					cursor: pointer
				}
			}

		}

		.value-massage {
			padding: 30px;
			padding-bottom: 50px;
			margin: 0 0 20px;
			position: relative;

			.add {
				position: absolute;
				width: 50px;
				height: 30px;
				line-height: 30px;
				border: 1px solid #000;
				bottom: 0;
				right: 50px;
				cursor: pointer;
				text-align: center;
				display: flex;
				.add-icon{
					width: 16px;
					height: 16px;
					svg{
						color: #000;
						width: 100%;
						height: 100%;
					}
				}
			}

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
					cursor: pointer;	
					i {
						transform: rotate(90deg);
					}
				}

				.down {
					width: 40px;
					height: 40px;
					border-right: 1px solid rgb(229, 229, 229);
					text-align: center;
					cursor: pointer;
					i {
						transform: rotate(-90deg);
					}
				}

				.delete {
					padding: 0 20px;
					color: rgb(225, 91, 86);
					cursor: pointer
				}

			}
		}
	}

	.add {
		.value-title {
			background: rgba(238, 241, 246, 1);
			padding: 0 10px;

			.text {
				color: #333333;
				line-height: 40px;
				text-align: left;
			}
		}

		.addbox {
			display: flex;
			align-items: center;
			padding-top: 20px;

			.inp {
				width: 30%;
			}

			.addBtn {
				background: rgba(255, 204, 0, 1);
				height: 40px;
				padding: 0 10px;
				line-height: 40px;
				color: #000;
				margin-left: 10px;
				cursor: pointer;
			}
		}
	}

	.bottom {
		border-top: rgba(238, 241, 246, 1) solid 1px;
		height: 100px;
		background: #fff;
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
