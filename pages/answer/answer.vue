<template>
	<view class="content">
		<view class="answer" v-if="answerShow">
			<view class="answer-total">
				<view class="answer-num">
					{{ activeIndex }} / {{ subjectTotal }}
				</view>
				<view class="answer-time">
					<u-count-down ref="uCountDown" :timestamp="timestamp" :show-days="false" @change="change"></u-count-down>
				</view>
			</view>
			<view class="answer-list">
				<view class="answer-list-item">
					<view v-for="(item, index) in questionsList" class="item" v-if="activeIndex === (index + 1)" :key="index">
						<view class="question-title">
							{{ item.questionName }}
						</view>
						<!-- 单选题 -->
						<view class="question-option" v-if="item.questionType === 0">
							<view class="option">
								<u-radio-group v-model="item.answer" :wrap="true" @change="radioGroupChange">
									<u-radio 
										@change="radioChange" 
										v-for="(option, j) in item.optionList" :key="j" 
										:name="option.optionName"
									>
										{{ option.optionName }}、{{ option.optionText}}
									</u-radio>
								</u-radio-group>
							</view>
						</view>
						<!-- 填空题 -->
						<view class="question-option" v-else-if="item.questionType === 1">
							<view class="option">
								<view class="option-input" v-for="(option, j) in item.optionList" :key="j" >
									<u-input v-model="item.answer[j]" type="text" :border="true"/>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="answer-btn">
				<view class="btn" v-if="prev">
					<u-button :disabled="disabled" @click="handleClickPrev">上一题</u-button>
				</view>
				<view class="btn" v-if="next">
					<u-button @click="handleClickNext">下一题</u-button>
				</view>
				<view class="btn" v-if="submit">
					<u-button type="primary" :loading="loading" @click="handleClickSubmit">提交</u-button>
				</view>
			</view>
		</view>
		<u-popup v-model="show" width="80%" height="80%" mode="center" :safe-area-inset-bottom="true" :mask-close-able="false" border-radius="14" :closeable="false">
			<view class="popup-container">
				<view class="popup-title">
					答题注意事项
				</view>
				<view class="popup-list">
					<view class="popup-list-item">
						1.考核注意事项
					</view>
					<view class="popup-list-item">
						1.考核注意事项
					</view>
					<view class="popup-list-item">
						1.考核注意事项
					</view>
				</view>
				<view class="start-btn">
					<u-button type="primary" @click="startAnswer">我已知晓，开始答题</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				res: {},
				show: false,
				answerShow: false,
				prev: false,
				next: true,
				submit: false,
				loading: false,
				disabled: false,
				activeIndex: 1,
				subjectTotal: 0,
				timestamp: 86400,
				questionsList: []
			}
		},
		onLoad(data) {
			this.show = true
			const item = JSON.parse(decodeURIComponent(data.data));
			this.res.token = item.token
			this.res.userId = item.userId
			this.res.type = item.type
			this.getQuestion(item.data)
		},
		methods: {
			getQuestion(data) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].questionType === 0) {
						const row = {}
						row.id = data[i].id
						row.questionName = data[i].questionName
						row.questionType = data[i].questionType
						row.questionAnswer = data[i].questionAnswer
						row.optionList = data[i].optionList
						row.questionScore = data[i].questionScore
						row.answer = ''
						this.questionsList.push(row)
					} else if (data[i].questionType === 1) {
						const row = {}
						row.id = data[i].id
						row.questionName = data[i].questionName
						row.questionType = data[i].questionType
						row.questionAnswer = data[i].questionAnswer
						row.optionList = data[i].answerSum
						row.questionScore = data[i].questionScore
						row.answer = []
						this.questionsList.push(row)
					}
				}
			},
			handleClickSubmit() {
				const data = []
				for (var i = 0; i < this.questionsList.length; i++) {
					let row = {}
					row.questionId = this.questionsList[i].id
					row.userId = this.res.userId
					row.type = this.questionsList[i].questionType
					row.score = this.questionsList[i].questionScore
					if (row.type === 0) {
						row.answerStr = this.questionsList[i].answer
					} else if (row.type === 1) {
						row.answerStr = this.questionsList[i].answer.join(',')
					}
					data.push(row)
				}
				this.loading = true
				this.disabled = true
				this.$http.post('/question/submitQuestin', data, {
					header: {
						'Authentication': this.res.token
					}
				}).then((res) => {
					if (res.data.code === 200) {
						this.loading = false
						this.disabled = false
						uni.showToast({
							title: res.data.message,
							icon: 'block',
							duration: 1000,
							success: () => {
								setTimeout(() => {
									uni.navigateBack();
									
									// 返回刷新
									let page = getCurrentPages().pop(); //跳转页面成功之后
									if (!page) return;
									page.onLoad();
									return true
								}, 1000)
							}
						})
					}
				})
			},
			handleClickPrev() {
				this.activeIndex--
				this.getActiveIndex()
			},
			handleClickNext() {
				this.activeIndex++
				this.getActiveIndex()
			},
			getActiveIndex() {
				if(this.activeIndex === 1) {
					this.prev = false
					this.submit = false
				} else if(this.activeIndex < this.subjectTotal) {
					this.prev = true
					this.next = true
					this.submit = false
				} else {
					this.next = false
					this.submit = true
				}
			},
			startAnswer() {
				this.show = false
				this.answerShow = true
				this.subjectTotal = this.questionsList.length
			},
			// 倒计时监听
			change(timestamp) {
				// console.log(timestamp);
			},
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log(e);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding-top: 10rpx;
		height: 100%;
		
		.answer{
			height: 100%;
			padding: 20rpx;
			background-color: #FFFFFF;
			
			.answer-total{
				margin-bottom: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			
			.answer-list{
				margin-bottom: 100rpx;
				
				.answer-list-item{
					.item{
						.question-title{
							font-size: 36rpx;
							margin-bottom: 20rpx;
						}
						
						.question-option{
							.option{
								.option-input{
									margin-bottom: 20rpx;
								}
							}
						}
					}
				}
			}
			
			.answer-btn{
				width: 100%;
				display: flex;
				justify-content: space-around;
				
				.btn{
					width: 40%;
				}
			}
		}
		
		.popup-container{
			padding: 50rpx;
			
			.popup-title{
				width: 100%;
				line-height: 60rpx;
				font-size: 36rpx;
				text-align: center;
			}
			
			.popup-list{
				.popup-list-item{
					line-height: 50rpx;
				}
			}
			
			.start-btn{
				width: 80%;
				margin: 100rpx auto 0;
			}
		}
	}
</style>
