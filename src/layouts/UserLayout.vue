<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <UserLayoutHeader />
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <a-layout-footer class="footer">
        <a href="https://www.wenguodong.com" target="_blank"> By WenJelly </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
}

#userLayout .header {
  box-shadow: #eee 1px 1px 5px;
}

#userLayout .content {
  //background-image: url("https://bpic.588ku.com/back_origin_min_pic/19/04/12/985a291035b93e7fee69e5ecaf8c10e0.jpg"); background: linear-gradient(to right, #fefefe, #fff); background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png") 0% 0% / 100% 100%;
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
  background: #efefef;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script>
import UserLayoutHeader from "@/components/UserLayoutHeader";

export default {
  components: { UserLayoutHeader },
};
</script>
