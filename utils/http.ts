import { baseUrl } from "@/private/backendInfo"

/**
 * 调试用的函数，用来打印 HTTP 响应内容
 */
function debugLogResponse(res: any) {
	console.group("debugLogResponse")
	if (res.data.status_code / 100 == 2) {
		console.log(
			"%c%d",
			"color: #fff; background-color: #090; padding: 0.2em;",
			res.data["status_code"]
		)
		console.log(res.data)
	}
	else {
		console.log(
			"%c%d",
			"color: #fff; background-color: #900; padding: 0.2em;",
			res.data["status_code"]
		)
		console.log(res.data)
	}
	console.groupEnd()
}

const req = (url: string, method: any, data: object) => uni.request({
	url: baseUrl + url,
	method: method,
	header: {
		"guet-s-c-m-s-token":getApp().globalData.userData.token
	},
	data
}).then(res => {

	debugLogResponse(res); // <-- tmp

	uni.hideLoading()
	
	if (res.data["status_code"] === 401) {
		uni.reLaunch({url: "/pages/login/login"})
	}
	
	return res.data;
})

const http = {
	post: (url: string, data: object) => req(url, 'POST', data),
	get: (url: string, data: object) => req(url, 'GET', data),
}

export default http;
