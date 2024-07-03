<template>
  <div id="addQuestionView">
    <div
      style="
        text-align: center;
        font-family: 华文琥珀;
        font-size: 32px;
        color: blueviolet;
      "
    >
      创建题目
    </div>
    <!--    <a-form :model="form">-->
    <a-row class="grid-demo">
      <a-col :span="12">
        <a-form :model="form">
          <!--          题目的标题-->
          <div id="questionInfo">
            <a-form-item
              field="title"
              label="题目标题"
              style="margin: 0 auto; margin-left: 3%"
            >
              <a-input
                v-model="form.title"
                placeholder="请输入标题"
                style="max-width: 70%"
              />
            </a-form-item>
          </div>
        </a-form>
        <a-form :model="form" layout="vertical">
          <!--          题目的内容-->
          <div id="questionInfo">
            <a-form-item
              field="content"
              label="题目内容"
              style="margin: 0 auto; margin-left: 12.4%"
            >
              <div id="questionContent">
                <MdEditor
                  :value="form.content"
                  :handle-change="onContentChange"
                />
              </div>
            </a-form-item>
          </div>
          <!--          题目答案-->
          <div id="questionInfo">
            <a-form-item
              field="answer"
              label="答案"
              style="margin: 0 auto; margin-left: 12.4%"
            >
              <div id="questionContent">
                <MdEditor
                  :value="form.answer"
                  :handle-change="onAnswerChange"
                />
              </div>
            </a-form-item>
          </div>
        </a-form>
      </a-col>
      <a-col :span="12">
        <a-form :model="form">
          <!--          题目标签-->
          <div id="questionInfo">
            <a-form-item
              field="tags"
              label="题目标签"
              style="margin: 0 auto; margin-left: 3%"
            >
              <a-input-tag
                v-model="form.tags"
                placeholder="请输入题目标签"
                allow-clear
                style="max-width: 70%"
              />
            </a-form-item>
          </div>

          <div id="questionInfo">
            <a-form-item
              field="judgeConfig.timeLimit"
              label="时间限制"
              style="margin: 0 auto; margin-left: 3%"
            >
              <a-input-number
                v-model="form.judgeConfig.timeLimit"
                placeholder="请输入时间限制"
                mode="button"
                min="0"
                size="large"
                style="max-width: 70%"
              />
            </a-form-item>
          </div>

          <div id="questionInfo">
            <a-form-item
              field="judgeConfig.memoryLimit"
              label="内存限制"
              style="margin: 0 auto; margin-left: 3%"
            >
              <a-input-number
                v-model="form.judgeConfig.memoryLimit"
                placeholder="请输入内存限制"
                mode="button"
                min="0"
                size="large"
                style="max-width: 70%"
              />
            </a-form-item>
          </div>

          <div id="questionInfo">
            <a-form-item
              field="judgeConfig.stackLimit"
              label="堆栈限制"
              style="margin: 0 auto; margin-left: 3%"
            >
              <a-input-number
                v-model="form.judgeConfig.stackLimit"
                placeholder="请输入堆栈限制"
                mode="button"
                min="0"
                size="large"
                style="max-width: 70%"
              />
            </a-form-item>
          </div>

          <div id="questionInfo">
            <div v-for="(judgeCaseItem, index) of form.judgeCase" :key="index">
              <a-form-item
                :field="`form.judgeCase[${index}].input`"
                :label="`输入用例-${index + 1}`"
                :key="index"
                style="margin: 0 auto; margin-left: 3%"
              >
                <a-input
                  v-model="judgeCaseItem.input"
                  placeholder="请输入测试输入用例"
                  style="max-width: 70%"
                />
              </a-form-item>
              <a-form-item
                :field="`form.judgeCase[${index}].output`"
                :label="`输出用例-${index + 1}`"
                :key="index"
                style="margin: 0 auto; margin-left: 3%; margin-top: 20px"
              >
                <a-input
                  v-model="judgeCaseItem.output"
                  placeholder="请输入测试输出用例"
                  style="max-width: 70%"
                />
              </a-form-item>
              <a-row class="grid-demo" style="margin-top: 20px">
                <a-button
                  status="danger"
                  @click="handleDelete(index)"
                  style="margin-left: 50%"
                >
                  删除
                </a-button>

                <a-button
                  @click="handleAdd"
                  type="outline"
                  status="success"
                  style="margin-left: 2%"
                  >新增测试用例
                </a-button>
              </a-row>
            </div>
          </div>
          <div id="questionInfo">
            <a-form-item style="margin: 0 auto; margin-left: 11%">
              <a-button type="primary" style="min-width: 40%" @click="doSubmit"
                >提交
              </a-button>
            </a-form-item>
          </div>
        </a-form>
      </a-col>
    </a-row>
    <!--    </a-form>-->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import MdEditor from "@/components/MdEditor.vue";

const route = useRoute();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");
const router = useRouter();

let form = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const doSubmit = async () => {
  console.log(form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("更新成功");
      setTimeout(() => {
        // 在这里执行需要延迟执行的代码
        router.push({
          path: "/manage/question/",
          replace: true,
        });
      }, 700);
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("创建成功");
      setTimeout(() => {
        // 在这里执行需要延迟执行的代码
        router.push({
          path: "/",
          replace: true,
        });
      }, 700);
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};

/**
 * 新增判题用例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * 删除判题用例
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
</script>

<style scoped>
#addQuestionView {
  max-width: 1280px;
  margin: 0 auto;
}

#questionInfo {
  margin: 0 auto;
  width: 100%;
  //text-align: center;
  /*background-color: #42b983;*/
  margin-top: 40px;
}

#questionContent {
  width: 67%;
}
</style>
