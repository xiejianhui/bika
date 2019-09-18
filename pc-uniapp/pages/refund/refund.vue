<template>
	<view>
		<view class="note pd40">
			<view class="title">
				温馨提示：
			</view>
			<view class="">
				1. 限时特价、预约资格等购买优惠可能一并取消；
			</view>
			<view class="">
				2. 如遇订单拆分、使用优惠券无法返还；
			</view>
			<view class="">
				3. 支付余额，抵扣余额积分都按原路退款；
			</view>
			<view class="">
				4. 订单一旦取消，无法恢复。
			</view>
		</view>
		<form @submit="makeRefund">
			<view class="refund-list bdb pd20">
				<view class="left fs30">
					退款原因
				</view>
				<view class="right betweenBox"  @click='showBox'>
					{{reasons[current].name}}
					<view class="r-icon">
						<uni-icon class='' type='arrowright' size='20'></uni-icon>
					</view>
				</view>
			</view>
			<view class="refund-list bdb pd20">
				<view class="left fs30">
					联系人
				</view>
				<view class="right">
					<input type="text" class="fs30" placeholder="请输入联系人" v-model="refundContacts" />
				</view>
			</view>
			<view class="refund-list bdb pd20">
				<view class="left fs30">
					手机号
				</view>
				<view class="right">
					<input type="text" class="fs30" placeholder="请输入手机号"  v-model="refundPhone" />
				</view>
			</view>
			<button class="refund-btn flex-box white fs30" formType="submit" :class="refundContacts == '' && refundPhone == '' ? 'btnShow': ''" :disabled="refundContacts == '' && refundPhone == ''">
				申请退款
			</button>
			
			<!-- 发票弹框 -->
			<view v-if='!hideBox' class='box'>
				<view class='box-bg'></view>
				<view class='box-main'>
					<!-- 退款原因 -->
					<view class="background-white mgt40 paymgt">
						<view class="order-fpTag fs20">退款原因</view>
						<view class="order-close" @click='showBox'>
							<image class="img-close" src="/static/img/closed.png"></image>
						</view>
						<view class="paymgt-box">
							<radio-group @change="radioChange">
								<label class="pdf box-item" v-for="(item, index) in reasons" :key="index">
									<view class="box-radio"><radio :value="item.value" :checked="item.value == current" style="transform:scale(0.8)"/></view>
									<view class="flex-box fs30">
										{{ item.name }}
									</view>
								</label>
							</radio-group>
						</view>
						<button class="reason-btn flex-box white fs30" @click="reasonsChange">
							确定
						</button>
					</view>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				reasons:[
					{
						value: '0',
						name: '订单不能按预计时间送达'
					},
					{
						value: '1',
						name: '操作有误（商品、地址等选错）'
					},
					{
						value: '2',
						name: '重复下单/误下单'
					},
					{
						value: '3',
						name: '其他渠道价格更低'
					},
					{
						value: '4',
						name: '该商品降价了'
					},
					{
						value: '5',
						name: '不想买了'
					},
					{
						value: '6',
						name: '其他原因'
					}
				],
				index:0,
				orderId:null,
				refundContacts:'',
				refundPhone:'',
				hideBox: true,
				current: 0,
				currents:0
			};
		},
		onLoad(e){
			this.orderId = e.id;
		},
		methods:{
			// 关闭退款原因弹框
			showBox() {
				this.hideBox = !this.hideBox;
			},
			// 退款原因选择
			radioChange: function(evt) {
				for (let i = 0; i < this.reasons.length; i++) {
					if (this.reasons[i].value == evt.target.value) {
						// this.current = evt.target.value;
						this.currents = evt.target.value;
						break;
					}
				}
			},
			reasonsChange: function(evt) {
				this.current = this.currents;
				this.showBox();
			},
			getOrderDetail(id){
				this.apiUrl
					.getOrderDetail({
						data: {
							orderId: id
						}
					})
					.then(res => {
						console.log(res);
						if (res.data.status == 1) {
							let checkingOrder = res.data.data;
							console.log(checkingOrder);
							uni.setStorageSync('checkingOrder',checkingOrder)
							setTimeout(()=>{
								uni.navigateBack();
							},1500)
						}
					});
			},
			makeRefund(){
				if(!this.refundContacts||!this.refundPhone){
					uni.showToast({
						title: '请填写完整资料',
						mask: false,
						icon:'none',
						duration: 1500
					});
					return	
				}
				uni.showLoading({
					title: '正在申请退款',
					duration: 1500
				})
				this.apiUrl.applyRefund({data:	{
					disagreereason:this.reasons[this.current].name,
					orderId:this.orderId,
					refundContacts:this.refundContacts,
					refundPhone:this.refundPhone
				}}).then(res=>{
					uni.hideLoading()
					if(res.data.status ==1){
						uni.showToast({
							title: '您的申请已提交成功，等待客服处理',
							mask: false,
							duration: 1500,
							icon:'none',
							success:()=>{
								this.getOrderDetail(this.orderId);
							}
						});
					}
				})
			},
			changepick(e){
				this.index = e.target.value
			}
		}
	}
