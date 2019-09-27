<template>
	<view class="car ">

		<view class="car-item background-white" v-for="(item,index) in goodsList" :key='index'>
			<view class="left flex-box">
				<view class="def-circle flex-box" :class="{active:item.select}" @tap="selectGoods(index)">
				<view class="flex-box" v-if="item.select">
					<image class="button-press" src="/static/img/self/shopping-button-press.png"></image>
				</view>
				</view>
			</view>
			<view class="right">
				<!-- 商品 -->
				<view class="goods-list list-inline relative">
					<view class="list-item">
						<view class="del-img">
							<image src="/static/img/self/icon_delete_pressed@2x.png" mode="widthFix" @tap="delShopping(item.id)"></image>
						</view>
						<view class="list-img">
							<image :src="item.imageUrl" mode="widthFix" @tap="goProductDetail(item)"></image>
						</view>
						<view class="list-info">
							<view class="list-name title-black fs36 fw500 .uni-ellipsis">
								{{item.productName}}
							</view>
							<view class="fs28 color9">
								剩余<text class="primary-color fs32">3</text>人次
							</view>
							<!-- <view class="gray fs24">
								<text v-if="item.modelName&&item.modelName!='无'">规格：{{item.modelName}} </text>
								<image src="/static/img/pubulic_icon_expand_down@2x.png"
								 mode="widthFix" @tap="selectProductModel(item,index)" v-if="editOrder&&item.enable&&item.modelName&&item.modelName!='无'" class="edit">
								 </image>
							</view> -->
							<view class="list-price mgt20 ">
								<uni-number-box v-if="item.enable" :min="1" :value='item.amount' @change='changeGoodsAmount($event,index)'></uni-number-box>
								<view class="fs30 orange">￥<text class="fs42 orange">{{item.price}}</text></view>
							</view>
							<!-- <view class="modelName" v-if="item.modelName"> -->
							<view class="modelName">
								<view v-for="(item,index) in modelArr" :key="index" 
								class="modelName-item flex-box fs30 color6" 
								:class="{ model_check: item.active }"
								@tap="changeModel(index)">
								{{item.modelName}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="" style="height: 130upx;">

		</view>
		<view class="car-money background-white" v-if="goodsList.length">
			<view class="emptyCart betweenBox">
				<view class="emptyCart-left flex-align">
					<input class="custom-quantity flex-box primary-color" v-model="customQuantity" />
					<view>次</view>
				</view>
				<view class="emptyCart-right fs32 fw500 primary-color flex-align">
					<view class="continue-add flex-box">
						继续添加
					</view>
					<view class="del-all flex-box" @tap="delShoppingCar">
						清空
					</view>
				</view>
			</view>
			<view class="flex-align all-chose">
				<view class="left flex-box">
					<view class="def-circle flex-box" :class="{active:selectAll}" @tap="buyAll">
						<view class="flex-box" v-if="selectAll">
							<image class="button-press" src="/static/img/self/shopping-button-press.png"></image>
						</view>
					</view>
				</view>
				<view class="right betweenBox" >
					<view class="">
						<text>全选</text>
					</view>
					<view class="flex-box">
						<template>
							<text class="fs30">合计：</text>
							<text class="orange fs30">￥</text>
							<text class="orange fs40">{{totalMoney}}</text>
							<text class="paybtn flex-box white mgl30 fs36" :class="{pay_active:totalMoney}" @tap="check">去结算</text>
						</template>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹出选择商品 -->
		<view class="car-pop" v-if="showPop">
			<view class="content">
				<view class="close-icon">
					<uni-icon type="closeempty" size='30' @click='showPop=false'></uni-icon>
				</view>
				<view class="top-img">
					<view class="left">
						<image :src="modelSource.image||modelSource.productImageList[0].imageUrl" mode="widthFix" class="w100"></image>
					</view>
					<view class="right">
						<view class="red fs36">
							￥{{(selectModel?selectModel.price:false)||modelSource.price}} 元
						</view>
						<view class="gray fs24" v-if="modelSource.stock">
							库存 {{(selectModel?selectModel.stock:false)||modelSource.stock}} 件
						</view>
						<view class="">
							请选择规格 数量
						</view>
					</view>
				</view>
				<view class="pdl20 pdr20">
					<view class="" v-if="modelSource.mulType" v-for="(item,index) in modelSource.attributeKeyList" :key='index'>
						<view class="">
							选择{{item.keyName}}
						</view>
						<view class="size-choose">
							<view class="size-btn mgt10" v-for="(subitem,subindex) in item.valueList" :key='subindex' :class="{'active-btn':subitem.active}"
							 @tap="selectAttr(subitem,index,subindex)">
								{{subitem.valueName}}
							</view>
						</view>
					</view>
					<view class="buy-btn" @tap='confirmModel'>
						确定
					</view>
				</view>
			</view>
		</view>
		<view class="emptyCar  tac" v-if="!goodsList.length">
			<image src="/static/img/cart1.png" mode="widthFix"></image>
			<view class="fs30 gray">
				您的购物车还没有商品，赶紧去首页挑选吧~
			</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from "@/components/uni-number-box.vue"
	import uniPopup from "@/components/uni-popup.vue"
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				selectAll: false,
				showPop: false,
				goodsList: [],
				totalMoney: 0,
				modelSourceIndex:0,
				modelSource:null,
				selectModel:null,
				editCarBol:true,
				modelArr:[{modelName:20,active: false},{modelName:30,active: false},{modelName:50,active: false},{modelName:'梭哈',active: false}],
				modelName:'',
				customQuantity:'',
			};
		},
		computed:{
			...mapState([
				'memberInfo'
			]),
			// 多语言
			i18n () {
				return this.$t('index')  
			}  
		},
		onLoad() {
			if(this.memberInfo){
				this.getList()
			}
		},
		onShow() {
			if(this.memberInfo){
				this.getList()
			}
			uni.setNavigationBarTitle({
				title:this.$t('tabs.cart')
			});
		},
		mounted(){

		},
		onPullDownRefresh() {
		    if(this.memberInfo){
		    	this.getList()
		    }else{
		    	uni.showToast({
		    		title: '请登录',
		    		mask: false,
		    		icon:'none',
		    		duration: 1500
		    	});
		    }
		    setTimeout( ()=>{
				 uni.stopPullDownRefresh();
		    }, 1000);
		},
		methods: {
			changeModel(index) {
				let arr = this.modelArr;
				arr.forEach(item => (item.active = false));
				arr[index].active = true;
				this.modelArr = arr;
				this.modelName = this.modelArr[index].modelName;
				console.log("this.modelName",this.modelName)
			},
			
			goProductDetail(item){
				console.log(item);
				if(item.enable){
					uni.navigateTo({
						url:'../product/product-detail?id='+item.productId,
						animationType: 'pop-in',
						animationDuration: 200
					})
				}
			},
			//下单
			check(){
				let arr = [];
				this.goodsList.forEach(item=>{
					if(item.select){
						item.type=2;
						item.shoppingCartIds = item.id;
						arr.push(item)
					}
				})
				if(arr.length){
					//商品是否已下架处理
					let bol = false;
					arr.forEach(item=>item.enable?'':bol=true)
					if(bol){
						uni.showToast({
							title:'不能提交已下架商品',
							icon:'none',
							duration:1500
						})
						return
					}
					//商品是否已下架处理
					uni.setStorage({
						key:'payingProduct',
						data:arr,
						success: () => {
							uni.navigateTo({
								url:'/pages/order/fillOrder/fillOrder?type=2'
							})
						}
					})
				}else{
					uni.showToast({
						title:'请选择至少一项商品',
						icon:'none',
						duration:2000
					})
				}
			},
			//更改型号
			confirmModel(){
				if (this.modelSource.mulType) {
					//多型号
					let arr = this.modelSource.attributeKeyList;
					let num = 0;
					arr.forEach(item => {
						item.valueList.forEach(subitem => {
							subitem.active ? num++ : ''
						})
					})
					if (num < arr.length) {
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: '请选择型号规格'
						})
						return
					}
				}
				//submit
				let data = {
					id: this.goodsList[this.modelSourceIndex].id,
					amount:this.goodsList[this.modelSourceIndex].amount
				}
				this.modelSource.mulType?data.modelId = this.selectModel.id:data.modelId =this.modelSource.productModelList[0].id

				this.apiUrl.editShoppingcar({
					data
				}).then(res => {
					if(res.data.status==1){
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: '修改成功'
						});
						this.showPop=!this.showPop;
						this.getList();
					}

				});
			},
			//获取详情
			getProduct(id){
				this.apiUrl.getGoodsdetail({data:{
					id
				}}).then(res=>{
					if(res.data.status!=1) return
					this.modelSource= res.data.data;
					this.showPop=!this.showPop;

				})
			},
			//弹出窗口 规格
			selectAttr(subitem,pIndex, sIndex) {
				let arr = this.modelSource.attributeKeyList[pIndex];
				arr.valueList.forEach(item => item.active = false);
				arr.valueList[sIndex].active = true;
				this.modelSource.attributeKeyList.splice(pIndex, 1, arr);
				//点击 查询 选择规格
				this.initSelectModel();
				//更换不同model图片
				if (subitem.imageUrl) {
					this.attibuteImg = subitem.imageUrl;
				}
			},
			initSelectModel() {
				// 筛选 用户选择的组合
				let arr = this.modelSource.attributeKeyList;
				let idsArr = [];
				arr.forEach(item => {
					item.valueList.forEach(subitem => {
						subitem.active ? idsArr.push(subitem.id) : ''
					})
				})
				console.log(idsArr);
				let targetGoods = null;

				let pmArr = this.modelSource.productModelList;
				for (let i = 0; i < pmArr.length; i++) {
					let bol = true
					for (let y = 0; y < idsArr.length; y++) {
						if (pmArr[i].valueIds.indexOf(idsArr[y]) == -1) {
							bol = false;
							break
						}
					}
					if (bol && idsArr.length === arr.length) {
						console.log(pmArr[i])
						targetGoods = pmArr[i];
					}
				}
				this.selectModel = targetGoods;
			},
			//选择列表商品
			selectProductModel(product,index){
				this.modelSourceIndex = index;
				this.getProduct(product.productId);
			},
			//car 选择 数量
			changeGoodsAmount(e, index) {
				if(!this.editCarBol) return
				this.editCarBol = false
				this.apiUrl.editShoppingcar({data:{
					amount:e,
					id:this.goodsList[index].id,
					modelId:this.goodsList[index].modelId
				}}).then(res=>{
					this.editCarBol = true
					let arr = this.goodsList;
					let num = arr[index].amount;
					res.data.status==1?arr[index].amount = e:arr[index].amount = num;
					this.goodsList = arr;
					this.initTotalMoney();
					if(res.data.status!=1){
						console.log(res)

						uni.showToast({
							icon:'none',
							duration:2000,
							title:res.data.message
						})
					}
				})
			},
			//选择商品
			selectGoods(index) {
				let arr = this.goodsList;
				arr[index].select = !arr[index].select;
				this.goodsList = arr;
				
				//是否全选
				this.selectAll =  arr.every(item=>item.select == true);
				this.initTotalMoney();
			},
			//删除单一商品
			delShopping(id) {
				this.apiUrl.delShoppingCar({
					data: {
						id: id
					}
				}).then(res => {
					if (res.data.status == 1) {
						uni.showToast({
							icon: 'success',
							duration: 2000,
							title: '删除成功'
						})
						this.getList();
					}
				})
			},
			//删除车
			delShoppingCar(id) {
				let arr = this.goodsList;
				let idarr = [];
				arr.forEach(item => {
					item.select ? idarr.push(item.id) : ''
				})
				this.apiUrl.delShoppingCar({
					data: {
						id: idarr.join(',')
					}
				}).then(res => {
					if (res.data.status == 1) {
						uni.showToast({
							icon: 'success',
							duration: 2000,
							title: '删除成功'
						})
						this.getList();
					}
				})
			},
			getList() {
				this.apiUrl.getShoppingCarList({
					data: {
						memberId: this.memberInfo.id
					}
				}).then(res => {
					if (res.data.status == 1) {
						console.log(res)
						if(res.data.data.length){
							let arr = res.data.data[0].shoppingCartList;
							arr.forEach(item => item.select = false);
							arr = this.setImgSize(arr,'200x200','imageUrl');
							this.goodsList = arr;
						}else{
							this.goodsList = []
						}
					}
				})
			},
			//计算总价
			initTotalMoney() {
				let m = 0;
				this.goodsList.forEach(item => {
					if (item.select) {
						m += item.price * item.amount
					}
				})
				this.totalMoney = m;
			},
			buyAll() {
				this.selectAll = !this.selectAll;
				let arr = this.goodsList;
				arr.forEach(item => item.select = this.selectAll);
				this.goodsList = arr;
				this.initTotalMoney();
			}
		},
		components: {
			uniNumberBox,
			uniPopup
		}
	}
