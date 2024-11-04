<template>
	<view class="main-content" style="background-image: url('/static/images/背景.jpg');">
		<view class="header" style=" background-image: url('/static/images/bg_mailtest_guet_edu_cn_1415261291691.jpg'); ">
			<text id="t1">欢迎使用基地管理系统</text>
			<text id="t2">让社团管理更加简单</text>
		</view>
		<view class="body">
			<view class="account item">
				<image src="../../static/svgs/people.svg"></image>
				<input type="number" placeholder="请输入学号" v-model="account"/>
			</view>
			<view class="password item">
				<image src="../../static/svgs/lock.svg"></image>
				<input type="password" placeholder="请输入密码" v-model="pwd"/>
			</view>
			<view class="department item">
				<image src="../../static/svgs/department.svg"></image>
				<picker
					mode="selector"
					:range="departmentInfo"
					range-key="fullName"
					@change="changePcikerVal">
					<text>{{departmentName}}</text>
				</picker>
			</view>
			<view class="name item">
				<image src="../../static/svgs/name.svg"></image>
				<input type="text" placeholder="请输入姓名" maxlength="16" v-model="name"/>
			</view>
			<view class="telephone item">
				<image src="../../static/svgs/telephone.svg"></image>
				<input type="tel" placeholder="请输入电话" maxlength="11" v-model="tel"/>
			</view>
			<view class="email item">
				<image src="../../static/svgs/email_black.svg"></image>
				<input type="text" placeholder="请输入邮箱地址" v-model="email"/>
			</view>
			<view class="item" id="veriCode">
				<view id="veriCode-left">
					<image src="../../static/svgs/verification_code.svg"></image>
					<input placeholder="请输入验证码" v-model="register_code"/>
				</view>
				<button id="veriCode-right" :class="countdownInstantiate?'disable':''" @click="askForRegisterCode()">{{countdownText}}</button>
			</view>
		</view>
		<button id="register" @click="register()">立 即 注 册</button>
	</view>
</template>

<script>
	import http from "@/utils/http.ts"
	import tools from "@/utils/tools.js"
	export default {
		data() {
			return {
				account:"",
				pwd:"",
				departmentName:"请选择院系",
				departmentId:null,
				name:"",
				tel:"",
				email:"",
				register_code:"",
				role:"student",
				
				departmentInfo:[],
				countdownText:"获取验证码",
				countdownInstantiate:null,
				countdownTime:60,
				app:null
			}
		},
		methods: {
			register(){
				if(!this.checkInputLegality()){
					return
				}
				http.post("/user/register",{
					user_id:this.account,
					pwd:this.pwd,
					department_id: this.departmentId,
					name: this.name,
					tel: this.tel,
					mail: this.email,
					register_code: this.register_code,
					role: this.role
				}).then(res=>{
					uni.showToast({
						title:res.status_text,
						icon:res.status_code === 201?'success':'error'
					})
					if(res.status_code != 201){
						return
					}
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
				})
			},
			askForRegisterCode(){
				if(!this.checkEmailLegality()){
					uni.showToast({
						title:"请正确填写邮箱",
						icon:'error'
					})
					return
				}
				http.post(`/user/register/email/send_code?email=${this.email}`).then(res=>{
					uni.showToast({
						title:'验证码已发送至邮箱',
						icon:'success'
					})
					this.startCountdown()
				})
			},
			checkInputLegality(){
				if(!this.account){
					uni.showToast({
						title:'学号不能为空',
						icon:'error'
					})
					return false
				}
				if(!this.pwd){
					uni.showToast({
						title:'密码不能为空',
						icon:'error'
					})
					return false
				}
				if(!this.departmentId){
					uni.showToast({
						title:'请选择院系',
						icon:'error'
					})
					return false
				}
				if(!this.name){
					uni.showToast({
						title:'姓名不能为空',
						icon:'error'
					})
					return false
				}
				if(!this.tel){
					uni.showToast({
						title:'电话号码不能为空',
						icon:'error'
					})
					return false
				}
				else if(this.tel.length !== 11 || !Number(this.tel)){
					uni.showToast({
						title:'请正确填写电话号码',
						icon:'error'
					})
					return false
				}
				if(!this.checkEmailLegality()){
					uni.showToast({
						title:'请正确填写邮箱',
						icon:'error'
					})
					return false
				}
				if(!this.register_code){
					uni.showToast({
						title:'请填写验证码',
						icon:'error'
					})
					return false
				}
				return true
			},
			checkEmailLegality(){
				const strictEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
				return strictEmailPattern.test(this.email)
			},	
			changePcikerVal(e){
				this.departmentId = this.departmentInfo[e.detail.value]['id']
				this.departmentName = this.departmentInfo[e.detail.value]['fullName']
			},
			startCountdown(){
				this.countdownInstantiate = setInterval(()=>{
					if(this.countdownTime < 1){
						this.countdownTime = 60
						this.countdownText = '获取验证码'
						clearInterval(this.countdownInstantiate)
						this.countdownInstantiate = null
						return
					}
					this.countdownTime -= 1
					this.countdownText = this.countdownTime.toString() + "S"
				},1000)
			}
		},
		beforeRouteLeave(){
			this.$data = {}
		},
		
		onLoad(){
			this.app = getApp()
			http.get("/department/all").then(res=>{
				this.departmentInfo = res.data
			}).catch(err=>{
				uni.showToast({
					title:"当前服务不可用",
					icon:"error"
				})
				setTimeout(()=>{
					uni.nav
				})
			})
		}
	}
</script>

<style scoped>
@import url(./register.css);
</style>
