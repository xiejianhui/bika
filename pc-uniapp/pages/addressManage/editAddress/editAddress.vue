<template>
	<view class="colTopBottom pageBg ">
		<form @submit="formSubmit">
			<view class="background-white">
				<view class="ea-list mgl20 pd20 bdb">
					<view class="left fs30">
						{{i18n.consignee}}
					</view>
					<input type="text" class="fs30" :placeholder="i18n.iput_consignee" v-model="consignee" />
				</view>
				<view class="ea-list mgl20 pd20 bdb">
					<view class="left fs30">
						{{i18n.phone_number}}
					</view>
					<input type="text" class="fs30" :placeholder="i18n.enter_phone" v-model="mobile" />
				</view>
				<view class="ea-list mgl20 pd20 bdb">
					<view class="left fs30">
						{{i18n.province_city}}
					</view>
					<view class="" style="flex:2;" @tap="showCityPicker">
						<text class="gray fs30" v-if="!zone">{{i18n.choose_provinces}}</text>
						<text class="fs30" v-else>{{zone}}</text>
					</view>
					<view class="info-right">
						<image src="/static/img/pubulic_icon_expand@2x.png" class=""></image>
					</view>
				</view>
				<view class="ea-list mgl20 pd20 bdb">
					<view class="left fs30">
						{{i18n.detailed_address}}
					</view>
					<input type="text" class="fs30" :placeholder="i18n.enter_address" v-model="address" />
				</view>
				<view class="ea-list mgl20 pd20 betweenBox">
					<view class="left fs30">
						{{i18n.default_address}}
					</view>
					<switch checked @change="switchChange" />
					<!-- <view class="ligh-btn background-blue" @tap="setAsDefault=!setAsDefault" :class="{'active':setAsDefault}">
						<view class="def-circle">
							
						</view>
					</view> -->
				</view>
				
				<!-- <mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault" @onChange="onChange" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker> -->
				<my-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault" @onChange="onChange" @onCancel="onCancel"
				 @onConfirm="onConfirm"></my-city-picker>
			</view>
			
			<!-- <view class="ad-save-btn flex-box white fs30" @tap="editAddress">
				保存该地址
			</view> -->
			<button class="ad-save-btn flex-box white fs30" formType="submit" :class="consignee && mobile && address ? '': 'btnShow'" :disabled="consignee == '' && mobile == '' && address == ''">{{i18n.save_address}}</button>
		</form>
	</view>
</template>

<script>
	import mpvueCityPicker from 'mpvue-citypicker';
	import myCityPicker from '@/components/myCityPicker.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				pickerValueDefault: [19, 1, 1],
				zone: '',
				setAsDefault: true,
				newAddress: true,
				consignee: '',
				mobile: '',
				isDefault: '',
				address: '',
				province: '',
				city: '',
				district: '',
				cityIds: [],
				id:null,
				allowRequest:true,
				formValue:'',
			};
		},
		components: {
			mpvueCityPicker,
			myCityPicker
		},
		computed: {
			...mapState([
				'memberInfo'
			]),
			i18n () {
				return this.$t('editAddress')  
			}  
		},
		mounted() {

		},
		onLoad(e) {
			if(e.id){
				this.id = e.id
				this.getAddress()
			}
			
		},
		methods: {
			showCityPicker() {
				this.$refs.mpvueCityPicker.show();
			},
			onChange(e) {
				console.log(e);
			},
			onCancel(e) {
				console.log(e);
			},
			switchChange(e) {
				this.setAsDefault = e.detail.value
				console.log(this.setAsDefault);

			},
			onConfirm(e) {
				console.log(e);
				this.zone = e.label;
				this.cityIds = e.cityCode
			},
			getAddress() {
				this.apiUrl.getAddressById({
					data:{
						id:this.id
					}
				}).then(res=>{
					console.log(res);
					let data = res.data.data;
					this.zone = data.position;
					this.consignee=data.consignee;
					this.mobile = data.mobile;
					this.address = data.address;
					this.cityIds = [data.province,data.city,data.district]
				})
			},
			formSubmit(e) {
				if(!this.allowRequest)  return
				this.allowRequest = false;
				uni.showLoading({
					title:this.i18n.wait_moment,
					mask:true
				})
				let data = {
					address: this.address,
					city: this.cityIds[1],
					consignee: this.consignee,
					district: this.cityIds[2],
					isDefault: this.setAsDefault?1:0,
					memberId: this.memberInfo.id,
					mobile: this.mobile,
					position: this.zone,
					province: this.cityIds[0]
				}
				if(!data.consignee||!data.mobile||!data.position||!data.address){
					let showdata = '';
					if(!data.address) showdata = this.i18n.detailed_address;
					if(!data.position) showdata = this.i18n.province_city;
					if(!data.mobile) showdata = this.i18n.phone_number;
					if(!data.consignee) showdata = this.i18n.consignee;
					uni.showToast({
						title:`${showdata}` + this.i18n.not_empty,
						duration:2000,
						icon:'none'
					})
					return
				}
				
				if(this.id){
					data.id = this.id
				}
				if(JSON.stringify(this.formValue) == "{}") return;
				this.apiUrl.submitAddress({
					data
				}).then(res=>{
					this.formValue = e.detail.value;
					this.allowRequest = true;
					uni.hideLoading();
					if(res.data.status==1){
						uni.showToast({
							title:this.i18n.successful_preservation,
							duration:2000,
							icon:'success'
						})
						setTimeout(function(){
							uni.navigateBack()
						},2000)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.pageBg{
		background: #fff;
		.btnShow{
			background: #E5E5E5;
			color: #FFFFFF;
			box-shadow: none;
		}
		.btnShow:after{
			border: none;
		}
	}
	.mgl20{
		margin: 0 40upx;
		padding: 66upx 0 36upx 0;
	}
	.ad-save-btn {
		width: 600upx;
		height: 80upx;
		background: #FC4E29;
		border-radius: 40upx;
		margin: 60upx auto;
	}
	.info-right{
		float: left;
		image{
			float: right;
			color: #ADADAD;
			padding-top: 10upx;
			padding-left: 20upx;
			line-height: 30upx;
			width: 20upx;
			height: 30upx;
			font-size: 20upx;
		}
	}
	
	.ea-list {
		display: flex;
		.left {
			width: 212upx;
			font-size:32upx;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(51,51,51,1);
		}
		>input{
			flex: 2;
		}
		.ligh-btn {
			width: 80upx;
			height: 40upx;
			border-radius: 30upx;
			position: relative;

			.def-circle {
				width: 40upx;
				height: 40upx;
				transition: all 0.5s;
				position: absolute;
				left: 0;
				top: 0;
				right: auto;
			}

			&.active {
				.def-circle {
					transform: translateX(40upx);
				}
			}
		}
	}
</style>
