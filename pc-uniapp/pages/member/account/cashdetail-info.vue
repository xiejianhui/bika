<template>
	<view class="pageBg">
		<view class="pdl20 pdr20 background-white" v-if="detail">
			<view class="pay-amount">
				<view class="gray">出账金额</view>
				<view class="amount">￥{{detail.applyAmount}}</view>
			</view>
			
			<view class="betweenBox pd20 bdb fs30 betweenBox1">
				<text class="gray" >当前状态</text>
				<text class="primary-color " v-if="detail.status==1">申请中</text>
				<text class="green" v-if="detail.status==2">已通过</text>
				<text class="red " v-if="detail.status==3">已拒绝</text>
			</view>
			<view class="betweenBox pd20 bdb fs30" v-if="detail.status==3">
				<text class="gray reject">拒绝原因</text>
				<text class="red">{{detail.remark}}</text>
			</view>
			<view class="betweenBox pd20 bdb fs30">
				<text class="gray">手续费</text>
				<text class="">￥{{detail.serviceCharge}}</text>
			</view>
			
			<view class="betweenBox pd20 bdb fs30 betweenBox2">
				<text class="gray">申请时间</text>
				<text class="">{{detail.applyTime}}</text>
			</view>
			<view class="betweenBox pd20 bdb fs30">
				<text class="gray">银行名称</text>
				<text class="">{{detail.bankName}}</text>
			</view>
			<view class="betweenBox pd20 bdb fs30">
				<text class="gray">开户名</text>
				<text class="">{{detail.accountName}}</text>
			</view>
			<!-- <view class="betweenBox pd20 bdb fs30">
				<text class="gray">实际到账（元）</text>
				<text class="">￥{{detail.applyAmount-detail.serviceCharge}}</text>
			</view> -->
			<view class="betweenBox pd20 bdb fs30">
				<text class="gray">收款账户</text>
				<text class="">{{detail.accountNo}}</text>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail:null
			};
		},
		onLoad(e) {
			this.getDetail(e.id)
		},
		methods: {
			getDetail(id) {
				this.apiUrl.getWidthDrawDetail({data:{
					id
				}}).then(res=>{
					if(res.data.status ==1){
						this.detail = res.data.data;
						this.detail.applyTime = this.format(this.detail.applyTime);
					}
				})
			}
		},
	}
</script>

<style lang="less" scoped>
.pageBg{
	background: #FFFFFF;
	.betweenBox1{
		margin-top: 40upx;
	}
	.betweenBox2{
		margin-top: 50upx;
	}
}
.pdl20 {
	padding: 0 30upx;
}
.pay-amount{
	height: auto;
	width: 100%;
	text-align: center;
	.gray{
		width:auto;
		height:45upx;
		font-size:32upx;
		font-family:PingFangSC-Light;
		font-weight:300;
		color:rgba(101,101,101,1);
		line-height:45upx;
		margin: 50upx 0 8upx 0;
		color: #656565;
	}
	.amount{
		width:auto;
		height:100upx;
		font-size:80upx;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:100upx;
		padding-bottom: 60upx;
		border-bottom: 1upx solid #E5E5E5;
	}
}
.primary-color {
	color: #FF3029;
}
.bdb{
	border-bottom: none;
	padding: 20upx 0upx;
	color: #333333;
	opacity: 0.8;
	font-size: 32upx;
}
.gray{
	width:128upx;
	margin-right: 10upx;
}
.reject{
	width: 300upx;
}
</style>
