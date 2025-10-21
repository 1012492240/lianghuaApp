<template>
  <view class="container">
    <u-navbar
      title="微信绑定"
      :autoBack="true"
      fixed
      placeholder
      bgColor="#ffffff"
      titleStyle="color: #333333; font-size: 16px;"
    ></u-navbar>

    <view class="wechat-section">
      <view class="wechat-list">
        <view v-for="(account, index) in wechatAccounts" :key="index" class="wechat-item" >
          <view class="wechat-info">
            <view class="wechat-id" @tap="selectWechatAccount(account)">
              <text>{{ account.wechatId }}</text>
              <text class="account-type" :class="account.accountType">{{ accountTypeInfo[account.accountType].title }}</text>
              <text v-if="account.wechatId === current_wechatId" class="current-tag">使用中</text>
            </view>
            <!-- <view class="bind-time">
              <text>绑定时间：{{ account.bindTime }}</text>
            </view> -->
          </view>
          <view class="wechat-actions">
            <u-icon name="trash" size="40rpx" color="#FF3B30" @tap="unbindAccount(index)"></u-icon>
          </view>
        </view>

        <view class="add-wechat" @tap="showAddModal = true">
          <u-icon name="plus" size="40rpx" color="#007AFF"></u-icon>
          <text>添加微信号</text>
        </view>
      </view>
    </view>

    <!-- 添加微信弹窗 -->
    <u-popup :show="showAddModal" mode="bottom" height="40%">
      <view class="add-wechat-modal">
        <view class="modal-header">
          <text class="title">添加微信号</text>
          <u-icon name="close" size="32rpx" color="#999" @tap="showAddModal = false"></u-icon>
        </view>

        <view class="modal-content">
          <view class="form-item">
            <text class="label">微信号</text>
            <u-input
              v-model="newWechatId"
              placeholder="请输入微信号"
              border="bottom"
              :clearable="true"
            ></u-input>
          </view>
        </view>

        <view class="modal-footer">
          <view class="confirm-btn" @tap="showTypeModal = true">确认</view>
        </view>
      </view>
    </u-popup>

    <!-- 账号类型选择弹窗 -->
    <u-popup :show="showTypeModal" mode="center">
      <view class="type-modal">
        <view class="modal-header">
          <text class="title">选择账号类型</text>
          <u-icon name="close" size="32rpx" color="#999" @tap="showTypeModal = false"></u-icon>
        </view>
        <view class="type-options">
          <view class="type-item" @tap="selectAccountType('old')">
            <view class="type-title">{{ accountTypeInfo.old.title }}</view>
            <view class="type-desc">{{ accountTypeInfo.old.description }}</view>
            <view class="type-limit">{{ accountTypeInfo.old.limit }}</view>
          </view>
          <view class="type-item" @tap="selectAccountType('new')">
            <view class="type-title">{{ accountTypeInfo.new.title }}</view>
            <view class="type-desc">{{ accountTypeInfo.new.description }}</view>
            <view class="type-limit">{{ accountTypeInfo.new.limit }}</view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 切换账号确认弹窗 -->
    <u-modal
      :show="showSwitchModal"
      title="切换账号"
      :content="`是否使用 ${selectedAccount?.wechatId} 这个账号？`"
      showCancelButton
      @confirm="confirmSwitchAccount"
      @cancel="showSwitchModal = false"
    ></u-modal>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api,responseHandler } from '@/api/index.js';

const current_wechatId = ref('');
const wechatAccounts = ref([]);
const showSwitchModal = ref(false);
const selectedAccount = ref(null);

// 获取用户配置
const getUserConfig = async () => {
  try {
    const res = await api.getUserConfig();
    if (res.data && res.data.data && res.data.data.config_content) {
      const config = res.data.data.config_content;
      if (config.wechatId_list) {
        wechatAccounts.value = config.wechatId_list;
        current_wechatId.value = config.current_wechatId;
      }
      
    }
  } catch (error) {
    console.log(error);
 responseHandler.error(error);
  }
};

// 更新用户配置
const updateUserConfig = async () => {
  console.log('执行更改')
  try {
    const res = await api.getUserConfig();
    let existingConfig = {};
    if (res.data && res.data.data && res.data.data.config_content) {
      existingConfig = res.data.data.config_content;
    }
    
    let exists = false;
console.log('wechatAccounts?.wechatId_list',wechatAccounts.value,)
    if(wechatAccounts.value){
      exists = wechatAccounts.value?.some(
       item => item.wechatId.trim() == current_wechatId.value
      );
    }
     console.log(exists,'exists')

    const configContent = {
      ...existingConfig,
      wechatId_list: wechatAccounts.value,
      current_wechatId:exists ? current_wechatId.value : wechatAccounts.value[0]?.wechatId
    };
    current_wechatId.value = exists ? current_wechatId.value : wechatAccounts.value[0]?.wechatId
    
    console.log('configContent', configContent);
    await api.updateUserConfig(configContent);
  } catch (error) {
	
    responseHandler.error(error);
  }
};

const showTypeModal = ref(false);
const accountTypeInfo = {
  old: {
    title: '老号',
    description: '注册时间一年以上且经常使用的号',
    limit: '每天建议加微信上限为20个'
  },
  new: {
    title: '新号',
    description: '注册时间不满一年或者注册时间超过一年但不常用的号',
    limit: '每天建议加微信上限为5个'
  }
};

