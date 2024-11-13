<script lang="ts">
	export default {
		globalData: {
			userData: {
				token: ''
			},
			appData:{
				currentClubIndex:null,
			}
		},

		onLaunch: function () {
			console.log('App Launch')

		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>