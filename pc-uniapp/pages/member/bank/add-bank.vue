<template>
	<view class="bg ">
		
		<form @submit="formSubmit">
			<view class="drawForm">
				<radio-group @change="radioChange" class="flex rg_check">
					<label class="flex" style='flex:1' v-for="(item,index) in items" :key="index">
						<view><radio :value="item.value" :checked="index === current" /></view>
						<view class="itemName">{{ item.name }}</view>
					</label>
				</radio-group>
				<view class="drawInput">
					<view class="" v-if="current==0">
						<view class="section">
							<view><input placeholder="请输入银行名称" type="text" v-model="bankName" /></view>
						</view>
						<view class="section">
							<view><input placeholder="请输入XX省XX市XX支行" type="text" v-model="depositBank" /></view>
						</view>
						<view class="section">
							<view><input placeholder="请输入开户名" type="text" v-model="name" /></view>
						</view>
						
						<view class="section">
							<view><input placeholder="请输入收款账号" type="text" v-model="cartNO" /></view>
						</view>
					</view>
					
					<view class="" v-else>
						<view class="section">
							<view><input placeholder="请输入支付宝账号" type="text" v-model="cartNO" /></view>
						</view>
						<view class="section">
							<view><input placeholder="请输入姓名" type="text" v-model="name" /></view>
						</view>
					</view>
				</view>
			</view>
			<view class="drawSubmit" v-if="current==0"><button formType="submit" :class="btnShow ? '': 'btnShow'" :disabled="disabled">确定</button></view>
			<view class="drawSubmit" v-else><button formType="submit" :class="btnShow ? '': 'btnShow'" :disabled="disabled">确定</button></view>
			<!-- button按钮改变隐藏域 -->
			<view style="display:none" >{{ exitsVal }}</view>
		</form>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			bankName:'',
			cartNO: '',
			name: '',
			account: '',
			addflag: false,
			depositBank:'',
			items: [
				{
					value: '0',
					name: '银行卡'

				},
				{
					value: '1',
					name: '支付宝'
				}
			],
			current: 0,
			formValue:'',
			disabled:true,
			btnShow:false,
			ifExist:0
		};
	},
	computed: mapState(['memberInfo']),
	computed:{
		exitsVal:function(){
			if (this.current == 0) {
				this.ifExist=Number(Boolean(this.cartNO))+Number(Boolean(this.name))+Number(Boolean(this.bankName))+Number(Boolean(this.depositBank))
			}else{
			  this.ifExist=Number(Boolean(this.cartNO))+Number(Boolean(this.name))
			}
		}	
	},
	watch:{
		// 监听data中 ifExist的值
		ifExist(newVal,oldVal){
			if(this.current == 0){
				if(Number(newVal) === 4){
					this.disabled = false;
					this.btnShow = true;
				 // 四个input框内都有值时需要做的操作
				}else{
					this.disabled = true;
					this.btnShow = false;
				 // 至少一个没有值
				}
			}else{
				if(Number(newVal) === 2){
					this.disabled = false;
					this.btnShow = true;
				}else{
					this.disabled = true;
					this.btnShow = false;
				}
			}
			
		}
	},
	methods: {
		radioChange: function(evt) {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].value === evt.target.value) {
					this.current = i;
					break;
				}
			}
		},
		formSubmit(e) {
			if (this.addflag) return;
			if(this.current==0){
				if (!this.cartNO || !this.name || !this.depositBank) {
					uni.showToast({
						title: '请输入银行名称/支行/名字',
						duration: 1500,
						icon: 'none'
					});
					return;
				}
			}else{
				if (!this.cartNO || !this.name ) {
					uni.showToast({
						title: '请输入银行名称和支行',
						duration: 1500,
						icon: 'none'
					});
					return;
				}
			}
			
			this.addflag = true;
			if(JSON.stringify(this.formValue) == "{}") return;
			uni.showLoading({
				title:'请稍候',
				mask:true
			})
			this.apiUrl
				.addCard({
					data: {
						bankName:this.bankName,
						cartNO: this.cartNO,
						depositBank: this.depositBank,
						userName: this.name,
						type:this.current==0?1:2
					}
				})
				.then(res => {
					this.formValue = e.detail.value;
					uni.hideLoading();
					this.addflag = false;
					if (res.data.status == 1) {
						uni.showToast({
							title: '添加成功',
							duration: 2000,
							icon:'none'
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 2000);
					}
				});
		}
	}
};
</script>
<style lang="less" scoped>
.rg_check {
	padding-bottom: 30upx;
	.itemName{
		height:48upx;
		font-size:34upx;
		font-family:PingFangSC-Regular;
		font-weight:400;
		color:rgba(51,51,51,1);
		line-height:48upx;
	}
}
.bg {
	height: 100%;
	width: 100%;
	position: relative;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	min-height: 90vh;
	.drawForm {
		padding: 60upx;

		form {
			display: flex;
			justify-content: center;
		}

		.drawInput {
			background-color: white;
			box-sizing: border-box;
			.section {
				border-bottom: solid 1upx #E5E5E5;
				&:first-child{
						border: none;
				}
				input{
					height: 48upx;
					margin: 65upx 0 36upx 0;
					font-size: 34upx;
				}
				.title {
					flex: 1;
					box-sizing: border-box;
					padding: 10upx 0;
					color: #656565;
					margin-top: 20upx;
					font-size: 26upx;
				}
			}
		}
	}

	.drawSubmit {

		text {
			display: flex;
			justify-content: center;
			color: #388ceb;
		}
		button {
			width: 600upx;
			height: 80upx;
			line-height: 80upx;
			background: #fc4e29;
			border-radius: 40px;
			font-size: 30upx;
			color: #ffffff;
		}
		.btnShow{
			background: #E5E5E5;
			color: #FFFFFF;
		}
		.btnShow:after{
			border: none;
		}
	}
}
</style>
