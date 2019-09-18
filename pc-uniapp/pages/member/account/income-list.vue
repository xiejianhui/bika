<template>
	<view class="pageBg pdt20" >
		
		<view class="info background-white mg20 pd20 bdb mgt20" v-for="(item,index) in incomeList" :key='index'>
			<view class="info-lef">
				<view class="infoHeader betweenBox">
					<text class="fs30">{{item.remarks}}</text>
					<text class="money primary-color fs36">{{item.operate?'+':'-'}}{{item.num}}</text>
				</view>
				<view class=" betweenBox">
					<text class="gray">{{item.createDate}}</text>
					<text class="green stating" v-if="item.status==2">已通过</text>
					<text class="primary-color status" v-if="item.status==1">申请中</text>
					<text class="red status" v-if="item.status==3">已拒绝</text>
				</view>
			</view>
		</view>
		<no-data v-if="!incomeList.length"></no-data>
	
	</view>
	
	<!-- <view class="">
		<view class="incomeDetail">
			<view class="incomeTitle">
				<view class="blueBg">
					<text class="time">时间</text>
					<text class="amount">金额</text>
					<text class="remarks">备注</text>
				</view>
			</view>
			<view class="incomeTitle incomeSchedules">
				<view v-for="(item,key) in incomeList" :key='key' class="bdb">
					<text class="time gray">{{item.createDate}}</text>
					<text class="amount" :class="item.operate?'green':'red'">{{item.operate?'+':'-'}}{{item.num}}</text>
					<text class="remarks gray" >{{item.remarks}}</text>
				</view>
				<no-data v-if="!incomeList.length"></no-data>
			</view>
		</view>
	</view> -->
	
</template>

<script>
	import noData from '@/components/no-data.vue'
	export default {
		data() {
			return {
				current: 1,
				incomeList: [],
				autoId: '',
				count: 0,
				pages:1,
				noMoreData:false,
			};
		},
		components:{
			noData
		},
		onPullDownRefresh() {
			this.current = 1;
			this.incomeList=[];
			this.getList().then(()=>{
				this.getList()
			})
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad() {
			this.getList().then(()=>{
				this.getList()
			})
		},
		onReachBottom() {
			if(this.incomeList.length == 0) return;
			if(this.noMoreData){
				uni.showToast({
					title:'已是最后一页',
					icon:'none',
					duration:1500
				});
				return
			}
			this.getList();
		},
		methods: {
			getList() {
				if(this.pages<this.current) return;
				uni.showLoading({
					title:'加载。。。'
				})
				return new Promise((resolve,reject)=>{
					this.apiUrl.getIncomeList({
						data: {
							current: this.current
						}
					}).then(res => {
						uni.hideLoading();
						if (res.data.status == 1) {
							if(this.current==1){
								this.pages = res.data.data.pages;
							}
							//列表是否加载完提示
							if(res.data.data.pages==this.current){
								this.noMoreData = true;
							}
							let arr = res.data.data.pageList;
							arr.forEach(item => {
								item.createDate = this.format(item.createDate);
							})
							this.incomeList = this.incomeList.concat(arr)
							this.current += 1;
							console.log(this.incomeList)
							resolve()
						}
					})
				}).catch((e) => {});
			}
		}
	}
</script>

<style lang="less">
	
// 	.skbg {
// 		background-color: #e3f8ff;
// 	}
// 
// 	.mf-title {
// 		>view {
// 			text-align: center;
// 			flex: 1;
// 		}
// 	}
// 
// 	.incomeDetail {
// 		.incomeTitle {
// 			>view{
// 				overflow: hidden;
// 			}
// 			text {
// 				font-size: 30upx;
// 				text-align: center;
// 				height: 80upx;
// 				line-height: 80upx;
// 				float: left;
// 				width: 200upx;
// 			}
// 			.time{
// 				width: 350upx;
// 				text-indent: 6upx;
// 				flex: 2.5;
// 			}
// 			.remarks{
// 				width: 200upx;
// 				flex: 2;
// 			}
// 		}
// 
// 		.blueBg {
// 			background-color: #eefbff;
// 		}
// 	}
.pageBg{
	background: #FFFFFF;
	.fs30{
		font-family:PingFangSC-Regular;
		font-size: 30upx;
		color: #333333;
		opacity: 0.8;
	}
}
.pdt20{
	padding: 20upx 0 124upx 0;
}
.gray{
	margin-top: 12upx;
	width: auto;
	height:33upx;
	font-size:24upx;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:rgba(101,101,101,1);
	line-height:33upx;
	opacity: 0.8;
}
.fs36{
	width: auto;
	height:50upx;
	font-size:36upx;
	font-family:PingFangSC-Semibold;
	font-weight:600;
	color:rgba(51,51,51,1);
	line-height:50upx;
}
.status{
	height:33upx;
	font-size:24upx;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:rgba(255,48,41,1);
	line-height:33upx;
	margin-top: 6upx;
}
.betweenBox .stating{
	color: #999999;
}
.info{
	height: 160upx;
	margin: 0 0 0 30upx;
	padding: 40upx 30upx 30upx 0upx;
	line-height: 50upx;
	box-sizing:border-box;
}
</style>
