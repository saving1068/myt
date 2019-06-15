
import {checkPower} from '@/api/common'

export default {
    data() {
        return {
            btnPowerList: [],
            menuPowerList: []
        }
    },
    methods: {
        // 获取功能权限
        getPower(buttonPowers = '', menuPowers = '') {
            this.btnPowerList = buttonPowers.split(',')
            this.menuPowerList = menuPowers.split(',')

            return new Promise(async (resolve, reject) => {
                try {
                    this.$loading.show()
                    const res = await checkPower({
                        menuPowers,
                        buttonPowers
                    })

                    this.btnPowerList = res.buttonPowers.split(',')
                    this.menuPowerList = res.menuPowers.split(',')

                    resolve(res)
                } catch (error) {
                    console.error(error)
                    reject(error)
                }
                this.$loading.hide()
            })
        },
        // 按钮是否有权限
        isBtnPower(code) {
            return this.btnPowerList.includes(code)
        },
        // 菜单是否有权限
        isMenuPower(code) {
            return this.menuPowerList.includes(code)
        }
    }
}