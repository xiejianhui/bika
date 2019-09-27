<template>
	<view class="pageBgW boxs-b" >
		<view class="title flex-align color9">历史开户人</view>
		<view class="info background-white bdbe relative" v-for="(item,index) in incomeList" :key='index'>
			<view class="info-lef fs30 color3 flex-align fw600">
				{{item.remarks}}
			</view>
			<view class="infoHeader flex-align">
				<text class="fs26">{{item.remarks}}</text>
				<text class="fs26">{{item.remarks}}</text>
			</view>
			<view class="close absolute" @click="close">
				<image src="/static/img/self/account-btn-guanbi@2x.png"></image>
			</view>
		</view>
		<no-data v-if="!incomeList.length"></no-data>
	
	</view>
	
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
			close(){
				uni.showModal({
					title: '提示',
					content: '是否确定删除',
					success: res => {
						if (res.confirm) {
							this.apiUrl
								.delCard({
									data: {
										id: this.selectBank.id
									}
								})
								.then(res => {
									if (res.data.status == 1) {
										uni.showToast({
											title: '删除成功',
											duration: 1000,
											icon: 'none'
										});
										setTimeout(() => {
											this.incomeList = [];
											this.getList();
										}, 1000);
									}
								});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
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
.title{
	width:750upx;
	height:70upx;
	background:rgba(249,249,249,1);
	font-size: 27upx;
	padding-left: 42upx;
}
.close{
	top: 68upx;
	right: 38upx;
	width: 44upx;
	height: 44upx;
	image{
		width: 44upx;
		height: 44upx;
	}
}
.info {
	height: 72upx;
	padding: 27upx 38upx 27upx 36upx;
	.info-lef{
		margin-bottom: 18upx;
		height: 30upx;
		.infoHeader{
			.fs26{
				color: 888888;
			}
			.txt{
				padding-left: 6upx;
				margin-left: 6upx;
			}
		}
	}
}

</style>
