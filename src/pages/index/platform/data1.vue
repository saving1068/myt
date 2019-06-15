<template>
    <div class="platform-data page-container">
        <sticky>
            <top-filter isBetWeen>
                <el-select v-model="storeValue" size="mini" placeholder="请选择">
                    <el-option
                        v-for="item in storeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div class="filter-condition flex justify-content-center">
                    <el-radio-group v-model="filterValue" size="mini" @change="filterChange">
                        <el-radio-button :label="item.value" :key="item.value" v-for="item in filterList">{{item.label}}</el-radio-button>
                    </el-radio-group>

                    <el-date-picker
                        style="margin-left:10px"
                        v-model="dateTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        size="mini"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        @change="pickerChange"
                    >
                    </el-date-picker>
                </div>
            </top-filter>
        </sticky>

        <div class="platform-data__content">
            <panel>
                <div slot="head">
                    <span class="title">一量9率数据总览</span>
                </div>
                <el-button @click="changeSwiper">click</el-button>
            </panel>

            <panel class="mt10">
                <div slot="head">
                    <span class="title">顾问一量9率</span>
                </div>
                <div class="adviser-swiper">
                    <swiper :options="swiperOption" ref="mySwiper">
                        <swiper-slide class="adviser-swiper__item" v-for="(item,index) in 10" :key="index">
                            {{item}}
                        </swiper-slide>
                        <div class="swiper-button-prev" slot="button-prev"></div>
                        <div class="swiper-button-next" slot="button-next"></div>
                    </swiper>
                </div>
            </panel>

        </div>
    </div>
</template>

<script>
import TopFilter from '@/components/TopFilter'
import Panel from '@/components/Panel'
import Sticky from '@/components/Sticky'

import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    components: {TopFilter, Panel, swiper, swiperSlide, Sticky},
    data() {
        return {
            storeValue: 0,
            storeList: [
                {
                    value: 0,
                    label: '全部门店'
                },
                {
                    value: 1,
                    label: '广州铭智'
                }, {
                    value: 2,
                    label: '广州天天'
                }
            ],
            filterValue: 0,
            filterList: [
                {label: '今日', value: 0},
                {label: '昨日', value: 1},
                {label: '近7天', value: 2},
                {label: '近15天', value: 3},
                {label: '近30天', value: 4},
                {label: '本月', value: 5},
                {label: '上月', value: 6},
            ],
            
            dateTime: '',
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            // adviser data
            swiperOption: {
                slidesPerView: 'auto',
                spaceBetween: 20,
                freeMode: true,
                slidesOffsetBefore : 60,
                slidesOffsetAfter : 60,
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true,//修改swiper的父元素时，自动初始化swiper
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            }
        }
    },
    methods: {
        filterChange(value) {
            // console.log('当前选中...',value)
        },
        pickerChange(d) {
            // console.log(d)
        },
        changeSwiper() {
            // console.log(this.$refs.mySwiper.swiper)
        }
    },
    beforeDestroy() {
        this.$refs.mySwiper && this.$refs.mySwiper.$destroy()
    }
}
</script>


<style lang="scss" scoped>
.platform-data {

    &__content {
        margin-top:10px;
    }
}
</style>


<style lang="scss">
.filter-condition {
    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
        width:250px !important;
    }
    .el-date-editor .el-range-separator {
        width: auto !important;
    }
}


.swiper-button-prev.swiper-button-disabled, .swiper-button-next.swiper-button-disabled {
    opacity: 0;
}

.adviser-swiper {
    .swiper-container {
        &:before,&:after {
            position:absolute;
            content:"";
            left:0; 
            top:0;
            width:60px;
            height:100%;
            background: -webkit-linear-gradient(left, #fff, rgba(255,255,255,.6)); 
            z-index: 10;
        }

        &:after {
            left: auto;
            right:0;
            background: -webkit-linear-gradient(left, rgba(255,255,255,.6) 30%, #fff 100%); 
        }
    }

    .swiper-button-prev, .swiper-button-next {
        z-index: 11;
    }

    &__item {
        display:flex;
        justify-content:center;
        align-items:center;
        height: 400px;
        width: 120px;
        border:1px solid #ddd;
        box-sizing:border-box;
    }
}
</style>