<template>
	<view class="container">
		<view class="task-types">
			<view class="task-card" v-for="(item, index) in taskTypes" :key="index" @tap="selectTask(item)">
				<view class="task-icon">
					<image :src="'/static/logo.png'" mode="aspectFit"></image>
				</view>
				<view class="task-info">
					<text class="task-name">{{item.name}}</text>
					<text class="task-desc">{{item.description}}</text>
				</view>
				<view class="task-arrow">
					<text class="arrow">›</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			taskTypes: [
				{
					id: 1,
					name: '附近获客',
					description: '智能分析目标客户，自动进行精准获客',
					path: '/pages/task/nearby'
				},
				{
					id: 2,
					name: '行业获客',
					description: '智能化管理客户资源，提高客户维护效率',
					path: '/pages/task/industry'
				},
				{
					id: 3,
					name: 'AI客户营销',
					description: '自动化营销策略，提升转化率',
					path: '/pages/task/marketing'
				},
				{
					id: 4,
					name: 'AI成交体系',
					description: '智能化成交流程，提高成单率',
					path: '/pages/task/deal'
				},
				{
					id: 5,
					name: 'AI企业顾问',
					description: '为企业提供智能化经营建议',
					path: '/pages/task/consultant'
				},
				{
					id: 6,
					name: 'AI决策分析',
					description: '数据驱动的决策支持系统',
					path: '/pages/task/analysis'
				},
				{
					id: 7,
					name: 'AI企业大学',
					description: '智能化企业培训体系',
					path: '/pages/task/education'
				}
			]
		}
	},
	methods: {
		selectTask(task) {
			uni.navigateTo({
				url: task.path
			})
		}
	}
}
</script>

<style lang="scss">
.container {
	padding: 20rpx;
	background-color: #f5f6fa;
}

.task-types {
	.task-card {
		display: flex;
		align-items: center;
		background: #ffffff;
		padding: 30rpx;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
		
		.task-icon {
			width: 100rpx;
			height: 100rpx;
			margin-right: 20rpx;
			
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		
		.task-info {
			flex: 1;
			
			.task-name {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 8rpx;
				display: block;
			}
			
			.task-desc {
				font-size: 24rpx;
				color: #666;
				display: block;
			}
		}
		
		.task-arrow {
			.arrow {
				font-size: 40rpx;
				color: #999;
				font-weight: 300;
			}
		}
		
		&:active {
			opacity: 0.8;
		}
	}
}
</style> 