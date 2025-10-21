<template>
  <view class="container">
    <u-navbar
      title="任务列表"
      :autoBack="true"
      fixed
      placeholder
      bgColor="#ffffff"
      titleStyle="color: #333333; font-size: 16px;"
    ></u-navbar>

    <view class="task-section">
      <view class="task-list">
        <view v-for="(task, index) in tasks" :key="index" class="task-item">
          <view class="task-info">
            <view class="task-type">
              <text>{{ getTaskTypeName(task.taskName) }}</text>
            </view>
            <view class="task-time">
              <text>{{ task.start }} - {{ task.end }}</text>
            </view>
          </view>
          <view class="task-actions">
            <u-icon name="trash" size="40rpx" color="#FF3B30" @tap="deleteTask(index)"></u-icon>
          </view>
        </view>

        <view class="add-task" @tap="showAddTaskModal = true">
          <u-icon name="plus" size="40rpx" color="#007AFF"></u-icon>
          <text>添加任务</text>
        </view>
      </view>
    </view>

    <!-- 添加任务弹窗 -->
    <u-popup :show="showAddTaskModal" mode="bottom" height="60%">
      <view class="add-task-modal">
        <view class="modal-header">
          <text class="title">添加任务</text>
          <u-icon name="close" size="32rpx" color="#999" @tap="showAddTaskModal = false"></u-icon>
        </view>

        <view class="modal-content">
          <view class="form-item">
            <text class="label">任务类型</text>
            <view class="task-type-selector">
              <view
                v-for="type in taskTypes"
                :key="type.value"
                class="type-item"
                :class="{ active: selectedTaskType === type.value }"
                @tap="selectedTaskType = type.value"
              >
                <text>{{ type.label }}</text>
              </view>
            </view>
          </view>

          <view class="form-item">
            <text class="label">时间段</text>
            <view class="time-selector">
              <view class="time-pickers-container">
              <up-datetime-picker
                hasInput
                v-model="startTime"
                mode="time"
                placeholder="开始时间"
                @confirm="handleStartConfirm"
                class="time-picker"
              ></up-datetime-picker>
              <text class="separator">至</text>
              <up-datetime-picker
                hasInput
                v-model="endTime"
                mode="time"
                placeholder="结束时间"
                @confirm="handleEndConfirm"
                class="time-picker"
              ></up-datetime-picker>
            </view>
            </view>
          </view>
        </view>

        <view class="modal-footer">
          <view class="confirm-btn" @tap="addTask">确认</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api,responseHandler } from '@/api/index.js';



// 获取用户配置
const getUserConfig = async () => {
  try {
    const res = await api.getUserConfig();
    if (res.data?.data?.config_content?.task_list) {
      tasks.value = res.data.data.config_content.task_list;
    }
  } catch (error) {
	   responseHandler.error(error);
 
  }
};

// 更新用户配置
const updateUserConfig = async (newTasks) => {
  try {
    const res = await api.getUserConfig();
    const existingConfig = res.data?.data?.config_content || {};
    
    await api.updateUserConfig({
      ...existingConfig,
      task_list: newTasks
    });
  } catch (error) {
    uni.showToast({ title: '更新失败', icon: 'none' });
  }
};

const tasks = ref([]);

const taskTypes = [
  { label: '抖音养号', value: 'douyinyanghao' },
  { label: '抖音点赞', value: 'douyinLike' },
  { label: '抖音私信', value: 'douyinsixin' },
  { label: '抖音回复', value: 'douyinreply' }
];

const showAddTaskModal = ref(false);
const selectedTaskType = ref('');

const startTime = ref('00:00');
const endTime = ref('00:00');

const getTaskTypeName = (taskName) => {
  const type = taskTypes.find(t => t.value === taskName);
  return type ? type.label : taskName;
};

const handleStartConfirm = (e) => {
  startTime.value = e.value;
};

const handleEndConfirm = (e) => {
  const start = startTime.value.split(':').map(Number);
  const end = e.value.split(':').map(Number);
  
  if (end[0] < start[0] || (end[0] === start[0] && end[1] < start[1])) {
    uni.showToast({ title: '结束时间不能早于开始时间', icon: 'none' });
    endTime.value = '00:00';
    return;
  }
  endTime.value = e.value;
};

const checkTimeOverlap = (start1, end1, start2, end2) => {
  const [h1, m1] = start1.split(':').map(Number);
  const [h2, m2] = end1.split(':').map(Number);
  const [h3, m3] = start2.split(':').map(Number);
  const [h4, m4] = end2.split(':').map(Number);
  
  const time1 = h1 * 60 + m1;
  const time2 = h2 * 60 + m2;
  const time3 = h3 * 60 + m3;
  const time4 = h4 * 60 + m4;
  
  return !(time2 <= time3 || time4 <= time1);
};

