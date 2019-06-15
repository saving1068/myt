<template>
    <div class="app-header">
        <div class="app-header__content flex">
            <div class="header-left col">
                <span class="logo"><img src="../../../images/u100.png" /></span>
                <div class="txt">
                    <span class="title">一量九率</span>
                    <span class="name">{{userInfo.name}}</span>
                </div>
            </div>
            <div class="header-right flex">
                <div class="tool">
                    <!-- <span class="notice">
                        <el-badge is-dot type="warning" class="item">
                            公告
                        </el-badge>
                    </span> -->
					<span class="name" @click="openChangePassWork">[修改密码]</span>
                    <span class="name">{{userInfo.realName}}</span>
                    <span class="exit" @click="exit">退出</span>
                </div>
                <span class="gl-logo">
                    <img v-if="userInfo.logo" :src="setImgPath(userInfo.logo)" />
                    <img v-else src="~assets/no_logo.png" />
                </span>
            </div>
        </div>
        <div class="app-header__menu">
            <ul class="nav-list flex">
                <li v-for="(item, index) in navList" :class="{'on' : index == navIndex}" :key="index" tag="li" @click="changeRoute(item, index)"><span>{{item.meta.title || item.name}}</span></li>
            </ul>
        </div>
		<el-dialog
		  title="修改密码"
		  :visible.sync="centerDialogVisible"
		  width="450px"
		  center>
		  <el-form :model="form" label-width="80px">
			<el-form-item label="旧密码" prop="oldPassword">
			  <el-input type="password" v-model="form.oldPassword"></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="passwrod">
			  <el-input type="password" minlength="8" maxlength="12" v-model="form.passwrod"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="newPassword">
			  <el-input type="password"  minlength="8" maxlength="12" v-model="form.newPassword"></el-input>
			</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
			<el-button @click="centerDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="suerPassWork('form')">确 定</el-button>
		  </span>
		</el-dialog>

    </div>
</template>

<script>
import {logout} from '@/api/common'
import {setImgPath} from '@/utils'
import {updatePwd} from '@/api/admin'

export default {
    data() {
        return {
            navList: [],
            navIndex: 0,
            isFullScreen: false,
			centerDialogVisible:false,
            setImgPath: setImgPath,
			form:{
				oldPassword:'',
				passwrod:'',
				newPassword:''
			},
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo
        }
    },
    watch: {
        $route() {
            this.getNavIndex()
        }
    },
    created() {
        this.getNavList()
        this.getNavIndex()
    },
    methods: {
		openChangePassWork(){
			this.centerDialogVisible = true;
		},
		async suerPassWork(formName){
				if(this.form.oldPassword){
					if(this.form.passwrod){
						if(this.form.passwrod.length>8&&this.form.passwrod.length<12){
							if(this.form.newPassword){
								if(this.form.newPassword.length>8&&this.form.newPassword.length<12){
									if(this.form.passwrod!=this.form.newPassword){
																 return this.$message.error('两次密码不一致，请再次确认!')
																}
																try{
																	let {oldPassword,newPassword} = {...this.form}
																	await updatePwd({oldPassword,newPassword})
																	this.form = {
																		oldPassword:'',
																		passwrod:'',
																		newPassword:''
																	}
																	this.$message.success('修改成功')
																	this.centerDialogVisible = false;
																}catch(e){
																	//TODO handle the exception
																}
																
								}else{
										return this.$message.error('请输入密码长度大于8且小于12的随机字符!')
									}
								
							}else{
								 return this.$message.error('请再次输入新密码!')
							}
						}else{
							return this.$message.error('请输入密码长度大于8且小于12的随机字符!')
						}
					}else{
						 return this.$message.error('请输入新密码!')
					}
				}else{
					 return this.$message.error('请输入旧密码!')
				}
					
				

		},
        getNavList() { 
            const {menuList} = this.$store.state
            const route = menuList.filter(v => v.name && !v.hidden)
            // console.log('store__route++++++++++', route)
            this.navList = [...route]
        },
        getNavIndex() {
            let matched = this.$route.matched.filter(v => v.name)
            this.navIndex = this.navList.findIndex(v => v.name === matched[0].name) || 0
        },
        changeRoute(route, index) {
            // 如果没有完善商户信息，则不能操作菜单
            if(this.userInfo.status == 0){
                return this.$message.error('请完善以下账户信息!')
            }

            if(index == this.navIndex) return
            this.navIndex = index

            this.$router.push({
                name: route.name
            })
        },
        // 登出
        exit() {
            this.$confirm('您确定要退出本系统吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                this.$loading.show()
                await logout()

                this.$loading.hide()
                
                this.$store.dispatch('clearUserInfo')
                
                this.$router.push({
                    name: 'login'
                })
            }).catch(() => {
            });
            
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/var';

$color: #bbb;

.app-header {
    position: relative;
    padding:20px 30px;
    background:url('~assets/head_bg.png') no-repeat;
    background-size: 100% auto;
    color:$color;

    &__content {
        
        .header-left {

            .logo,.txt {
                display: inline-block;
                vertical-align: middle;
            }

            .logo {
                width: 30px;
            }

            .txt {
                letter-spacing: 3px;
                font-size: 20px;

                .title {
                    padding:0 10px;
                }
                .name {
                    display: inline-block;
                    position: relative;
                    padding:0 10px 0 15px;
                    color: $orange;

                    &:before {
                        position:absolute;
                        content:"";
                        width:1px;
                        height:14px;
                        left:0;
                        top:50%;
                        margin-top:-7px;
                        background: $color;
                    }
                }
            }
        }

        .header-right {
            .tool {
                margin-right: 20px;
                span {
                    position: relative;
                    display: inline-block;
                    padding:0 10px;
                    cursor: pointer;

                    &:not(:first-child):before {
                        position:absolute;
                        content:"";
                        width:1px;
                        height:12px;
                        left:0;
                        top:50%;
                        margin-top:-6px;
                        background: $color;
                    }

                    &:hover {
                        color: $orange;
                    }
                }
                
            }

            .gl-logo {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 80px;
                height: 80px;

                img {
                    max-width: 100%;
                    max-height: 100%;
                }
            }
        }
    }

    &__menu {
        position: absolute;
        left: 30px;
        right : 30px;
        bottom:0;

        .nav-list {
            li {
                position: relative;
                padding:15px;
                margin:0 10px;
                cursor: pointer;
                transition: all .3s;

                &:hover,&.on {
                    color: #fff;
                }

                &:after {
                    position: absolute;
                    content:"";
                    left:50%;
                    bottom:0;
                    width:0;
                    height:5px;
                    transform: translateX(-50%);
                    background: $orange;
                    transition: all .3s;
                }

                &.on:after,&:hover:after {
                    width: 100%;
                }
            }
        }
    }
}
</style>

<style>
.header-right .el-badge__content {
    border-color: transparent!important;
}
</style>


