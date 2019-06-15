<template>
    <div class="resource-manage page-container">
        <panel style="height: 100%;">
            <template slot="head">
                <div class="left">
                    <span class="title">资源管理</span>
                </div>
            </template>
            <div class="resource-manage__content" slot="content">
                <div class="resource-manage__left">
                    <el-scrollbar class="app-sidebar__scrollbar">
                        <el-tree 
                            :data="data" 
                            :props="defaultProps" 
                            empty-text="加载中..." 
                            node-key="id"
                            :highlight-current="true"
                            :expand-on-click-node="false"
                            :default-expand-all="true" 
                            @node-click="handleNodeClick"
                        >
                            <span class="custom-tree-node" :class="{disabled: data.status == 0}" slot-scope="{ node, data }">
                                <span class="title" :class="data.type == 1 ? 'menu-title' : 'btn-title'">
                                    <!-- <template v-if="data.type == 1">
                                        <icon-svg icon-class="folderOpen" />
                                    </template> -->
                                    {{ node.label }}
                                </span>
                                <span class="tool" v-if="data.type == 1">
                                    <el-button type="text" size="mini" @click.stop="() => addMenu(data)">+菜单</el-button>
                                    <el-button type="text" size="mini" @click.stop="() => addBtn(data)">+按钮</el-button>
                                </span>
                            </span>
                        </el-tree>
                    </el-scrollbar>
                </div>
            </div>
        </panel>


        <el-dialog
            :title="(isAddChild ? '添加' : '编辑') + (ruleForm.type == 1 ? '菜单' : '按钮')"
            :visible.sync="dialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            top="50px"
            width="600px"
            center
        >
            <div class="dialog-content" v-loading="loading">
                <el-form :model="ruleForm" ref="ruleForm" :rules="rules" size="small" label-width="80px" class="resource-ruleForm">
                    <!--新增没编号-->
                    <el-form-item label="编号" prop="code" v-if="!isAddChild">
                        {{ruleForm.code}}
                    </el-form-item>
                    <el-form-item label="名称" placeholder="20字以内" :maxlength="20" prop="name">
                        <el-input v-model="ruleForm.name" />
                    </el-form-item>
					 <el-form-item label="请求地址" placeholder="请求地址"  prop="url">
					    <el-input v-model="ruleForm.url" />
					</el-form-item>
                    <el-form-item label="描述" prop="content">
                        <el-input type="textarea" placeholder="500字以内" :rows="3" :maxlength="500" v-model="ruleForm.content" />
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-radio-group v-model="ruleForm.type">
                            <el-radio :label="1" :disabled="ruleForm.type == 2">菜单</el-radio>
                            <el-radio :label="2" :disabled="ruleForm.type == 1">按钮</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="ruleForm.status">
                            <el-radio :label="0">禁用</el-radio>
                            <el-radio :label="1">启用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="白名单" prop="notFilter">
                        <el-radio-group v-model="ruleForm.notFilter">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="ruleForm.parentCode" label="父级" prop="parentCode">
                        {{ruleForm.parentCode}}
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model="ruleForm.sort" style="width: 80px" />
                    </el-form-item>
                </el-form>
            
        
                <div slot="footer" class="dialog-footer textCenter">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
                </div>
            </div>
        </el-dialog>
        
    </div>
</template>


<script>
import Panel from '@/components/Panel'
import {resourceList, updateResource} from '@/api/auth'

const initForm = {
    name: '',
    content: '',
	url:'',
    status: 1,
    notFilter: 0,
    sort: 1
}

