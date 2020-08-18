<script>
	import { mapMutations } from 'vuex'; 
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.getStorage({//获得保存在本地的用户信息  
				key: 'userInfo',  
				success:(res) => {
					console.log(res)
					if(res.data !== '' && res.data.token !== '') {
						
					} else {
						uni.navigateTo({
						    url: '/pages/login/login'
						})
					}
				},
				fail: (err) => {
					console.log(err)
					uni.navigateTo({
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
	@import '/static/css/style.scss';
</style>
