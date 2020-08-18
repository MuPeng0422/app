import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({  
    state: {  
		wxUserInfo: {},
        uerInfo: {},
		token: '',
        hasLogin: false  
    },  
    mutations: {
		getUserInfo(state, user) {
			state.wxUserInfo = user
		},
        login(state, provider) {// 改变登录状态
			state.token = provider.token||''
            state.hasLogin = true  
            state.uerInfo = provider
            uni.setStorage({// 将用户信息保存在本地  
                key: 'userInfo',  
                data: provider  
            })  
        },  
        logout(state) {//退出登录  
			state.token = ''
            state.hasLogin = false  
            state.uerInfo = {}  
            uni.removeStorage({  
                key: 'uerInfo'  
            })  
        }  
    }  
})

export default store