export default {
    components: {Panel},
    data() {

        const validateName = (rule, value, callback) => {
            if(value == ''){
                callback(new Error('名称不能为空'))
            }

            callback()
        }

        const validateSort = (rule, value, callback) => {
            if(value == ''){
                callback(new Error('排序不能为空'))
            }else if(!/^\d+$/.test(value)){
                callback(new Error('请输入数字'))
            }

            callback()
        }

        return {
            loading: false,
            data: [],
            defaultProps: {
                children: 'adminResourceLists',
                label: 'name'
            },
            dialogVisible: false,
            isShowDetail: false, // 是否显示修改信息
            isEdit: false,
            isAddChild: false,  // 1-新增根菜单,2-新增子菜单,3-修改菜单
            ruleForm: {},
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                sort: [
                    { validator: validateSort, trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getData()
    },
    methods: {
        async getData() {
            try {
                const res = await resourceList()
				
                this.data = res
				
            } catch (error) {
                console.error(error)
            }
        },
        handleNodeClick(data) {
            this.resetFields();

            this.isEdit = true
			// console.log(data)
			data.url = data.url?data.url:'';
            this.ruleForm = {...data}
            this.dialogVisible = true

            // console.log(this.ruleForm)
        },
        // 表单提交
        submitForm(formName) {
            this.$refs[formName].validate( async (valid) => {
                if (!valid) {
                    // console.log('error submit!!');
                    return false;
                }

                const {isEdit, isAddChild} = this

                const params = {...this.ruleForm}

                // 编辑类型 1-新增根菜单,2-新增子菜单,3-修改菜单
                if(isEdit){
                    params.editType = 3
                }else{
                    params.editType = 2
                }

				// console.log(params)
                try {
                    this.loading = true
                    const res = await updateResource(params)
                    this.$message.success('编辑成功！')

                    this.getData()

                    this.isEdit = false
                    this.isAddChild = false
                    this.dialogVisible = false
                    this.loading = false
                } catch (error) {
                    this.loading = false
                    console.error(error)
                }
                    
            });
        },
        closeDialog() {
            this.ruleForm = {}
            this.dialogVisible = false
            this.isEdit = false
            this.isAddChild = false
        },
        addMenu(data) {
            this.resetFields()
            
            this.isAddChild = true
            const formParam = {...initForm}

            if(data.childNum){
               formParam.sort = data.childNum + 1
            }

            formParam.type = 1
            formParam.parentCode = data.code

            this.ruleForm = formParam

            this.dialogVisible = true

            // console.log(formParam)
            
        },
        addBtn(data) {
            this.resetFields()
            // console.log(data)

            this.isAddChild = true
            const formParam = {...initForm}

            if(data.childNum){
                formParam.sort = data.childNum + 1
            }

            formParam.type = 2
            formParam.parentCode = data.code

            this.ruleForm = formParam

            this.dialogVisible = true
        },
        resetFields() {
            this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields()
        }
    }
}
</script>

<style lang="scss" scoped>
.resource-manage {
    overflow: hidden;

    &__content {
        padding:20px;
        border-top:1px solid #ddd;
        height: calc(100% - 44px);
    }

    &__left {
        width:450px;
        height: 100%;
        overflow-y: auto;

        .custom-tree-node {
            display: flex;
            justify-content: space-between;
            width:100%;
        }

        .el-tree {
            padding:10px;
            background: #fbf9f9;
        } 
    }
}
</style>


<style lang="scss">
$color: #2d9cea;

.resource-manage {
    .el-tree-node {

        .title {
            padding-left:20px;

            &.menu-title {
                line-height: 28px;
            }
        }

        > .el-tree-node__content > .custom-tree-node {
            .menu-title {
                background: url('~@/assets/folder_close.png') no-repeat left center;
                background-size: 16px 14px;
            }
        }

        &.is-expanded > .el-tree-node__content > .custom-tree-node {
            .menu-title{
                background-image: url('~@/assets/folder_open.png');
            }
        }

        .btn-title {
            background: url('~@/assets/icon_tree_btn.png') no-repeat left center;
            background-size: 18px 16px;
        }
            
    }

    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background: #d9ebff;
        color: $color;
    }

    // .el-icon-caret-right:before {
    //     color: $color;
    // }
}
</style>

