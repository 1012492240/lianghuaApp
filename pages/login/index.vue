<template>
  <view class="login-container">
    <!-- 背景装饰 -->
    <view class="background">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="mesh"></view>
    </view>

    <!-- 主内容区 -->
    <view class="content">
      <!-- 品牌展示区 -->
      <view class="brand">
        <image class="logo" src="/static/laikebao-logo.png" mode="aspectFit"></image>
      </view>

      <!-- 登录区域 -->
      <view class="login-box">
        <view class="welcome">
          <text class="welcome-text">欢迎回来</text>
          <text class="welcome-desc">请使用您的账号密码登录来客宝</text>
        </view>

        <!-- 表单区域 -->
        <view class="form-area">
          <!-- 手机号输入框 -->
          <u--input
            v-model="phone"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
            prefixIcon="account"
            :border="false"
            customStyle="background: rgba(245, 246, 247, 0.8); backdrop-filter: blur(20px); height: 110rpx; padding: 0 40rpx; border-radius: 20rpx;"
          ></u--input>

          <!-- 密码输入框 -->
          <u--input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            prefixIcon="lock"
            :border="false"
            customStyle="background: rgba(245, 246, 247, 0.8); backdrop-filter: blur(20px); height: 110rpx; padding: 0 40rpx; border-radius: 20rpx; margin-top: 24rpx;"
          >
            <template #suffix>
              <text class="forget-pwd" @click="handleForgetPwd">忘记密码?</text>
            </template>
          </u--input>

          <!-- 记住密码选项 -->
          <view class="remember-pwd">
            <checkbox :checked="rememberPassword" @tap="toggleRememberPassword" color="#3A7FFF" style="transform: scale(0.8)" />
            <text class="remember-text" @tap="toggleRememberPassword">记住密码</text>
          </view>

          <!-- 登录按钮 -->
          <view class="action-area">
            <u-button
              text="登 录"
              @click="handleLogin"
              :disabled="!canLogin"
              customStyle="width: 100%; height: 110rpx; background: linear-gradient(135deg, #3A7FFF, #6AA1FF); border: none; font-size: 32rpx; font-weight: 500; border-radius: 20rpx; color: #fff;"
            ></u-button>
          </view>
        </view>
      </view>

      <!-- 添加版本号显示 -->
      <view class="version-info">
        <text class="version-text">当前版本 {{ version }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/store/user";
import md5 from "md5";
import { API_BASE_URL } from "@/config";
import { api, responseHandler } from "@/api";

const userStore = useUserStore();
const phone = ref("");
const password = ref("");
const version = ref("v1.0.0");
const isLoading = ref(false);
const rememberPassword = ref(false);

const canLogin = computed(() => {
  return phone.value.length === 11 && password.value.length >= 6;
});

// 加载保存的账号密码
onMounted(() => {
  const savedCredentials = uni.getStorageSync('savedCredentials');
  if (savedCredentials) {
    phone.value = savedCredentials.phone || '';
    password.value = savedCredentials.password || '';
    rememberPassword.value = true;
  }
});

// 切换记住密码状态
const toggleRememberPassword = () => {
  rememberPassword.value = !rememberPassword.value;
};

// 保存账号密码
const saveCredentials = () => {
  if (rememberPassword.value) {
    uni.setStorageSync('savedCredentials', {
      phone: phone.value,
      password: password.value
    });
  } else {
    uni.removeStorageSync('savedCredentials');
  }
};

const handleLogin = async () => {
  if (!canLogin.value || isLoading.value) return;

  isLoading.value = true;
  uni.showLoading({
    title: "登录中...",
    mask: true,
  });
  
  try {
    const response = await api.login(phone.value, password.value);

    const resultData = response;

    const data = await responseHandler.success(resultData);

    console.log(data,'dddd')
    // 保存账号密码（如果选择了记住密码）
    saveCredentials();

    userStore.login(data.token, {
      id: data.user_id,
      phone: data.phone,
      nickname: data.real_name,
      username: data.username,
      expireTime: data.membership_end_time,
      token: data.token,
    });

    uni.showToast({
      title: "登录成功",
      icon: "success",
    });

    setTimeout(() => {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    }, 1500);
  } catch (error) {
    console.error("登录错误:", error);
    responseHandler.error(error);
  } finally {
    isLoading.value = false;
    uni.hideLoading();
	uni.reLaunch({
	  url: "/pages/index/index",
	});
  }
};

const handleForgetPwd = () => {
  uni.navigateTo({
    url: "/pages/forget-password/index",
  });
};

// 获取应用版本号
// #ifdef APP-PLUS
plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
  version.value = "v" + widgetInfo.version;
});
// #endif
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;

  .circle {
    position: absolute;
    border-radius: 50%;

    &-1 {
      width: 800rpx;
      height: 800rpx;
      background: linear-gradient(
        135deg,
        rgba(58, 127, 255, 0.1),
        rgba(106, 161, 255, 0.1)
      );
      top: -400rpx;
      right: -200rpx;
      transform: rotate(-15deg);
    }

    &-2 {
      width: 600rpx;
      height: 600rpx;
      background: linear-gradient(
        135deg,
        rgba(58, 127, 255, 0.08),
        rgba(106, 161, 255, 0.08)
      );
      bottom: -300rpx;
      left: -200rpx;
      transform: rotate(15deg);
    }
  }

  .mesh {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.4;
    background-image: linear-gradient(
        rgba(58, 127, 255, 0.05) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(58, 127, 255, 0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    transform: rotate(15deg) scale(1.5);
  }
}

.content {
  position: relative;
  z-index: 2;
  padding: 0 40rpx;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;

  // 添加版本信息样式
  .version-info {
    position: absolute;
    bottom: 40rpx;
    left: 0;
    right: 0;
    text-align: center;

    .version-text {
      font-size: 24rpx;
      color: #999999;
    }
  }
}

.brand {
  text-align: center;
  margin-bottom: 40rpx;

  .logo {
    width: 160rpx;
    height: 160rpx;
  }

  .brand-text {
    .brand-name {
      font-size: 56rpx;
      color: #333333;
      font-weight: 600;
      margin-bottom: 12rpx;
      display: block;
    }

    .brand-slogan {
      font-size: 28rpx;
      color: #666666;
      letter-spacing: 4rpx;
    }
  }
}

.login-box {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 32rpx;
  padding: 48rpx 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.05);

  .welcome {
    margin-bottom: 40rpx;

    .welcome-text {
      font-size: 40rpx;
      color: #333333;
      font-weight: 600;
      margin-bottom: 12rpx;
      display: block;
    }

    .welcome-desc {
      font-size: 26rpx;
      color: #999999;
    }
  }

  .form-area {
    :deep(.u-input) {
      .u-input__input {
        font-size: 28rpx;
      }

      .u-icon {
        color: #3a7fff;
        font-size: 36rpx;
      }
    }

    .forget-pwd {
      font-size: 26rpx;
      color: #3a7fff;
      padding: 0 20rpx;
    }

    .remember-pwd {
      display: flex;
      align-items: center;
      margin-top: 24rpx;
      padding: 0 10rpx;
      
      .remember-text {
        font-size: 26rpx;
        color: #666666;
        margin-left: 8rpx;
      }
    }

    .action-area {
      margin-top: 32rpx;
      color: #fff;
    }

    :deep(.u-button) {
      background: linear-gradient(135deg, #3a7fff, #6aa1ff) !important;
      border: none !important;
      box-shadow: 0 8rpx 16rpx rgba(58, 127, 255, 0.2) !important;
    }

    :deep(.u-button--disabled) {
      opacity: 0.7 !important;
      background: linear-gradient(135deg, #3a7fff, #6aa1ff) !important;
    }
  }
}
</style>