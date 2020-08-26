import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({  
    state: {
        userInfo: {},
		token: '',
        hasLogin: false  
    },  
    mutations: {
        login(state, provider) {// 改变登录状态
			console.log(provider)
			state.token = provider.token||''
            state.hasLogin = true  
            state.userInfo = provider.userInfo
			uni.setStorage({// 将用户信息保存在本地
			    key: 'userInfo',  
			    data: provider
			})
        },  
        logout(state) {//退出登录  
			state.token = ''
            state.hasLogin = false  
            state.userInfo = {}  
            uni.removeStorage({  
                key: 'userInfo'  
            })  
        }  
    }  
})

export default store
