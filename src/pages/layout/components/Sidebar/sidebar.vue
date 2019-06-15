<template>
    <div class="app-sidebar flex">
        <div class="icon-menu flex align-items-center">
            <span class="img flex align-items-center justify-content-center">
                <icon-svg :icon-class="moduleIcon" />
            </span>
            <p class="txt">{{moduleName}}</p>
        </div>
        <el-scrollbar class="app-sidebar__scrollbar" v-if="menuList.length">
            <ul class="side-menu" v-for="(item, index) in menuList" :key="index">
                <side-item :item="item" />
            </ul>
        </el-scrollbar>
    </div>
</template>

<script>
import sideItem from './sideItem'
import * as types from '@/store/types'

export default {
    components: {sideItem},
    data() {
        return {
            moduleName: '首页',
            moduleIcon: 'bi',
            menuList: [],
            routeParent: ''
        };
    },
    computed: {
        routes() {
            return this.$store.state.sideRoute
        }
    },
    watch: {
        $route() {
            this.getCurrentRoute()
        }
    },
    created() {
        this.getCurrentRoute()
		
    },
	mounted(){
		console.log('sied页面')
		let side = document.getElementsByClassName("admin-container__side")[0].offsetHeight;
		this.$store.state.getContentSize = side;
		console.log(this.$store.state.getContentSize)
		window.onresize = this.getContentSize;
	},
    methods: {
		getContentSize(){
			let side = document.getElementsByClassName("admin-container__side")[0].offsetHeight;
			this.$store.state.getContentSize = side;
			console.log(this.$store.state.getContentSize)
			// console.log(side)
		},
        getCurrentRoute() {
            const {menuList} = this.$store.state
            const routes = menuList.filter(v => v.name)
            this.findParentRoute(routes, true)
            this.getCurrentMenu()
            // console.log(menuList)
            // console.log(this.$route)
        },
        // 找到父级
        findParentRoute(list, isParent) {
            const {name, path} = this.$route
            for(let [key, item] of list.entries()){
                if(item.name === name){
                    // console.log('in......findParents', this.routeParent.name)
                    this.updateSideRoute(this.routeParent)
                    break
                }

                if(isParent){
                    this.routeParent = item;
                }

                if(item.children && item.children.length){
                    this.findParentRoute(item.children, false)
                }
            }
        },
        // 更新侧边栏菜单信息
        updateSideRoute(routeParent) {
            // console.log('routeParent++++',routeParent)
            this.$store.dispatch('addSideRoute', routeParent)
        },
        // 当前模块的所有菜单属性
        getCurrentMenu() {
            const {sideRoute} = this.$store.state
            this.moduleName = sideRoute.meta.title
            this.menuList = sideRoute.children ? [...sideRoute.children] : [sideRoute]
            this.moduleIcon = sideRoute.meta.icon || 'bi'
            // console.log('current menuList', this.menuList)
        }
    }
}
</script>

<style lang="scss">
@import '../../../../styles/var';
@import '../../../../styles/mixins';

.app-sidebar {
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #fff;
    box-shadow: 1px 1px 15px rgba(0,0,0,.1);

    .icon-menu {
        flex-direction: column;
        padding: 30px 0;
        border-bottom:1px solid $borderColor;

        .img {
            @include size(40px, 40px);
            border-radius: 50%;
            background: $primary;
            color:#fff;
            svg {
                @include size(24px, 24px);
            }
        }

        .txt {
            margin-top:5px;
            color: $primary;
            font-size: 16px;
        }
    }

    &__scrollbar {
        flex: 1;
        height: 100%;

        .el-scrollbar__wrap {
            overflow-x:hidden;
        }
    }
    
}
</style>
