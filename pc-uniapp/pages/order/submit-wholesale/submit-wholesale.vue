<template>
	<view class="pageBg" v-if="product">
		<view class="pd20 sc-top background-white">
			<view class="mgUrl"><image class="imgUrl" :src="product.appProductOrderList[0].imageUrl" mode="widthFix"></image></view>
			<view>
				<view class="mgl20 fs30 zhedie">{{ product.appProductOrderList[0].productName }}</view>
				<view class="packageType">套餐: {{ product.appProductOrderList[0].packageType }}</view>
			</view>
		</view>
		<view class="background-white">
			<navigator url="/pages/addressManage/addressManage"><address-using :arrow="true" :receiving="false"></address-using></navigator>
		</view>
		<form @submit="submit">
			<view class="background-white mhBox">
				<view class="mgt20 blues fs30 pd20 background-white bdb">
					<text>提货信息</text>
					<text class="fs24">（可提货量{{ product.appProductOrderList[0].mayAmout }}）</text>
				</view>
				<view class="mgl20 pd20 background-white flex bdb fs30">
					<view class="w200">提货数量</view>
					<input type="number" placeholder="请输入提货数量" v-model="num" @blur="fixedNum" />
				</view>
				<view class="mgl20 pd20 background-white flex">
					<view class="w200">安全密码</view>
					<view class="flex-box" style="flex:2;">
						<input type="text" style="flex:2;" :password="!showPassword" class="fs30" placeholder="请输入安全密码" v-model="code" />
						<text class="password-mode" @tap="showPassword=!showPassword">{{showPassword? '隐藏':'显示'}}</text>
					</view>
				</view>
			</view>
			<button class="blue-btn mgt40 primary-background" formType="submit" :class="code && num ? '': 'btnShow'" :disabled="num == '' && code == ''">确定</button>
			<!--<agree-pop :type="5"></agree-pop>-->
		</form>
	</view>
</template>

<script>
import agreePop from '@/components/agreement-pop.vue';
import addressUsing from '@/components/address-using.vue';
import { mapState, mapMutations } from 'vuex';
import md5 from '@/common/md5.js'

export default {
	data() {
		return {
			index: null,
			package: ['258套餐', '358套餐', '458套餐', '558套餐', '658套餐'],
			num: '',
			code: '',
			product: null,
			showPassword:false,
			allowRquest:true
		};
	},
	computed: mapState(['activeAddress']),
	components: {
		addressUsing,
		agreePop
	},
	onLoad(e) {
		if(e.orderId != undefined){
			this.getOrderDetail(e.orderId)
		}else{
			uni.getStorage({
				key: 'jsProduct',
				success: res => {
					this.product = res.data;
				}
			});
		}
	},
	methods: {
		getOrderDetail(id){
			this.apiUrl
				.getOrderDetail({
					data: {
						orderId: id
					}
				})
				.then(res => {
					if(res.data.status==1&&res.data.data){
						res.data.data.appProductOrderList = this.setImgSize(res.data.data.appProductOrderList,'400x400');
						this.product = res.data.data
					}
				});
		},
		fixedNum(evt) {
			console.log(evt);
			if (evt.detail.value == 0) {
				this.num = 1;
				uni.showToast({
					title: '寄售数量至少为 1',
					mask: false,
					icon: 'none',
					duration: 1500
				});
			}
			if (evt.detail.value > this.product.appProductOrderList[0].mayAmout) {
				this.num = this.product.appProductOrderList[0].mayAmout;
				uni.showToast({
					title: '可寄售数量只有 ' + this.product.appProductOrderList[0].mayAmout,
					mask: false,
					icon: 'none',
					duration: 1500
				});
			}
		},
		changepackage(e) {
			this.index = e.target.value;
		},
		submit() {
			let str;
			!this.code ? (str = '请输入支付密码') : '';
			!this.num ? (str = '请输入提货数量') : '';
			if (str) {
				uni.showToast({
					title: str,
					mask: false,
					icon: 'none',
					duration: 1500
				});
				return;
			}
			if (!this.activeAddress) {
				uni.showToast({
					title: '请选择收货地址',
					mask: false,
					duration: 1500
				});
				return;
			}
			if(!this.allowRquest) return
			this.allowRquest = false;
			let data = {
				num: this.num,
				orderId: this.product.id,
				paypwd: md5('TPSHOP' + this.code),
				type: 2, //1-寄售，2提货
				address: this.activeAddress.address,
				city: this.activeAddress.city,
				consignee: this.activeAddress.consignee,
				district: this.activeAddress.district,
				mobile: this.activeAddress.mobile,
				province: this.activeAddress.province
			};
			uni.showLoading({
				title:'请稍候',
				mask:true
			})
			this.apiUrl
				.consignProduct({
					data
				})
				.then(res => {
					uni.hideLoading();
					this.allowRquest = true;
					if (res.data.status == 1) {
						uni.showToast({
							title: '提交成功',
							duration: 2000,
							icon: 'success'
						});
						setTimeout(function() {
							uni.getStorage({
								key:'consignment',
								success: (res) => {
									uni.redirectTo({
										url:'/pages/order/wholesale-list/wholesale-list'
									})
								},
								fail() {
									uni.navigateTo({
										url:'/pages/order/wholesale-list/wholesale-list',
										animationType: 'pop-in',
										animationDuration: 200
									})
								}
							})
						}, 1000);
					}
				});
		}
	}
};
</script>

