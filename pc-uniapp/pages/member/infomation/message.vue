<template>
	<view class="bg">
		<view class="message" v-if="message">
			<view class="mesTitle"><text>{{message.title}}</text></view>
			<view class="mesTime"><text>{{message.createDate}}</text></view>
			<view class="mesContent"><text>{{message.content}}</text></view>
		</view>
	</view>
</template>
<script>
	import myMixin from '../../../common/myMixin.js'

export default{
	data(){
		return {
			message:null
		}
	},
	mixins:[myMixin],
	onLoad(e) {
		this.getDetail(e.id)
	},
	methods:{
		getDetail(id){
			this.apiUrl.getMessageDetail({data:{
				id
			}}).then(res=>{
				if(res.data.status==1){
					console.log("res",res)
					this.message = res.data.data;
					this.message.createDate=this.formatMonth(this.message.createDate)
				}
			})
		}
	},
}
</script>
<style lang='less' scoped>
	.bg{
		
		background-color: #f4f4f4;
		.message{
			background-color: white;
			padding: 40upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.mesTitle{
				width:auto;
				height:65upx;
				font-size:46upx;
				font-family:PingFangSC-Medium;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:65upx;
			}
			.mesContent{
				/* 首行两个空格 */
				text-indent: 2em;
				
				font-size:30upx;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(101,101,101,1);
				line-height:60upx;
			}
			.mesTime{
				width:auto;
				height:40upx;
				font-size:28upx;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(153,153,153,1);
				line-height:40upx;
				margin: 20upx 0 50upx 0;
			}
		}
	}
</style>