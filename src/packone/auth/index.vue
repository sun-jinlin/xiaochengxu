<template>
  <view>
    <button
      open-type="getUserInfo"
      @getuserinfo="getBtnUserInfo"
      type="primary"
    >
      微信登录
    </button>
  </view>
</template>

<script>
export default {
  onLoad() {
    this.getApiUserInfo();
  },
  methods: {
    async getApiUserInfo() {
      const [serr, set] = await uni.getSetting();
      if (!serr && set.authSetting["scope.userInfo"]) {
        const [err, userInfo] = await uni.getUserInfo();
        console.log(err, userInfo);
        if (!err) {
          this.login(userInfo);
        }
      }
    },
    getBtnUserInfo(res) {
      if (res.detail.errMsg === "getUserInfo:ok") {
        this.login(res.detail);
      }
    },
    async login(userInfo) {
      const [err, _data] = await uni.login();
      if (!err) {
        const { encryptedData, iv, rawData, signature } = userInfo;
        console.log(err, data);
        const { mes, data } = await this.request({
          url: "/users/wxlogin",
          method: "POST",
          data: {
            code: _data.code,
            encryptedData,
            iv,
            rawData,
            signature,
          },
        });
        console.log(mes, data);
        uni.setStorageSync(
          "token",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImlhdCI6MTU5NjY5OTA3NSwiZXhwIjoxMDAxNTk2Njk5MDc0fQ.cJsIARhWZ8TbwN2y7Q1hb4dwZkWdT_ULgiKq-UteqRg"
        );
        uni.showModal({
          title: "提示",
          content: "登录成功",
          showCancel: false,
          success: (res) => {
            uni.navigateBack();
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  width: 600rpx;
  margin: 200rpx auto 0;
}
</style>