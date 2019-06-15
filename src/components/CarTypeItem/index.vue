<template>
    <div class="car-type-item" :class="{'on': isSelected}" @click="clickHandle">
        <div class="car-type-item__head">
            <div class="title ellipsis">{{item.brandName}}</div>
            <p class="txt ellipsis">{{item.saleStatus == 1 ? '官方指导价' : '预售价'}}：¥{{item.minPrice}}起</p>
        </div>
        <div class="car-type-item__content">
            <img :src="setImgPath(item.brandImg)" />
        </div>
    </div>
</template>

<script>
import {setImgPath} from '@/utils'
export default {
    props: {
        item: Object,
        isSelected: Boolean
    },
    data() {
        return {
            setImgPath
        }
    },
    methods: {
        clickHandle() {
            this.$emit('select', this.item)
        }
    }
}
</script>


<style lang="scss" scoped>
@import '../../styles/var';

.car-type-item {
    width:170px;
    height:120px;
    padding:5px 10px 10px;
    border:2px solid transparent;
    cursor: pointer;
    transition: all .3s;
    overflow: hidden;
    box-shadow: 1px 1px 5px rgba(0,0,0,.1);

    &.on {
        border-color:$orange;
        box-shadow: 1px 1px 5px rgba(0,0,0,.3);
    }

    &:hover {
        box-shadow: 1px 1px 5px rgba(0,0,0,.3);
    }

    &__head {
        .title {
            font-weight: 700;
            color: #333;
        }
        .txt {
            font-size: 12px;
            color:#999;
        }
    }

    &__content {
        img {
            width: 100%;
            height:52px;
        }
    }
}
</style>
