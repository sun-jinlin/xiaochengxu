<template>
  <view class="search" :class="{ focused: isSearch }">
    <view class="sinput">
      <input
        @confirm="enter"
        @input="inputResult"
        v-model="result"
        @focus="search"
        type="text"
        placeholder="搜索"
      />
      <button @click="cancel">取消</button>
    </view>
    <view class="scontent" v-show="isSearch">
      <div class="title">
        搜索历史
        <span @click="clrearStorage" class="clear"></span>
      </div>
      <div class="history" v-if="!results.length">
        <navigator
          v-for="(item, i) in searchs"
          :key="i"
          :url="'/packone/list/index?query=' + item"
          >{{ item }}</navigator
        >
      </div>
      <!-- 结果 -->
      <scroll-view scroll-y class="result" v-else>
        <navigator
          v-for="item in results"
          :key="item.goods_id"
          :url="'/packone/list/index?query=' + item.goods_name"
          >{{ item.goods_name }}</navigator
        >
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isSearch: false,
      searchs: uni.getStorageSync("history") || [],
      result: "",
      results: [],
    };
  },
  created() {
    console.log(3333333333333);
  },
  methods: {
    clrearStorage() {
      this.searchs = [];
      uni.removeStorage({
        key: "history",
      });
    },
    enter() {
      if (!this.searchs.includes(this.result)) {
        this.searchs.push(this.result);
        uni.setStorage({
          key: "history",
          data: this.searchs,
        });
      }

      uni.navigateTo({
        url: `/packone/list/index?query=${this.result}`,
      });
      this.result = "";
      this.results = [];
    },
    search() {
      this.isSearch = true;
      uni.hideTabBar();
      this.wh = uni.getSystemInfoSync().windowHeight;
      this.$emit("search", this.wh + "px");
    },
    cancel() {
      this.isSearch = false;
      uni.showTabBar();
      this.$emit("search", "auto");
      this.result = "";
      this.results = [];
    },
    inputResult() {
      if (!this.result) {
        return (this.results = []);
      }
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.getResult();
      }, 600);
    },
    async getResult() {
      const { mes, data } = await this.request({
        url: `/goods/qsearch`,
        data: {
          query: this.result,
        },
      });
      if (mes.status === 200) {
        this.results = data;
        console.log(this.results);
      }
    },
  },
};
</script>

<style lang="scss">
// 搜索
.search {
  display: flex;
  flex-direction: column;
  .sinput {
    box-sizing: border-box;
    padding: 20rpx 16rpx;
    background: #ff2d4a;
    position: relative;
    //伪元素
    &::after {
      position: absolute;
      top: 28rpx;
      left: 302rpx;
      content: "";
      width: 44rpx;
      height: 44rpx;
      line-height: 1;
      background-image: url(https://static.botue.com/ugo/images/icon_search%402x.png);
      background-size: 32rpx;
      background-position: 6rpx center;
      background-repeat: no-repeat;
    }
    input {
      background: #fff;
      flex: 1;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      font-size: 24rpx;
      color: #bbb;
      border-radius: 5rpx;
    }
    button {
      display: none;
      margin-left: 20rpx;
      width: 150rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      font-size: 24rpx;
      border-radius: 5rpx;
      background: transparent;
      color: #666;
    }
  }
  &.focused {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    .sinput {
      display: flex;
      background: #eee;
      input {
        text-align: left;
        padding-left: 60rpx;
      }
      button {
        display: block;
      }
      &::after {
        left: 30rpx;
      }
    }
  }
  .scontent {
    background: #fff;
    position: relative;

    flex: 1;
    padding: 27rpx;
    .title {
      font-size: 27rpx;
      line-height: 1;
      color: #333;
    }
    .clear {
      display: block;
      width: 27rpx;
      height: 27rpx;
      float: right;
      background-image: url(http://static.botue.com/ugo/images/clear.png);
      background-size: cover;
    }

    .history {
      padding-top: 30rpx;
      navigator {
        display: inline-block;
        line-height: 1;
        padding: 15rpx 20rpx 12rpx;
        background-color: #ddd;
        font-size: 24rpx;
        margin-right: 20rpx;
        margin-bottom: 15rpx;
        color: #333;
      }
    }

    .result {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: #fff;
      navigator {
        line-height: 1;
        padding: 20rpx 30rpx;
        font-size: 24rpx;
        color: #666;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>