<script>
	import { mapMutations } from 'vuex'; 
	export default {
		onLaunch: function() {
			
			uni.getStorage({//获得保存在本地的用户信息
				key: 'userInfo',  
				success:(res) => {
					if(res.data.hasLogin === true && res.data.userInfo.state === 0) {
						uni.reLaunch({
							url: '/pages/index/login'
						})
					} else if (res.data.hasLogin === true && res.data.userInfo.state === 1) {
						uni.reLaunch({
							url: '/pages/enterprise/index/index'
						})
					} else {
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}
				},
				fail: (err) => {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
			});  
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(['login'])
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import 'uview-ui/index.scss';
	
</style>
