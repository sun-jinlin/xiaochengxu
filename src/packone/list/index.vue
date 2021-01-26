<template>
  <view>
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>
    <!-- 商品列表 -->
    <scroll-view @scrolltolower="toLower" class="goods" scroll-y>
      <view
        v-for="(item, i) in result"
        :key="i"
        class="item"
        @click="goDetail(item.goods_id)"
      >
        <!-- 商品图片 -->
        <image class="pic" :src="item.goods_big_logo" />
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{ item.goods_name }}</view>
          <view class="price">
            <text>￥</text>{{ item.goods_price }}
            <text>.00</text>
          </view>
        </view>
      </view>
      <view v-if="bottom ? 'bottom' : ''" class="bottom">到底了</view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      result: [],
    };
  },
  onLoad(query) {
    this.query = query;
    this.query.pagenum = 1;
    this.query.pagesize = 5;
    this.getResult(this.query);
  },
  computed: {
    bottom() {
      return this.result.length === this.total;
    },
  },
  methods: {
    toLower() {
      if (!this.bottom) {
        this.query.pagenum++;
        this.getResult(this.query);
      }
    },
    async getResult(query) {
      const { mes, data } = await this.request({
        url: "/goods/search",
        data: query,
      });

      if (mes.status === 200) {
        this.result.push(...data.goods);
        this.total = data.total;
      }
    },
    goDetail(goods_id) {
      uni.navigateTo({
        url: "/packone/goods/index?goods_id=" + goods_id,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.bottom {
  margin: 30px;
  color: rgb(196, 188, 188);
  text-align: center;
  font-size: 24rpx;
}
.filter {
  display: flex;
  height: 96rpx;
  line-height: 96rpx;
  border-bottom: 1rpx solid #ddd;

  /* #ifdef H5 */
  position: relative;
  z-index: 99;
  /* #endif */

  text {
    flex: 1;
    text-align: center;
    font-size: 30rpx;
    color: #333;

    &.active {
      color: #ea4451;
    }
  }
}

.goods {
  position: absolute;
  width: 100%;
  top: 97rpx;
  bottom: 0;
}

.item {
  display: flex;
  padding: 30rpx 20rpx 30rpx 0;
  margin-left: 20rpx;
  border-bottom: 1rpx solid #eee;

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
}
</style>
