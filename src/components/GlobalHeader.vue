<template>
  <a-row id="globalHeader" style="margin-bottom: 16px" align="center">
    <a-col flex="100px">
      <!-- <div>100px</div> -->
    </a-col>
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div
            :style="{
              width: '80px',
              height: '30px',
              borderRadius: '2px',
              background: 'var(--color-fill-3)',
              cursor: 'text',
            }"
          />
        </a-menu-item>
        <a-menu-item v-for="item in routes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>{{ store.state.user?.loginUser?.userName ?? "未登录" }}</div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { routes } from "../router/routes";
import { ref } from "vue";
import { useStore } from "vuex";

const router = useRouter();

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

const doMenuClick = (key: string) => {
  console.log(key);
  router.push({
    path: key,
  });
};

const store = useStore();

// 定时，3秒后更新登录信息
setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "WenJelly",
  });
}, 3000);
</script>

<style></style>
