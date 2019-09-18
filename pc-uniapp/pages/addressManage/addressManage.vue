<template>
	<view class="pageBg address-wrap">
		<view class="background-white mgt20" v-for="(item,index) in list" :key='index'>
			<view class="mgl20 mgtBox" @tap='useAddress(item)'>
				<view class="pd20">
					<view class="fs30 title-black">
						<text class=" name-width">{{item.consignee}}</text>
						<text class="mgl20">{{item.mobile}}</text>
					</view>
					<view class="locate">
						<view class="col-app fs24">{{item.position+item.address}}</view>
					</view>
				</view>
			</view>

			<view class="mgl20 pd20 bdb betweenBox">
				<view class="flex-box">
					<view class="def-circle mgr20" v-if="!item.isDefault" @tap="setDefault(index)">

					</view>
					<image src="/static/img/red-ticket.png" v-else mode="widthFix" class="blueTicket mgr20" @tap="setDefault(index)"></image>
					<text class="col-app">设为默认地址</text>
				</view>
				<view class="betweenBox op-btn">
					<view class="btn-dit btn-del" @tap="goEdit(item.id)">
						编辑
					</view>
					<view class="btn-del" @tap="delAddress(item.id)">
						删除
					</view>
				</view>
			</view>

		</view>

		<view class="addcard white flex-box fs30">
			<navigator url="editAddress/editAddress">
				新建收货地址
			</navigator>
		</view>


	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				list: []
			};
		},
		onPullDownRefresh() {
			this.getAddressList()
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad() {

		},
		onShow() {
			if (!this.memberInfo) uni.redirectTo({url: '/pages/login/login'})
			console.log(this.memberInfo);
			this.getAddressList()
		},
		computed: mapState([
			'memberInfo',
			'activeAddress'
		]),
		methods: {
			useAddress(address) {
				//save address
				uni.setStorage({
					data: address,
					key: 'activeAddress',
					success: (e) => {
						this.$store.commit('saveAddress', address)
						uni.navigateBack()
					}
				})
			},
			getAddressList() {
				this.apiUrl.getAddressList({
					data: {
						memberId: this.memberInfo.id
					}
				}).then(res => {
					if (res.data.status == 1) this.list = res.data.data

				})
			},
			goEdit(id) {
				uni.navigateTo({
					url: '/pages/addressManage/editAddress/editAddress?id=' + id
				})
			},
			setDefault(index) {
				var arr = this.list;
				if (!arr[index].isDefault) {

					this.apiUrl.submitAddress({
						data: {
							id: arr[index].id,
							isDefault: 1,
							address: arr[index].address,
							city: arr[index].city,
							consignee: arr[index].consignee,
							district: arr[index].district,
							mobile: arr[index].mobile,
							position: arr[index].position,
							province: arr[index].province
						}
					}).then(res => {
						if (res.data.status == 1) {
							arr.forEach(item => item.isDefault = 0);
							arr[index].isDefault = 1;
							this.list = arr;
						}
					})
				}
			},
			delAddress(id) {
				uni.showModal({
					title: '提示',
					content: '确定删除该地址吗',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.apiUrl.delAddressById({
								data: {
									id
								}
							}).then(res => {
								console.log(id);
								if (res.data.status == 1) {
									if(this.activeAddress && this.activeAddress.id == id){
										this.$store.commit('delAddress');
									}
									uni.showToast({
										title: '删除成功',
										duration: 2000
									})
									this.getAddressList();
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			}
		}
	}
</script>

<style lang="less" scoped>
	.blueTicket {
		width: 30upx;
	}

	.address-wrap {
		padding-bottom: 100upx;
	}

	.add-btn {
		height: 100upx;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #FC4E29;
	}

	.op-btn {
		.btn-dit{
			margin-right:50upx;
		}
		.btn-del{
			padding: 0 10upx;
			margin-right:20upx;
			color:rgba(101,101,101,1);
		}
	}
	.mgt20 .col-app{
		color:rgba(101,101,101,1) !important;
	}

	.name-width {
		width: auto;
		margin-right: 30upx;
		display: inline-block;
	}

	.locate {
		display: flex;

		image {
			width: 22upx;
			margin-top: 10upx;
		}

		>view {
			width: 560upx;
		}
	}
	.addcard {
		width: 670upx;
		height: 90upx;
		font-size: 34upx;
		line-height: 90upx;
		padding: 0upx;
		margin: 60upx 0 0 50upx;
		text-align: center;
		display: block;
		background: #FC4E29;
		border-radius: 90upx;
		color: #ffffff;
		overflow: hidden;

		navigator{
			width: 100%;
			height: 100%;
			border-radius: 90upx;
			overflow: hidden;
		}
	}
	.mgt20{
		margin: 30upx 30upx 0 30upx;
		padding: 50upx 40upx 0upx ;
		background:rgba(255,255,255,1);
		box-shadow:0upx 6upx 14upx 0upx rgba(224,224,224,0.5);
		border-radius:10upx;
		.mgl20 {
			margin-left: 0;
			padding: 0;
		}
		.mgtBox{
			padding-bottom: 10upx;
			border-bottom: 1upx solid #E5E5E5;
		}
		.bdb{
			padding: 35upx 0;
			font-size:28upx;
			font-family:PingFangSC-Light;
			font-weight:300;
			color:rgba(101,101,101,1);
		}
		.mgr20{
			margin-right: 14upx;
		}
		.def-circle{
			width:38upx;
			height:38upx;
			border:2upx solid rgba(208,208,208,1);
		}
		.blueTicket{
			width:38upx;
			height:38upx;
		}
	}
	.title-black{
		width: auto;
		height:48upx;
		font-size:34upx;
		font-family:PingFangSC-Medium;
		font-weight:500;
		color:rgba(51,51,51,1);
		line-height:48upx;
		margin-bottom: 16upx;
	}
</style>
