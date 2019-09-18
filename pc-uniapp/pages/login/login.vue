<template>

	<view class="login-page">
		<view class="welcome">欢迎登陆一元购</view>
		<view class="login-form relative">
			<view class="form-item flex-align">
				<view class="form-label">
					<image class="phone-logo mgr20" src="/static/img/login/login_iphone@2x.png"></image>
				</view>
				<view class="form-input">
					<input type="number" v-model="mobilePhone" placeholder="请输入手机号码" @focus="changemb" @blur="changeblur"/>
				</view>
			</view>
			<view class="form-item flex-align">
				<view class="form-label">
					<image class="phone-logo mgr20" src="/static/img/login/login_lock@2x.png"></image>
				</view>
				<view class="form-input">
					<input type="text" :password="!showPassword" v-model="password" placeholder="请输入登录密码" />
					<view class="appen-solt" @tap="showPassword=!showPassword">
						<text class="password-mode">{{showPassword? '隐藏':'显示'}}</text>
					</view>
				</view>
			</view>
			<view class="acoumt" v-if="showAcoumt && fSearch">
				<view class="acoumt-box pd30" v-if="fSearch.length > 0">
					<view class="acoumt-item pdb20" v-for="(item, index) in fSearch" :key="index" :data-acoumt="item" @tap="goACoumt">{{item}}</view>
				</view>
			</view>
		</view>
		<view class="submit-btn" @tap="goLogin">登录</view>
		<view class="fun-btn">
			<text @tap="go(1)">快速注册</text>
			<text @tap="go(2)">忘记密码</text>
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
			}
			// #endif
		},
		methods: {
			changemb(){
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
						title: '请输入手机号码'
					})
					return
				}
				if (!this.password) {
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '请输入登录密码'
					})
					return
				}
				uni.showLoading({
					title:'请稍候',
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
					if (res.data.status == 0) message = '手机号不存在';
					if (res.data.status == 2) message = '密码错误';
					if (res.data.status == 3) message = '会员被禁用';

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
							title: '登录成功'
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
		line-height: 60upx;
	}

	.submit-btn {
		margin-top: 60upx;
		margin-bottom: 40upx;
		height: 90upx;
		background: #FC4E29;
		border-radius: 50upx;
		line-height: 90upx;
		text-align: center;
		font-size: 36upx;
		font-weight: 400;
		color: #ffffff;
	}

	.fun-btn {
		float: right;

		text {
			display: inline-block;
			padding: 0 20upx;
			height: 37upx;
			font-size: 26upx;
			font-weight: 300;
			color: #656565;
			line-height: 37upx;
			border-right: 1px solid #E5E5E5;

			&:last-child {
				border-right: none;
			}
		}
	}
</style>
