<template>
  <div id="userLoginView">
    <div id="title">注册</div>
    <div id="registerForm">
      <a-form
        style="max-width: 480px; margin: 0 auto"
        label-align="left"
        auto-label-width
        :model="form"
        @submit="handleSubmit"
      >
        <a-form-item field="userName" label="用户名" id="item">
          <a-input v-model="form.userName" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item field="userAccount" label="账号" id="item">
          <a-input v-model="form.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item
          id="item"
          field="userPassword"
          tooltip="密码不少于 8 位"
          label="密码"
        >
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item
          id="item"
          field="checkPassword"
          tooltip="密码不少于 8 位"
          label="再次输入密码"
        >
          <a-input-password
            v-model="form.checkPassword"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item id="button">
          <a-button type="primary" html-type="submit" style="width: 120px">
            注册
          </a-button>
          <div id="gotoRegister">
            已有账号？去<a href="/user/login">登录</a>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import {
  UserControllerService,
  UserRegisterRequest,
} from "../../../generated/";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * 表单信息
 */
const form = reactive({
  userName: "",
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const router = useRouter();
const store = useStore();

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  // 登录成功，跳转到主页
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    message.success("注册成功");
    setTimeout(() => {
      // 在这里执行需要延迟执行的代码
      router.push({
        path: "/user/login",
        replace: true,
      });
    }, 700);
  } else {
    message.error("注册失败，" + res.message);
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

#registerForm {
}

#item {
  margin-top: 10px;
}

#button {
  margin-top: 20px;
}

#gotoRegister {
  margin-left: 110px;
}
</style>
