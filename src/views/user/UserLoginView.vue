<template>
  <div id="userLoginView">
    <div id="title">登录</div>
    <div id="loginForm">
      <a-form
        :model="form"
        auto-label-width
        label-align="left"
        style="max-width: 480px; margin: 0 auto"
        @submit="handleSubmit"
      >
        <a-form-item id="item" field="userAccount" label="账号">
          <a-input v-model="form.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item
          id="item"
          field="userPassword"
          label="密码"
          tooltip="密码不少于 8 位"
        >
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item id="button">
          <a-button html-type="submit" style="width: 120px" type="primary">
            登录
          </a-button>
          <div id="gotoRegister">
            暂无账号？去<a href="/user/register">注册</a>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated/";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const router = useRouter();
const store = useStore();

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  // 登录成功，跳转到主页
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    message.success("登录成功,欢迎您 " + res.data.userName);
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
#userLoginView {
  background-color: white;
  height: 550px;
  width: 600px;
  border-radius: 4%;
  margin-top: 30px;
  margin-left: 33%;
}

#title {
  font-family: 华文琥珀;
  font-size: 32px;
  color: blueviolet;
  padding-top: 50px;
  padding-bottom: 50px;
}

#loginForm {
}

#item {
  margin-top: 20px;
}

#button {
  margin-top: 20px;
}

#gotoRegister {
  margin-left: 170px;
}
</style>
