<template>
    <div class="admin-wrapper">
        <app-header />
        <div class="admin-container" :class="isopen ? 'show' : 'hide'">
            <div class="admin-container__side">
                <sidebar />
                <div class="expand" @click="openHandle">
                    <icon-svg class="icon-menu" icon-class="expand" />
                </div>
            </div>
            <div class="admin-container__content">
                <!-- <breadcrumb />
                <tags-view /> -->
                <app-main />
            </div>
        </div>
    </div>
</template>

<script>
// import Breadcrumb from '@/components/Breadcrumb'
import { AppHeader, Sidebar, AppMain } from './components'
import {SET_OPEN_MENU} from '@/store/types'

export default {
    components: {AppHeader, Sidebar, AppMain},
    computed: {
        isopen() {
            return this.$store.state.isOpenMenu
        }
    },
    methods: {
        openHandle() {
            const isopen = this.isopen
            this.$store.commit(SET_OPEN_MENU, !isopen)
        }
    }
}
</script>


<style lang="scss" scoped>
@import '../../styles/var.scss';
.admin {
    &-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    &-container {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        &.hide {
            .admin-container {
                &__side {
                    left:-138px;
                    .app-sidebar {
                        transform: translateX(-15px);
                    }
                }

                &__content {
                    margin-left: 20px;
                }
            }

            .expand {
                right: 0;

                .icon-menu {
                    transform:rotate(0deg);
                }
            }
        }

        &__side {
            position: absolute;
            width: 150px;
            left:20px;
            top:10px;
            bottom: 10px;
            transition: all .3s;

            &.close {
                width: 64px !important;
            }

            .app-sidebar {
                transform:translateX(0);
            }

            .expand {
                position: absolute;
                right:-12px;
                top:50%;
                width:12px;
                padding:18px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: $primary;
                background-image: linear-gradient(to right, #3c7aff, $primary);
                box-shadow: 1px 1px 5px rgba(0,0,0,.1);
                text-align: center;
                border-radius: 0 5px 5px 0;
                transform:translateY(-50%);
                cursor: pointer;

                &:hover {
                    opacity: .8;
                }

                .icon-menu {
                    color:#fff;
                    width: 8px;
                    height: 8px;
                    transform:rotate(-180deg);
                    transition: transform .3s;
                }
            }
        }

        &__content {
            // position: absolute;
            // left:185px;
            // right:20px;
            // bottom:10px;
            // top:10px;

            position: relative;
            // height: cale(100% - 20px);
            flex:1;
            margin: 10px 10px 10px 185px;

            padding:0 5px;
            overflow-x: hidden;
            overflow-y: auto;
            transition: all .3s;

            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
                border-radius: 16px;
                background: #dde3e8;
            }

            &::-webkit-scrollbar-thumb {
                border-radius: 16px;
                background: #b4c8d8
            }
        }
    }
}
</style>
