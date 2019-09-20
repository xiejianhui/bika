<script>
export default {
	onLaunch: function() {
		// 多语言
		var lan = 'zh'
		try {
			const res = uni.getSystemInfoSync();
			lan = res.language
		} catch (e) {
			console.log('error='+e)
		}
		console.log('lan='+lan); 
		if(lan == 'en') {
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
		}
		if(lan == 'zh-Hans-CN' || lan=='zh') {
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
		}
		// 多语言end
		console.log('App Launch');
		this.$store.dispatch('getSystemInfo');
	},
	onShow: function() {
		// console.log('App Show')
		//init address  and member
		this.$store.commit('saveStorageMember');
	},
	onHide: function() {
		// console.log('App Hide')
	}
};
</script>

<style lang="less">
/*每个页面公共css */
@import './common/uni.css';
@import './common/common.less';

</style>
