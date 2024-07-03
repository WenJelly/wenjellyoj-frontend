<template>
  <div id="manageQuestionView">
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
      <template #tags="{ record }">
        <a-space wrap>
          <div v-for="(tag, index) of record.tags" :key="index">
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

      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>

      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doView(record)">查看</a-button>
          <a-button type="secondary" @click="doUpdate(record)">修改</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated/";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment/moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
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

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    title: "编号",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  // {
  //   title: "答案",
  //   dataIndex: "answer",
  // },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  // {
  //   title: "判题配置",
  //   dataIndex: "judgeConfig",
  // },
  // {
  //   title: "判题用例",
  //   dataIndex: "judgeCase",
  // },
  {
    title: "题目创建者",
    dataIndex: "userVO.userName",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败");
  }
};

const router = useRouter();

const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};

const doView = (question: Question) => {
  router.push({
    path: `/detail/question/${question.id}`,
  });
};
</script>

<style scoped>
#manageQuestionView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
