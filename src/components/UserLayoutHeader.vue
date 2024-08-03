<template>
  <a-row id="globalHeader" :wrap="false" align="center">
    <a-col flex="auto">
      <a-menu mode="horizontal">
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div id="top">Welcome to WenJellyOJ</div>
        </a-menu-item>
      </a-menu>
    </a-col>
  </a-row>
</template>
<style scoped>
#top {
  font-family: 华文琥珀;
  color: blueviolet;
  font-size: 32px;
}
</style>
