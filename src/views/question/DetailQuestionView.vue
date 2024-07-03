<template>
  <div id="DetailQuestionView">
    <div id="title">题目详细</div>
    <a-tabs default-active-key="question">
      <a-tab-pane key="question" title="题目">
        <a-card v-if="question" :title="question.title">
          <a-descriptions title="判题条件" :column="{ xs: 1, md: 2, lg: 3 }">
            <a-descriptions-item label="时间限制">
              {{ question.judgeConfig.timeLimit ?? 0 }}
            </a-descriptions-item>
            <a-descriptions-item label="内存限制">
              {{ question.judgeConfig.memoryLimit ?? 0 }}
            </a-descriptions-item>
            <a-descriptions-item label="堆栈限制">
              {{ question.judgeConfig.stackLimit ?? 0 }}
            </a-descriptions-item>
          </a-descriptions>

          <MdViewer :value="question.content || ''" />
          <template #extra>
            <a-space wrap>
              <div v-for="(tag, index) of question.tags" :key="index">
                <!--            简单难度为绿色-->
                <a-tag size="large" color="green" v-if="tag == '简单'">
                  {{ tag }}
                </a-tag>
                <!--            中等难度为黄色-->
                <a-tag size="large" color="orangered" v-else-if="tag == '中等'">
                  {{ tag }}
                </a-tag>
                <!--            困难难度为红色-->
                <a-tag size="large" color="red" v-else-if="tag == '困难'">
                  {{ tag }}
                </a-tag>
                <!--            题目类型为淡蓝色-->
                <a-tag size="large" color="blue" v-else>
                  {{ tag }}
                </a-tag>
              </div>
            </a-space>
          </template>
        </a-card>
      </a-tab-pane>
      <!--          <a-tab-pane key="comment" title="评论" disabled> 评论区</a-tab-pane>-->
      <a-tab-pane key="comment" title="评论"> 评论区</a-tab-pane>
      <a-tab-pane key="answer" title="答案"> 暂时无法查看答案</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import message from "@arco-design/web-vue/es/message";
import MdViewer from "@/components/MdViewer.vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }

  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败," + res.message);
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>

<style>
#DetailQuestionView {
  max-width: 750px;
  margin: 0 auto;
}

#DetailQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}

#title {
  font-size: 32px;
  font-family: 华文琥珀;
  color: blueviolet;
  text-align: center;
  margin-bottom: 30px;
}
</style>