const showAddModal = ref(false);
const newWechatId = ref('');
const selectedType = ref('');

const selectAccountType = async (type) => {
  selectedType.value = type;
  showTypeModal.value = false;
  
  const now = new Date();
  const bindTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  wechatAccounts.value.push({
    wechatId: newWechatId.value,
    bindTime: bindTime,
    accountType: type
  });

  await updateUserConfig();

  showAddModal.value = false;
  newWechatId.value = '';
  selectedType.value = '';

  uni.showToast({
    title: '添加成功',
    icon: 'success'
  });
};

const unbindAccount = async (index) => {
  wechatAccounts.value.splice(index, 1);
  await updateUserConfig();
  
  uni.showToast({
    title: '解绑成功',
    icon: 'success'
  });
};

const selectWechatAccount = (account) => {
  if (account.wechatId === current_wechatId.value) return;
  selectedAccount.value = account;
  showSwitchModal.value = true;
};

const confirmSwitchAccount = async () => {
  if (!selectedAccount.value) return;
  
  current_wechatId.value = selectedAccount.value.wechatId;
 

  await updateUserConfig();
  
  showSwitchModal.value = false;
  selectedAccount.value = null;
  
  uni.showToast({
    title: '切换成功',
    icon: 'success'
  });
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

.wechat-section {
  padding: 24rpx;

  .wechat-list {
    background: #ffffff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);

    .wechat-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx 24rpx;
      border-bottom: 1px solid #f5f6f7;

      &:has(.current-tag) {
        background-color: rgba(0, 122, 255, 0.05);
      }

      .wechat-info {
        flex: 1;

        .wechat-id {
          font-size: 28rpx;
          color: #333333;
          font-weight: 500;
          margin-bottom: 8rpx;
        }

        .bind-time {
          font-size: 24rpx;
          color: #999999;
        }
      }

      .wechat-actions {
        padding-left: 24rpx;
      }
    }

    .add-wechat {
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

.account-type {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  margin-left: auto;
  color: #007AFF;
  background: rgba(0, 122, 255, 0.1);
  display: inline-block;

  &.old {
    color: #07c160;
    background: rgba(7, 193, 96, 0.1);
  }

  &.new {
    color: #ff9500;
    background: rgba(255, 149, 0, 0.1);
  }
}
.current-tag {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  margin-left: 12rpx;
  color: #007AFF;
  background: rgba(0, 122, 255, 0.2);
  border: 1px solid rgba(0, 122, 255, 0.4);
  box-shadow: 0 2rpx 4rpx rgba(0, 122, 255, 0.1);
}

.type-modal {
  width: 600rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  transform: scale(0.95);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

  .modal-header {
    padding: 32rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f5f6f7;

    .title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333333;
    }
  }

  .type-options {
    padding: 32rpx;

    .type-item {
      padding: 32rpx;
      border: 2rpx solid #e5e5e5;
      border-radius: 16rpx;
      margin-bottom: 24rpx;
      transition: all 0.2s ease;

      &:last-child {
        margin-bottom: 0;
      }

      &:active {
        background: #f9fafb;
        border-color: #007AFF;
        transform: scale(0.98);
      }

      .type-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333333;
        margin-bottom: 16rpx;
      }

      .type-desc {
        font-size: 28rpx;
        color: #666666;
        margin-bottom: 12rpx;
        line-height: 1.5;
      }

      .type-limit {
        font-size: 26rpx;
        color: #999999;
        line-height: 1.4;
      }
    }
  }
}

.add-wechat-modal {
  background: #ffffff;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.08);

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    border-bottom: 1px solid #f5f6f7;

    .title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333333;
    }
  }

  .modal-content {
    padding: 32rpx;

    .form-item {
      margin-bottom: 32rpx;

      .label {
        font-size: 28rpx;
        color: #333333;
        margin-bottom: 16rpx;
        display: block;
        font-weight: 500;
      }
    }
  }

  .modal-footer {
    padding: 32rpx;
    border-top: 1px solid #f5f6f7;

    .confirm-btn {
      background: linear-gradient(135deg, #0A84FF 0%, #0055FF 100%);
      height: 88rpx;
      border-radius: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.2);
      transition: all 0.2s ease;

      &:active {
        transform: scale(0.98);
        box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.15);
      }
    }
  }
}

@media (prefers-color-scheme: dark) {
  .type-modal {
    background: #2c2c2e;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);

    .modal-header {
      border-bottom-color: #3a3a3c;

      .title {
        color: #ffffff;
      }
    }

    .type-options .type-item {
      border-color: #3a3a3c;
      background: #1c1c1e;

      &:active {
        background: #2c2c2e;
        border-color: #0A84FF;
      }

      .type-title {
        color: #ffffff;
      }

      .type-desc {
        color: #8e8e93;
      }

      .type-limit {
        color: #6e6e73;
      }
    }
  }

  .add-wechat-modal {
    background: #2c2c2e;
    box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.2);

    .modal-header {
      border-bottom-color: #3a3a3c;

      .title {
        color: #ffffff;
      }
    }

    .modal-content .form-item .label {
      color: #ffffff;
    }

    .modal-footer {
      border-top-color: #3a3a3c;

      .confirm-btn {
        background: linear-gradient(135deg, #0A84FF 0%, #0055FF 100%);
      }
    }
  }
}
</style>