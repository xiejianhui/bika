<template>
	<view class="pageBg pdt20" >
		
		<view class="info background-white mg20 pd20 bdb mgt20" v-for="(item,index ) in list" :key='item.id' @tap="goDetail(item.id)">
			<view class="info-lef">
				<view class="infoHeader betweenBox">
					<text class="fs30">{{item.bankName}}（尾号{{item.accountNo}}）</text>
					<text class="money primary-color fs36">{{item.applyAmount}}</text>
				</view>
				<view class=" betweenBox">
					<text class="gray">{{item.applyTime}}</text>
					<text class="green stating" v-if="item.status==2">已通过</text>
					<text class="primary-color status" v-if="item.status==1">申请中</text>
					<text class="red status" v-if="item.status==3">已拒绝</text>
				</view>
			</view>
			<view class="info-right">
				<uni-icons style="position: relative;top: -2upx;" type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<no-data v-if="!list.length"></no-data>

	</view>
</template>
<script>
	import myMixin from '../../../common/myMixin.js'
	import noData from '@/components/no-data';

	export default{
		data(){
			return {
				current:1,
				list:[],
				noMoreData:false,
			}
		},
		mixins:[myMixin],
		onPullDownRefresh() {
			this.current = 1;
			this.list=[];
			
			setTimeout( ()=>{
				 this.getList()
			}, 100);
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad() {
			this.getList()
		},
		onReachBottom() {
			if(this.list.length == 0) return;
			if(this.noMoreData){
				uni.showToast({
					title:'已是最后一页',
					icon:'none',
					duration:1500
				});
				return
			}
			this.getList()
		},
		components: { 
			noData
		},
		methods:{
			goDetail(id){
				uni.navigateTo({
					url:'cashdetail-info?id='+id
				})
			},
			getList(){
				this.apiUrl.getCashList({data:{
					current:this.current
				}}).then(res=>{
					if(res.data.status ==1){
						let arr = res.data.data.pageList;
						//列表是否加载完提示
						if(res.data.data.pages==this.current){
							this.noMoreData = true;
						}
						arr.forEach(item=>{
							item.applyTime = this.format(item.applyTime);
							item.accountNo=item.accountNo.slice(-4)
						})
						this.list = this.list.concat(arr);
						console.log(this.list)
						this.current+=1;
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
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
		.info-lef{
			float: left;
			width: 640upx;
		}
		.info-right{
			float: left;
			padding-top: 30upx;
			margin-left: 10upx;
			color: #ADADAD;
		}
	}
</style>