</script>

<style lang="less" scoped>
.mgt40{
	position: relative;
	box-sizing: border-box;
	padding:40upx 40upx 20upx 40upx;
	margin:0;
	.box-item{
		display: flex;
		padding-top: 55upx;
		height:45upx;
		line-height: 45upx;
		font-size:32upx;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(51,51,51,1);
		.flex-box{
			height:45upx;
			font-size:32upx;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(101,101,101,1);
			line-height:45upx;
		}
		.box-radio{
			width: 44upx;
			height: 44upx;
			line-height: 44upx;
			margin-right:30upx;
			margin-top: -8upx;
		}
	}
	.order-fpTag {
		width: 100%;
		text-align: center;
		height: 60upx;
		font-size:36upx;
		font-family:PingFangSC-Medium;
		font-weight:500;
		color:rgba(51,51,51,1);
	}order-fpTag {
		width: 100%;
		text-align: center;
		height: 60upx;
		font-size:36upx;
		font-family:PingFangSC-Medium;
		font-weight:500;
		color:rgba(51,51,51,1);
	}
	.order-close{
		position: absolute;
		top: 50upx;
		right: 45upx;
		height: 30upx;
		width: 30upx;
		color:#CECECE;
		.img-close{
			height: 30upx;
			width: 30upx;
			margin: 4upx;
		}
	}
}
.btnShow{
	background: #E5E5E5;
	color: #FFFFFF;
}
.btnShow:after{
	border: none;
}
.pd20{
	padding: 37upx 40upx;
	border-bottom: 1px solid #E5E5E5;
	font-size:32upx;
	font-family:PingFangSC-Regular;
	font-weight:400;
	color:rgba(51,51,51,1);
}
.refund-btn{
	width: 600upx;
	height: 80upx;
	background: #FC4E29;
	border-radius: 40upx;
	margin: 50upx auto;
}
.reason-btn{
	width: 670upx;
	height: 80upx;
	background: #FC4E29;
	border-radius: 40upx;
	margin: 34upx auto 0;
}
.refund-list{
	display: flex;
	.left{
		width: 212upx;
	}
	.right{
		flex:2;
		position: relative;
		.r-icon{
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			color: #ADADAD;
		}
	}
}
.note{
	margin: 47upx 30upx 40upx 30upx;
	padding: 40upx;
	background:rgba(248,248,248,1);
	border-radius:18upx;
	color: #767676;
	line-height: 40upx;
	.title{
		font-weight: bold;
	}
}
// 发票弹框
.box{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
	z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
}
.box-bg{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);
}
.box .box-main{
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    width: 100%;
	height: auto;
    z-index: 9;
	border-radius:30upx 30upx 0upx 0upx;
	overflow: hidden;
}
</style>
