<template>
    <div class="app-breadcrumb row align-items-center">
        <span class="app-breadcrumb__icon" :class="isOpenMenu ? 'open' : 'close'" @click="toggleMenu">
            <icon-svg icon-class="menu" />
        </span>
        <el-breadcrumb class="app-breadcrumb__nav" separator="/">
            <transition-group name="breadcrumb">
                <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta.title" :key="item.path">
                    <span v-if="item.redirect==='noredirect' || index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
                    <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
                </el-breadcrumb-item>
            </transition-group>
        </el-breadcrumb>
    </div>
</template>


<script>
import * as types from '@/store/types'
export default {
    data() {
        return {
            levelList: null
        }
    },
    computed: {
        isOpenMenu() {
            return this.$store.state.isOpenMenu
        }
    },
    watch: {
        $route() {
            this.getBreadcrumb()
        }
    },
    created() {
        this.getBreadcrumb()
    },
    methods: {
        getBreadcrumb() {
            let matched = this.$route.matched.filter(item => {
                if (item.name) {
                    return true
                }
            })
            // console.log(matched)
            const first = matched[0]
            if (first && first.name.trim().toLocaleLowerCase() !== ''.toLocaleLowerCase()) {
                matched = [{ path: '/', meta: { title: '智胜5S管理平台' }}].concat(matched)
            }
            this.levelList = matched
        },
        handleLink(item) {
            // console.log(item)
            const { redirect, path } = item
            // if (redirect) {
            //     this.$router.push(redirect)
            //     return
            // }
            this.$router.push(path)
        },
        toggleMenu() {
            const state = this.$store.state.isOpenMenu;
            this.$store.commit(types.SET_OPEN_MENU, !state);
        }
    }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb {
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;

    &__icon {
        display: block;
        margin-right: 20px;
        cursor: pointer;

        .icon-svg {
            display: block;
            width: 24px;
            height: 24px;
            color: #666;
            transition: transform .3s;
        }

        &.close .icon-svg {
            transform: rotate(90deg);
        }
    }
}
</style>
