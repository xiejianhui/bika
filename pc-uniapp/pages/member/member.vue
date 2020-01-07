<template>
	<view class="member-box">
		<!-- #ifdef APP-PLUS -->
		<view class="my_top relative">
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
		<view class="my_top relative" style="height: 510upx">
		<!-- #endif -->
			<view class="code flex-box" @tap="showBox">
				<view class="icon flex-box">
					<image mode="widthFix" src="/static/img/self/my_icon_yuyanqiehuan@2x.png" ></image>
				</view>
				<view class="fw500 fs24 ">
					{{i18n.switch_language}}
				</view>
			</view>
			<view class="info">
				<view class="" style="position: relative">
					<view style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 10" v-if="!memberInfo.id" @click="askToLogion"></view>
					<navigator url="person-info/person-info">
						<view class="head">
							<image :src="memberInfo.logo" v-if="memberInfo.logo" mode="widthFix" class="w100"></image>
							<image src="/static/img/logoGsp.png" v-else mode="widthFix" class="w100"></image>
						</view>
					</navigator>
				</view>
				<view class="mid">
					<view class="white" v-if="memberInfo.id">
						<view class="fs36 fw500 flex-align">
							{{ memberInfo.userName||memberInfo.mobilePhone}}
						</view>
						<view class="fs24 flex-align">
							{{i18n.username}}：212
						</view>
					</view>
					<view class="login-regit flex-align" v-else>
						<navigator url="/pages/login/login">
							<view class="white fs36">{{i18n.login_register}}</view>
						</navigator>
					</view>
				</view>	
			</view>
			<view class="info-box">
				<view class="info-item">
					<view class="fs32 flex-box">
						92000
					</view>
					<view class="fs24 flex-box">
						{{i18n.bonus_point}}
					</view>
				</view>
				<view class="info-item">
					<view class="fs32 flex-box">
						66
					</view>
					<view class="fs24 flex-box">
						{{i18n.balance}}（RM)
					</view>
				</view>
				<view class="info-item">
					<view class="fs32 flex-box">
						90
					</view>
					<view class="fs24 flex-box">
						{{i18n.my_favorite}}
					</view>
				</view>
				<view class="info-item">
					<view class="fs32 flex-box">
						88
					</view>
					<view class="fs24 flex-box">
						{{i18n.winning_record}}
					</view>
				</view>
			</view>
			<view style="position: relative">
				<view style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 10" v-if="!memberInfo.id" @click="askToLogion"></view>
				<view class="recharge-type colorw">
					<view class="flex-box recharge-item" @click="toRecharge">
						<view class="icon flex-box">
							<image mode="widthFix" src="/static/img/self/my_icon_chognzhi@2x.png" ></image>
						</view>
						<view class="fs30">
							{{i18n.recharge}}
						</view>
						
					</view>
					<view class="flex-box recharge-item" @click="toshareEarn">
						<view class="icon flex-box">
							<image mode="widthFix" src="/static/img/self/my_icon_share@2x.png" ></image>
						</view>
						<view class="fs30">
							{{i18n.share_earn}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="position: relative">
			<view class="copy-save betweenBox fs28 color6">
				<view class="">
					{{i18n.main_webpage}}：<text class="orange" v-model="spread_url">http://oneonhy.com</text>
				</view>
				<view class="">
					<view v-if="coypyH5 == true"
						v-clipboard:copy="spread_url"
						v-clipboard:success="(type) => onCopyResult('success')"
						v-clipboard:error="(type) => onCopyResult('error')"
						class="orange copy flex-box">
						{{i18n.copy}}</view>
						<view v-else
							@click="onCopyResult"
							class="orange copy flex-box">
							{{i18n.copy}}</view>
				</view>
			</view>
			<view class="bdb30"></view>
			<view class="item-box betweenBox" @click="toSign">
				<view class="left flex-box">
					<image mode="widthFix" src="/static/img/self/my-icon-fenxiang@2x.png" ></image>{{i18n.check_in}}
				</view>
				<view class="right">
					<uni-icons style="position: relative;top: 0upx;color: #B6B6B6;" type="arrowright" size="20"></uni-icons>
				</view>
			</view>
			<view class="item-box betweenBox" @click="toCollect">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-shoucang@2x.png"></image>{{i18n.my_favorite}}
				</view>
				<view class="right">
					<uni-icons style="position: relative;top: 0upx;color: #B6B6B6;color: #B6B6B6;" type="arrowright" size="20"></uni-icons>
				</view>
			</view>
			<view class="item-box betweenBox" @click="toWinning">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-huode@2x.png" ></image>{{i18n.winning_record}}
				</view>
				<view class="right">
					<uni-icons style="position: relative;top: 0upx;color: #B6B6B6;" type="arrowright" size="20"></uni-icons>
				</view>
			</view>
			<view class="item-box betweenBox" @click="toPurshase">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-xianggou@2x.png" ></image>{{i18n.purshase_record}}
				</view>
				<view class="right">
					<uni-icons style="position: relative;top: 0upx;color: #B6B6B6;" type="arrowright" size="20"></uni-icons>
				</view>
			</view>
			<view class="item-box betweenBox" @click="toAccountDetails">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-zhanghu@2x.png" ></image>{{i18n.transaction}}
				</view>
				<view class="right">
					<uni-icons style="position: relative;top: 0upx;color: #B6B6B6;" type="arrowright" size="20"></uni-icons>
				</view>
			</view>
			<view class="item-box betweenBox" @click="customerService">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-kefu@2x.png" ></image>{{i18n.customer_service}}
				</view>
				<view class="right">
					<uni-icons style="position: relative;top: 0upx;color: #B6B6B6;" type="arrowright" size="20"></uni-icons>
				</view>
			</view>
			<navigator url="person-info/person-info">
				<view class="item-box betweenBox">
					<view class="left flex-box">
						<image src="/static/img/self/my-icon-zhanghao@2x.png" ></image>{{i18n.account_settings}}
					</view>
					<view class="right">
						<uni-icons style="position: relative;top: 0upx;color: #B6B6B6;" type="arrowright" size="20"></uni-icons>
					</view>
				</view>
			</navigator>
			<view class="item-box betweenBox logout-btn" @click="logout" v-if="memberInfo.id">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-tuichu@2x.png" ></image>{{i18n.log_out}}
				</view>
				<view class="right">
					<uni-icons style="position: relative;top: 0upx;color: #B6B6B6;" type="arrowright" size="20"></uni-icons>
				</view>
			</view>
		</view>
		
		<view v-if='!hideBox' class='box'>
			<view class='box-bg' @tap="showBox"></view>
			<view class='box-main'>
				<view v-for="(item,index) in languages" 
					:key="index" 
					class="box-item fs30" :class="{'active':item.active}"
					:data-idx="index" 
					@click="changeLanuage">
					<image v-if="index == 0" class="box-item-icon" src="/static/img/self/my-icon-chiness@2x.png"></image>
					<image v-if="index == 1" class="box-item-icon" src="/static/img/self/my-icon-yingwen@2x.png"></image>
					<image v-if="index == 2" class="box-item-icon" src="/static/img/self/my-icon-malaiyu@2x.png"></image>
					 {{languages[index].value}}
				</view>
			</view>
		</view>
		
		<view class="uni-modal" v-if="showModal" @touchmove.stop.prevent="doNothing">
			<view class="uni-mask" @click="customerService"></view>
			<view class="modal-box flex-box">
				<view class="modal-shadow">
					<view class="uni-modal-wechart">
						<image :src="preImage" mode=""></image>
						<!-- <image src="/static/img/self/shopping-button-press.png" mode=""></image> -->
					</view>
					<view class="uni-modal-ar fs28 fw500 mgt20">
						<view class="">{{i18n.longCode}}</view>
						<view class="">{{i18n.tambahWeChat}}</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			hideBox:true,
			// languages: ['中文', '英文','马来西亚语'],
			languages: [{active:false,value:'中文 (Chiness)'},{active:true,value:'英文 (English)'},{active:false,value:'马来西亚语 (Malay)'}],
			spread_url:'http://oneonhy.com',
			coypyH5:false,
			showModal:false,
			preImage:'',
			
			member: null,
		};
	},
	computed: mapState({
		memberInfo: (state) => state.memberInfo || {},
		// 多语言
		i18n () {
			return this.$t('member')  
		}  
	}),
	onPullDownRefresh() {
		this.getCode();
		
		if (this.memberInfo.id) {
			this.$store.dispatch('getMemberInfo')
			setTimeout( ()=>{
				uni.stopPullDownRefresh();
			}, 1000);
		}
	},
	onLoad() {
		// #ifdef H5
		this.coypyH5 = true;
		// #endif
		// 获取客服二维码
		this.getCode();
	},
	onShow() {
		if (this.memberInfo.id) {
			this.isFromLogin();
		}
	},
	methods: {
		showBox() {
			this.hideBox = !this.hideBox
		},
		// 自定义多语言
		changeLanuage(e) {
			this.hideBox = !this.hideBox;
			let index = e.target.dataset.idx;
			let arr = this.languages;
			arr.forEach(item => (item.active = false));
			arr[index].active = true;
			uni.showToast({
				title: this.$t('member.loading'),
				icon: 'loading',
				duration: 1000
			})
			if(index == '0') {
				uni.hideToast()
				// 切换语言需要定时器
				setTimeout(() => {  
					this.$i18n.locale = 'zh-CN'  
					// tabbar多语言
					let tabBarLang = this.i18n.tabBarLang;
					tabBarLang.forEach((element, index) => {
						uni.setTabBarItem({
							'index': index,
							'text': element
						})
					})
					// 导航栏
					uni.setNavigationBarTitle({
						title:this.$t('tabs.my')
					});
				},100)  
			}else if(index == '1'){
				uni.hideToast()
				setTimeout(() => {
					this.$i18n.locale = 'en-US'
					// tabbar多语言
					let tabBarLang = this.i18n.tabBarLang;
					tabBarLang.forEach((element, index) => {
						uni.setTabBarItem({
							'index': index,
							'text': element
						})
					})
					uni.setNavigationBarTitle({
						title:this.$t('tabs.my')
					});
				},100)
			}else if(index == '2'){
				uni.hideToast()
				setTimeout(() => {
					this.$i18n.locale = 'en-ML'
					// tabbar多语言
					let tabBarLang = this.i18n.tabBarLang;
					tabBarLang.forEach((element, index) => {
						uni.setTabBarItem({
							'index': index,
							'text': element
						})
					})
					uni.setNavigationBarTitle({
						title:this.$t('tabs.my')
					});
				},100)
			}else{
				uni.hideToast()
				setTimeout(() => {
					this.$i18n.locale = 'en-US'
					// tabbar多语言
					let tabBarLang = this.i18n.tabBarLang;
					tabBarLang.forEach((element, index) => {
						uni.setTabBarItem({
							'index': index,
							'text': element
						})
					})
					uni.setNavigationBarTitle({
						title:this.$t('tabs.my')
					});
				},100)
			}
		},
		
		// 复制
		onCopyResult(type) {
			// 兼容h5剪切板
			if(this.coypyH5 == true){
				if (type==='success') {
					uni.showToast({
						title:'复制成功',
						icon:'none',
						duration:1500
					});
					return;
				} else {
					uni.showToast({
						title:'复制失败',
						icon:'none',
						duration:1500
					});
					return;
				}
			}else{
				console.log(111)
				uni.setClipboardData({
				    data: this.spread_url,
				    success: function () {
						uni.showToast({
							title:'复制成功',
							icon:'none',
							duration:1500
						});
						return;
				    },fail() {
				    	uni.showToast({
				    		title:'复制失败',
				    		icon:'none',
				    		duration:1500
				    	});
				    	return;
				    }
				});
			}
		},
		
		toSign(){
			uni.navigateTo({
				url:"/pages/member/sign-in/sign-in"
			})
		},
		toRecharge(){
			uni.navigateTo({
				url:"/pages/member/recharge-detail/recharge-detail"
			})
		},
		toCollect(){
			uni.navigateTo({
				url:"/pages/member/collect/collect"
			})
		},
		toAccountDetails(){
			uni.navigateTo({
				url:"/pages/member/account-details/account-details"
			})
		},
		toPurshase(){
			uni.navigateTo({
				url:"/pages/packages/purshase-record/purshase-record"
			})
		},
		toWinning(){
			uni.navigateTo({
				url:"/pages/packages/winning-record/winning-record"
			})
		},
		doNothing(){
			return;
		},
		customerService(){
			this.showModal = !this.showModal
		},
		getCode() {
			let data = {
				memberId:this.memberInfo.id,
			};
			this.apiUrl
				.getShareGraph({
					data
				})
				.then(res => {
					uni.hideLoading();
					if (res.data.status == 1) {
						this.preImage = res.data.data.sharePic;
					}
				});
		},
		toshareEarn(){
			uni.navigateTo({
				url:"/pages/member/share-earn/share-earn"
			})
		},
		
		
		

		isFromLogin() {
			uni.getStorage({
				key: 'pagefrom',
				success: () => {
					uni.removeStorage({
						key: 'pagefrom'
					});
					uni.switchTab({
						url: '/pages/index/index'
					});
				},
				fail: () => {
					this.initMember();
				}
			});
		},
		initMember() {
			uni.getStorage({
				key: 'member',
				success: res => {
					this.member = res.data;
					this.$store.commit('saveMember', res.data);
					setTimeout(() => {
						this.$store.dispatch('getMemberInfo');
					}, 1000);
				},
				fail() {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			});
		},
		logout() {
			uni.showModal({
				title: '提示',
				content: '您将退出此次登录，是否确定？',
				success:  (res)=>{
					if (res.confirm) {
						this.$store.commit('logOut');
						uni.navigateTo({
							url: '../login/login'
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});

		},
		askToLogion () {
			uni.showModal({
				title: '提示',
				content: '请先登录后再查看',
				success:  (res)=>{
					if (res.confirm) {
						uni.navigateTo({
							url: '../login/login'
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
	}
};
</script>

<style lang="less" scoped>
	.bdb30{
		border-bottom: 10upx solid #F5F5F5;
	}
	/* 切换语言弹框 */
	.box{
	    position: fixed;
	    top: 0;
	    left: 0;
		z-index: 10;
	    width: 100%;
	    height: 100%;
	    display: flex;
	    justify-content: center;
	    align-items: center;
		/* #ifdef H5 */
		bottom: var(--window-bottom);
		/* #endif */
		.box-bg{
		    position: absolute;
		    top: 0;
		    left: 0;
			z-index: 11;
		    width: 100%;
		    height: 100%;
		    background-color: rgba(0, 0, 0, .6);
		}
		.box-main{
		    position: absolute;
		    bottom: 0;
		    left: 0;
		    display: block;
		    width: 100%;
		    z-index: 100;
			background:rgba(255,255,255,1);
			/* #ifdef H5 */
			bottom: var(--window-bottom);
			/* #endif */
		}
		.box-main .box-item{
		    width: 100%;
		    height: 90rpx;
		    font-size: 30rpx;
		    background:#FFFFFF;
		    display: flex;
			align-items: center;
			padding-left: 231upx;
			color: #333333;
			.box-item-icon{
				width: 47upx;
				height: 32upx;
				margin-right: 21upx;
			}
		}
		.box-main .active{
			background:rgba(248,204,207,0.24);
		}
		.box-main view button{
		    width: 100%;
		    height: 100%;
		    font-size: 28rpx;
		    background-color: transparent;
		    display: flex;
		    justify-content: center;
		    align-items: center;
		}
		.box-main view button::after{
		    border: none;
		}
	}
	
	.member-box{
		width: 100%;
		height: 100%;
		overflow: hidden;
		background:rgba(255,255,255,1);
	}
	.my_top{
		padding: 72upx 20upx 0 20upx;
		height:510upx;
		background:linear-gradient(131deg,#f55c70 0%,#f87a4f 100%);
		box-sizing: border-box;
		position: relative;
		box-sizing: border-box;
		.code{
			position: absolute;
			right: 0upx;
			top: 120upx;
			z-index: 1;
			width:auto;
			height:47upx;
			background:rgba(248,189,9,1);
			border-top-left-radius:24upx;
			border-bottom-left-radius:24upx;
			padding: 0 24upx;
			font-family:PingFang SC;
			font-weight:400;
			color:rgba(255,255,255,1);
			line-height:47upx;
			.icon{
				width: 30upx;
				height: 30upx;
				margin-right: 8upx;
				image{
					width: 30upx;
					height: 30upx;
				}
			}
		}
		
		.info{
			display: flex;
			// align-items: center;
			position: relative;
			.head{
				width: 140upx;
				height: 140upx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 12upx;
				image{
					width: 100%;
					height: 100%!important;
					border-radius: 50%;
				}
			}
			.mid{
				width: 430upx;
				padding-top: 36upx;
				.fs36{
					height: 36upx;
					margin-bottom: 16upx;
				}
				.fs24{
					height: 24upx;
				}
				.login-regit{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	
	.info-box{
		display: flex;
		margin-top: 60upx;
		.info-item{
			flex: 1;
			.fs32{
				height: 32upx;
				color: #FFFFFF;
				margin-bottom: 16upx;
			}
			.fs24{
				color:rgba(255,223,223,1);
			}
		}
	}
	
	.recharge-type{
		height: 70upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		margin: 50upx 10upx 0;
		.recharge-item {
			width:330upx;
			height:70upx;
			background:rgba(255,232,226,0.3);
			border-radius:6upx;
			height: 100%;
			text-align: center;
			color:rgba(255,255,255,1);
			.icon{
				width: 44upx;
				height: 44upx;
				margin-right: 6upx;
				image{
					width: 44upx;
					height: 44upx;
				}
			}
		}
		.recharge-item:first-child{
			margin-right: 30upx;
		}
	}

	.copy-save{
		height: 90upx;
		background: #FFFFFF;
		margin-bottom: 11upx;
		padding: 0 30upx;
		box-sizing: border-box;
		.please-copy{
			margin-left: 22upx;
		}
		.copy{
			width: auto;
			height:48upx;
			padding: 0upx 27upx;
			border:1upx solid rgba(254,106,114,1);
			border-radius:6upx;
		}
	}
	.item-box{
		height: 78upx;
		margin: 0 30upx;
		background: #FFFFFF;
		border-bottom: 1upx solid #F2F2F2;
		.left{
			image{
				width: 44upx;
				height: 44upx;
				margin-right: 18upx;
			}
		}
		.right{
			color: #333333;
			font-size: 28upx;
			image{
				width: 15upx;
				height: 29upx;
				color: #B6B6B6;
			}
		}
	}
	
	.logout-btn {
		margin-bottom: 75upx;
	}
	
	// 客服咨询
	.modal-box{
		width:311upx;
		height:398upx;
		background:rgba(232,111,118,0.3);
		border-radius:30upx;
		.modal-shadow{
			width:251upx;
			height:346upx;
			box-sizing: border-box;
			background:rgba(255,255,255,1);
			box-shadow:0upx 0upx 27upx 0upx rgba(252,106,114,0.7);
			border-radius:30upx;
			.uni-modal-wechart{
				width:184upx;
				height:184upx;
				padding: 36upx 34upx 0 36upx;
				image{
					width:184upx;
					height:184upx;
				}
			}
			.uni-modal-ar{
				height:69upx;
				color:rgba(86,25,29,1);
				line-height:43upx;
			}
		}
		
	}
</style>
