<template>
  <a-row id="globalHeader" :wrap="false" align="center">
    <a-col flex="auto">
      <a-menu
        :selected-keys="selectedKeys"
        mode="horizontal"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div id="logo">WenJellyOJ</div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col id="userInfo" flex="100px">
      <div v-if="store.state.user?.loginUser.userName == '未登录'">
        <a href="/user/login">未登录</a>
      </div>
      <div v-else>
        <a-dropdown trigger="hover">
          <a-avatar :image-url="store.state.user?.loginUser.userAvatar">
          </a-avatar>
          <template #content>
            <a-doption @click="personalInfo">个人信息</a-doption>
            <a-doption @click="logout">退出登录</a-doption>
          </template>
        </a-dropdown>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { routes } from "../router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";
import message from "@arco-design/web-vue/es/message";

const router = useRouter();
const store = useStore();

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

console.log();

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "WenJelly",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

/**
 * 用户点击个人信息时
 */
const personalInfo = () => {
  setTimeout(() => {
    // 在这里执行需要延迟执行的代码
    router.push({
      path: "/user/personalInfo",
      replace: true,
    });
  });
};

/**
 * 用户点击退出登录时
 */
const logout = async () => {
  // 向后端发送请求
  const res = await UserControllerService.userLogoutUsingPost();
  if (res.code === 0) {
    // 跳转到首页
    message.success("退出成功");
    // 重新加载首页
    window.location.reload();
    setTimeout(() => {
      // 在这里执行需要延迟执行的代码
      router.push({
        path: "/",
        replace: true,
      });
    }, 700);
  } else {
    message.error("登陆失败，" + res.message);
  }
};
</script>

<style scoped>
#logo {
  font-size: 24px;
  font-family: 华文琥珀;
  color: blueviolet;
  margin-left: 40px;
}

#userInfo {
  margin-right: 60px;
}
</style>
