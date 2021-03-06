<template>
    <div class="app-tags-view">
        <span v-if="isShowBtn" class="tags-btn tags-btn__left" @click="scrollLeft(-240)"><i class="el-icon-arrow-left"></i></span>
        <div class="app-tags-view__content" ref="content">
            <el-scrollbar ref="scrollContainer" :vertical="false" class="app-tags-view__scrollbar" @wheel.native.prevent="handleScroll">
                <!-- <transition-group name="breadcrumb"> -->
                    <span class="tags-item" :class="{'on': isActive(item)}" ref="tag" :data-path="item.path" v-for="(item, index) in tagsList" :key="index" @click="changePage(item)">
                        <i class="icon-dot">{{item.title}}</i>
                        <i class="el-icon-close" @click.stop="delViewTags(item)"></i>
                    </span>          
                <!-- </transition-group> -->
            </el-scrollbar>
        </div>
        <span v-if="isShowBtn" class="tags-btn tags-btn__right" @click="scrollLeft(240)"><i class="el-icon-arrow-right"></i></span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isShowBtn: false,
        }
    },
    computed: {
        tagsList() {
            return Array.from(this.$store.state.tagsView.visitedViews)
        }
    },
    watch: {
        $route() {
            this.addViewTags()
            this.moveToCurrentTag()
            this.btnVisible();
        }
    },
    mounted() {
        this.addViewTags()
        this.btnVisible()

        window.addEventListener('resize', this.throttle(this.btnVisible.bind(this), 500).bind(this))
    },
    methods: {        
        btnVisible() {
            const $content = this.$refs.content;
            if($content){
                const contentWidth = $content.offsetWidth
                this.$nextTick(_ => {
                    const tags = this.$refs.tag
                    if(tags){
                        const lastTag = tags.slice(-1)[0]
                        if(lastTag.offsetLeft + lastTag.offsetWidth >= contentWidth){
                            this.isShowBtn = true;
                        }else{
                            this.isShowBtn = false;
                        }
                    }
                })
            }
        },
        throttle(fn, delay = 200) {

            let startTime
            let timer

            return function(){
                const args = arguments
                const context = this

                const endTime = new Date/1
                if(startTime && endTime - startTime < delay){
                    timer && clearTimeout(timer)
                    timer = setTimeout(_ => {
                        startTime = endTime
                        fn.apply(context, args)
                    }, delay)
                }else{
                    startTime = endTime
                    fn.apply(context, args)
                }
            }
        },
        handleScroll(e) {
            const eventDelta = e.wheelDelta || -e.deltaY * 40
            const $scrollWrapper = this.$refs.scrollContainer.wrap
            $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
        },
        scrollLeft(offset) {
            const $container = this.$refs.scrollContainer.$el
            const $containerWidth = $container.offsetWidth
            const $scrollWrapper = this.$refs.scrollContainer.$refs.wrap
            const $scrollWrapperWidth = $scrollWrapper.offsetWidth

            $scrollWrapper.scrollLeft += offset
        },
        moveToCurrentTag() {
            const tags = this.$refs.tag
            this.$nextTick(() => {
                for (const tag of tags) {
                    if (tag.dataset.path === this.$route.path) {
                        this.moveToTarget(tag)
                        break
                    }
                }
            })
        },
        moveToTarget(currentTag) {
            const $container = this.$refs.scrollContainer.$el
            const $containerWidth = $container.offsetWidth
            const $scrollWrapper = this.$refs.scrollContainer.$refs.wrap
            const tagList = this.$refs.tag

            let firstTag = null
            let lastTag = null
            let prevTag = null
            let nextTag = null

            const tagAndTagSpacing = 10

            // find first tag and last tag
            if (tagList.length > 0) {
                firstTag = tagList[0]
                lastTag = tagList[tagList.length - 1]
            }

            // find preTag and nextTag
            for (let i = 0; i < tagList.length; i++) {
                if (tagList[i] === currentTag) {
                    if (i === 0) {
                        nextTag = tagList[i].length > 1 && tagList[i + 1]
                    } else if (i === tagList.length - 1) {
                        prevTag = tagList[i].length > 1 && tagList[i - 1]
                    } else {
                        prevTag = tagList[i - 1]
                        nextTag = tagList[i + 1]
                    }
                    break
                }
            }

            if (firstTag === currentTag) {
                $scrollWrapper.scrollLeft = 0
            } else if (lastTag === currentTag) {
                $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
            } else {
                // the tag's offsetLeft after of nextTag
                const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing

                // the tag's offsetLeft before of prevTag
                const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagAndTagSpacing

                if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
                    $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
                } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
                    $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
                }
            }
        },
        addViewTags() {
            if(this.$route){
                this.$store.dispatch('addTagsView', this.$route)
            }
        },
        delViewTags(route) {
            this.$store.dispatch('delTagsView', route).then(({ visitedViews }) => {
                if (this.isActive(route)) {
                    const latestView = visitedViews.slice(-1)[0]
                    if (latestView) {
                        this.$router.push(latestView)
                    } else {
                        this.$router.push('/')
                    }
                }
            })
        },
        isActive(route) {
            return route.path === this.$route.path || route.name === this.$route.name
        },
        changePage(item) {
            this.$router.push({
                path: item.path,
                query: item.query
            })
        }
    },
    destroyed() {
        window.removeEventListener('resize', this.throttle)
    }
}
</script>


<style lang="scss">
@import '../../../styles/var';

.app-tags-view {
    display: flex;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;

    &__content {
        flex: 1;
        overflow: hidden;
        background-color: #f9f9f9;
    }

    &__scrollbar {
        white-space: nowrap;
        overflow: hidden;

        .el-scrollbar__view {
            padding:5px;
        }

        .tags-item {
            display: inline-block;
            padding:5px 10px;
            margin:0 5px;
            border:1px solid #e8eaec;
            border-radius: 2px;
            background-color: #fff;
            cursor: pointer;

            &.on {
                color: $primary;
                border-color:#b3d8ff;
                background-color: #ecf5ff;

                .el-icon-close {
                    color: $primary;
                }

                .icon-dot:before,.el-icon-close:hover {
                    background: $primary;
                }
            }

            &:hover {
                opacity: .8;
            }

            .icon-dot {
                position: relative;
                padding-left:15px;

                &:before {
                    position: absolute;
                    content: "";
                    left:0;
                    top:50%; 
                    width:8px;
                    height: 8px;
                    margin-top:-4px;
                    background: #ccc;
                    border-radius: 50%;
                }
            }

            .el-icon-close {
                margin-left:5px;
                color:#ccc;
                transition: .3s all;
                border-radius: 50%;

                &:hover {
                    background-color: #ccc;
                    color:#fff;
                }
            }

            &.el-tag--primary .icon-dot {
                &:before {
                    background-color: $primary;
                }
            }
        }
    }

    .tags-btn {
        display: flex;
        align-items: center;
        padding:0 5px;
        cursor: pointer;

        &.tags-btn__left {
            border-right: 1px solid #e8e8e8;
            box-shadow: 0 2px 5px rgba(0,0,0,.1);
        }

        &.tags-btn__right {
            border-left: 1px solid #e8e8e8;
            box-shadow: 0 2px 5px rgba(0,0,0,.1);
        }

        i {
            font-size: 18px;
        }
    }


}
</style>

