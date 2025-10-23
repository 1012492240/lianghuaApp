<template>
	<view class="status-bar" :style="{ height: statusBarHeight + 'px' }">
		<view class="status-bar-bg"></view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const statusBarHeight = ref(0)

onMounted(() => {
	uni.getSystemInfo({
		success: (res) => {
			statusBarHeight.value = res.statusBarHeight
		}
	})
})
</script>

<style lang="scss">
.status-bar {
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
	
	.status-bar-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(90deg, #0E0026, #2a004d) !important;
		backdrop-filter: blur(20px);
	}
}
</style> 