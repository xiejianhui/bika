<template>
	<view class="pageBgW receipt">
		<view>
			<image src="/static/img/self/recharge-banner-bg@2x.png"  mode="widthFix" class="w100"></image>
		</view>
		<form @submit="submitReceipt">
			<view class="title-black fw500 fs26 absolute">{{i18n.refillBalance + ':'}}<text class="account">600</text><text class="fs40">{{i18n.rMB}}</text></view>
			<view class="receipt-box absolute">
				<view class="background-white">
					<view :class="item.active == true ? 'rp-btn-fp flex-box active box-b' : 'rp-btn-fp flex-box box-b'" 
						v-for="(item, index) in rechargeList"
						:data-index="index" 
						:data-money="item.costMoney" 
						:key="index" 
						@tap="change">
						<view class="fs36 fw500">
							<text class="fs40">{{ item.costMoney}}</text>
							{{i18n.rMB}}
						</view>
					</view>
					<view class="rp-btn-fp flex-box box-b fs30">
						<view class="fs36 fw500 orange flex-box box-b">
							<input type="text" class="orange" placeholder-style='color:#FE6A72;font-size:30upx'
							:placeholder="i18n.customAmount" 
							v-model="customAmount"/>
						</view>
					</view>
				</view>
			</view>
			<view class="receipt-platform fs34 color6">
				<view class="chose-platform fs40 fw600 color3 flex-align">
					{{i18n.selectionPlatform}}
				</view>
				<radio-group>
					<label class="flex-align radio-group" v-for="(item, index) in platformList" :key="index" @tap="selectGoods(index)">
						<view>
							<view class="def-circle flex-box" :class="{active:item.active}">
								<view class="flex-box" v-if="item.active">
									<image class="button-press" src="/static/img/self/shopping-button-press.png"></image>
								</view>
							</view>
						</view>
						
						<view class="mgl20 fs30">{{ item.value }}</view>
					</label>
				</radio-group>
			</view>
			<button form-type="submit" :class="btnShow ? 'submit-btn btnShow': 'submit-btn'" :disabled="disabled">{{i18n.confirmRecharge}}</button>
			<!-- button按钮改变隐藏域 -->
			<view style="display:none" >{{ exitsVal }}</view>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			customAmount:'',
			addflag:false,
			rechargeMoney:'',
			chose:false,
			platform:'',
			rechargeList: [
				{'costMoney':'30',"active":false},{'costMoney':'50',"active":false},{'costMoney':'100',"active":false},{'costMoney':'150',"active":false},
				{'costMoney':'200',"active":false},{'costMoney':'250',"active":false},{'costMoney':'300',"active":false},{'costMoney':'500',"active":false},
			],
			platformList: [
				{
					value: 'Public bank',
					active: true
				},
				{
					value: ' CIMB bank',
					active: false
				},
				{
					value: ' HLB bank',
					active: false
				},
				{
					value: 'MBB bank',
					active: false
				}
			],
			disabled:true,
			btnShow:false,
			ifExist:0,
		};
	},
	onShow() {
		uni.setNavigationBarTitle({
			title:this.$t('recharge_detail.recharge')
		});
	},
	onLoad() {
		// this.preExisting();
	},
	computed:{
		exitsVal:function(){
			// this.ifExist=Number(Boolean(this.rechargeMoney))+Number(Boolean(this.platform))
			this.ifExist=Number(Boolean(this.rechargeMoney))
		},
		// 多语言
		i18n () {
			return this.$t('recharge_detail')  
		}  
	},
	watch:{
		// 监听data中 ifExist的值
		ifExist(newVal,oldVal){
			console.log(Number(newVal))
			if(Number(newVal) === 1){
				this.disabled = false;
				this.btnShow = true;
			 // 四个input框内都有值时需要做的操作
			}else{
				this.disabled = true;
				this.btnShow = false;
			 // 至少一个没有值
			}
		},
		customAmount:function(newV,oldV){
			// console.log(newV,oldV);
			if(newV != undefined){
				let that = this;
				let arr = this.rechargeList;
				if(this.chose == true){
					this.chose = false;
					return;
				}
				arr.forEach(item => (item.active = false));
				// 判断自定义还是选择支付
				this.rechargeMoney=newV;
			}
		}
	},
	methods: {
		//选择商品
		selectGoods(index) {
			let arr = this.platformList;
			arr.forEach(item => (item.active = false))
			arr[index].active = !arr[index].active;
			this.platformList = arr;
			this.platform = arr[index].value;
		},
		
		change(e) {
			let arr = this.rechargeList;
			this.customAmount = '';
			this.chose = true;
			arr.forEach(item => (item.active = false))
			arr[e.currentTarget.dataset.index].active = true;
			this.rechargeList = arr;
			this.rechargeMoney = e.currentTarget.dataset.money;
		},
		preExisting(){
			this.apiUrl
				.submitRegister({
					data: this.memberInfo.id
				})
				.then(
					res => {
						if (res.data.status == 1) {
							this.rechargeList = res.data.data.rechargeList;
							this.platformList = res.data.data.platformList;
							return
						} else {
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: res.data.message
							});
						}
					},
					err => {}
				);
		},
		submitReceipt() {
			if (this.addflag) return;
			this.addflag = true;
			let parm = {
				rechargeMoney:this.rechargeMoney,
				platform:this.platform,
			};
			uni.showLoading({
				title:'请稍候',
				mask:true
			})
			this.apiUrl
				.submitRegister({
					data: parm
				})
				.then(
					res => {
						uni.hideLoading();
						this.addflag = false;
						if (res.data.status == 1) {
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: '调起支付成功'
							});
							return
						} else {
							uni.showToast({
								duration: 1500,
								icon: 'none',
								title: res.data.message
							});
						}
					},
					err => {}
				);
		}	
	}
};
</script>

