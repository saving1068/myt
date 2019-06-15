import {supportCss3} from '@/utils'

export default {
    mounted() {
        
        const _table_wrap =document.querySelector('.table-header-wrap')
        // 先移除
        if(_table_wrap){
            _table_wrap.parentNode.removeChild(_table_wrap)
        }

        if(supportCss3('position', 'sticky')){
            this.$nextTick(_ => {
                const table = document.querySelector('.tableList')
                const tableWrap = table.querySelector('.el-table__body-wrapper')
                const tableHeader = table.querySelector('.el-table__header-wrapper')

                const dom = document.createElement('div')
                dom.className = 'table-header-wrap'
                dom.innerHTML = tableHeader.innerHTML

                const tabTop = document.querySelector('.el-tabs__header')
                tabTop.insertAdjacentElement('afterEnd', dom)

                const tableHeaderWrap = document.querySelector('.table-header-wrap')
                tableHeaderWrap.style.cssText = `position:-webkit-sticky; position:sticky; top:50px; left:0; display:none; margin:10px; padding:12px 0; background:#f4f6f9; color:#909399; overflow:hidden; z-index: 12`

                tableWrap.addEventListener('scroll', e => {
                    const scrollLeft = e.target.scrollLeft
                    tableHeaderWrap.querySelector('table').style.transform = `translateX(-${scrollLeft}px)`
                })

                document.querySelector('.admin-container__content').addEventListener('scroll', this.scrollEvent, false)

            })
        }
    },
    methods: {
        scrollEvent(e) {
            const top = e.target.scrollTop
            const tableWrap = document.querySelector('.table-header-wrap')
            const tableList = document.querySelector('.tableList')
            if(top >= tableList.offsetTop + 60){
                tableWrap.style.display = 'block'
            }else{
                tableWrap.style.display = 'none'
            }
        }
    },
    beforeDestroy() {
        const dom = document.querySelector('.admin-container__content')
        dom && dom.removeEventListener('scroll', this.scrollEvent, false)
    }
}