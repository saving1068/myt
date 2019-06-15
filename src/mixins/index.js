const message = {
    methods: {
        message(txt, title = '提示', params = {}) {
            const options = Object.assign({}, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            }, params)
            return new Promise((resolve, reject) => {
                this.$confirm(txt, title, options).then((e) => {
                   resolve(e)
                }).catch((e) => {
                    reject(e)
                })
            })
        }
    }
}


export {
    message
}