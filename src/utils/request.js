const BASE_URL = 'https://www.uinav.com/api/public/v1'
export default async function myRequest({ url, data, method, header }) {
  if (url.substr(1, 2) == 'my') {
    if (!uni.getStorageSync('token')) {
      return uni.showToast({
        title: '请先登录',
        success: res => {
          uni.navigateTo('/packone/auth/index')
        }
      })
    }
  }
  uni.showLoading({
    title: '加载中。。。',
    mask: true
  })
  const [err, res] = await uni.request({
    url: BASE_URL + url,
    data,
    method,
    header: { Authorization: uni.getStorageSync("token") }
  })
  uni.hideLoading()
  if (err) {
    return err
  } else {
    return {
      mes: res.data.meta,
      data: res.data.message
    }
  }
}

const plug = {
  install(Vue) {
    Vue.prototype.request = myRequest
  }
}
export { plug }