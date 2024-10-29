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
					<input type="password" v-model="pwd" placeholder="请输入密码" />
				</view>
				<view class="function-area">
					<text id="t3" @click="developing()">免费注册</text>
					<text id="t4" @click="developing()">忘记密码？</text>
				</view>
				<!-- <my-button :isLoading="isLoading" :text="new String(`登 录`)" class="button" @click="loginByAccount()">登 录></my-button> -->
				<button class="button" :class="isLoading?'disable':''" @click="loginByAccount()">登 录</button>
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
			<image src="../../static/svgs/email.svg" @click="developing()"></image>
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
				email:"",
				vaiCode:"",
				app:"",
				isLoading:false
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
					uni.showToast({
						title:res.status_text,
						icon:res.status_code === 200?"success":"error",
						duration:1500
					})
					if(res.status_code != 200){
						return
					}
					this.app.globalData.userData = tools.changeNameFromLowerSnakeToCamel(res.data)
					setTimeout(()=>{
						this.isLoading = false
						uni.switchTab({
							url:"/pages/announcement/announcement"
						})
					},1500)
				})
			},
			loginByEmail(){
				
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