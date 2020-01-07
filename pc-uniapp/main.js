import Vue from 'vue'
import App from './App'
import uniIcons from "@/components/uni-icons/uni-icons.vue" //uniIcon图标
import apiUrl from './common/apiUrl.js'
import myMixin from '@/common/myMixin.js'
import store from './store'
// var VConsole = require('./common/vconsole.min.js');
// var vConsole = new VConsole();

// 多语言
// import VueI18n from 'vue-i18n'  
import VueI18n from '@/common/language/vue-i18n.js'
import messages from '@/common/language/lang.js'
Vue.use(VueI18n)  
Vue.config.productionTip = false;

const i18n = new VueI18n({  
  locale: 'zh-CN',  // 默认选择的语言
  messages 
})  
Vue.prototype._i18n = i18n //防止app微信报错$t函数不存在
// 多语言结束

// 复制功能
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);
// 复制功能end

Vue.prototype.$store = store
Vue.config.productionTip = false

App.mpType = 'app'
Vue.component('uni-icons',uniIcons)
const app = new Vue({
	i18n,
	store,
    ...App
})
app.$mount()
//mixin
Vue.mixin(myMixin)
//request
Vue.prototype.apiUrl=apiUrl;
//全局数据
Vue.prototype.globalData = {
	projectInfo: {
		appId: "",
		projectIcon: "",
		projectName: "",
		autoId:"",
		wxAppId:"wx418bbb4be427019a"
	},
	customizeTabsList: {},
	g_location: {
		lat: 0,
		lng: 0
	},
	comUrl: "https://mg.vzmapp.com/wc_mg/",
    paymentUrl: "https://pay-gw.vzmapp.com",
};

//全局请求方法
Vue.prototype.networkRequest = function(obj) {
	if (!obj || !obj.url) {
		console.log('app.request:', 'request url cannot be null');
		return;
	}
	//组装URLs
	obj.url = this.globalData.comUrl + obj.url;
	
	if (obj.cache != false) {
		let key = obj.url + JSON.stringify(obj.data || {});
		let cacheRes = uni.getStorageSync(key);
		//有缓存，直接返回
		if (cacheRes) {
			obj.success(cacheRes);
		}

		let succes = obj.success;

		obj.success = function(res) {
			//处理res.data，相当于小程序的getJsonData()
			if(res && res.data.length > 5) {
				let jsonStr = res.data.substring(5, res.data.length - 1);
				res.data = JSON.parse(jsonStr);
			}
			
			//对比数据是否有更新
			if (res && (!cacheRes.data || res.data != cacheRes.data)) {
				uni.setStorageSync(key, res);
				succes(res);
			}
		};
		uni.request(obj);
	}
};

//获取缩略图
Vue.prototype.getThumnailImage = function(imageUrl, str) {
	let index = imageUrl.lastIndexOf('.');
	imageUrl = imageUrl.substr(0, index) + str + imageUrl.substr(index, imageUrl.length - index);
	return imageUrl;
};

//展示默认样式的模态框
Vue.prototype.showDefaultModal = function(titleStr) {
	 if (titleStr) {
		uni.showModal({
			title: titleStr,
			showCancel: false
		})
	}
	return;
};

//展示默认样式的提示框
Vue.prototype.showDefaultToast = function(titleStr) {
	uni.showToast({
		title: titleStr,
		icon: 'none',
		duration: 2000
	});
}