<template>
	<div class="log-record page-container">
		<panel>
			<template slot="head">
				<div class="left">
					<span class="title">角色管理</span> &gt;
					<i class="small">编辑角色</i>
				</div>
			</template>
			<div class="flex">
				<el-form :model="formInfo" label-width="100px">
					<el-form-item label="角色编号">
						{{formInfo.code}}
					</el-form-item>
					<el-form-item label="角色名称">
						<form-input v-model="formInfo.name" classType='bigInput' :max='20' sizi='mini'></form-input>
					</el-form-item>
					<el-form-item label="角色描述">
						<form-input v-model="formInfo.content" classType='bigTextarea' :max='1000' sizi='mini'></form-input>
					</el-form-item>
					<el-form-item label="角色状态">
						<el-radio-group v-model="formInfo.status">
							<el-radio :label="0">禁用</el-radio>
							<el-radio :label="1">启用</el-radio>
						</el-radio-group>
					</el-form-item>
					<div class="btn flex">
						<el-button size="mini" type="primary" @click='keep'>保存</el-button>
						<el-button size="mini" type="warning" @click='$router.go(-1)'>返回</el-button>
					</div>
				</el-form>
				<div class="setPower">
					<div class="head">角色的权限设置<span>（权限变更后重新登陆方可生效，或五分钟后自动生效。）</span></div>
					<div class="data">
						<el-tree 
						:data="data"   
						check-on-click-node
						:default-checked-keys="checkArr" 
						show-checkbox 
						default-expand-all 
						node-key="code" 
						ref="tree" 
						@check-change='checkChange'
						highlight-current 
						:props="defaultProps">
						</el-tree>
					</div>

				</div>
			</div>
		</panel>
	</div>
</template>

<script>
	import Panel from '@/components/Panel'
	import NoData from '@/components/NoData'
	import formInput from '@/components/FormInput'
	import {roleDatas,getRole,listDatasUpdate} from '@/api/auth'
	export default {
		components: {
			Panel,
			NoData,
			formInput
		},
		async created() {
			if(this.$route.query.roleId){
				this.getData(this.$route.query.roleId)
			}
		},
		data() {
			return {
				formInfo: {
					code: '',
					name: '',
					content: "",
					status: 1,
				},
				checkArr:[],
				initArr:[],
				cheakAll:[],
				dataChange:false,
				defaultProps: {
					children: 'adminResourceLists',
					label: 'name'
				},
				data: [],
				lastCodeList:[]
			}
		},
		methods:{
			async getData(id){
				try{
					this.$loading.show('请稍等');
					let info = await getRole({id});
					let cheakArr = info.allUserResource;
					this.initArr = cheakArr;//默认选中得
					this.formInfo = {...info};
					let arr= []
					for(let i=0;i<cheakArr.length;i++){
						arr.push(cheakArr[i].resCode)
						
					}
					this.checkArr = arr;
					// console.log(arr)
					this.$loading.hide();
					try{
						const res = await roleDatas()
						this.data = res;
						this.getNewList(res);
					}catch(e){
						//TODO handle the exception
					}
					
				}catch(e){
					//TODO handle the exception
				}
			},
			async keep(){
				let sendArr = [];
				if(this.dataChange){
					if(this.cheakAll.length){
						// console.log(this.initArr,this.cheakAll)
						this.initArr.forEach((item,index) =>{
							const findObj = this.cheakAll.find(v => v.code == item.resCode);//在最终选中 找默认选中
							// console.log(findObj,item)
							if(!findObj){//删除的
								this.cheakAll.push({
									resId:item.id,
									roleCode:item.resCode,
									isDel:1
								})
							}else{//没变
								const _index = this.cheakAll.findIndex(v => v.code == item.resCode);//在最终选中 找默认选中位置
								// console.log(_index)
								this.cheakAll[_index].resId = item.id;
								this.cheakAll[_index].isDel = 0;
							}
						})
						this.cheakAll.forEach(item =>{
							let obj = {
								resId:item.resId?item.resId:0,
								isDel:item.isDel == 1?1:0,
								resCode:item.roleCode?item.roleCode:item.code
							}
							sendArr.push(obj)
						})
						
					}else{
						this.$message.warning('最少选择一个角色')
					}
				}else{
					if(this.initArr.length){
						for(let i=0;i<this.initArr.length;i++){
							let send = {
								resId:this.initArr[i].id,
								resCode:this.initArr[i].resCode,
								isDel:1
							}
							sendArr.push(send)
						}
					}else{
						this.$message.warning('最少选择一个角色')
					}
					
				}
				// console.log(sendArr)
				let sendObj = {
					rolePowers:JSON.stringify(sendArr),
					id:this.formInfo.id,
					content:this.formInfo.content,
					status:this.formInfo.status,
					name:this.formInfo.name
				}
				try{
					this.$loading.show('请稍等。。。')
					await listDatasUpdate(sendObj)
					this.$loading.hide()
					this.$message.success('设置成功')
					this.$router.go(-1)
				}catch(e){
					this.$loading.hide()
					//TODO handle the exception
				}
				
			},

			
			getNewList(arr) {
			    arr.forEach(item => {
			        const childs = item.adminResourceLists
			        if(childs && childs.length){
			            const data = {...item}
			            delete data.adminResourceLists
			            this.lastCodeList.push(data);
			            this.getNewList(childs);
			        }else{
			            this.lastCodeList.push(item);
			        }
			    })
			},
			
			getList(list, arr) {
				list.forEach(item => {
					if(item.parentCode){
						const parentItem = this.findParantItem(item.parentCode)
						if(parentItem){
							const data = {...parentItem}
							delete data.adminResourceLists
							arr.push(data)
							
							if(parentItem.adminResourceLists && parentItem.adminResourceLists.length){
								this.getList(parentItem.adminResourceLists, arr)
							}
						}
						
					}else{
						arr.push(item)
					}
				})
				return arr
			},
			
			findParantItem(parentCode) {
				return this.initArr.find(v => v.resCode == parentCode)
			},
			checkChange(data){
// 				let arr =[];
// 				 this.$refs.tree.getHalfCheckedKeys().forEach(item =>{
// 					arr.push({code:item,isDel:0})
// 				})
				let res = this.$refs.tree.getCheckedNodes();
// 				res.forEach(item =>{
// 					item.resId = 0;
// 				})
				// this.cheakAll = res.concat(arr);
				this.cheakAll = res
				this.dataChange =true;
				// console.log(this.cheakAll)
			},

		}
	}
</script>

<style scoped="scoped" lang="scss">
	.btn {
		justify-content: center;
	}
	.setPower {
		margin-left: 50px;

		.head {
			font-size: 16px;

			span {
				color: #dd514c;
				font-size: 12px;
			}
		}

		.data {
			margin-top: 10px;
			padding: 5px;
			background: #fbf9f9;
			height: 500px;
			overflow-y: scroll;
			overflow-x: auto;
		}
	}
</style>
