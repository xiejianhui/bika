<template name="uni-countdown">
	<view class="" :class="{ inblock: !inProduct }">
		<!-- <view class="uni-countdown-numbers" :style="{borderColor:borderColor, color:fontColor, background:bgrColor}">{{d}} </view>天 -->
		<view class="uni-countdown flex-box">
			<!-- <view class="uni-countdown-numbers" :style="{ borderColor: borderColor, color: fontColor, background: bgrColor }">{{ h }}</view>
			{{':'}} -->
			<view class="uni-countdown-numbers" :style="{ borderColor: borderColor, color: fontColor, background: bgrColor }">{{ i }}</view>
			{{':'}}
			<view class="uni-countdown-numbers" :style="{ borderColor: borderColor, color: fontColor, background: bgrColor }">{{ s }}</view>
			{{':'}}
			<view class="uni-countdown-numbers" :style="{ borderColor: borderColor, color: fontColor, background: bgrColor }">{{ m }}</view>
		</view>  
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
	name: 'uni-countdown',
	props: {
		bgrColor: {
			type: String,
			default: '#FE6A72'
		},
		borderColor: {
			type: String,
			default: '#FE6A72'
		},
		fontColor: {
			type: String,
			value: '#ffffff'
		},
		timer: {
			type: [String, Number],
			default: ''
		},
		startTime: {
			type: [String, Number],
			default: ''
		},
		endTime: {
			type: [String, Number],
			default: ''
		},
		inProduct: {
			type: Boolean,
			default: false
		},
		now:{
			type: [String, Number],
			default: ''
		},
	},
	computed:{
		...mapState(['systemInfo'])
	} ,
	
	data() {
		return {
			setTime: null,
			d: '00',
			h: '00',
			i: '00',
			s: '00',
			m:'00',
			leftTime: 0,
			hasStart: false,
			gameOver: false,
			currentTime:0,
		};
	},
	watch:{
		now:function (val,newVal){
			// #ifdef APP-PLUS
			this.hasStart = false; //活动是否开始
			// #endif
			this.currentTime = newVal;
			if (this.startTime < this.currentTime &&this.endTime > this.currentTime){
				this.hasStart = true; //活动是否开始
			}
		}
	},
	created() {
		this.currentTime = this.now;
		if (this.startTime < this.currentTime &&this.endTime > this.currentTime){
			this.hasStart = true; //活动是否开始
		}
		clearInterval(this.setTime);
		// this.countDown(this);
		this.setInterValFunc(this);
		// 毫秒倒计时
		this.$nextTick(() => {
		   this.timeDt(this)
		})
	},
	onShow() {
		clearInterval(this.setTime);
		this.countDown(this);
		this.setInterValFunc(this);
	},
	onHide() {
		clearInterval(this.setTime);
	},
	beforeDestroy() {
		clearInterval(this.setTime);
	},
	methods: {
		timeDt (self) {
			setTimeout(function () {
				var haomiao = 99
				setInterval(function () {
					haomiao--
					if (haomiao < 0) {
					   haomiao = 99
					}
					self.m = haomiao;
				}, 10)
			}, 1000)
		},
		setInterValFunc: function(obj) {
			this.setTime = setInterval(function() {
				obj.countDown(obj);
			}, 1000);
		},
		countDown: function(self) {
			this.currentTime += 1000;
			let leftTime;
			if (this.startTime - this.currentTime >= 0) {
				//unstart
				leftTime = this.startTime - this.currentTime ;
			} else if (this.endTime - this.currentTime >= 0) {
				//ing
				leftTime = this.endTime - this.currentTime;
				if(!this.hasStart){
					this.$emit('activeStart');
					this.hasStart = true;
				}
			} else {
				//end
				this.gameOver = true;
				this.$emit('activeOver');
				clearInterval(this.setTime);
				return;
			}
			if (leftTime > 0) {
				var hours = parseInt(leftTime / 1000 / 60 / 60, 10);
				var minutes = parseInt((leftTime / 1000 / 60) % 60, 10);
				var seconds = parseInt((leftTime / 1000 % 60), 10);
			} else {
				var hours = 0,
					minutes = 0,
					seconds = 0;
				return;
			}
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			self.h = hours;
			self.i = minutes;
			self.s = seconds;
			
		}
	}
};
</script>
<style lang="less" scoped>
.inblock {
	display: flex;
}
.uni-countdown {
	display: flex;
	padding: 2upx 0;
	flex-wrap: nowrap;
	justify-content: center;
}

.uni-countdown-numbers {
	line-height: 56upx;
	width: 32upx !important;
	padding: 0 12upx;
	justify-content: center;
	height: 56upx;
	border-radius: 4upx;
	margin: 0 8upx;
	font-size: 30upx;
	display: flex;
}
</style>