<style lang="less" scoped>
.pageBg{
	background: #FFFFFF;
	.blue-btn{
		width:670upx;
		height:90upx;
		border-radius:50upx;
		line-height: 90upx;
	}
	.btnShow{
		background: #E5E5E5;
		color: #FFFFFF;
	}
	.btnShow:after{
		border: none;
	}
	.address{
		border-bottom: 1upx solid #E5E5E5;
	}
	.background-white .pageBd{
		border-bottom: 1upx solid #f5f5f5;
		.title-black{
			font-size:36upx;
			font-family:PingFangSC-Medium;
			font-weight:500;
			color:rgba(51,51,51,1);
			.mgr20{
				margin-right: 18upx;
			}
			.mgl20{
				margin-left: 20upx;
			}
		}
	}
	.packageType{
		height:33upx;
		font-size:24upx;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(153,153,153,1);
		line-height:33upx;
	}
	.mhBox{
		.mgl20{
			margin: 0 40upx;
			width: 670upx;
			padding: 37upx 0;
			font-size:32upx;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(51,51,51,1);
			border-bottom:1upx solid #E5E5E5;
			.w200{
				width: 212upx;
			}
		}
	}
	.blues{
		padding: 70upx 0 30upx 40upx;
		margin: 0;
		border-radius: 0;
		font-size:36upx;
		font-family:PingFangSC-Medium;
		font-weight:500;
		color: #333333;
		border-bottom:none;
		.fs24{
			font-size:26upx;
			font-family:Regular;
			font-weight:400;
			color:#999999;
		}
	}
}

.zhedie {
	width:420upx;
	height:80upx;
	font-size:28upx;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:rgba(0,0,0,1);
	line-height:40upx;
	padding: 0;
	margin: 15upx 0 6upx 0;
	white-space: normal;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}
.sc-top {
	display: flex;
	margin: 30upx;
	padding: 30upx;
	background:rgba(255,255,255,1);
	box-shadow:0upx 10upx 29upx 0upx rgba(235,235,235,1);
	border-radius:20upx;
	.mgUrl{
		height: 150upx;
		width: 150upx;
		margin-right: 30upx;
		.imgUrl{
			height: 150upx;
			width: 150upx;
		}
	}
	> view {
		line-height: 40upx;
	}
}
</style>
