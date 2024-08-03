<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <div style="margin-top: 16px">
              <a-card v-if="question" :title="question.title">
                <a-descriptions
                  :column="{ xs: 1, md: 2, lg: 3 }"
                  title="判题条件"
                >
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
                      <a-tag v-if="tag == '简单'" color="green" size="large">
                        {{ tag }}
                      </a-tag>
                      <!--            中等难度为黄色-->
                      <a-tag
                        v-else-if="tag == '中等'"
                        color="orangered"
                        size="large"
                      >
                        {{ tag }}
                      </a-tag>
                      <!--            困难难度为红色-->
                      <a-tag v-else-if="tag == '困难'" color="red" size="large">
                        {{ tag }}
                      </a-tag>
                      <!--            题目类型为淡蓝色-->
                      <a-tag v-else color="blue" size="large">
                        {{ tag }}
                      </a-tag>
                    </div>
                  </a-space>
                </template>
              </a-card>
            </div>
          </a-tab-pane>

          <a-tab-pane key="comment" title="评论">
            <div style="margin-top: 16px">
              <a-list>
                <a-list-item v-for="idx in 4" :key="idx">
                  <CommentsView />
                </a-list-item>
              </a-list>
            </div>
          </a-tab-pane>

          <a-tab-pane key="answer" title="答案"> 暂时无法查看答案</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item
            field="language"
            label="编程语言"
            style="min-width: 240px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '220px' }"
              placeholder="选择编程语言"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
              <a-option>html</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :handle-change="changeCode"
          :language="form.language"
          :value="form.code as string"
        />
        <a-divider size="0" />
        <a-button style="min-width: 200px" type="primary" @click="doSubmit">
          提交代码
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, withDefaults } from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";
import CommentsView from "@/views/question/CommentsView.vue";

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
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
