<template>
	<view class="register-page">
		<form @submit="register">
			<view class="login-form relative">
				<view class="form-item flex-align">
					<view class="form-label">
						<image class="phone-logo mgr20" src="/static/img/login/login_iphone@2x.png"></image>
					</view>
					<view class="form-input">
						<input type="number" v-model="info.mobilePhone" placeholder="请输入手机号" />
					</view>
				</view>
				<view class="form-item flex-align">
					<view class="form-label">
						<image class="phone-logo mgr20" src="/static/img/login/login_lock@2x.png"></image>
					</view>
					<view class="form-input">
						<input class="input-code" type="text" :password="!showPassword" v-model="info.password" placeholder="请输入登密码" />
						<view class="appen-solt" @tap="showPassword=!showPassword">
							<text class="password-mode">{{showPassword? '隐藏':'显示'}}</text>
						</view>
					</view>
				</view>
				<view class="form-item flex-align">
					<view class="form-label">
						<image class="phone-logo mgr20" src="/static/img/login/login_shield@2x.png"></image>
					</view>
					<view class="form-input">
						<input class="input-code" type="text" v-model="info.imgCode" placeholder="请输入图形验证码" />
						<view class="appen-solt">
							<image :src="imgCodePath" @tap="initImgCode" class="img-code"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="fs24 primary-color noteStr flex-align" v-if="noteStr == true">
				账号或登录密码不正确，请重新输入
			</view>
			<button formType="submit" :class="btnShow ? 'submit-btn btnShow': 'submit-btn'" :disabled="disabled">确定</button>
			<view class="agreement">
				<view @tap="agree = !agree">
					<image v-if="agree" src="/static/img/login/icon_otc_skfs_yjh@2x.png" mode="widthFix"></image>
					<image v-else src="/static/img/login/icon_otc_skfs_unyjh@2x.png" mode="widthFix"></image>
				</view>
				<view class="flex-align">
					<text class="txt">我已阅读并同意</text><navigator url="agreements/agreements?type=1" class="txt primary-color">《用户服务协议》</navigator>
				</view>
			</view>
			<!-- button按钮改变隐藏域 -->
			<view style="display:none" >{{ exitsVal }}</view>
		</form>
	</view>
</template>

<script>
	import {
		baseUrl as path,
		signSecret
	} from '@/common/req.js';
	import md5 from '@/common/md5.js'
	export default {
		data() {
			return {
				info: {
					mobilePhone: '',
					imgCode: '',
					password: '',
					confirmpsw: '',
					confirmpaypwd: '',
					openId: null,
					weChatAppId: null
				},
				imgCodePath: '',
				key: '',
				agree: true,
				showPassword: false,
				noteStr:false,
				
				disabled:true,
				btnShow:false,
				ifExist:0,
			};
		},
		computed:{
			exitsVal:function(){
				this.ifExist=Number(Boolean(this.info.mobilePhone))+Number(Boolean(this.info.password))+Number(Boolean(this.agree))
			}	
		},
		watch:{
			// 监听data中 ifExist的值
			ifExist(newVal,oldVal){
				if(Number(newVal) === 3){
					this.disabled = false;
					this.btnShow = true;
				 // 3个input框内都有值时需要做的操作
				}else{
					this.disabled = true;
					this.btnShow = false;
				 // 至少一个没有值
				}
			}
		},
		onLoad(e) {
			e.agree ? (this.agree = true) : '';
			this.initImgCode();
		},
		onShow(e) {
			uni.getStorage({
				key: 'agreeRegister',
				success: res => {
					this.agree = true;
					uni.removeStorageSync('agreeRegister');
				}
			});
		},
		methods: {
			register() {
				if (!this.info.mobilePhone) {
					this.noteStr = true;
					return;
				}

				if (!this.info.password) {
					
					return;
				}
				let noteStr = '';
				if (!this.checkPswString(this.info.password)){
					this.noteStr = true;
					console.log("this.noteStr",this.noteStr)
					noteStr = '登录密码格式错误，密码只能是6-16位数字或数字和字母的组合';
					return;
				}
				if (!this.agree) {
					uni.showToast({
						duration: 2000,
						icon: 'none',
						title: '注册需要同意注册协议'
					});
					return;
				}
				let oldPassword = this.info.password;
				this.info.password = md5('TPSHOP' + this.info.password)
				uni.showLoading({
					title:'请稍候',
					mask:true
				})
				this.apiUrl
					.submitRegister({
						data: this.info
					})
					.then(
						res => {
							uni.hideLoading();
							let str;
							if (res.data.status == 1) {
								uni.showToast({
									duration: 1500,
									icon: 'none',
									title: '注册成功'
								});

								//签名secret
								let secret = signSecret;
								uni.setStorageSync('memberSecretV2',secret)
								this.$store.commit('saveMember', res.data.data);
								// #ifdef H5
								uni.navigateTo({
									url:'registerSuccess/registerSuccess'
								})
								return
								// #endif
								setTimeout(() => {
									uni.switchTab({
										url:'../index/index'
									})
								}, 1500)
							} else {
								this.info.password = oldPassword;
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
			initImgCode() {
				this.key = new Date().getTime();
				this.imgCodePath = path + '/member_veryCode.action?key=' + this.key;
				this.info.imgCode = '';
			}
		}
	};
</script>

<style lang="less" scoped>
	.noteStr{
		position: absolute;
		margin-top: 20upx;
		height:33upx;
		width: 590upx;
	}
	.phone-logo{
		width: 44upx;
		height: 44upx;
	}
	.form-item{
		.input-code{
			width: 80%;
		}
	}
	
	.register-page {
		padding: 20upx 60upx;
	}

	.password-mode {
		font-size: 26upx;
		color: #656565;
		line-height: 60upx;
	}
	.login-form .form-input .appen-solt{
		top: -16upx;
		padding: 0;
		line-height:60upx;
		.img-code {
			display: block;
			height: 46upx;
			width: 105upx;
		}
	}
	
	.smscode-btn {
		width: 160upx;
		border-radius: 6upx;
		border: 1px solid #656565;
		text-align: center;
		line-height: 50upx;
		font-size: 26upx;
		color: #656565;
	}

	.agreement {
		display: flex;
		align-items: center;
		margin-top: 40upx;
		image {
			display: block;
			width: 30upx;
			height: 30upx;
			margin-right: 20upx;
		}

		.txt {
			height: 33upx;
			line-height: 33upx;
			text-decoration:none;
			color:rgba(102,102,102,1);
			font-weight:400;
			font-size: 24upx;
		}
		.primary-color{
			color: #FE6A72;
		}
	}

</style>
