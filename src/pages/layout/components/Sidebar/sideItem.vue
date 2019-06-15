<template>
    <li class="side-menu__item" :class="item.children ? '' : 'child-item'">
        <div v-if="!item.hidden" class="side-menu__title" v-waves :class="$route.name === item.name ? 'active' : ''" @click.stop="toPath(item)">
            <div class="title" :class="item.meta.icon ? 'menu-top' : ''">
                <icon-svg class="icon-nav-img" v-if="item.meta.icon" :icon-class="item.meta.icon" />
                <span class="txt">{{item.meta.title}}</span>
            </div>
        </div>
        <ul class="side-menu side-menu__child" v-if="item.children">
            <side-item :item="child" v-for="(child,index) in item.children" :key="index" />
        </ul>
    </li>
</template>


<script>
import waves from '@/directive/waves'

export default {
    name: 'sideItem',
    props: ['item'],
    directives: { waves },
    methods: {
        toPath(item) {

            // 如果没有完善商户信息，则不能操作菜单
            if(this.$store.state.userInfo.status == 0){
                return this.$message.error('请完善以下账户信息!')
            }

            if(item.children) return;
            this.$router.push({
                name: item.name
            })
        }
    }
}
</script>

<style lang="scss">
@import '../../../../styles/var';

.side-menu {

    // &.side-menu__child {
    //     .side-menu__title {
    //         padding-left: 45px;
    //     }
    // }

    .child-item {
        user-select: none;
        
        .side-menu__title {
            position: relative;
            transition: background .5s;
            cursor: pointer;
    
            &:after {
                position:absolute;
                content:"";
                width:3px;
                height:30%;
                left:0;
                top:50%;
                opacity: 0;
                background:$primary;
                transform: translateY(-50%);
                transition: all .3s;
            }
    
            &.active {
                background: $primaryBg;
                color: $primary;
    
                &:after {
                    opacity: 1;
                    height:100%;
                }
            }

            &:hover {
                color: $primary;
                background-color: #f5f9ff;
            }
        }
    }

    &__title {
        display: flex;
        align-items: center;
        justify-content: center;
        padding:10px;

        .title {
            position: relative;
            display: flex;
            align-items: center;
            min-width: 60px;

            &.menu-top {
                color:#bbb;
            }

            .icon-nav-img {
                position: absolute;
                left: -25px;
                display: block;
                color: $primary;
            }
        }
        
        
    }
}
</style>