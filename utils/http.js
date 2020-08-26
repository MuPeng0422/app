const http = (params) => {
	let url = params.url;
	let method = params.method;
	let header = params.header || {};
	let data = params.data || {};
	
	// 请求方式GET POST
	if (method) {
		method = method.toUpperCase(); // 小写转大写
		if (method === 'POST') {
			header = {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	}
	
	// 发起请求 加载动画
	if (!params.hideLoading) {
		uni.showLoading({
			title: '加载中...'
		})
	}
	
	// 发起网络请求
	uni.request({
		url: url,
		method: method || 'GET',
		header: header,
		data: data,
		dataType: 'json',
		sslVerify: false, // 是否验证ssl证书
		success: (res) => {
			if (res.statusCode && res.statusCode !== 200) {
				// api错误
				uni.showModal({
					content: res.data.message
				})
				return;
			}
			typeof params.success === 'function' && params.success(res.data);
		},
		fail: (err) => {
			uni.showModal({
				content: err.data.message
			})
			typeof params.fail === 'function' && params.fail(err.data);
		},
		complete: (e) => {
			uni.hideLoading()
			typeof params.complete == "function" && params.complete(e.data);
			return;
		}
	})
}

export default http
