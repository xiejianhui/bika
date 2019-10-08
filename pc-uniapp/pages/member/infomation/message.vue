<template>
	<view class="bg">
		<view class="message" v-if="message">
			<view class="bdb">
				<view class="mesTitle"><text>{{message.title}}</text></view>
				<view class="mesTime">
					<text>发表时间：</text>
					<text class="mgl10">{{message.createDate}}</text>
				</view>
			</view>
			
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
					this.message.createDate=this.format(this.message.createDate)
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
			padding: 62upx 39upx 50upx 31upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.mesTitle{
				width:auto;
				height:45upx;
				font-size:45upx;
				font-family:PingFangSC-Medium;
				font-weight:600;
				color:rgba(51,51,51,1);
				line-height:45upx;
			}
			.mesContent{
				/* 首行两个空格 */
				text-indent: 2em;
				
				font-size:28upx;
				font-family:PingFangSC-Regular;
				font-weight:500;
				color:rgba(102,102,102,1);
				line-height:50upx;
			}
			.mesTime{
				width:auto;
				height:28upx;
				font-size:28upx;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(153,153,153,1);
				line-height:28upx;
				margin: 28upx 0 25upx 0;
			}
		}
	}
</style>