</script>

<style lang="less" scoped>
	.emptyCart{
		padding: 0 37upx;
		height: 130upx;
		box-sizing:border-box;
		border-top:1upx solid #E8E8E8;
		border-bottom:1upx solid #E8E8E8;
		.custom-quantity{
			width:137upx;
			height:60upx;
			border:2upx solid rgba(244,87,108,1);
			border-radius:30upx;
			text-align: center;
			margin-right: 12upx;
		}
		.emptyCart-right{
			.continue-add,.del-all{
				width:auto;
				height:60upx;
				border:2upx solid rgba(244,87,108,1);
				border-radius:30upx;
				padding: 0 36upx;
			}
			.continue-add{
				margin-right: 34upx;
			}
		}
	}
	
	.goods-list.list-inline .list-item .list-name{
		width:350upx;
		height:36upx;
		line-height: 36upx;
		color:rgba(51,51,51,1);
		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding: 0;
	}
	.list-item{
		.modelName{
			float: left;
		}
		.modelName-item{
			width:83upx;
			height:60upx;
			border:1upx solid rgba(223,223,223,1);
			border-radius:10upx;
			margin : 26upx 15upx 0 0;
			float: left;
			box-sizing: border-box;
		}
		.model_check{
			border:1px solid rgba(254,106,114,1);
			color:rgba(254,106,114,1);
		}
		.modelName-item:last-child{
			margin-right: 0;
		}
		.del-img{
			position: absolute;
			width: 28upx;
			height: 40upx;
			right: 0upx;
			top: 0upx;
			image{
				width: 28upx;
				height: 40upx;
			}
		}
	}
	.emptyCar{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		image{
			width:300upx;
		}
	}
	.edit {
		width: 25upx;
		margin-left: 20upx;
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

	.car-money {
		position: fixed;
		bottom: 0;
		/* #ifdef H5 */
		bottom: var(--window-bottom);
		/* #endif */
		left: 0;
		width: 100%;
		z-index: 10;
		.all-chose{
			height: 90upx;
			margin-bottom: 18upx;
		}
		.left {
			padding: 0 21upx 0 30upx;
			width: 44upx;
		}

		.right {
			flex: 2;
		}

		.paybtn {
			width:200upx;
			height:90upx;
			background:rgba(180,180,180,1);
		}
		.pay_active{
			background:rgba(254,106,114,1);
		}

		.delbtn {
			background-color: #eb4847;
			background-image: none;
			width:260upx;
			height:80upx;
			background:rgba(249,83,26,1);
			border-radius:40upx;
			color: white;
			font-size: 36upx;
		}
	}

	.car {
		padding-bottom: 110upx;

		.car-item {
			border-bottom: 1upx solid #E8E8E8;
			padding: 47upx 37upx;
			display: flex;
			
			.left{
				height: 210upx;
			}

			.right {
				flex: 1;
			}
			.active {
				border: none;
				box-sizing: border-box;
			}
		}
	}

	.goods-list.list-inline {
		margin: 0;
	}
	.goods-list .list-item{
		margin: 0;
		padding: 0;
	}
	.goods-list.list-inline .list-item .list-img{
		position: relative;
		width:210upx;
		height:210upx;
		margin: 0 32upx 0 11upx;
		background:rgba(250,250,250,1);
		image{
			width: 100%;
			width:210upx;
			height:210upx;
		}
	}
</style>
