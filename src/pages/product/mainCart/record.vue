
<template>
    <div class="log-record page-container" v-loading='loding'>
        <panel>
            <template slot="head">
                <div class="left">
                    <span >主推车系管理</span><i class="el-icon-arrow-right"></i><span style="font-size: 14px;">过往主推记录</span> 
                </div>
				<div class="right">
					 <div class="bcakBtn" @click="back">
						<el-button type="info" size="mini">返回</el-button>
					</div>
				</div>
            </template>
			<div class="value shadow">
				<template>
					<el-table :height='sideHeight' :data="listInfo.items" style="width: 100%;" fit @cell-mouse-enter="cellEnter" @cell-mouse-leave="cellLeave" >
						<!-- <el-table-column 
						:prop='v.prop'
						:label='v.label'
						fit
						v-for="(v,i) in tableList"
						>
						
					  </el-table-column> -->
						<el-table-column prop='brandImg' label='车系'  align="center"  width="180" >
							<template slot-scope="scope">
								<img :src="setImgPath(scope.row.brandImg)" />
							</template>
						</el-table-column>
						<el-table-column prop='brandName' label='名称' align="center" >
							
						</el-table-column>
						<el-table-column prop='brandLevel' label='类型' align="center" >
							
						</el-table-column>
						<el-table-column prop='date' label='官价（元）' align="center" width="100">
							<template slot-scope="scope">
								{{scope.row.minPrice}}-{{scope.row.maxPrice}}
							</template>
						</el-table-column>
						<el-table-column prop='pushMainTimes' label='主推周期' align="center"  width="180" >
							
						</el-table-column>
						
						<el-table-column prop='intentionUserNum' label='意向客户量' align="center" >
							
						</el-table-column>
						<el-table-column prop='testDriveNum' label='试驾量' align="center" >
							
						</el-table-column>
						<el-table-column prop='dealReserveCarNum' label='成交量' align="center">
							
						</el-table-column>
						<el-table-column prop='totalFabulousNum' label='总点赞' align="center" >
							
						</el-table-column>
						<el-table-column prop='totalBrowseNum' label='总浏览' align="center" >
							
						</el-table-column>
						<el-table-column prop='ifoperation' label='操作' align="center"width="180">
							<template slot-scope="scope">
								<div class="operation" v-if="scope.row.ifoperation">
									<div @click="editPushMainLogStatus(scope.row)">恢复主推</div>
									<div>查看过往素材</div>
								</div>
							</template>
						</el-table-column>
			
					</el-table>
				</template>
			</div>
			<div class="Pagination">
				 <div class="flex justify-content-end mt15">
				    <el-pagination background layout="prev, pager, next" :page-size="10" :current-page.sync="listInfo.page" :total="listInfo.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
				</div>
				<!-- <template>
				  <div class="block">
					<el-pagination
					  @size-change="handleSizeChange"
					  @current-change="handleCurrentChange"
					  :current-page="listInfo.page"
					  :page-size="10"
					  layout="total, prev, pager, next, jumper"
					  :total="listInfo.total">
					</el-pagination>
				  </div>
				</template> -->
			</div>
            <!-- <no-data>开发中....</no-data> -->
        </panel>
    </div>
</template>

<script>
import Panel from '@/components/Panel'
import NoData from '@/components/NoData'
import {getPushMainCarLogs,editPushMainLogStatus} from '@/api/mainCart'
import {setImgPath} from '@/utils/index'
export default {
    components: {Panel, NoData},
	computed:{
			sideHeight(){
			// 			console.log(111)
			// 			console.log(this.$store.state.getContentSize)
							return this.$store.state.getContentSize -150
					}
		},
	data(){
			return{
					setImgPath:setImgPath,
					listInfo:{},
					loding:false
				}
			},
			created() {
				this.getPushMainCarLogs(10,1)
			},
			methods:{
				handleSizeChange(val) {
					console.log(`每页 ${val} 条`);
				  },
				  handleCurrentChange(val) {
					  this.getPushMainCarLogs(10,val)
					console.log(`当前页: ${val}`);
				  },
				async getPushMainCarLogs(pageSize,curPage){
					this.loding = true;
					let send = {
						pageSize,curPage
					}
					try{
						let res = await getPushMainCarLogs(send);
						for(let i=0;i<res.items.length;i++){
							res.items[i].ifoperation = false;
							res.items[i].index = i;
						}
						this.listInfo = res;
						this.loding = false;
					}catch(e){
						this.loding = false;
						//TODO handle the exception
					}
				},
				async editPushMainLogStatus(item){
					this.loding = true;
					let send = {
						pushMainId:item.id
					}
					try{
						await editPushMainLogStatus(send);
						this.$message({
							message:'恢复主推成功',
							type:'success'
						})
						this.loding = false;
						this.$router.push(
							{
								name:'mainCart',
							}
						)
					}catch(e){
						this.loding = false;
						//TODO handle the exception
					}
				},
				cellEnter(row, column, cell, event){
					// console.log(row)
					let list = [...this.listInfo.items];
					list[row.index].ifoperation =true;
					this.$set(this.listInfo.items,row.index,row)
					// console.log(list[row.index].ifoperation)
				},
				cellLeave(row){
					let list = [...this.listInfo.items];
					list[row.index].ifoperation =false;
				},
				goTo(place){
					console.log(place,1111)
					this.$router.push({
						name:place
					})
				},
				back(){
					this.$router.go(-1)
				}
			}
		}
</script>
<style scoped="scoped" lang="scss">
	.left{
		display: flex;
		align-items: center;
	}
	.value {
		margin-top: 10px;
		padding: 10px 20px;
		background: #fff;
		.operation{
			// display: flex;
			// align-items: center;
			// flex-wrap: wrap;
			// justify-content: space-between;
			div:hover{
				cursor: pointer;
				color: skyblue
			}
		}
	}
	.Pagination{
		width: 100%;
		background: #fff;
	}
</style>
	