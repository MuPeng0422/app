<template>
	<view class="content">
		<!-- 消控室管理 -->
		<view class="fire-control-room">
			<view class="title">
				消控室管理
			</view>
			<view class="firl-total">
				<view class="total">
					<view class="total-title">
						消控室
					</view>
					<view class="number">
						{{ box.units  }}
					</view>
				</view>
				<view class="total">
					<view class="total-title">
						异常
					</view>
					<view class="number">
						{{ errUnit }}
					</view>
				</view>
			</view>
		</view>
		<!-- 人员管理 -->
		<view class="personnel-manage">
			<view class="title">
				人员管理
			</view>
			<view class="manage-list">
				<view class="list-item">
					持证<span>{{ box.licensed }}</span>人
				</view>
				<view class="list-item">
					上岗<span>{{ box.dutyNum }}</span>人
				</view>
				<view class="list-item">
					在岗<span>{{ box.sign }}</span>人
				</view>
				<view class="list-item">
					证书到期<span>{{ expired }}</span>人
				</view>
				<view class="list-item">
					请假<span>{{ box.qingJia }}</span>人
				</view>
				<view class="list-item">
					缺勤<span>{{ box.queQin }}</span>人
				</view>
			</view>
		</view>
		
		<!-- 实时信息 -->
		<view class="real-time-info">
			<view class="title">
				实时信息
			</view>
			<view class="real-time-info-list">
				<view class="list-content">
					<view v-for="(item, index) in realTimeInfoList" :key="index" class="item" :class="{'animate-up': animateUp}">
						<view class="item-content">
							{{ item.event }}
						</view>
						<view class="item-date">
							{{ item.creatTime }}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 学习排名 -->
		<view class="study">
			<view class="study-title">
				<view class="title">
					学习排名
				</view>
				<view class="tabs">
					<view v-for="(item, index) in studyList" :key="index" @click="studyChange(index)">
						<u-tag :text="item.name" mode="dark" :type="item.type" border-color="none"/>
					</view>
				</view>
			</view>
			
			<view class="study-content">
				<swiper :current="studySwiperCurrent" @animationfinish="animationfinish">
					<swiper-item class="swiper-item">
						<scroll-view scroll-y style="height: 300rpx;width: 100%;">
							<view class="study-content-table">
								<view class="study-content-table-title">
									<view class="th rank">
										<span>排名</span>
									</view>
									<view class="th name">
										<span>单位名称</span>
									</view>
									<view class="th integral">
										<span>总积分</span>
									</view>
									<view class="th time-long" @click="companySearch">
										<span>总时长</span>
										<span class="icon"><u-icon :name="[companyIsActive ? arrowUp : arrowDown]"></u-icon></span>
									</view>
								</view>
								<view class="study-content-table-body">
									<view v-for="(item, index) in companyData" :key="index" class="tr">
										<view class="td">
											第 {{ item.index }} 名
										</view>
										<view class="td">
											{{ item.unitName }}
										</view>
										<view class="td">
											{{ item.scoreNum }}
										</view>
										<view class="td">
											{{ item.courseNum }}
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="swiper-item">
						<scroll-view scroll-y style="height: 800rpx;width: 100%;">
							<view class="study-content-table">
								<view class="study-content-table-title">
									<view class="th rank">
										<span>排名</span>
									</view>
									<view class="th name">
										<span>姓名</span>
									</view>
									<view class="th integral">
										<span>总积分</span>
									</view>
									<view class="th time-long" @click="personalSearch">
										<span>总时长</span>
										<span class="icon"><u-icon :name="[personalIsActive  ? arrowUp : arrowDown]"></u-icon></span>
									</view>
								</view>
								<view class="study-content-table-body">
									<view v-for="(item, index) in personData" :key="index" class="tr">
										<view class="td">
											第 {{ index + 1 }} 名
										</view>
										<view class="td">
											{{ item.userName }}
										</view>
										<view class="td">
											{{ item.uesrScoreNum }}
										</view>
										<view class="td">
											{{ item.uesrCourseNum }}
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 今日学习完成率 -->
		<view class="todayStudy">
			<view class="title">
				今日学习完成率
			</view>
			<view class="chart">
				<canvas canvas-id="canvasGauge" id="canvasGauge" class="charts"></canvas>
			</view>
		</view>
		
		<!-- 相关数据统计 -->
		<view class="data-total">
			<view class="data-total-title">
				<view class="title">
					相关数据统计
				</view>
				<view class="tabs">
					<view v-for="(item, index) in dataTotalList" :key="index" @click="dataTotalChange(index)">
						<u-tag :text="item.name" mode="dark" :type="item.type" border-color="none"/>
					</view>
				</view>
			</view>
			
			<view class="data-total-body">
				<swiper :current="dataTotalSwiperCurrent" @animationfinish="dataTotalAnimationfinish">
					<swiper-item class="swiper-item">
						<scroll-view scroll-y style="height: 100%;width: 100%;">
							<view class="qiun-charts" >
							   <u-table>
							   	<u-tr class="u-tr">
							   		<u-th class="u-th">名称</u-th>
							   		<u-th class="u-th">数量</u-th>
							   	</u-tr>
							   	<u-tr v-for="(item, index) in box.certificate" :key="index" class="u-tr">
							   		<u-td class="u-td">{{item.name}}</u-td>
							   		<u-td class="u-td">{{item.val}}</u-td>
							   	</u-tr>
							   </u-table>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="swiper-item">
						<scroll-view scroll-y style="height: 100%;width: 100%;">
							<view class="qiun-charts" >
							  <u-table>
							  	<u-tr class="u-tr">
							  		<u-th class="u-th">名称</u-th>
							  		<u-th class="u-th">数量</u-th>
							  	</u-tr>
							  	<u-tr v-for="(item, index) in equipData" :key="index" class="u-tr">
							  		<u-td class="u-td">{{item.key}}</u-td>
							  		<u-td class="u-td">{{item.vel}}</u-td>
							  	</u-tr>
							  </u-table>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '../../components/u-charts/u-charts.js';
	var _self;
	var canvaGauge = null;
	var canvaPie=null;
	export default {
		data() {
			return {
				token: '',
				errUnit: 0,
				expired: 0,
				box: {
					certificate: [],
					courseToday: 0,
					dutyNum: 0,
					licensed: 0,
					qingJia: 0,
					queQin: 0,
					sign: 0,
					units: 0
				},
				realTimeInfoList: [],
				animateUp: false,
				timerScroll: null,
				timerMsg: null,
				studyList: [
					{
						name: '单位',
						type: 'success'
					},
					{
						name: '个人',
						type: 'info'
					}
				],
				dataTotalList: [
					{
						name: '证书等级',
						type: 'success'
					},
					{
						name: '人员配比',
						type: 'info'
					}
				],
				studySwiperCurrent: 0,
				dataTotalSwiperCurrent: 0,
				companyIsActive: false,
				personalIsActive: false,
				arrowUp: 'arrow-up',
				arrowDown: 'arrow-down',
				companyData: [],
				personData: [],
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				gaugeWidth:15,
				equipData: [],
				tempRealTimeList: [],
				backgroundImage: 'https://xksv.atx.net.cn/xcx_static/img/bigdata.jpg'
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.token = res.data.data.token
					this.getData()
					this.fetchMsg()
					this.getRank()
					this.realMsg()
					
					this.timerScroll = setInterval(this.scrollAnimate, 2000)
					this.timerMsg = setInterval(this.realMsg, 10000)
				}
			})
		},
		methods: {
			getServerData(){
				let Gauge = {
					categories: [],
					series: [],
				};
				//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				Gauge.categories = [
					{
						value: 0.2,
						color: "#1890ff"
					},
					{
						value: 0.8,
						color: "#2fc25b"
					},
					{
						value: 1,
						color: "#f04864"
					}
				]
				Gauge.series = [
					{
						name: "完成率",
						data: this.box.courseToday,
						color: "#2fc25b",
						index: 0,
						type: "gauge",
						show: true,
						pointShape: "circle",
						legendShape: "circle"
					}
				];
				_self.showGauge("canvasGauge",Gauge);
				
			},
			showGauge(canvasId,chartData){
				canvaGauge = new uCharts({ 
					$this:_self,
					canvasId: canvasId,
					type: 'gauge',
					fontSize: 11,
					legend:false,
					title: {
						name: Math.round(chartData.series[0].data*100)+'%',
						color: chartData.categories[1].color,
						fontSize: 25*_self.pixelRatio,
						offsetY: 50*_self.pixelRatio,//新增参数，自定义调整Y轴文案距离
					},
					subtitle: {
						name: chartData.series[0].name,
						color: '#ffffff',
						fontSize: 18*_self.pixelRatio,
						offsetY: -60*_self.pixelRatio, //新增参数，自定义调整Y轴文案距离
						offsetX: -120*_self.pixelRatio
					},
					extra: {
						gauge:{
							type:'default',
							width: _self.gaugeWidth*_self.pixelRatio,//仪表盘背景的宽度
							startAngle:0.75,
							endAngle:0.25,
							startNumber:0,
							endNumber:100,
							splitLine:{
								fixRadius:0,
								splitNumber:10,
								width: _self.gaugeWidth*_self.pixelRatio,//仪表盘背景的宽度
								color:'#FFFFFF',
								childNumber:5,
								childWidth:_self.gaugeWidth*0.4*_self.pixelRatio,//仪表盘背景的宽度
							},
							pointer:{
								width: _self.gaugeWidth*0.8*_self.pixelRatio,//指针宽度
								color:'auto'
							}
						}
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					dataLabel: true,
				});
			},
			getData() {
				// 消控室、持证、上岗、在岗、请假、缺勤、学习完成率、证书等级占比
				this.$http.get('/unit/units', {
					header: {
						'Authentication': this.token,
					}
				}).then((res) => {
					this.box = res.data
					
					_self = this;
					this.cWidth = uni.upx2px(670);
					this.cHeight = uni.upx2px(260);
					this.getServerData();
				})
			},
			fetchMsg() {
				// 实时信息列表
				this.$http.get('/real', {
					header: {
						'Authentication': this.token,
					}
				}).then((res) => {
					for (var i = 0; i < res.data.data.length; i++) {
						res.data.data[i].creatTime = res.data.data[i].creatTime.substring(res.data.data[i].creatTime.length - 8)
					}
					this.realTimeInfoList = res.data.data
				})
			},
			getRank() {
				// 获取学习排名
				this.$http.get('/unit/monitors', {
					header: {
						'Authentication': this.token
					}
				}).then((res) => {
					for (var i = 0; i < res.data.jsonArray.length; i++) {
						if(i < 3) {
							var row = {
								index: i + 1,
								unitName: res.data.jsonArray[i].unitName,
								scoreNum: res.data.jsonArray[i].scoreNum,
								courseNum: res.data.jsonArray[i].courseNum
							}
							this.companyData.push(row)
						}
					}
					for (var i = 0; i < res.data.userJsonArray.length; i++) {
						if(i < 3) {
							this.personData .push(res.data.userJsonArray[i])
						}
					}
					console.log(res)
					this.equipData = res.data.percentageArray
				})
			},
			scrollAnimate () {
				this.animateUp = true
				setTimeout(() => {
					this.realTimeInfoList.push(this.realTimeInfoList.shift())
					this.animateUp = false
				}, 500)
			},
			realMsg() {
				// 异常消控室数、证书过期人数、实时信息
				this.$http.get('/unit/erroUnits', {
					header: {
						'Authentication': this.token
					}
				}).then((res) => {
					this.errUnit = res.data.errUnit
					this.expired = res.data.expired
				})
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.studySwiperCurrent = current;
				for (var i = 0; i < this.studyList.length; i++) {
					if (current === i) {
						this.studyList[i].type = 'success'
					} else {
						this.studyList[i].type = 'info'
					}
				}
			},
			dataTotalAnimationfinish(e) {
				let current = e.detail.current;
				this.dataTotalSwiperCurrent = current;
				for (var i = 0; i < this.dataTotalList.length; i++) {
					if (current === i) {
						this.dataTotalList[i].type = 'success'
					} else {
						this.dataTotalList[i].type = 'info'
					}
				}
			},
			studyChange(index) {
				this.studySwiperCurrent = index;
				for (var i = 0; i < this.studyList.length; i++) {
					if (index === i) {
						this.studyList[i].type = 'success'
					} else {
						this.studyList[i].type = 'info'
					}
				}
			},
			dataTotalChange(index) {
				this.dataTotalSwiperCurrent = index;
				for (var i = 0; i < this.dataTotalList.length; i++) {
					if (index === i) {
						this.dataTotalList[i].type = 'success'
					} else {
						this.dataTotalList[i].type = 'info'
					}
				}
			},
			companySearch() {
				if(this.companyIsActive) {
					this.sortByKey(this.companyData, 'courseNum')
				} else {
					this.companyData.reverse()
				}
				this.companyIsActive = !this.companyIsActive
			},
			personalSearch() {
				if(this.personalIsActive) {
					this.sortByKey(this.personData, 'courseNum')
				} else {
					this.personData.reverse()
				}
				this.personalIsActive = !this.personalIsActive
			},
			sortByKey(array, key) {
				return array.sort((a, b) => {
					var x = a[key];
					var y = b[key];
					return ((x < y) ? -1 : (x > y) ? 1:0)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 20rpx;
		background: url('https://xksv.atx.net.cn/xcx_static/img/bigdatabg.jpg');
		
		.fire-control-room{
			.title{
				height: 100rpx;
				line-height: 100rpx;
				color: #FFFFFF;
			}
			
			.firl-total{
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.total{
					width: 48%;
					height: 150rpx;
					border-radius: 10rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: rgba($color: #010853, $alpha: 0.5);
					position: relative;
					
					.total-title{
						position: absolute;
						left: 20rpx;
						top: 20rpx;
						color: #FFFFFF;
					}
					
					.number{
						font-size: 48rpx;
						font-weight: 900;
						color: #FFFFFF;
					}
				}
			}
		}
		
		.personnel-manage{
			.title{
				height: 100rpx;
				line-height: 100rpx;
				color: #FFFFFF;
			}
			
			.manage-list{
				padding: 20rpx 20rpx 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				background-color: rgba($color: #010853, $alpha: 0.5);
				
				.list-item{
					width: 48%;
					height: 100rpx;
					line-height: 100rpx;
					margin-bottom: 20rpx;
					text-align: center;
					background-color: #297B5E;
					color: #FFFFFF;
					
					span{
						padding-left: 20rpx;
					}
				}
			}
		}
		
		.real-time-info{
			.title{
				height: 100rpx;
				line-height: 100rpx;
				color: #FFFFFF;
			}
			
			.real-time-info-list{
				padding: 20rpx;
				background-color: rgba($color: #010853, $alpha: 0.5);
				
				.list-content{
					height: 250rpx;
					overflow: hidden;
					
					.item{
						height: 50rpx;
						line-height: 50rpx;
						display: flex;
						justify-content: space-between;
						
						.item-content{
							flex: 1;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							color: #FFFFFF;
						}
						
						.item-date{
							width: 150rpx;
							text-align: right;
							color: #FFFFFF
						}
					}
					
					.animate-up {
						transition: all 0.5s ease-in-out;
						transform: translateY(-50rpx);
					}
				}
			}
		}
		
		.study{
			.study-title{
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.title{
					height: 100rpx;
					line-height: 100rpx;
					color: #FFFFFF;
				}
				
				.tabs{
					width: 200rpx;
					display: flex;
					justify-content: space-between;
				}
			}
			
			.study-content{
				padding: 20rpx;
				background-color: rgba($color: #010853, $alpha: 0.5);
				
				.study-content-table-title{
					height: 90rpx;
					display: flex;
					align-items: center;
					justify-content: space-around;
					color: #FFFFFF;
					
					.th{
						width: 25%;
						text-align: center;
					}
					
					.time-long{
						.icon{
							margin-left: 10rpx;
						}
					}
				}
				
				.study-content-table-body{
					height: 210rpx;
					
					.tr{
						height: 70rpx;
						display: flex;
						align-items: center;
						justify-content: space-around;
						
						.td{
							width: 25%;
							text-align: center;
							color: #FFFFFF;
						}
					}
				}
			}
		}
		
		.todayStudy{
			.title{
				height: 100rpx;
				line-height: 100rpx;
				color: #FFFFFF;
			}
			
			.chart{
				height: 300rpx;
				padding: 20rpx;
				background-color: rgba($color: #010853, $alpha: 0.5);
				
				.charts{
					width: 100%;
					height: 100%;
				}
			}
		}
		
		.data-total{
			.data-total-title{
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.title{
					height: 100rpx;
					line-height: 100rpx;
					color: #FFFFFF;
				}
				
				.tabs{
					width: 300rpx;
					display: flex;
					justify-content: space-between;
				}
			}
			
			.data-total-body{
				background-color: rgba($color: #010853, $alpha: 0.5);
				
				.swiper-item{
					
					.qiun-charts{
						width: 100%;
						height: 100%;
						padding: 20rpx;
					}
				}
			}
		}
	}
	
	.animation{
		transform: rotate(360deg);
		transition: transform 1s linear;
	}
</style>
