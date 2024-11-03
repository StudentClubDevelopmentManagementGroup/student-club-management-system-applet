<template>
	<view class="main-content" style="background-image: url('/static/images/背景.jpg');">
		<view class="header" style=" background-image: url('/static/images/bg_mailtest_guet_edu_cn_1415261291691.jpg'); ">
			<text id="t1">欢迎使用基地管理系统</text>
			<text id="t2">让社团管理更加简单</text>
		</view>
		<view class="body">
			<view class="account-login" :class="isAccountLogin?'':'disable'">
				<view class="input-account">
					<image src="../../static/svgs/people.svg" mode="aspectFit"></image>
					<input v-model="account" maxlength="32" placeholder="请输入学号">
				</view>
				<view class="input-password">
					<image src="../../static/svgs/lock.svg" mode="aspectFit"></image>
					<input type="password" v-model="pwd" maxlength="512" placeholder="请输入密码" />
				</view>
				<view class="function-area">
					<text id="t3" @click="developing()">免费注册</text>
					<text id="t4" @click="developing()">忘记密码？</text>
				</view>
				<!-- <my-button :isLoading="isLoading" :text="new String(`登 录`)" class="button" @click="loginByAccount()">登 录></my-button> -->
				<button class="button" :class="isLoading?'disable':''" @click="loginByAccount()">登 录</button>
			</view>
			<view class="email-login" :class="isAccountLogin?'disable':''">
				<view class="input-email">
					<image src="../../static/svgs/people.svg"></image>
					<input v-model="account" maxlength="32"  type="text" placeholder="请输入学号" />
				</view>
				<view class="input-code">
					<view style="display:flex; align-items: center;  height:100%; width:50%;	border-bottom: 2px solid black;">
						<image src="../../static/svgs/verification_code.svg"></image>
						<input v-model="veriCode" type="text" placeholder="请输入验证码" />
					</view>
					<button :class="countdownInstantiate?'disable':''" @click="getVeriCode()">{{code_text}}</button>
				</view>
				<button class="button" :class="isLoading?'disable':''" @click="loginByEmail()">登 录</button>
			</view>
		</view>
		<view class="footer">
			<view class="divider">
				<view class="line"></view>
				<text>其他登录方式</text>
				<view class="line"></view>
			</view>
			<image v-if="isAccountLogin" src="../../static/svgs/email.svg" @click="()=>{isAccountLogin = !isAccountLogin}"></image>
			<image v-else src="../../static/svgs/people.svg" @click="()=>{isAccountLogin = !isAccountLogin}"></image>
		</view>
	</view>
</template>

<script>
	import http from "@/utils/http.ts"
	import tools from "@/utils/tools.js"
	export default {
		data() {
			return {
				isAccountLogin:true,
				account:"",
				pwd:"",
				veriCode:"",
				app:"",
				isLoading:false,
				code_text:'获取验证码',
				countdownTime:60,
				countdownInstantiate:null
			}
		},
		onLoad() {
			this.app = getApp()
		},
		methods: {
			loginByAccount(){
				if(!this.account){
					uni.showToast({
						title:"请输入账号",
						icon:'error'
					})
					return
				}
				if(!this.pwd){
					uni.showToast({
						title:"请输入密码",
						icon:'error'
					})
					return
				}
				this.isLoading = true
				uni.showLoading({
					title:"登录中..."
				})
			
				http.post('/user/login/password', {
					user_id: this.account,
					pwd: this.pwd
				}).then(res=>{
					this.isLoading = false
					this.toastHttpRequestInfo(res)
					if(res.status_code != 200){
						return
					}
					this.gotoMainPage(res)
				})
			},
			loginByEmail(){
				if(!this.account){
					uni.showToast({
						title:"请输入账号",
						icon:'error'
					})
					return
				}
				if(!this.veriCode){
					uni.showToast({
						title:"请输入验证码",
						icon:'error'
					})
					return
				}
				this.isLoading = true
				http.post("/user/login/email",{
					user_id:this.account,
					code:this.veriCode
				}).then(res=>{
					this.isLoading = false
					this.toastHttpRequestInfo(res)
					if(res.status_code !== 200){
						return
					}
					this.gotoMainPage(res)
				})
				
			},
			getVeriCode(){
				if(!this.account){
					uni.showToast({
						title:"请输入账号",
						icon:'error'
					})
					return
				}
				http.post(`/user/login/email/send_code?user_id=${this.account}`).then(res=>{
					this.toastHttpRequestInfo(res)
					if(res.status_code !== 200){
						return
					}
					this.startInterval()
				})
			},
			gotoMainPage(res){
				this.app.globalData.userData = tools.changeNameFromLowerSnakeToCamel(res.data)
				setTimeout(()=>{
					uni.switchTab({
						url:"/pages/notice/notice"
					})
				},1500)
			},
			startInterval(){
				this.countdownInstantiate = setInterval(()=>{
					if(this.countdownTime){
						this.countdownTime -= 1
						this.code_text = this.countdownTime.toString() + " S"
					}
					else{
						this.countdownTime = 60
						this.code_text = "获取验证码"
						clearInterval(this.countdownInstantiate)
						this.countdownInstantiate = null
					}
				},1000)
			},
			toastHttpRequestInfo(res){
				uni.showToast({
					title:res.status_text,
					icon:res.status_code === 200?"success":"error",
					duration:1500
				})
			},
			developing(){
				uni.showToast({
					title:"该功能正在开发",
					icon:"none"
				})
				return
			}
		}
	}
</script>

<style lang="css" scoped>
@import url(./login.css);
</style>