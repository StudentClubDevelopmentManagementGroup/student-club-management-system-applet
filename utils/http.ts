import { baseUrl } from "@/private/backendInfo"

const req = (url: string, method: any, data: object) => uni.request({
	url: baseUrl + url,
	method: method,
	header: {
		"guet-s-c-m-s-token": getApp().globalData.userData.token
	},
	data
}).then(res => {
	console.log(res.data["status_code"]);
	uni.hideLoading()
	
	return res.data;
})

const http = {	
	post: (url: string, data: object) => req(url, 'POST', data),
	get: (url: string, data: object) => req(url, 'GET', data),
}

export default http;
