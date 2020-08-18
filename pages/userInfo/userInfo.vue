<template>
	<view class="content">
		<view class="content-main">
			<u-cell-group>
				<u-cell-item title="姓名" :value="userInfo.username" :arrow="false"></u-cell-item>
				<u-cell-item title="所在单位" :value="userInfo.company" :arrow="false"></u-cell-item>
				<u-cell-item title="联系方式" :value="userInfo.phone" :arrow="false"></u-cell-item>
				<u-cell-item title="岗位" :value="userInfo.position" :arrow="false"></u-cell-item>
				<u-cell-item title="身份证号码" :value="userInfo.idcard" :arrow="false"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					username: '刘大招',
					company: '香格里拉酒店',
					phone: '158-5896-5896',
					position: '职员',
					idcard: '60131346132216416461'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100%;
		padding-top: 10rpx;
		
		
		.content-main{
			height: 100%;
			background-color: #FFFFFF;
		}
	}
</style>
