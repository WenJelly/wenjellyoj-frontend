<template>
  <div id="exampleView">
    <CodeEditor :handle-change="onCodeChange" :value="codeValue" />
    <MdEditor :handle-change="onMdChange" :value="mdValue" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue"; // @ is an alias to /src

const mdValue = ref();
const codeValue = ref();

const onMdChange = (v: string) => {
  mdValue.value = v;
};

const onCodeChange = (v: string) => {
  codeValue.value = v;
};
</script>
