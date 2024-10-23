<template>
	<view class="main-content" style="background-image: url('/static/images/背景.jpg');">
		<view class="header" style=" background-image: url('/static/images/bg_mailtest_guet_edu_cn_1415261291691.jpg'); ">
			<text id="t1">欢迎使用基地管理系统</text>
			<text id="t2">让社团管理更加简单</text>
		</view>
		<view class="body">
			<view v-if="isAccountLogin" class="account-login">
				<view class="input-account">
					<image src="../../static/svgs/people.svg" mode="aspectFit"></image>
					<input v-model="account" placeholder="请输入学号"/>
				</view>
				<view class="input-password">
					<image src="../../static/svgs/lock.svg" mode="aspectFit"></image>
					<input v-model="pwd" placeholder="请输入密码" />
				</view>
				<view class="function-area">
					<text id="t3">免费注册</text>
					<text id="t4">忘记密码？</text>
				</view>
				<button @click="loginByAccount()">登录</button>
			</view>
			<view v-else class="email-login">
				
			</view>
		</view>
		<view class="footer">
			<view class="divider">
				<view class="line"></view>
				<text>快捷登录方式</text>
				<view class="line"></view>
			</view>
			<image src="../../static/svgs/email.svg"></image>
		</view>
	</view>
</template>

<script>
	import apiClient from "@/utils/http.ts"
	export default {
		data() {
			return {
				isAccountLogin:true,
				account:"",
				pwd:"",
				email:"",
				vaiCode:"",
				app:""
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
				uni.showLoading({
					title:"登录中..."
				})
				apiClient.post('/user/login/password',{
					user_id:this.account,
					pwd:this.pwd
				}).then(res=>{
					uni.hideLoading()
					uni.showToast({
						title:res.status_text,
						icon:Error
					})
					if(res.status_code != 200){
						return
					}
					this.app.globalData.userData = res.data
					setTimeout(()=>{
						uni.switchTab({
							url:"/pages/notice/notice"
						})
					},0)
					
				})
			},
			loginByEmail(){
				
			}
			
		}
	}
</script>

<style lang="css" scoped>
@import url(./login.css);
</style>