<style lang="less">
.receipt{
	.w100{
		height: 328upx !important;
	}
	.title-black{
		top: 67upx;
		left: 0;
		height:50upx;
		color:rgba(255,197,205,1);
		line-height:50upx;
		margin: 0upx 0 0upx 35upx;
		.account{
			font-size: 60upx;
			font-weight: 400;
			font-family: PingFangSC-Medium;
			color: #FFFEFE;
		}
	}
	.receipt-box{
		top: 140upx;
		left: 0;
		margin: 0 38upx 0 34upx;
		padding: 37upx 48upx 20upx 48upx;
		background:rgba(255,255,255,1);
		box-shadow:0upx 9upx 21upx 0upx rgba(211,211,211,0.3);
		border-radius:10upx;
	}
	
}

.receipt-platform{
	margin-top: 220upx;
	padding: 0 39upx 0 32upx;
	.chose-platform{
		height:80upx;
		padding-left: 4upx;
	}
	.radio-group {
		height: 44upx;
		padding: 32upx 0 23upx 0;
		border-bottom: 1upx solid #E8E8E8;
		.mgl20{
			margin-left: 28upx;
		}
	}
	.def-circle {
		width: 44upx;
		height: 44upx;
		box-sizing: border-box;
	}
	.button-press{
		width: 44upx;
		height: 44upx;
	}
	.active {
		border: none;
		box-sizing: border-box;
	}
}


.pageBgW{
	background: #FFFFFF;
	.submit-btn {
		width:670upx;
		height:90upx;
		border-radius:50upx;
		margin: 40upx auto;
	}
}

.rp-btn-fp{
	width:167upx;
	height:66upx;
	line-height: 66upx;
	text-align: center;
	margin: 0 40upx 28upx 0;
	border:2upx solid rgba(254,106,114,1);
	border-radius:10upx;
	display: inline-block;
	color: #FE6A72;
	box-sizing: border-box;
	&.active {
		color: #FFFFFF;
		background:rgba(254,106,114,1);
		border-radius:10upx;
		border:1upx solid rgba(254,106,114,1);
		box-sizing: border-box;
	}
	.orange{
		height: 66upx;
		line-height: 66upx;
		uni-input-placeholder{
			color: #FE6A72;
		}
	}
	input{
		height: 100%;
		top: 42%;
	}
}
.rp-btn-fp:nth-child(3n){
	margin: 0 0 28upx 0;
}

</style>
