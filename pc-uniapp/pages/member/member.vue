<template>
	<view class="member-box">
		<!-- #ifdef APP-PLUS -->
		<view class="my_top relative">
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
		<view class="my_top relative" style="height: 280upx">
		<!-- #endif -->
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
						<view class="fs34 fw500 flex-align">
							{{ memberInfo.userName||memberInfo.mobilePhone}}
						</view>
						<view class="fs30 flex-align">
							账号：212
						</view>
						<view class="fs30 betweenBox flex-align">
							<view>
								福分：900
							</view>
							<view>
								余额：100
							</view>
						</view>
					</view>
					<view class="login-regit flex-align" v-else>
						<navigator url="/pages/login/login">
							<view class="white fs36">登录/注册</view>
						</navigator>
					</view>
				</view>
				<view class="code fw500 fs24 flex-box" @tap="showBox">
					切换语言
				</view>
			</view>

		</view>
		<view style="position: relative">
			<view style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 10" v-if="!memberInfo.id" @click="askToLogion"></view>
			<view class="recharge-type colorw fs30">
				<view class="flex-box" @click="toRecharge">
					充值
				</view>
				<view class="flex-box" @click="toSign">
					签到
				</view>
			</view>
		</view>
		<view style="position: relative">
			<view class="copy-save flex-box fs28 color6">
				官网：<text class="orange" v-model="spread_url">http://oneonhy.com</text> <text class="please-copy">请点击</text>
				<text v-if="coypyH5 == true"
					v-clipboard:copy="spread_url"
					v-clipboard:success="(type) => onCopyResult('success')"
					v-clipboard:error="(type) => onCopyResult('error')"
					class="orange copy">
					复制</text>
					<text v-else
						@click="onCopyResult"
						class="orange copy">
						复制</text>
				保存
			</view>
			<view class="bdb30"></view>
			<view class="item-box betweenBox">
				<view class="left flex-box">
					<image mode="widthFix" src="/static/img/self/my-icon-fenxiang@2x.png" ></image>分享赚钱
				</view>
				<view class="right">
					<uni-icon style="position: relative;top: 0upx;" type="arrowright" size="20"></uni-icon>
				</view>
			</view>
			<view class="item-box betweenBox" @click="toCollect">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-shoucang@2x.png"></image>我的收藏
				</view>
				<view class="right">
					<uni-icon style="position: relative;top: 0upx;" type="arrowright" size="20"></uni-icon>
				</view>
			</view>
			<view class="item-box betweenBox">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-huode@2x.png" ></image>获得商品
				</view>
				<view class="right">
					<uni-icon style="position: relative;top: 0upx;" type="arrowright" size="20"></uni-icon>
				</view>
			</view>
			<view class="item-box betweenBox">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-xianggou@2x.png" ></image>享购记录
				</view>
				<view class="right">
					<uni-icon style="position: relative;top: 0upx;" type="arrowright" size="20"></uni-icon>
				</view>
			</view>
			<view class="item-box betweenBox">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-zhanghu@2x.png" ></image>账户明细
				</view>
				<view class="right">
					<uni-icon style="position: relative;top: 0upx;" type="arrowright" size="20"></uni-icon>
				</view>
			</view>
			<view class="item-box betweenBox">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-kefu@2x.png" ></image>客服咨询
				</view>
				<view class="right">
					<uni-icon style="position: relative;top: 0upx;" type="arrowright" size="20"></uni-icon>
				</view>
			</view>
			<view class="item-box betweenBox">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-zhanghao@2x.png" ></image>账号设置
				</view>
				<view class="right">
					<uni-icon style="position: relative;top: 0upx;" type="arrowright" size="20"></uni-icon>
				</view>
			</view>
			<view class="item-box betweenBox">
				<view class="left flex-box">
					<image src="/static/img/self/my-icon-tuichu@2x.png" ></image>退出登录
				</view>
				<view class="right">
					<uni-icon style="position: relative;top: 0upx;" type="arrowright" size="20"></uni-icon>
				</view>
			</view>
		</view>

		<view class="logout-btn fs30 " @click="logout" v-if="memberInfo.id">退出登录</view>
		<view class="pdb20"></view>
		<view class="pdb20"></view>
		
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
					let tabBarLang = [
					    '首页',
					    '分类',
						'购物车',
					    '我的'
					];
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
					let tabBarLang = [
					    'Home',
					    'Product',
						'Cart',
					    'My'
					];
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
					let tabBarLang = [
					    'Rumah',
					    'Pengelasan',
						'Troli',
					    'Mine'
					];
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
					let tabBarLang = [
					    'Home',
					    'Product',
						'Cart',
					    'My'
					];
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
				url:"/pages/member/sign-in/sign-in"
			})
		},
		toCollect(){
			uni.navigateTo({
				url:"/pages/member/collect/collect"
			})
		},
		
		// goShareCode(){
		// 	uni.navigateTo({
		// 		url:'shareCode/shareCode'
		// 	})
		// },
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
	/* 切换语言弹框 */
	.box{
	    position: fixed;
	    top: 0;
	    left: 0;
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
		    z-index: 9;
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
		padding: 30upx;
		height:280upx;
		background:linear-gradient(131deg,#f55c70 0%,#f87a4f 100%);
		box-sizing: border-box;
		position: relative;
		
		.info{
			display: flex;
			// align-items: center;
			position: relative;
			.head{
				width: 140upx;
				height: 140upx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 33upx;
				image{
					width: 100%;
					height: 100%!important;
					border-radius: 50%;
				}
			}
			.mid{
				width: 394upx;
				padding-top: 3upx;
				.fs34{
					height: 34upx;
					margin-bottom: 32upx;
				}
				.fs30{
					height: 32upx;
					margin-bottom: 18upx;
				}
				.white{
					color: #FFDEDE;
				}
				.login-regit{
					width: 100%;
					height: 100%;
				}
			}
			.code{
				position: absolute;
				right: 0upx;
				top: 0;
				padding: 0 24upx;
				height:47upx;
				border:2upx solid rgba(255,194,193,1);
				border-radius:24upx;
				color:rgba(255,255,255,1);
			}
		}
	}
	.recharge-type{
		height: 68upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		background:rgba(255,232,226,1);
		> view {
			width: 375upx;
			height: 100%;
			text-align: center;
			background:rgba(255,232,226,1);
		}
		view:first-child{
			border-right: 1upx solid rgba(255,255,255,0.65);
		}
	}

	.copy-save{
		height: 90upx;
		background: #FFFFFF;
		.please-copy{
			margin-left: 22upx;
		}
		.copy{
			padding: 9upx 21upx;
			border:1upx solid rgba(254,106,114,1);
			border-radius:10upx;
			margin: 0 9upx;
		}
	}
	.item-box{
		height: 90upx;
		padding: 0 36upx;
		background: #FFFFFF;
		border-bottom: 1upx solid #F2F2F2;
		.left{
			image{
				width: 32upx;
				height: 32upx;
				margin-right: 25upx;
			}
		}
		.right{
			color: #B6B6B6;
			image{
				width: 15upx;
				height: 29upx;
				color: #B6B6B6;
			}
		}
	}
	
.logout-btn {
	width: 600upx;
	height: 80upx;
	margin: 30upx auto;
	background: #FC4E29;
	border-radius: 10upx;
	text-align: center;
	line-height: 80upx;
	color: white;
}

.mg-part {
	display: flex;
	justify-content: space-around;
	padding: 30upx 0;

	> view {
		width: 140upx;
		text-align: center;

		.mg-circle {
			width: 100upx;
			height: 100upx;
			display: inline-block;
			background-image: linear-gradient(180deg, #53b1fa 0%, #388ceb 100%);
			font-size: 50upx;
			text-align: center;
			line-height: 100upx;
			border-radius: 50%;
			margin-bottom: 20upx;
		}

		.mg-circle-car {
			background-image: linear-gradient(180deg, #ffb75a 0%, #e78e00 100%);
			display: flex;

			image {
				width: 60upx;
			}
		}

		.fens-icon {
			width: 70upx;
		}

		.fens-icon2 {
			width: 90upx;
			height: auto;
		}
	}
}

.bl-juan {
	display: flex;
	padding: 20upx;

	> view {
		width: 330upx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		image {
			width: 40upx;
			margin-right: 10upx;
		}
	}
}


.order-types {
	display: flex;
	justify-content: flex-start;

	flex-wrap: wrap;
	> view {
		width: 170upx;
		text-align: center;
		margin-left: 12upx;
		margin-block-start: 20upx;
		image {
			width: 90upx;
		}
	}
}

.top {
	background-image: url('~@/static/img/my-bg.png');
	background-size: 100% auto;
	background-repeat: no-repeat;

	.messageIcon {
		width: 40upx;
		margin: 20upx;
	}

	.content {
		width: 650upx;
		background-color: #ffffff;
		border-radius: 15px;
		margin: 60upx auto 20upx auto;
		position: relative;
		padding-bottom: 30upx;

		.head {
			position: absolute;
			left: 50%;
			top: 0;
			transform: translate(-50%, -50%);
			width: 150upx;
			height: 150upx;
			border-radius: 50%;
			overflow: hidden;
		}

		.mb-name {
			padding-top: 90upx;
			display: flex;
			align-items: center;
			justify-content: center;

			.tag {
				padding: 2upx 10upx;
				background-image: linear-gradient(90deg, #53b1fa 0%, #388ceb 100%);
				border-radius: 16px;
				color: white;
				margin-left: 10upx;
			}
		}

	}
}
</style>