const addTask = async() => {
  // 基础校验
  if (endTime.value <= startTime.value) {
    uni.showToast({ title: '结束时间必须晚于开始时间', icon: 'none' });
    return;
  }
  
  if (!selectedTaskType.value) {
    uni.showToast({
      title: '请选择任务类型',
      icon: 'none'
    });
    return;
  }

  // 检查时间段是否有重叠
  const hasOverlap = tasks.value.some(task => 
    checkTimeOverlap(startTime.value, endTime.value, task.start, task.end)
  );

  if (hasOverlap) {
    uni.showToast({
      title: '该时间段与已有任务时间重叠',
      icon: 'none'
    });
    return;
  }

  const newTask = {
    taskName: selectedTaskType.value,
    start: startTime.value,
    end: endTime.value
  };
  tasks.value.push(newTask);

  uni.showLoading({ title: '保存中...' });
  try {
    console.log(tasks.value,'ttttt');
    await updateUserConfig(tasks.value);
    uni.showToast({ title: '添加成功' });
  } catch (e) {
    tasks.value.pop(); // 回滚操作
    uni.showToast({ title: '添加失败', icon: 'none' });
  } finally {
    uni.hideLoading();
  }

  showAddTaskModal.value = false;
  selectedTaskType.value = '';
  startTime.value = '00:00';
  endTime.value = '00:00';
};

const deleteTask = (index) => {
  tasks.value.splice(index, 1);
  updateUserConfig(tasks.value);
};

onMounted(() => {
  getUserConfig();
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f6f7f9;
}

.task-section {
  padding: 24rpx;

  .task-list {
    background: #ffffff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);

    .task-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx 24rpx;
      border-bottom: 1px solid #f5f6f7;

      .task-info {
        flex: 1;

        .task-type {
          font-size: 28rpx;
          color: #333333;
          font-weight: 500;
          margin-bottom: 8rpx;
        }

        .task-time {
          font-size: 24rpx;
          color: #999999;
        }
      }

      .task-actions {
        padding-left: 24rpx;
      }
    }

    .add-task {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32rpx 24rpx;
      gap: 12rpx;

      text {
        font-size: 28rpx;
        color: #007AFF;
      }

      &:active {
        background-color: #f9fafb;
      }
    }
  }
}

.add-task-modal {
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    border-bottom: 1px solid #f5f6f7;

    .title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }
  }

  .modal-content {
    padding: 24rpx;

    .form-item {
      margin-bottom: 24rpx;

      .label {
        font-size: 28rpx;
        color: #333333;
        margin-bottom: 16rpx;
        display: block;
      }

      .task-type-selector {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;

        .type-item {
          padding: 16rpx 24rpx;
          background: #f5f6f7;
          border-radius: 8rpx;
          font-size: 28rpx;
          color: #666666;

          &.active {
            background: #007AFF;
            color: #ffffff;
          }
        }
      }

      .time-selector {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .time-picker {
          flex: 1;
          background: #f5f6f7;
          padding: 16rpx 24rpx;
          border-radius: 8rpx;
          text-align: center;

          text {
            font-size: 28rpx;
            color: #333333;
          }
        }

        .separator {
          font-size: 28rpx;
          color: #999999;
        }
      }
    }
  }

  .modal-footer {
    padding: 24rpx;
    border-top: 1px solid #f5f6f7;

    .confirm-btn {
      background: #007AFF;
      height: 88rpx;
      border-radius: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: #ffffff;
      font-weight: 500;

      &:active {
        opacity: 0.9;
      }
    }
  }
}

// 暗黑模式适配
@media (prefers-color-scheme: dark) {
  .container {
    background-color: #1c1c1e;
  }

  .task-list {
    background: #2c2c2e !important;
    box-shadow: none !important;

    .task-item {
      border-bottom-color: #3a3a3c !important;

      .task-info {
        .task-type text {
          color: #ffffff !important;
        }

        .task-time text {
          color: #8e8e93 !important;
        }
      }
    }

    .add-task:active {
      background-color: #3a3a3c !important;
    }
  }

  .add-task-modal {
    background: #2c2c2e !important;

    .modal-header {
      border-bottom-color: #3a3a3c !important;

      .title {
        color: #ffffff !important;
      }
    }

    .modal-content {
      .form-item {
        .label {
          color: #ffffff !important;
        }

        .task-type-selector .type-item {
          background: #3a3a3c !important;
          color: #ffffff !important;

          &.active {
            background: #0A84FF !important;
          }
        }

        .time-selector {
          .time-picker {
            background: #3a3a3c !important;

            text {
              color: #ffffff !important;
            }
          }
        }
      }
    }

    .modal-footer {
      border-top-color: #3a3a3c !important;

      .confirm-btn {
        background: #0A84FF !important;
      }
    }
  }
}
</style>