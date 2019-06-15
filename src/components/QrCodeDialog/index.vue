<template>
    <el-dialog :title="title" :visible.sync="show" :width="dialogWidth" center>
        <div v-if="typeof src === 'string'" class="textCenter">
            <img class="inlineBlock" :src="setImgPath(src)" :width="width" :height="height" />
        </div>
        <div v-else-if="Array.isArray(src) && src.length" class="more-qr">
            <div class="txt">
                意向是【{{userInfo.name}}  {{userInfo.mobile}}】的跟进顾问与档案，<br>
                扫码即可查看对应档案信息
            </div>
            <div class="more-qr__content flex justify-content-center">
                <div class="qr-item" v-for="(item,index) in src" :key="index">
                    <div class="qr-item__head">
                        <p class="strong">{{item.storeName}}</p>
                        <p>
                            {{item.advName}}
                            <span v-if="item.isJd || item.isTsAdv">
                                ({{item.isJd ? '建档' : ''}} {{item.isJd && item.isTsAdv ? '|' : ''}} {{item.isTsAdv ? '推手上级' : ''}})
                            </span>
                        </p>
                    </div>
                    <div class="qr-item__content">
                        <img :src="setImgPath(item.codeUrl)" class="inlineBlock" width="140" height="140">
                    </div>
                </div>
            </div>
        </div>
        <div class="qrcode textCenter mt15">
            <slot />
        </div>
    </el-dialog>
</template>

<script>
import {setImgPath} from '@/utils'
export default {
    props: {
        visible: Boolean,
        src: [String, Array],
        userInfo: Object,
        title: {
            type: String,
            default : '提示'
        },
        width: {
            type: Number,
            default: 200
        },
        height: {
            type: Number,
            default: 200
        }
    },
    computed: {
        dialogWidth() {
            if(Array.isArray(this.src) && this.src.length){
                return Math.max(this.src.length * 200, 300) + 'px'
            }else{
                return '300px'
            }
        }
    },
    watch: {
        visible(state) {
            this.show = state
        },
        show(state) {
            this.$emit('update:visible', state)
        }
    },
    data() {
        return {
            show: this.visible,
            setImgPath: setImgPath
        }
    }
}
</script>

<style lang="scss" scoped>
.more-qr {
    &__content {
        .qr-item {
            margin:10px;
            border:1px solid #ddd;
            &__head {
                padding:5px 0;
                border-bottom:1px solid #ddd;
                background:#f8f8f8;
                text-align: center;
                font-size:12px;
                p {
                    line-height: 16px;
                }
            }
            &__content {
                padding:10px;
            }
        }
    }
}
</style>
