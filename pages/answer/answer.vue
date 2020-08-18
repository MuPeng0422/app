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
							{{ item.questionTitle }}
						</view>
						<view class="question-option" v-if="item.questionType === 0">
							<view class="option">
								<u-radio-group v-model="item.questionAnswer" :wrap="true" @change="radioGroupChange">
									<u-radio 
										@change="radioChange" 
										v-for="(option, j) in item.questionOptions" :key="j" 
										:name="option.content"
									>
										{{option.content}}
									</u-radio>
								</u-radio-group>
							</view>
						</view>
						<view class="question-option" v-else-if="item.questionType === 1">
							<view class="option">
								<u-checkbox-group v-model="item.questionAnswer" :wrap="true" @change="checkboxGroupChange">
									<u-checkbox 
										@change="checkboxChange" 
										v-for="(option, j) in item.questionOptions" :key="j" 
										:name="option.content"
									>{{option.content}}</u-checkbox>
								</u-checkbox-group>
							</view>
						</view>
						<view class="question-option" v-else-if="item.questionType === 2">
							<view class="option">
								<view class="option-input" v-for="(option, j) in item.questionOptions" :key="j" >
									<u-input v-model="option.questionAnswer['+ j +']" type="text" :border="true" />
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="answer-btn">
				<view class="btn" v-if="prev">
					<u-button @click="handleClickPrev">上一题</u-button>
				</view>
				<view class="btn" v-if="next">
					<u-button @click="handleClickNext">下一题</u-button>
				</view>
				<view class="btn" v-if="submit">
					<u-button type="primary" @click="submit">提交</u-button>
				</view>
			</view>
		</view>
		<u-popup v-model="show" width="80%" height="80%" mode="center" :safe-area-inset-bottom="true" :mask-close-able="false" border-radius="14" :closeable="true">
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
				show: false,
				answerShow: false,
				prev: false,
				next: true,
				submit: false,
				activeIndex: 1,
				subjectTotal: 0,
				timestamp: 86400,
				questionsList: [
					{
						id: 1,
						questionTitle: '单选题',
						questionType: 0,
						questionAnswer: '',
						questionOptions: [
							{
								id: 0,
								content: '选项一'
							},
							{
								id: 1,
								content: '选项二'
							},
							{
								id: 2,
								content: '选项三'
							},
							{
								id: 3,
								content: '选项四'
							}
						]
						
					},
					{
						id: 1,
						questionTitle: '多选题',
						questionType: 1,
						questionOptions: [
							{
								id: 0,
								content: '选项一'
							},
							{
								id: 1,
								content: '选项二'
							},
							{
								id: 2,
								content: '选项三'
							},
							{
								id: 3,
								content: '选项四'
							}
						]
						
					},
					{
						id: 1,
						questionTitle: '多选题',
						questionType: 1,
						questionOptions: [
							{
								id: 0,
								content: '选项一'
							},
							{
								id: 1,
								content: '选项二'
							},
							{
								id: 2,
								content: '选项三'
							},
							{
								id: 3,
								content: '选项四'
							}
						]
						
					},
					{
						id: 1,
						questionTitle: '多选题',
						questionType: 1,
						questionOptions: [
							{
								id: 0,
								content: '选项一'
							},
							{
								id: 1,
								content: '选项二'
							},
							{
								id: 2,
								content: '选项三'
							},
							{
								id: 3,
								content: '选项四'
							}
						]
						
					},
					{
						id: 1,
						questionTitle: '填空题',
						questionType: 2,
						questionOptions: [
							{
								id: 0,
								content: '选项一'
							},
							{
								id: 1,
								content: '选项二'
							},
							{
								id: 2,
								content: '选项三'
							},
							{
								id: 3,
								content: '选项四'
							}
						]
						
					}
				]
			}
		},
		onLoad() {
			this.show = true
		},
		methods: {
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
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				console.log(e);
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
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
					width: 30%;
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
