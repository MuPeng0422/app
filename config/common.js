 //引入全局请求插件
import Request from 'luch-request' // 使用npm
const http = new Request()

export {
	http
}

http.config.baseURL = 'https://xks.atx.net.cn'
// http.config.baseURL = 'http://192.168.0.67:9527' // 李鑫
// http.config.baseURL = 'http://192.168.0.116:9527' // 王洪伟
