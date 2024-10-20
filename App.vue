<script lang="ts">
	import { userData } from '@/types/index';

	export default {
		globalData:{
			user_data : {
				user_info: {
					user_id: '',
					department: {
						department_name: ''
					},
					name: '',
					tel: '',
					mail: '',
					role: {
						is_student: false,
						is_teacher: false,
						is_club_member: false,
						is_club_manager: false,
						is_super_admin: false
					}
				},
				token: ''
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