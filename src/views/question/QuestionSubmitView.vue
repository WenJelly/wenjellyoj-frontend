<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #message="{ record }">
        <!--        答案正确-->
        <div
          v-if="record.judgeInfo.message == '答案正确'"
          style="color: #00b42a; font-family: 'JetBrains Mono'"
        >
          Accepted
        </div>
        <!--        答案错误-->
        <div
          v-if="record.judgeInfo.message == '答案错误'"
          style="color: red; font-family: 'JetBrains Mono'"
        >
          Wrong Answer
        </div>
        <!--        编译错误-->
        <div
          v-if="record.judgeInfo.message == '编译错误'"
          style="color: #f53f3f; font-family: 'JetBrains Mono'"
        >
          Compile Error
        </div>
        <!--        运行错误-->
        <div
          v-if="record.judgeInfo.message == '运行错误'"
          style="color: #ff5722; font-family: 'JetBrains Mono'"
        >
          Runtime Error
        </div>
        <!--        运行超时-->
        <div
          v-if="record.judgeInfo.message == '超时'"
          style="color: grey; font-family: 'JetBrains Mono'"
        >
          Time Limit Exceeded
        </div>

        <!--        内存溢出-->
        <div
          v-if="record.judgeInfo.message == '内存溢出'"
          style="color: #86909c; font-family: 'JetBrains Mono'"
        >
          Memory Limit Exceeded
        </div>
      </template>
      <template #time="{ record }">
        <div v-if="record.judgeInfo.time != null && record.judgeInfo.time != 0">
          {{ record.judgeInfo.time }} ms
        </div>
      </template>
      <template #memory="{ record }">
        <!--        {{ JSON.stringify(record.judgeInfo.message) }}-->
        <div
          v-if="record.judgeInfo.memory != 0 && record.judgeInfo.memory != null"
        >
          {{ record.judgeInfo.memory }} MB
        </div>
      </template>
      <template #status="{ record }">
        <!--        题目状态 (0-待判题 1-判题中 2-成功 3-失败)-->
        <div v-if="record.status == 0">等待判题</div>
        <div v-else-if="record.status == 1">正在判题</div>
        <div v-else-if="record.status == 2">判题完成</div>
        <div v-else>判题失败</div>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated/";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 15,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "编号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "结果",
    slotName: "message",
  },
  {
    title: "时间",
    slotName: "time",
  },
  {
    title: "内存",
    slotName: "memory",
  },
  {
    title: "判题状态",
    slotName: "status",
  },
  {
    title: "题目名称",
    dataIndex: "questionVO.title",
  },
  {
    title: "提交用户",
    dataIndex: "userVO.userName",
  },
  {
    title: "提交时间",
    slotName: "createTime",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
