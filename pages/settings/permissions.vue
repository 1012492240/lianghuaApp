<template>
  <view class="container">
    <u-navbar
      title="权限管理"
      :autoBack="true"
      fixed
      placeholder
      bgColor="#ffffff"
      titleStyle="color: #333333; font-size: 32rpx; font-weight: 500"
    ></u-navbar>

    <view class="permissions-section">
      <view class="permissions-group">
        <view
          class="permission-item"
          @click="handlePermissionClick('notification')"
        >
          <view class="item-left">
            <u-icon name="bell" size="40rpx" color="#333"></u-icon>
            <view class="permission-info">
              <text class="title">通知权限</text>
              <text class="desc">用于接收消息提醒</text>
            </view>
          </view>
          <view
            class="permission-status"
            :class="{ 'status-enabled': permissions.notification }"
          >
            <text>{{ permissions.notification ? "已开启" : "未开启" }}</text>
            <u-icon
              :name="
                permissions.notification ? 'checkmark-circle' : 'arrow-right'
              "
              size="32rpx"
              :color="permissions.notification ? '#007AFF' : '#BDBDBD'"
            ></u-icon>
          </view>
        </view>

        <view
          class="permission-item"
          @click="handlePermissionClick('location')"
        >
          <view class="item-left">
            <u-icon name="map" size="40rpx" color="#333"></u-icon>
            <view class="permission-info">
              <text class="title">位置权限</text>
              <text class="desc">用于获取当前位置信息</text>
            </view>
          </view>
          <view
            class="permission-status"
            :class="{ 'status-enabled': permissions.location }"
          >
            <text>{{ permissions.location ? "已开启" : "未开启" }}</text>
            <u-icon
              :name="permissions.location ? 'checkmark-circle' : 'arrow-right'"
              size="32rpx"
              :color="permissions.location ? '#007AFF' : '#BDBDBD'"
            ></u-icon>
          </view>
        </view>
      </view>
    </view>

    <up-modal
      :show="showModal"
      :title="modalTitle"
      :content="modalContent"
      showCancelButton
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
      confirmText="去设置"
      cancelText="取消"
      confirmColor="#007AFF"
      cancelColor="#999999"
    ></up-modal>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onLoad, onShow, onHide, onUnload } from "@dcloudio/uni-app";

const permissions = ref({
  notification: false,
  location: false,
});

// 添加弹框相关的响应式变量
const showModal = ref(false);
const modalTitle = ref("");
const modalContent = ref("");
const currentPermissionType = ref("");

onShow(() => {
  checkAllPermissions();
});

// 检查所有权限状态
const checkAllPermissions = async () => {
  try {
    const main = plus.android.runtimeMainActivity();
    const PackageManager = plus.android.importClass(
      "android.content.pm.PackageManager"
    );
    const NotificationManagerCompat = plus.android.importClass(
      "androidx.core.app.NotificationManagerCompat"
    );

    // 获取通知管理器
    const notificationManager = NotificationManagerCompat.from(main);

    permissions.value = {
      notification: notificationManager.areNotificationsEnabled(),
      location:
        plus.android.invoke(
          main,
          "checkSelfPermission",
          "android.permission.ACCESS_FINE_LOCATION"
        ) === PackageManager.PERMISSION_GRANTED,
    };
  } catch (error) {
    console.error("检查权限失败:", error);
  }
};

const handlePermissionClick = (type) => {
  // 如果权限已开启，则不执行任何操作
  if (permissions.value[type]) {
    return;
  }
  showPermissionDialog(type);
};

const showPermissionDialog = (type) => {
  const permissionInfo = {
    notification: { name: "通知", desc: "用于接收消息提醒" },
    location: { name: "位置信息", desc: "用于获取当前位置" },
  };

  const { name, desc } = permissionInfo[type];

  currentPermissionType.value = type;
  modalTitle.value = "权限申请";
  modalContent.value = `需要${name}权限${desc}，是否去设置打开？`;
  showModal.value = true;
};

// 添加弹框确认处理函数
const handleModalConfirm = () => {
  const type = currentPermissionType.value;
  try {
    const main = plus.android.runtimeMainActivity();
    const packageName = main.getPackageName();
    const Intent = plus.android.importClass("android.content.Intent");
    const Settings = plus.android.importClass("android.provider.Settings");
    const Uri = plus.android.importClass("android.net.Uri");
    const Build = plus.android.importClass("android.os.Build");

    let intent;
    if (type === "notification") {
      // 通知权限设置页面
      if (plus.os.version >= 26) {
        intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
        intent.putExtra(Settings.EXTRA_APP_PACKAGE, packageName);
      } else {
        intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        const uri = Uri.fromParts("package", packageName, null);
        intent.setData(uri);
      }
    } else if (type === "overlay") {
      // 悬浮窗权限设置页面
      if (Build.VERSION.SDK_INT >= 23) {
        intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
        const uri = Uri.parse("package:" + packageName);
        intent.setData(uri);
      } else {
        intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        const uri = Uri.fromParts("package", packageName, null);
        intent.setData(uri);
      }
    } else {
      // 其他权限使用应用详情设置页面
      intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      const uri = Uri.fromParts("package", packageName, null);
      intent.setData(uri);
    }

    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    main.startActivity(intent);
  } catch (error) {
    console.error("打开设置页面失败:", error);
    try {
      if (plus.os.name.toLowerCase() === "android") {
        const Intent = plus.android.importClass("android.content.Intent");
        const Settings = plus.android.importClass("android.provider.Settings");
        const Uri = plus.android.importClass("android.net.Uri");
        const main = plus.android.runtimeMainActivity();

        const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        const uri = Uri.fromParts("package", plus.runtime.appid, null);
        intent.setData(uri);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        main.startActivity(intent);
      } else {
        plus.runtime.openURL("app-settings:");
      }
    } catch (e) {
      console.error("备用跳转也失败:", e);
      uni.$u.toast({
        type: "error",
        message: "无法打开设置页面，请手动前往系统设置修改权限",
        duration: 3000,
      });
    }
  }
};

// 添加弹框取消处理函数
const handleModalCancel = () => {
  showModal.value = false;
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f8faff;
}

.permissions-section {
  padding: 40rpx;

  .permissions-group {
    background: #ffffff;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .permission-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background-color: #f8f8f8;
      }

      .item-left {
        display: flex;
        align-items: center;
        // gap: 20rpx;

        .permission-info {
          margin-left: 20rpx;
          display: flex;
          flex-direction: column;
          gap: 4rpx;

          .title {
            font-size: 28rpx;
            color: #333333;
            font-weight: 500;
          }

          .desc {
            font-size: 24rpx;
            color: #999999;
          }
        }
      }

      .permission-status {
        display: flex;
        align-items: center;
        gap: 8rpx;

        text {
          font-size: 24rpx;
          color: #999999;
        }

        &.status-enabled {
          text {
            color: #007aff;
          }
        }
      }
    }
  }
}
</style> 