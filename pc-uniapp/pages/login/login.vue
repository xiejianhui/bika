<template>

	<view class="login-page">
		<view class="welcome">{{i18n.toWelcome}}</view>
		<view class="login-form relative">
			<view class="form-item flex-align">
				<view class="form-label">
					<image class="phone-logo mgr20" src="/static/img/login/login_iphone@2x.png"></image>
				</view>
				<view class="form-input">
					<input type="number" v-model="mobilePhone" :placeholder="i18n.enter_phone_number" @focus="changemb" @blur="changeblur"/>
				</view>
			</view>
			<view class="form-item flex-align">
				<view class="form-label">
					<image class="phone-logo mgr20" src="/static/img/login/login_lock@2x.png"></image>
				</view>
				<view class="form-input">
					<input type="text" :password="!showPassword" v-model="password" :placeholder="i18n.passwordEnter" />
					<view class="appen-solt" @tap="showPassword=!showPassword">
						<text class="password-mode">{{showPassword? i18n.hide : i18n.show}}</text>
					</view>
				</view>
			</view>
			<view class="acoumt" v-if="showAcoumt && fSearch">
				<view class="acoumt-box pd30" v-if="fSearch.length > 0">
					<view class="acoumt-item pdb20" v-for="(item, index) in fSearch" :key="index" :data-acoumt="item" @tap="goACoumt">{{item}}</view>
				</view>
			</view>
		</view>
		<button :class="mobilePhone && password ? 'submit-btn btnShow': 'submit-btn'" :disabled="mobilePhone == '' || password == ''" @tap="goLogin">{{i18n.login}}</button>
		<view class="fun-btn fs28 fw400 flex-box color3">
			{{i18n.accountNo+'?'}}<text class="primary-color" @tap="go(1)">{{i18n.registered}}</text>
			<!-- <text class="" @tap="go(2)">忘记密码</text> -->
		</view>
		<!-- 登录选择弹框 -->
		<view class="uni-modal" v-if="showModal">
			<view class="uni-mask"></view>
			<view class="modal-box">
			<view class="uni-modal__hd">{{i18n.tips}}</view>
				<view class="uni-modal__bd">{{i18n.areaSelect}}</view>
				<view class="uni-modal__ft">
					<view class="uni-modal__btn" @tap="modalCancel">+60</view>
					<view class="uni-modal__btn" @tap="modalConfirm">+65</view>
				</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {signSecret} from '@/common/req.js'
	import md5 from '@/common/md5.js'
	export default {
		data() {
			return {
				mobilePhone: '',
				password: '',
				save: true,
				fromDetail: false,
				showPassword: false,
				changepsw:1,
				showAcoumt:false,
				acoumtArr:[],
				showModal:false,
			}
		},
		methods: {

		},
		onShow() {
			uni.getStorage({
				key: 'pagefromDetail',
				success: (res) => {
					this.fromDetail = res.data; //page from product-detail
				},
				fail: () => {
					uni.setStorage({
						key: 'pagefrom',
						data: 'login' //page frome member
					})
				}
			})
			uni.getStorage({
				key: 'acoumtArr',
				success: (res) => {
					this.acoumtArr = res.data
				},
				fail: (res) => {
				}
			})
		},
		destroyed() {
			uni.removeStorageSync('pagefromDetail');
		},
		computed : {  
			// #ifdef APP-PLUS || H5
			//设置账号计算属性
			fSearch(){
				if(this.mobilePhone){
					return this.acoumtArr.filter((item)=>{  //过滤数组元素
						return item.includes(this.mobilePhone); //如果包含字符返回true
					});
				}
			},
			// #endif
			i18n () {
				return this.$t('login')
			}
		},
		methods: {
			// 选择手机区号
			modalConfirm(){
				this.showModal = false;
				this.mobilePhone = 65
			},
			modalCancel(){
				this.showModal = false;
				this.mobilePhone = 60
			},
			changemb(){
				if(this.mobilePhone == ''){
					this.showModal = true;
				}
				// #ifdef APP-PLUS || H5
				this.showAcoumt = true;
				// #endif
			},
			changeblur(){
				// #ifdef APP-PLUS || H5
				setTimeout(() => {
					this.showAcoumt = false;
				}, 300)	
				// #endif
			},
			goACoumt(e) {
				setTimeout(() => {
					this.showAcoumt = false;
				}, 300)	
				this.mobilePhone = e.currentTarget.dataset.acoumt;
			},
			go(index) {
				if (index == 1) {
					uni.navigateTo({
						url: 'register'
					})
				}
				if (index == 2) {
					uni.navigateTo({
						url: 'reset-psw'
					})
				}
			},
			goLogin() {
				if (!this.mobilePhone) {
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: this.i18n.enter_phone_number
					})
					return
				}
				if (!this.password) {
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: this.i18n.enter_login_password
					})
					return
				}
				uni.showLoading({
					title:this.i18n.wait_moment,
					mask:true
				})
				this.apiUrl.login({
					data: {
						mobilePhone: this.mobilePhone,
						password:md5('TPSHOP' + this.password)
					}
				}).then(res => {
					uni.hideLoading();
					let message = null;
					if (res.data.status == 0) message =  this.i18n.not_exist;
					if (res.data.status == 2) message =  this.i18n.password_error;
					if (res.data.status == 3) message =  this.i18n.member_disabled;

					if (message) {
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: message
						})
					} else {
						uni.showToast({
							icon: 'none',
							duration: 1500,
							title: this.i18n.login_successfully
						})
						uni.removeStorage({
							key: 'pagefrom'
						})
						//签名secret
						let secret = signSecret;
						uni.setStorageSync('memberSecretV2',secret)
						
						this.$store.commit('saveMember', res.data.data);
						// 记住账号
						if(this.acoumtArr.length>0){
							if(!this.acoumtArr.includes(this.mobilePhone)){
								this.acoumtArr.push(this.mobilePhone)
								uni.setStorageSync('acoumtArr',this.acoumtArr)
							}
						}else{
							this.acoumtArr.push(this.mobilePhone)
							uni.setStorageSync('acoumtArr',this.acoumtArr)
						}
						
						setTimeout(() => {
							let url;
							this.fromDetail ? url = '/pages/product/product-detail?id=' + this.fromDetail : url = '/pages/member/member'
							if (this.fromDetail) {
								uni.navigateBack();
							} else {
								uni.switchTab({
									url
								})
							}
						}, 1500)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.phone-logo{
		width: 44upx;
		height: 44upx;
	}
	.acoumt{
		position: absolute;
		top: 150upx;
		left: 0;
		z-index: 11;
		height: auto;
		width: 100%;
		box-sizing: border-box;
		background: #FFFFFF;
		.acoumt-box{
			height: auto;
			width: 100%;
			box-sizing: border-box;
			box-shadow:0px 4upx 10upx #E5E5E5; 
		}
		.acoumt-item{
			color: #656565;
		}
		.acoumt-item:last-child{
			padding-bottom: 0;
		}
	}
	.login-page {
		padding: 0 80upx;
		margin-top: 105upx;

		.welcome {
			height:62upx;
			font-size:56upx;
			font-family:PingFangSC;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height:62upx;
			margin-bottom: 111upx;
		}
	}

	.password-mode {
		font-size: 26upx;
		color: #656565;
	}

	.fun-btn {
		position: fixed;
		bottom: 0;
		left: 0;
		border-top: 1upx solid rgba(0,0,0,0.1);
		height: 128upx;
		width:100%;
		text {
			display: inline-block;
			padding: 0 20upx;
			height: 37upx;
			line-height: 37upx;
			border-right: 1px solid #E5E5E5;

			&:last-child {
				border-right: none;
			}
		}
	}
	.uni-modal .modal-box .uni-modal__ft .uni-modal__btn{
		color: #FE6A72;
	}
</style>
