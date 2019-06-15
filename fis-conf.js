
fis.media('prod').match('/dist/(**)', {
	release: '$1',
	deploy: fis.plugin('http-push', {
		receiver: 'http://39.108.172.177:8261/receiver',
		to: '/usr/local/html/mgrjkd' // 注意这个是指的是测试机器的路径，而非本地机器
	})
});