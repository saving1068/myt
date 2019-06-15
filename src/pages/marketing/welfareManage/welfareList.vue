<template>
	<div class="welfare-list app-container" >
		<panel style='position: relative;'>
			<template slot="head">
				<div class="left"><span class="title">分润管理</span></div>
				<div class="right">
					<el-button type="warning" size="mini" v-if="isBtnPower('060205')" @click="getBossMobie">设置分润咨询电话</el-button>
					<el-button type="warning" size="mini" v-if="isBtnPower('060205')" @click="$router.push({name: 'welfareRecord'})">分润核销记录</el-button>
				</div>
			</template>
			<div class="welfare-list__content">
				<el-table :data="list" :row-key="getRowKeys" fit :expand-row-keys="expands" :height="sideHeight" style="width: 100%" v-loading="loading">
					<el-table-column type="expand">
						<template slot-scope="props">
							<div style="margin-left:10%;">
								<el-table :data="props.row.carTypeWelfareMultipleDtos" fit>
									<el-table-column label="车型名称" prop="years" width="150" align="center">
										<template slot-scope="scope">
											{{scope.row.years}}{{scope.row.sweptVolume}}{{scope.row.model}}
										</template>
									</el-table-column>
									<!-- <el-table-column label="排量" align="center">
										<template slot-scope="scope">
											{{scope.row.sweptVolume}}<i v-if="scope.row.isTurbine == 1">T</i>
										</template>
									</el-table-column> -->
									<!-- <el-table-column label="型号" prop="model" align="center" /> -->
									<el-table-column label="推手返利方式" width="110"  align="center">
										<template slot-scope="scope">
											<!-- <div v-for="(item,index) in scope.row.welfareMultipleList" v-if="item.type == 1"> -->
											<div v-if="scope.row.welfareMultiplePushHandDto">
												<el-select v-model="scope.row.welfareMultiplePushHandDto.rebateType" size="mini" placeholder="请选择" :disabled="!scope.row.isEdit">
													<el-option label="请选择" :value="0"></el-option>
													<el-option label="现金" :value="1"></el-option>
													<!-- <el-option label="券" :value="2"></el-option> -->
													<el-option label="实物" :value="3"></el-option>
												</el-select>
											</div>
											<div v-else>--</div>
											
											<!-- </div> -->

											<!-- <el-radio-group v-model="scope.row.rebateType" :disabled="!scope.row.isEdit">
												<el-radio :label="1">现金</el-radio>
												<el-radio :label="3">实物</el-radio>
											</el-radio-group> -->
										</template>
									</el-table-column>
									<el-table-column label="分润奖励"  min-width="250"  align="center">
										<template slot-scope="scope">
											<!-- <div v-for="(item,index) in scope.row.welfareMultipleList" v-if="item.type == 1"> -->
											<div v-if="scope.row.welfareMultiplePushHandDto" class="flex justify-content-center align-items-center">
												<span v-if="scope.row.welfareMultiplePushHandDto.rebateType == 0">--</span>
											<el-button v-else-if="scope.row.welfareMultiplePushHandDto.rebateType == 3" :disabled="!scope.row.isEdit"
											 size="mini" type="warning" @click="showEditWelfaresDialog(scope.row.welfareMultiplePushHandDto,1)">
												{{scope.row.welfareMultiplePushHandDto.rebateId ? scope.row.welfareMultiplePushHandDto.rebateDesc + `(价值${scope.row.welfareMultiplePushHandDto.goodsPrice})` : '编辑实物奖励'}}
											</el-button>
											<el-input v-else v-model="scope.row.welfareMultiplePushHandDto.casePrice" :disabled="!scope.row.isEdit"
											 class="welfareNum" size="mini" style="width: 120px;" />
											</div>
											<div v-else>--</div>
											
											<!-- </div> -->
										</template>
									</el-table-column>
									<el-table-column label="代理返利方式"  width="110"  align="center">
										<template slot-scope="scope">
											<div v-if="scope.row.welfareMultipleAgentDto">
												<el-select v-model="scope.row.welfareMultipleAgentDto.rebateType" size="mini" placeholder="请选择" :disabled="!scope.row.isEdit">
													<el-option label="请选择" :value="0"></el-option>
													<el-option label="现金" :value="1"></el-option>
													<!-- <el-option label="券" :value="2"></el-option> -->
													<el-option label="实物" :value="3"></el-option>
												</el-select>
											</div>
											<div v-else>--</div>
											<!-- <div v-for="(item,index) in scope.row.welfareMultipleList" v-if="item.type == 2"> -->
											
											<!-- </div> -->
										</template>
									</el-table-column>
									<el-table-column label="分润奖励"  min-width="250" align="center">
										<template slot-scope="scope">
											<div v-if="scope.row.welfareMultipleAgentDto">
												<span v-if="scope.row.welfareMultipleAgentDto.rebateType == 0">--</span>
												<el-button v-else-if="scope.row.welfareMultipleAgentDto.rebateType == 3" :disabled="!scope.row.isEdit"
												 size="mini" type="warning" @click="showEditWelfaresDialog(scope.row.welfareMultipleAgentDto,2)">
													{{scope.row.welfareMultipleAgentDto.rebateId ? scope.row.welfareMultipleAgentDto.rebateDesc + `(价值${scope.row.welfareMultipleAgentDto.goodsPrice})` : '编辑实物奖励'}}
												</el-button>
												<el-input v-else v-model="scope.row.welfareMultipleAgentDto.casePrice" :disabled="!scope.row.isEdit"
												 class="welfareNum" size="mini" style="width: 120px;" />
												</div>
												<div v-else>--</div>
										</template>
									</el-table-column>
									<el-table-column label="分润次数" align="center">
										<template slot-scope="scope">
											{{scope.row.rewardNun||0}}
										</template>
									</el-table-column>
									<el-table-column label="操作" align="center" >
										<template slot-scope="scope">
											<div class="operate">
												<span @click="editCarType(scope.row, props.row.carTypeWelfareMultipleDtos)" v-if="!scope.row.isEdit">设置分润奖励</span>
												<span @click="saveCarType(scope.row)" v-if="isBtnPower('060201') &&scope.row.isEdit">保存</span>
												<span @click="lookCarRecord(scope.row, 'carBrand')" v-if="isBtnPower('060204') && !scope.row.isEdit">奖励方案记录</span>
												<span @click="toRecord(scope.row)" v-if="isBtnPower('05020102')&&!scope.row.isEdit">核销记录</span>
												<!-- <span>数据</span> -->
											</div>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</template>
					</el-table-column>



					<el-table-column label="车系"  align="center">
						<template slot-scope="scope">
							<img :src="setImgPath(scope.row.brandImg)"/>
						</template>
					</el-table-column>
					<el-table-column label="名称" prop="brandName" align="center" />
					<el-table-column label="状态" align="center">
						<template slot-scope="scope">
							<el-tag :type="scope.row.saleStatus | getSaleStatusType">{{scope.row.saleStatus | getSaleStatus}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="推广" prop="mainPush" align="center" />
					<el-table-column label="全车系统一方案" min-width="120"  align="center" >
						<template slot-scope="scope">
							<div>
								<el-select v-model="scope.row.isUnifiedWelfare" @change="togglePlan(scope.$index, scope.row, $event)" size="mini"
								 placeholder="请选择" :disabled="!scope.row.isFlag">
									<el-option label="请选择" :value="2"></el-option>
									<el-option label="是" :value="1"></el-option>
									<el-option label="否" :value="0"></el-option>
								</el-select>
								<!-- <el-radio-group v-model="scope.row.isUnifiedWelfare" :disabled="!scope.row.isEdit">
									<el-radio :label="1">是</el-radio>
									<el-radio :label="0">否</el-radio>
								</el-radio-group> -->
							</div>
						</template>
					</el-table-column>
					<el-table-column label="推手返利方式"  align="center" width="110">
						<template slot-scope="scope">
							<!-- <div v-if="scope.row.carTypeWelfareMultipleDtos">
								<div v-for="(item,index) in scope.row.carTypeWelfareMultipleDtos[0]" v-if="item.type == 1">
								<el-select v-model="item.rebateType" size="mini" placeholder="请选择" :disabled="!scope.row.isEdit">
										<el-option  label="现金" :value="1"></el-option>
										<el-option  label="券"  :value="2"></el-option>
										<el-option  label="实物"  :value="3"></el-option>
								</el-select>
								</div>
							</div> -->
							<div v-if="scope.row.welfareSingleDto&&scope.row.isUnifiedWelfare==1">
								<div v-for="(item,index) in scope.row.welfareSingleDto" v-if="item.type == 1">
								<el-select v-model="item.rebateType" size="mini" placeholder="请选择" :disabled="!scope.row.isEdit">
									<el-option label="请选择" :value="0"></el-option>
									<el-option label="现金" :value="1"></el-option>
									<!-- <el-option label="券" :value="2"></el-option> -->
									<el-option label="实物" :value="3"></el-option>
								</el-select>
								</div>
								<!-- <div v-else>--</div> -->
							</div>
							<div v-else>--</div>
						</template>
					</el-table-column>
					<!-- <el-table-column label="分润奖励" width="140" align="center">
						<template slot-scope="scope" v-if="scope.row.welfareSingleDto">
							<span v-if="scope.row.welfareSingleDto.rebateType == 0">--</span>
							<el-button v-else-if="scope.row.welfareSingleDto.rebateType == 3" @click="showEditWelfaresDialog(scope.row.welfareSingleDto)"
							 :disabled="!scope.row.isEdit || scope.row.isUnifiedWelfare != 1" size="mini" type="warning">
								{{scope.row.welfareSingleDto.rebateId ? scope.row.welfareSingleDto.rebateDesc + `(价值${scope.row.welfareSingleDto.goodsPrice})` : '编辑实物奖励'}}
							</el-button>
							<el-input v-else v-model="scope.row.welfareSingleDto.casePrice" :disabled="!scope.row.isEdit || scope.row.isUnifiedWelfare != 1"
							 class="welfareNum" size="mini" style="width: 70px;" />
						</template>
					</el-table-column> -->
					<el-table-column label="推手分润奖励" align="center"  min-width="250">
						<template slot-scope="scope">
							<!-- <div v-if="scope.row.carTypeWelfareMultipleDtos">
								<div v-for="(item,index) in scope.row.carTypeWelfareMultipleDtos[0]" v-if="item.type == 1">
									<div v-if='item.rebateType == 1'>
										
										{{keepPoints(item.casePrice)}}
									</div>
									<div  v-if='item.rebateType == 2'>价值{{keepPoints(item.goodsPrice)}}</div>
									<div v-if='item.rebateType == 3'>{{item.rebateDesc}}</div>
								</div>
							</div> -->
							<div v-if="scope.row.welfareSingleDto&&scope.row.isUnifiedWelfare==1" class="flex justify-content-center align-items-center">
								<div v-for="(item,index) in scope.row.welfareSingleDto" v-if="item.type == 1">
								<span v-if="item.rebateType == 0">--</span>
								<el-button v-else-if="item.rebateType == 3" :disabled="!scope.row.isEdit"
								 size="mini" type="warning" @click="showEditWelfaresDialog(scope.row,1,'child')">
									{{item.rebateId ? item.rebateDesc + `(价值${item.goodsPrice})` : '编辑实物奖励'}}
								</el-button>
								<el-input v-else v-model="item.casePrice" :disabled="!scope.row.isEdit"
								 class="welfareNum" size="mini" style="width: 120px;" />
								<!-- <div v-if='item.rebateType == 1'>{{keepPoints(item.casePrice)}}</div>
									<div  v-if='item.rebateType == 2'>价值{{keepPoints(item.goodsPrice)}}</div>
									<div v-if='item.rebateType == 3'>{{item.rebateDesc}}</div> -->
								</div>
								<!-- <div v-else>--</div> -->
							</div>
							<div v-else>--</div>
							<!-- {{scope.row.carTypeWelfareMultipleDtos[0] && scope.row.carTypeWelfareMultipleDtos[0].welfareMultipleList}} -->
						</template>
					</el-table-column>
					<el-table-column label="代理返利方式"  align="center"  width="110">
						<template slot-scope="scope">
							<!-- <div v-if="scope.row.carTypeWelfareMultipleDtos">
								<div v-for="(item,index) in scope.row.carTypeWelfareMultipleDtos[0]" v-if="item.type == 2">
								<el-select v-model="item.rebateType" size="mini" placeholder="请选择" :disabled="!scope.row.isEdit">
										<el-option  label="现金" :value="1"></el-option>
										<el-option  label="券"  :value="2"></el-option>
										<el-option  label="实物"  :value="3"></el-option>
								</el-select>
								</div>
							</div> -->
							<div v-if="scope.row.welfareSingleDto&&scope.row.isUnifiedWelfare==1">
								<div v-for="(item,index) in scope.row.welfareSingleDto" v-if="item.type == 2">
								<el-select v-model="item.rebateType" size="mini" placeholder="请选择" :disabled="!scope.row.isEdit">
									<el-option label="请选择" :value="0"></el-option>
									<el-option label="现金" :value="1"></el-option>
									<!-- <el-option label="券" :value="2"></el-option> -->
									<el-option label="实物" :value="3"></el-option>
								</el-select>
								</div>
								<!-- <div v-else>--</div> -->
							</div>
							<div v-else>--</div>
						</template>
					</el-table-column>

					<el-table-column label="代理直推分润奖励" align="center" style='min-width: 140px;' width="250">
						<template slot-scope="scope">
							<!-- <div v-if="scope.row.carTypeWelfareMultipleDtos">
								<div v-for="(item,index) in scope.row.carTypeWelfareMultipleDtos[0]" v-if="item.type == 2">
									<div v-if='item.rebateType == 1'>{{keepPoints(item.casePrice)}}</div>
									<div  v-if='item.rebateType == 2'>价值{{keepPoints(item.goodsPrice)}}</div>
									<div v-if='item.rebateType == 3'>{{item.rebateDesc}}</div>
								</div>
							</div> -->
							<div v-if="scope.row.welfareSingleDto&&scope.row.isUnifiedWelfare==1"  style='min-width: 140px;'>
								<div v-for="(item,index) in scope.row.welfareSingleDto" v-if="item.type == 2">
									<!-- {{JSON.stringify(item)}} -->
									<span v-if="item.rebateType == 0">--</span>
									
									<el-button  style='min-width: 140px;' v-else-if="item.rebateType == 3" :disabled="!scope.row.isEdit" size="mini" type="warning" @click="showEditWelfaresDialog(scope.row, 2,'child')">
										
										{{item.rebateId ? item.rebateDesc + `(价值${item.goodsPrice})` : '编辑实物奖励'}}
									</el-button>
									<el-input v-else v-model="item.casePrice" :disabled="!scope.row.isEdit" class="welfareNum" size="mini" style="width: 120px;" />
								</div>
								<!-- <div v-else>--</div> -->
							</div>
							<div v-else>--</div>
							<!-- {{scope.row.carTypeWelfareMultipleDtos[0] && scope.row.carTypeWelfareMultipleDtos[0].welfareMultipleList}} -->
						</template>
					</el-table-column>
					<el-table-column label="分润次数" align="center">
						<template slot-scope="scope">
							<div v-if='scope.row.isUnifiedWelfare==1'>{{scope.row.rewardNun || 0}}</div>
								<div v-else>--</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="250" align="center">
						<template slot-scope="scope">
							<div class="operate">
								<!-- <div v-if="scope.row.isUnifiedWelfare == 1"> -->
								<span v-if="isBtnPower('060201') && !scope.row.isFlag&&!scope.row.isEdit" @click="changeFlag(scope.row,scope.$index)">设置方案方式</span>
								<span v-if="isBtnPower('060201') && scope.row.isFlag" @click="saveType(scope.row)">保存</span>
								
								<div v-if="isBtnPower('060201') && !scope.row.isFlag">
									<span v-if="isBtnPower('060201') && !scope.row.isEdit&&scope.row.isUnifiedWelfare == 1" @click="editCarBrand(scope.row,scope.$index)">设置分润奖励</span>
									<span v-if="isBtnPower('060201') && scope.row.isEdit&&scope.row.isUnifiedWelfare == 1" @click="saveCarBrand(scope.row)">保存</span>
								</div>
								
								<!-- </div> -->
								<div>
									<span v-if="isBtnPower('060204') && !scope.row.isFlag&&!scope.row.isEdit" @click="lookCarRecord(scope.row, 'carType')">奖励方案记录</span>
									<span @click="toRecord(scope.row)" v-if="isBtnPower('05020102') && !scope.row.isFlag&&!scope.row.isEdit">核销记录</span>
								</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="alertBg"  v-if="openMarketing ==0">
				<div class="alertBg-val">
					<div  class="alertBg-val-font" style="color: #ffffff;">小程序当前未开通「分润功能」</div>
					<div class="alertBg-val-btn" @click="openMarket">马 上 开 通</div>
				</div>
			</div>
		</panel>
		<!-- 编辑实物奖励 -->
		<el-dialog title="编辑实物奖励" :visible.sync="editWelfaresDialogVisible" :close-on-click-modal="false" width="400px">
			<div class="editWelfares-content">
				<p>「{{choiceItem.brandName}}」{{choiceItem.years}} {{choiceItem.sweptVolume}}{{choiceItem.model}}的实物奖励</p>
				<el-form label-width="80px" class="mt20">
					<el-form-item label="实物名称">
						<form-input classType='input' v-model="editWelfareParam.desc" :max="12" placeholder="请输入实物" />
					</el-form-item>
					<el-form-item label="实物价值">
						<form-input classType='price' v-model="editWelfareParam.price" :max="12" placeholder="请输入价格" />
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer textCenter">
				<el-button type="info" @click="editWelfaresDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="editWelfaresHandle">保存</el-button>
			</div>
		</el-dialog>

		<!-- 奖励方案记录 -->
		<el-dialog title="奖励方案记录" :visible.sync="welfaresRecordDialogVisible" :close-on-click-modal="false" width="1000px">
			<div class="editWelfares-content">
				<p>
					<span v-if="welfaresRecordInfo.brandName">
						<i class="strong">「{{welfaresRecordInfo.brandName}}」</i> 的奖励记录
					</span>
					<span v-else>
						<i class="strong">「{{currentCarInfo.brandName}}」{{welfaresRecordInfo.years}} {{welfaresRecordInfo.sweptVolume}}
							{{welfaresRecordInfo.model}}</i> 的奖励记录
					</span>
				</p>

				<template v-if="welfaresRecordInfo.brandName">
					<div class="mt15">
						<el-radio-group v-model="welfarerecordType" @change="carBrandRecordChange">
							<el-radio :label="item.id" v-for="(item,index) in welfarerecordParams" :key="index">
								{{item.title}}
							</el-radio>
						</el-radio-group>
					</div>
					<!-- 非统一 -->
						<div class="mt15" v-if="welfaresRecordInfo.carTypeWelfareMultipleDtos.length">
							<div v-if="welfarerecordType == welfaresRecordInfo.carTypeWelfareMultipleDtos[0].carTypeId">
								<div class="mt15">
									<el-radio-group class="filters-radio cartype-radio" v-model="welfarerecordCarType" size="mini" @change="carTypeRecordChange">
										<el-radio-button :label="item.carTypeId" v-for="(item,index) in welfaresRecordInfo.carTypeWelfareMultipleDtos"
										 :key="index">
											{{item.years}}{{item.sweptVolume}}{{item.model}}
										</el-radio-button>
									</el-radio-group>
								</div>
							</div>
							<div v-else>
								暂无车型
							</div>
						</div>
					
				</template>

				<el-table :data="welfareRecordList" border max-height="400" class="mt20" style="width:100%" v-loading="recordLoading">
					<el-table-column label="编辑方案时间" width="160" align="center">
						<template slot-scope="scope">
							{{scope.row.dayTime}} {{scope.row.hourTime}}
						</template>
					</el-table-column>
					<el-table-column label="奖励方式" prop="rebateType" align="center">
						<template slot-scope="scope">
							<div v-if="scope.row.welfareLogPushHandDto">
								{{scope.row.welfareLogPushHandDto.rebateType}}
							</div>
							<div v-else>
								--
							</div>
								
						</template>
					</el-table-column>
					<el-table-column label="奖励内容" align="center" min-width="140">
						<template slot-scope="scope">
							<div v-if="scope.row.welfareLogPushHandDto">
								<div v-if="scope.row.welfareLogPushHandDto.rebateType=='现金'">
									{{scope.row.welfareLogPushHandDto.casePrice||0}}
								</div>
								<div v-else>	
									{{scope.row.welfareLogPushHandDto.rebateDesc}} | {{scope.row.welfareLogPushHandDto.goodsPrice}}
								</div>
							</div>
							<div v-else>--</div>
						</template>
					</el-table-column>
					<el-table-column label="代理奖励方式" prop="rebateType" align="center">
					<template slot-scope="scope">
						<div v-if="scope.row.welfareLogAgentDto">
							{{scope.row.welfareLogAgentDto.rebateType}}
						</div>
						<div v-else>
							--
						</div>
						</template>
					</el-table-column>
					<el-table-column label="代理奖励内容" align="center" min-width="140">
						<template slot-scope="scope">
							<div v-if='scope.row.welfareLogAgentDto'>
								<div v-if="scope.row.welfareLogAgentDto.rebateType=='现金'">
									{{scope.row.welfareLogAgentDto.casePrice||0}}
								</div>
								<div v-else>	
									{{scope.row.welfareLogAgentDto.rebateDesc}} | {{scope.row.welfareLogAgentDto.goodsPrice}}
								</div>
							</div>
							<div v-else>--</div>
						</template>
					</el-table-column>
					<el-table-column label="关联奖励次数" prop="rewardNun" align="center">
						<template slot-scope="scope">
							<div v-if='scope.row.welfareLogAgentDto&&scope.row.welfareLogPushHandDto'>
								{{scope.row.welfareLogAgentDto.rewardNun+scope.row.welfareLogPushHandDto.rewardNun}}
							</div>
							<div v-else-if='scope.row.welfareLogAgentDto&&!scope.row.welfareLogPushHandDto'>
								{{scope.row.welfareLogAgentDto.rewardNun}}
							</div>
							<div v-else-if='!scope.row.welfareLogAgentDto&&scope.row.welfareLogPushHandDto'>
								{{scope.row.welfareLogPushHandDto.rewardNun}}
							</div>
						</template>
						</el-table-column>
					<el-table-column label="修改人" prop="userName" align="center" />
				</el-table>
				
			</div>
		</el-dialog>
		<!-- boss电话 -->
		<el-dialog :visible.sync="BossMobie" width="300px" class='upgrade'>
			<div slot="title" class="cartType-dialog-head" style="text-align: left;">
				<span class="left">设置分润咨询电话</span>
			</div>
			<span>请设置一个方便推手和代理商咨询分润事宜的联系电话号码：</span>
			<div style="padding-top: 10px;width: 150px;">
				<el-input type="text" v-model='bossInfo.content' :maxlength="11" size="mini"></el-input>
			</div>

			<span slot="footer" class="dialog-footer">
				<el-button @click="BossMobie = false">取 消</el-button>
				<el-button type="primary" @click="setBossMobie">保存</el-button>
			</span>
		</el-dialog>

	</div>
</template>


<script>
	import Panel from '@/components/Panel'
	import FormInput from '@/components/FormInput'

	import {getDictSellerInfo,editEnableWelfare} from '@/api/common'
	import {
		setImgPath,
		checkPriceTwo,
		validMobile,
		keepPoints
	} from '@/utils'
	import {
		message
	} from '@/mixins'
	import power from '@/mixins/power'
import {getSellerInfo} from '@/api/account'
	import {
		getWelfares,
		editWelfares,
		addRebate,
		getWelfareLogs,setWelfares,setIsUnifiedWelfare
	} from '@/api/marketing'

	export default {
		components: {
			Panel,
			FormInput
		},
		mixins: [power, message],
		computed:{
				sideHeight(){
		// 			console.log(111)
		// 			console.log(this.$store.state.getContentSize)
						return this.$store.state.getContentSize - 75
				}
			},
		data() {
			return {
				keepPoints: keepPoints,
				choiceItem:{},
				RebateType: '',
				RebateList: [{
						lable: '现金',
						value: 1
					},
					{
						lable: '实物',
						value: 3
					}
				],
				BossMobie: false,
				bossInfo: {
					content: ''
				},

				loading: false,
				list: [],
				currentCarInfo: '', // 当前大list的item数据
				childCarInfo: '', // 含大list and list下的child => item数据
				// 获取row的key值
				getRowKeys(row) {
					return row.brandId;
				},
				expands: [], // 要展开的行，数值的元素是row的key值
				editWelfaresDialogVisible: false, // 编辑实物奖励窗口
				editWelfareParam: {
					desc: '',
					price: ''
				},

				welfaresRecordDialogVisible: false, // 奖励方案记录窗口
				recordLoading: false,
				welfaresRecordInfo: '',
				welfareRecordList: [],
				welfarerecordType: 0, // 方案类型
				welfarerecordCarType: 0, // 车系下的车型Id类型
				welfarerecordParams: [{
						title: '全车系统一方案分润记录',
						id: 0
					},
					{
						title: '分车型分润方案',
						id: 1
					},
				],
				choiceId:null,
				setImgPath: setImgPath,
				
				openMarketing:null
			}
		},
		async created() {
			await this.getPower('060201,060204,060205,05020102')
			this.getSellerInfo()
			this.getData()
		},
		methods: {
			async openMarket(){
				try{
					await editEnableWelfare()
					this.$message.success('开通成功')
					this.getSellerInfo()
				}catch(e){
					
				}
				
			},
			async getSellerInfo(){
				this.$loading.show('请稍等')
				try{
					let info = await getSellerInfo()
					this.openMarketing = info.enableWelfare;
					
				}catch(e){
					
					//TODO handle the exception
				}
				this.$loading.hide()
			},
			async setBossMobie() {
				// console.log(validMobile)
				if (!validMobile(this.bossInfo.content)) {
					this.$message.warning('输入正确的手机号码')
				}
								let send = {
									mobile:this.bossInfo.content,
									id:this.bossInfo.id?this.bossInfo.id:''
								}
								try{
									await setWelfares(send);
									this.bossInfo.content = ''
									this.$message.success('设置成功')
								this.BossMobie = false;
								}catch(e){
									//TODO handle the exception
								}


			},
			async getBossMobie() {
				try{
					this.BossMobie = true;
					this.$loading.show();
					await getDictSellerInfo({type:35}).then((res)=>{
						// console.log(res)
						if(res.length !=0){
							this.bossInfo  = res[0];
						}
					})
					
				}catch(e){
					//TODO handle the exception
				}
				this.$loading.hide();
				
			},
			async saveType(item){
				console.log(item)
					if(item.isUnifiedWelfare == undefined){
						return this.$message.warning('请选择方案方式')
					}
					let {brandId,id,isUnifiedWelfare} = {...item}
					let resId  =await setIsUnifiedWelfare({brandId,id,isUnifiedWelfare})
					this.choiceId = resId
					this.getData()
				
				
			},
			changeFlag(item){//编辑方案
				// 是否有正在编辑的选项
				if (this.list.filter(v => v.isFlag).length) {
					this.message('是否放弃当前操作').then(_ => {
						this.list.forEach((v,i) => {
							v.isFlag = false
							v.isEdit = false
							console.log(v.carTypeWelfareMultipleDtos.length)
							if(v.carTypeWelfareMultipleDtos.length){
								console.log(v.carTypeWelfareMultipleDtos)
								v.carTypeWelfareMultipleDtos.forEach(itemD =>{
									itemD.isEdit = false
								})
							}
						})
						// item.isEdit = true
						item.isFlag = true;
					}).catch(_ => {
				
					})
				} else {
					this.list.forEach((v,i) => {
						v.isEdit = false
					})
					item.isFlag = true;
				}
				console.log(item)
			},
			async getData() {
				this.expands = []
				try {
					this.loading = true
					let res = await getWelfares()
					res = res.map(item => {
						// 是否编辑状态
						item.isEdit = false
						// 是否编辑方案状态
// 						if(item.isUnifiedWelfare == 0){
// 							item.isEdit = true
// 						}
						item.isFlag = false
						
// 						
						if (item.carTypeWelfareMultipleDtos) { //非同一翻案
							if (item.carTypeWelfareMultipleDtos.length > 0) {
								item.carTypeWelfareMultipleDtos = item.carTypeWelfareMultipleDtos.map(v => {
									if (!v.welfareMultipleAgentDto) { //代理
										let init = {
											casePrice: 0,
											rebateType: 0,
											goodsPrice: 0,
											rebateId: '',
											rebateDesc: '',
											rewardNun: 0,
											type: 2
										}
										// console.log(init)
										v.welfareMultipleAgentDto = {
											...init
										}
									}else{
										v.welfareMultipleAgentDto.rebateId = v.welfareMultipleAgentDto.rebateId?v.welfareMultipleAgentDto.rebateId:'';
										v.welfareMultipleAgentDto.rebateDesc = v.welfareMultipleAgentDto.rebateDesc?v.welfareMultipleAgentDto.rebateDesc:'';
									}

									if (!v.welfareMultiplePushHandDto) { //推手
										let init = {
											casePrice: 0,
											rebateType: 0,
											goodsPrice: 0,
											rebateId: '',
											rebateDesc: '',
											rewardNun: 0,
											type: 1
										}
										v.welfareMultiplePushHandDto = { ...init
										}
									}else{
										v.welfareMultiplePushHandDto.rebateId = v.welfareMultiplePushHandDto.rebateId?v.welfareMultiplePushHandDto.rebateId:'';
										v.welfareMultiplePushHandDto.rebateDesc = v.welfareMultiplePushHandDto.rebateDesc?v.welfareMultiplePushHandDto.rebateDesc:'';
									}
									v.brandId = item.brandId
									v.isEdit = false
									return v
								})

							}

						}
						
						
						
						if(item.welfareSingleDto){
							if (item.welfareSingleDto.length <= 0) {
							let agentInit = {
									casePrice: 0,
									rebateType: 0,
									goodsPrice: 0,
									rebateId: '',
									rebateDesc: '',
									rewardNun: 0,
									type: 1
								}
								let pushInit = {
									casePrice: 0,
									rebateType: 0,
									goodsPrice: 0,
									rebateId: '',
									rebateDesc: '',
									rewardNun: 0,
									type: 2
								}
								item.welfareSingleDto.push(agentInit)
								item.welfareSingleDto.push(pushInit)
							}else{
								item.welfareSingleDto.forEach(item =>{
									if(!item.rebateDesc){
										item.rebateDesc = ''
									}
									if(!item.rebateId){
										item.rebateId = ''
									}
								})
							}
						}else{
							item.welfareSingleDto = [];
							let agentInit = {
								casePrice: 0,
								rebateType: 0,
								goodsPrice: 0,
								rebateId: '',
								rebateDesc: '',
								rewardNun: 0,
								type: 1
							}
							let pushInit = {
								casePrice: 0,
								rebateType: 0,
								goodsPrice: 0,
								rebateId: '',
								rebateDesc: '',
								rewardNun: 0,
								type: 2
							}
							item.welfareSingleDto.push(agentInit)
							item.welfareSingleDto.push(pushInit)
						}
						
						
						let rewardNun = 0;
						if(item.welfareSingleDto){//统一
							item.welfareSingleDto.forEach(v =>{
								rewardNun += v.rewardNun
							})
						}
						// console.log(rewardNun)
						item.rewardNun = isNaN(rewardNun) == NaN? 0:rewardNun;
						
						
						
						if(item.carTypeWelfareMultipleDtos){//非统一
							item.carTypeWelfareMultipleDtos.forEach(v =>{
								let notRewardNun = 0;
								// console.log(v)
								if(v.welfareMultipleAgentDto.rewardNun&&v.welfareMultiplePushHandDto.rewardNun){
									notRewardNun += v.welfareMultipleAgentDto.rewardNun+v.welfareMultiplePushHandDto.rewardNun;
								}
								if(v.welfareMultipleAgentDto.rewardNun&&!v.welfareMultiplePushHandDto.rewardNun){
									notRewardNun += v.welfareMultipleAgentDto.rewardNun
								}
								if(!v.welfareMultipleAgentDto.rewardNun&&v.welfareMultiplePushHandDto.rewardNun){
									notRewardNun += v.welfareMultiplePushHandDto.rewardNun
								}
								if(!v.welfareMultipleAgentDto.rewardNun&&!v.welfareMultiplePushHandDto.rewardNun){
									notRewardNun += notRewardNun
								}
								// console.log(notRewardNun)
								v.rewardNun = notRewardNun
							})
						}

						return item
					})
					console.log(res)
					this.list = res
					// console.log(this.list)
					// 默认展开
					this.list.forEach((item,index) =>{
						if(item.isUnifiedWelfare == 0){
							console.log(index)
							this.expands.push(item.brandId);
						}
					})
					console.log(this.expands)
					
				} catch (error) {
					console.error(error)
				}

				this.loading = false
			},
			// 切换车系统一方案 0 1
			togglePlan(index, row) {
// 				console.log(index, row)	
// // 				this.list.forEach(item =>{
// // 					item.isEdit = false;
// // 				})
// // 				row.isEdit = true;
				setTimeout(_ => {
					// const tagName = event.target.tagName
					// const item = this.list[index]
					if (row.isFlag) {
						// 否 => 展开
						if (row.isUnifiedWelfare == 0) {
							//确保只展开一行
							// this.expands.shift();
							const findObj = this.expands.find(v => v == row.brandId);//在最终选中 找默认选中
							if(!findObj){
								this.expands.push(row.brandId);
							}
							

						} else {
							console.log(this.expands)
							const _index = this.expands.findIndex(item =>item == row.brandId)
							console.log(_index)
							if(_index != -1){
								this.expands.splice(_index, 1)
							}
							
						}
					}

				}, 100)
// 
			},
			// 编辑统一方案 
			editCarBrand(item,index) {
				console.log(item)
				const {
					list
				} = this
				
				// 是否有正在编辑的选项
				if (list.filter(v => v.isEdit).length) {
					
					this.message('是否放弃当前操作').then(_ => {
						this.currentCarInfo = item
						this.editCarBrandEvent(item,index)
					}).catch(_ => {

					})
				} else {
					this.currentCarInfo = item
					this.editCarBrandEvent(item,index)
				}

			},
			editCarBrandEvent(item,index) {
				// this.list.find(v => v.roleCode == item.roleCode)
				console.log('edit+++++++', item,index)
				this.choiceItem = item;
				this.list.forEach((v,i) => {
// 					if(v.isEdit){
// 						const _index = this.expands.findIndex(item => item == v.brandId);
// 						this.expands.splice(_index, 1)
// 					}
					v.carTypeWelfareMultipleDtos.forEach(itemB =>{
						itemB.isEdit = false
					})
					v.isFlag = false;
					v.isEdit = false;
				})

				// this.expands.splice(0, 1)

				// 否 => 展开
				if (item.isUnifiedWelfare == 0) {
					// 确保只展开一行
					// this.expands.shift();
					this.expands.push(item.brandId);
				} 

				item.isEdit = true
			},
			// 统一方案保存车系
			saveCarBrand(item) {
				// console.log(item)
				if (item.isUnifiedWelfare == 0) {
					return this.$message.error('请切换全车系统一方案')
				}
				this.message('确定保存该奖励方案').then(async () => {

					try {
// 						const {
// 							rebateType,
// 							casePrice,
// 							rebateId,
// 							goodsPrice
// 						} = item.welfareSingleDto
						let pushInfo = {}
						let agengInfo = {}
						item.welfareSingleDto.forEach(item =>{
							if(item.type == 1){
								 pushInfo = {...item}
							}else{
								agengInfo = {...item}
							}
						})
						
						// console.log(pushInfo,agengInfo,'111111111111111111')
						const sendPush = {
							busType: 1,
							busId: item.brandId,
							isUnifiedWelfare: item.isUnifiedWelfare,
							type:1,
							id:this.choiceId
						}
							
						const sendAgent = {
							busType: 1,
							busId: item.brandId,
							isUnifiedWelfare: item.isUnifiedWelfare,
							type:2,
							id:this.choiceId
						}

						// 1-现金,2-券,3-实物
						if(pushInfo.type == 1){
							if (pushInfo.rebateType == 1) {
								if (!checkPriceTwo(pushInfo.casePrice)) {
									return this.$message.error('请输入正确分润奖励金额')
								}
								sendPush.casePrice = pushInfo.casePrice
							} else if (pushInfo.rebateType == 3) {
								if (!pushInfo.rebateId) {
									return this.$message.error('请添加实物奖励')
								}
								sendPush.rebateId = pushInfo.rebateId
								sendPush.goodsPrice = pushInfo.goodsPrice
							}
							
							sendPush.rebateType = pushInfo.rebateType
						}
						
						if(agengInfo.type == 2){
							if (agengInfo.rebateType == 1) {
								if (!checkPriceTwo(agengInfo.casePrice)) {
									return this.$message.error('请输入正确分润奖励金额')
								}
								sendAgent.casePrice = agengInfo.casePrice
							} else if (agengInfo.rebateType == 3) {
								if (!agengInfo.rebateId) {
									return this.$message.error('请添加实物奖励')
								}
								sendAgent.rebateId = agengInfo.rebateId
								sendAgent.goodsPrice = agengInfo.goodsPrice
							}
							
							sendAgent.rebateType = agengInfo.rebateType
						}
						
						if (item.isUnifiedWelfare != 1 && item.isUnifiedWelfare != 3) {
							return this.$message.error('请选择统一方案')
						}
						console.log(pushInfo,agengInfo)
						if(pushInfo.rebateType == 3){
							if (!pushInfo.casePrice && !pushInfo.rebateId) {
								return this.$message.error('请选择推手返利方式')
							}
						}
						if(agengInfo.rebateType == 3){
							if (!agengInfo.casePrice && !agengInfo.rebateId) {
								return this.$message.error('请选择代理返利方式')
							}
						}
						
						
						let params = [sendPush,sendAgent]
						let send = {
							jsonStr:JSON.stringify(params)
						}
						// console.log(params)

						this.$loading.show()

						const res = await editWelfares(send)

						this.$message.success('编辑成功')
						this.$loading.hide()

						this.getData()
					} catch (error) {
						console.error(error)
						this.$loading.hide()
					}

				}).catch(_ => {})

			},
			// 编辑非统一方案
			editCarType(item, arr) {
				let _index = this.list.findIndex(v =>v.brandId == item.brandId)
				this.choiceItem = item;
				this.currentCarInfo =  this.list[_index];
				this.choiceItem.brandName = this.currentCarInfo.brandName;
				// console.log(this.choiceItem)
				console.log(arr,arr.filter(v => v.isEdit).length,arr.filter(v => v.isEdit))
				
				
				if (arr.filter(v => v.isEdit).length) {
					this.$confirm('是否放弃当前操作?', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning'
					}).then(() => {
						console.log(111111111)
					 arr.forEach(v => {
					 	v.isEdit = false
					 })
					 item.isEdit = true
					}).catch(() => {
					    
					});
				}else{
					arr.forEach(v => {
						v.isEdit = false
					})
					item.isEdit = true
				}
				
				// if(this.list.filter(v => v.isEdit).length){
					// this.message('是否放弃当前操作').then(_ => {
						this.list.forEach(v => {
							v.isEdit = false
						})
						
						
						
						
// 					}).catch(_ => {
// // 					
// 					})
// 				}
				
				
				
				console.log(_index)
				this.list[_index].isEdit = true
				
			},
			// 非统一方案保存车型
			saveCarType(item) {	
				// console.log('车型+++', item)
				if (item.welfareMultiplePushHandDto.rebateType !== 1 && item.welfareMultiplePushHandDto.rebateType !== 3) {
					return this.$message.error('请选择推手返利方式')
				}
				
				if (item.welfareMultipleAgentDto.rebateType !== 1 && item.welfareMultipleAgentDto.rebateType !== 3) {
					return this.$message.error('请选择代理返利方式')
				}

				this.message('确定保存该奖励方案').then(async () => {
					try {
						const {
							// rebateType,
							// casePrice,
							rebateId,
							// goodsPrice,
							carTypeId
						} = item
						
						const pushInfo = {...item.welfareMultiplePushHandDto}
						const agentInfo = {...item.welfareMultipleAgentDto}
						
						const currentCarInfo = this.currentCarInfo


						// console.log(pushInfo)
						// console.log(agentInfo)
						const sendPush = {
							busType: 1,
							busId: currentCarInfo.brandId,
							busChildId: carTypeId,
							isUnifiedWelfare: 0,
							type:1,
							id:this.choiceId
						}
							
						const sendAgent = {
							busType: 1,
							busId: currentCarInfo.brandId,
							busChildId: carTypeId,
							isUnifiedWelfare: 0,
							type:2,
							id:this.choiceId
						}

						// 1-现金,2-券,3-实物
							if (pushInfo.rebateType == 1) {
								if (!checkPriceTwo(pushInfo.casePrice)) {
									return this.$message.error('请输入推手正确分润奖励金额')
								}
								sendPush.casePrice = pushInfo.casePrice
							} else if (pushInfo.rebateType == 3) {
								if (!pushInfo.rebateId) {
									return this.$message.error('请添加推手实物奖励')
								}
								sendPush.rebateId = pushInfo.rebateId
								sendPush.goodsPrice = pushInfo.goodsPrice
							}
							sendPush.rebateType = pushInfo.rebateType
							
							if (agentInfo.rebateType == 1) {
								sendAgent.casePrice = agentInfo.casePrice
								if (!checkPriceTwo(agentInfo.casePrice)) {
									return this.$message.error('请输入代理正确分润奖励金额')
								}
							} else if (agentInfo.rebateType == 3) {
								if (!agentInfo.rebateId) {
									return this.$message.error('请添加代理实物奖励')
								}
								sendAgent.rebateId = agentInfo.id
								sendAgent.rebateId = agentInfo.rebateId
								sendAgent.goodsPrice = agentInfo.goodsPrice
							}
							sendAgent.rebateType = agentInfo.rebateType
						let params = [sendPush,sendAgent]
						// console.log(params)
						
						let send ={
							jsonStr:JSON.stringify(params)
						}
						// console.log(send)
						this.$loading.show()

						const res = await editWelfares(send)

						this.$message.success('编辑成功')

						this.getData()
					} catch (error) {
						console.error(error)
					}
					this.$loading.hide()
				}).catch(_ => {

				})
			},
			// 弹出编辑实物窗口
			showEditWelfaresDialog(item,type) {
				console.log(item,type)
				this.childCarInfo = item
				this.childCarInfo.typeName = type
				this.childCarInfo.carTypeId = this.choiceItem.carTypeId;
				if(item.isUnifiedWelfare == 1){//统一
					item.welfareSingleDto.forEach(v =>{
						if(type == 1){
							if(v.type == 1){//推手
								this.editWelfareParam.desc = v.rebateDesc||'';
								this.editWelfareParam.price = v.goodsPrice
							}
						}else{
							if(v.type == 2){//代理
								this.editWelfareParam.desc = v.rebateDesc||'';
								this.editWelfareParam.price = v.goodsPrice
							}
						}
						
					})
					
				}else{
						if(type == 1){
							if(item.type == 1){//推手
								this.editWelfareParam.desc = item.rebateDesc||'';
								this.editWelfareParam.price = item.goodsPrice
							}
						}else{
							if(item.type == 2){//代理
							// debugger
								this.editWelfareParam.desc = item.rebateDesc||'';
								this.editWelfareParam.price = item.goodsPrice
							}
						}
						
// 					this.editWelfareParam.desc = item.rebateDesc||'';
// 					this.editWelfareParam.price = item.goodsPrice
				}
				
// 				
				this.editWelfaresDialogVisible = true
			},
			// 保存编辑实物
			async editWelfaresHandle() {
				const {
					desc,
					price
				} = this.editWelfareParam
				const {
					currentCarInfo,
					childCarInfo
				} = this
				// console.log(childCarInfo,'childCarInfo',this.childCarInfo)
				if (desc == '') {
					return this.$message.error('请输入实物')
				}
				if (!checkPriceTwo(price)) {
					return this.$message.error('请输入正确价格')
				}

				console.log('currentCarInfo+++++', currentCarInfo)

				const params = {
					desc
				}

				// 更新列表对应的实物价格
				// 统一方案
				const listIndex = this.list.findIndex(v => v.brandId == currentCarInfo.brandId)
				console.log(listIndex)
				// 非统一方案
				let childIndex

				// 统一方案
				if (currentCarInfo.isUnifiedWelfare == 1) {
					const childList = this.list[listIndex].welfareSingleDto;
					
					childList.forEach(item =>{
						if(this.childCarInfo.typeName  == 1){
							if(item.type == 1){
								item.goodsPrice= parseFloat(price)
								item.rebateDesc= desc
								item.rebateId = item.rebateId? item.rebateId:''
									
								params.rebateId = item.rebateId
							}
						}else{
							if(item.type == 2){
								item.goodsPrice= parseFloat(price)
								item.rebateDesc= desc
								item.rebateId = item.rebateId? item.rebateId:''
								params.rebateId = item.rebateId
							}
						}
						
					})
					console.log(listIndex,this.list)
					

// 					if (currentCarInfo.rebateId) {
// 						params.rebateId = currentCarInfo.rebateId
// 					}
				} else {
					const childList = this.list[listIndex].carTypeWelfareMultipleDtos
					childIndex = childList.findIndex(v => v.carTypeId == childCarInfo.carTypeId)
					console.log(childIndex)
					const rebateId = childList[childIndex].rebateId
					if(this.childCarInfo.type == 2){//代理
						this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultipleAgentDto.goodsPrice = parseFloat(price)
						this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultipleAgentDto.rebateDesc = desc
						this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultipleAgentDto.rebateId = this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultipleAgentDto.rebateId? this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultipleAgentDto.rebateId:''
							
						params.rebateId = this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultipleAgentDto.rebateId
					}else{//推手
						this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultiplePushHandDto.goodsPrice = parseFloat(price)
						this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultiplePushHandDto.rebateDesc = desc
						this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultiplePushHandDto.rebateId = this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultiplePushHandDto.rebateId? this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultiplePushHandDto.rebateId:''
							
						params.rebateId = this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultiplePushHandDto.rebateId
					}
					
// 					if (rebateId) {
// 						params.rebateId = rebateId
// 					}
				}

				// console.log(params)
				this.$loading.show()

				try {
					const res = await addRebate(params)

					// 同步ID到对应的item中
					if (currentCarInfo.isUnifiedWelfare == 1) {
						let nowList = this.list[listIndex].welfareSingleDto
						nowList.forEach(item =>{
							if(this.childCarInfo.typeName  == 1){
								if(item.type == 1){
									item.rebateId = res
								}
							}else{
								if(item.type == 2){
									item.rebateId = res
								}
							}
						})
						
						
					} else {
						if(this.childCarInfo.type == 2){
							this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultipleAgentDto.rebateId = res
						}else{
							this.list[listIndex].carTypeWelfareMultipleDtos[childIndex].welfareMultiplePushHandDto.rebateId = res
						}
						
					}
					// console.log(this.list)
					this.$message.success('编辑实物成功')
				} catch (error) {
					console.error(error)
				}

				this.$loading.hide()

				this.editWelfaresDialogVisible = false
			},
			// 查看奖励方案记录
			lookCarRecord(item, type) {
				// console.log(item)

				// 初始化
				this.welfareRecordList = []
				this.welfarerecordType = 0
				this.welfarerecordParams = [...this.$options.data().welfarerecordParams]

				const params = {}
				

				// 统一方案
				if (item.brandId) {
					if(item.carTypeWelfareMultipleDtos.length){
						this.welfarerecordCarType =item.carTypeWelfareMultipleDtos[0].carTypeId;
						this.welfarerecordParams[1].id = item.carTypeWelfareMultipleDtos[0].carTypeId
					}
					params.brandId = item.brandId

					// 弹窗中的方案切换默认
					this.welfarerecordType = item.brandId
					
					if (item.welfareSingleDto && item.welfareSingleDto.length) {//统一翻案
						
// 						this.welfarerecordCarType = item.carTypeWelfareMultipleDtos[0].carTypeId
						this.welfarerecordParams[0].id = item.brandId
						
					} else {
						return this.$message.error('暂无奖励记录')
					}

					// 非统一方案
				} else {
// 					if (item.carTypeWelfareMultipleDtos && item.carTypeWelfareMultipleDtos.length) {
// 					} else {
// 						return this.$message.error('暂无奖励记录')
// 					}
					params.carTypeId = item.carTypeId
				}

				this.welfaresRecordInfo = item
				this.welfaresRecordDialogVisible = true

				// console.log('this.welfarerecordParams++', this.welfarerecordParams)

				this.getCarRecord(params)

			},
			// 车系奖励方案记录 方案切换
			carBrandRecordChange(val) {
				const obj = this.welfarerecordParams.find(v => v.id == val)
				const index = this.welfarerecordParams.findIndex(v => v.id == val)
				const params = {}
				const carTypeWelfareMultipleDtos = this.welfaresRecordInfo.carTypeWelfareMultipleDtos
				// console.log(val, obj)
				// 全车系
				if (index == 0) {
					params.brandId = obj.id
					this.getCarRecord(params)
					// 车型
				} else {
					params.carTypeId = obj.id
					if(carTypeWelfareMultipleDtos && carTypeWelfareMultipleDtos.length){
						this.getCarRecord(params)
					}else{
						this.welfareRecordList = []
					}
				}

				// 恢复车型默认第一个值
				
				if (carTypeWelfareMultipleDtos && carTypeWelfareMultipleDtos.length) {
					this.welfarerecordCarType = carTypeWelfareMultipleDtos[0].carTypeId;
				}

				
			},
			// 车型
			carTypeRecordChange(val) {
				// console.log('carTypeRecordChange', val)
				this.getCarRecord({
					carTypeId: val
				})
			},
			// 获取奖励记录
			async getCarRecord(params) {
				// console.log(params,'send')
				this.recordLoading = true
				try {
					const res = await getWelfareLogs(params)
					this.welfareRecordList = res
				} catch (error) {

				}
				this.recordLoading = false
			},
			toRecord(item) {
				console.log(item)
				const query = {}
				if (item.brandId) {
					query.brandId = item.brandId
				}

// 				if (item.carTypeId) {
// 					query.carTypeId = item.carTypeId
// 				}
				this.$router.push({
					name: 'welfareRecord',
					query
				})
			}
		},
		filters: {
			getSaleStatus(status) {
				return ['--', '在售', '预售', '退市'][status]
			},
			getSaleStatusType(status) {
				return ['info', 'success', 'primary', 'info'][status]
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.alertBg{
		position: absolute;
		top: 0;left: 0;
		width: 100%;
		height: 100%;
		background: rgba($color: #000000, $alpha: .6);
		display: flex;
		justify-content: center;
		// align-items: center;
		padding-top: 100px;
		z-index: 9999;
		.alertBg-val-font{
			color:#fff;
			font-size: 30px;
			height: auto;
			font-weight: 600;
			padding-bottom: 50px;
			
		}
		.alertBg-val-btn{
			border-radius: 20px;
			border: 5px solid rgba(255, 204, 0, 1);
			text-align: center;
			line-height: 50px;
			font-weight: 600;
			font-size: 30px;
			cursor: pointer;
			color:rgba(255, 204, 0, 1)
		}
		.alertBg-val-btn:hover{
			transition: .5s all;
			color:#fff;
			background: rgba(255, 204, 0, 1);
		}
	}
	.upgrade {
		.el-dialog__header {
			border-bottom: 1px solid #ddd;
		}

	}
</style>

<style lang="scss">
	.upgrade {
		.el-dialog__header {
			border-bottom: 1px solid #ddd !important;
		}

	}

	.welfare-list {
		.el-radio__label {
			padding-left: 5px;
		}

		.el-radio+.el-radio {
			margin-left: 10px;
		}

		.cartype-radio .el-radio-button--mini {
			margin-bottom: 10px;
		}

		.welfareNum {
			font-size: 14px;

			&.is-disabled input {
				border-color: transparent;
				text-align: center;
				background: transparent;
				color: #333;
			}
		}

		.el-table__expanded-cell {
			padding-right: 0;
		}

		.el-table__expand-icon {
			display: none;
		}
	}
</style>