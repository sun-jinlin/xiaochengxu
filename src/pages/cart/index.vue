<template>
  <view class="wrapper">
    <!-- 收货信息 -->
    <block v-if="addRess">
      <view class="shipment" @click="getRess">
        <view class="dt">收货人:</view>
        <view class="dd meta">
          <text class="name">{{ addRess.userName }}</text>
          <text class="phone">{{ addRess.telNumber }}</text>
        </view>
        <view class="dt">收货地址:</view>
        <view class="dd">{{
          addRess.provinceName +
          addRess.cityName +
          addRess.countyName +
          addRess.detailInfo
        }}</view>
      </view>
    </block>
    <block v-else>
      <button @click="getRess">选择收货地址</button>
    </block>

    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>
        <view :key="i" v-for="(item, i) in cards" class="goods">
          <!-- 商品图片 -->
          <image class="pic" :src="item.goods_small_logo" />
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{ item.goods_name }}</view>
            <view class="price">
              <text>￥</text>{{ item.goods_price }}
              <text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @click="switchInput(-1, i)">-</text>
              <input
                type="number"
                @input="switchInput(0)"
                v-model="item.goods_count"
                class="number"
              />
              <text class="plus" @click="switchInput(1, i)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox">
            <icon
              @click="switchActive(i)"
              type="success"
              size="20"
              :color="item.goods_checked ? '#ea4451' : '#ccc'"
            ></icon>
          </view>
        </view>
      </view>
    </view>
    <!-- 其它 -->
    <view class="extra">
      <label class="checkall" @click="switchAllchecked">
        <icon
          type="success"
          :color="allChecked ? '#ea4451' : '#ccc'"
          size="20"
        ></icon
        >全选
      </label>
      <view class="total">
        合计:
        <text>￥</text>
        <label>{{ total }}</label>
        <text>.00</text>
      </view>
      <view @click="closeAnAccount" class="pay"
        >结算({{ activeChecked.length }})</view
      >
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cards: [],
      addRess: "",
    };
  },
  onLoad() {
    // uni.removeStorageSync("token");
  },
  onShow() {
    this.cards = uni.getStorageSync("cards") || [];
  },
  computed: {
    allChecked() {
      return this.cards.every((item) => item.goods_checked);
    },
    activeChecked() {
      return this.cards.filter((item) => item.goods_checked);
    },
    total() {
      return this.activeChecked.reduce((a, b) => {
        return a + b.goods_price * b.goods_count;
      }, 0);
    },
  },
  methods: {
    async closeAnAccount() {
      if (!this.addRess || !this.activeChecked.length) {
        return uni.showToast({
          title: "请选择收货地址并最少选择一件商品",
          icon: "none",
        });
      }
      if (!uni.getStorageSync("token")) {
        return uni.showModal({
          title: "提示",
          content: "没有登录,请先进行登录",
          showCancel: false,
          success: () => {
            uni.navigateTo({
              url: "/packone/auth/index",
            });
          },
        });
      }
      const { mes, data } = await this.request({
        url: "/my/orders/create",
        method: "POST",
        header: { Authorization: uni.getStorageSync("token") },
        data: {
          order_price: this.total,
          consignee_addr:
            this.addRess.provinceName +
            this.addRess.cityName +
            this.addRess.countyName +
            this.addRess.detailInfo,
          goods: this.activeChecked.map((item) => {
            item.goods_number = item.goods_count;
            return item;
          }),
        },
      });
      if (mes.status === 200) {
        this.cards = this.cards.filter((item) => !item.goods_checked);
        this.updataCards();
        uni.navigateTo({
          url: "/packone/order/index",
        });
      }
    },
    updataCards() {
      uni.setStorageSync("cards", this.cards);
    },
    switchInput(i, index) {
      if (i === 0) {
      } else if (i == "-1") {
        if (this.cards[index].goods_count - 1 <= 0) {
          return uni.showToast({
            title: "已达到最小数",
          });
        } else {
          this.cards[index].goods_count = this.cards[index].goods_count - 1;
        }
      } else if (i == "1") {
        if (this.cards[index].goods_count + 1 >= 11) {
          return uni.showToast({
            title: "已达到最大数",
          });
        } else {
          this.cards[index].goods_count = this.cards[index].goods_count + 1;
        }
      }
      this.updataCards();
    },
    switchActive(index) {
      this.cards[index].goods_checked = !this.cards[index].goods_checked;
      this.updataCards();
    },
    switchAllchecked() {
      if (this.allChecked) {
        this.cards.forEach((item) => (item.goods_checked = false));
      } else {
        this.cards.forEach((item) => (item.goods_checked = true));
      }
      this.updataCards();
    },
    // 获取收货地址
    getRess() {
      uni.chooseAddress({
        success: (res) => {
          console.log(res.userName);
          console.log(res.postalCode);
          console.log(res.provinceName);
          console.log(res.cityName);
          console.log(res.countyName);
          console.log(res.detailInfo);
          console.log(res.nationalCode);
          console.log(res.telNumber);
          this.addRess = res;
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.shipment {
  height: 100rpx;
  line-height: 2;
  padding: 30rpx 30rpx 40rpx 30rpx;
  font-size: 27rpx;
  color: #333;
  background-color: #fff;
  background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;

  .dt {
    width: 140rpx;
    float: left;
    clear: both;
  }

  .dd {
    padding-left: 160rpx;
  }

  .meta {
    padding-right: 50rpx;
  }

  text.phone {
    float: right;
  }
}

.carts {
  background-color: #f4f4f4;
  padding-bottom: 110rpx;
  overflow: hidden;

  .shopname {
    padding: 30rpx;
    margin-top: 20rpx;
    font-size: 30rpx;
    color: #333;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    border-bottom: 1rpx solid #eee;
  }

  .goods {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 100rpx;
    border-bottom: 1rpx solid #eee;
    background-color: #fff;

    position: relative;

    .checkbox {
      width: 101rpx;
      height: 100%;
      background-color: #fff;

      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      left: -100rpx;
      top: 0;
    }

    &:last-child {
      border-bottom: none;
    }

    .pic {
      width: 200rpx;
      height: 200rpx;
      margin-right: 30rpx;
    }

    .meta {
      flex: 1;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      text {
        font-size: 22rpx;
      }
    }

    .amount {
      position: absolute;
      bottom: 0;
      right: 20rpx;

      height: 48rpx;
      text-align: center;
      border: 1rpx solid #ddd;
      border-radius: 8rpx;

      display: flex;
      align-items: center;

      text {
        display: block;
        width: 60rpx;
        line-height: 48rpx;
        font-size: 36rpx;
        color: #ddd;
        text-align: center;
      }

      input {
        width: 60rpx;
        height: 48rpx;
        min-height: 48rpx;
        font-size: 27rpx;
        border-left: 1rpx solid #ddd;
        border-right: 1rpx solid #ddd;
      }
    }
  }
}

.extra {
  position: fixed;
  bottom: 0;
  /* #ifdef H5 */
  bottom: 50px;
  /* #endif */
  left: 0;
  z-index: 9;

  width: 750rpx;
  height: 96rpx;
  text-align: center;
  line-height: 96rpx;
  font-size: 36rpx;
  border-top: 1rpx solid #eee;
  background-color: #fff;
  color: #333;
  display: flex;

  .checkall {
    width: 140rpx;
    line-height: 1;
    margin-left: 25rpx;
    display: flex;
    align-items: center;

    icon {
      margin-right: 20rpx;
    }
  }

  .total {
    display: flex;
    justify-content: center;
    flex: 1;

    label,
    text {
      color: #ea4451;
      vertical-align: bottom;
      position: relative;
      bottom: -2rpx;
    }

    text {
      position: relative;
      bottom: -3rpx;
      font-size: 24rpx;

      &:first-child {
        margin-left: 10rpx;
      }
    }
  }

  .pay {
    width: 200rpx;
    background-color: #ea4451;
    color: #fff;
  }
}
</style>

