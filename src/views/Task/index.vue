<script lang="ts" setup>
  import { useUserInfoStoreHook } from '@/store/modules/user';
  import { onMounted, ref } from 'vue';
  import fetchdata from './components/fetchdata.vue';
  import Task from './components/task.vue';
  import { STATUS_LIST } from './types/task';
  import type { Status, TaskParams } from './types/task';

  defineOptions({
    name: 'RtTask',
  });

  //获取子组件实例
  const childRef = ref<InstanceType<typeof fetchdata> | null>(null);

  //任务数据
  const TaskData2 = ref<TaskParams[]>([]);
  const TodoTaskData = ref<TaskParams[]>([]);
  const DoingTaskData = ref<TaskParams[]>([]);
  const DoneTaskData = ref<TaskParams[]>([]);
  const StoppedTaskData = ref<TaskParams[]>([]);

  //|——对任务数据进行归类状态到数据 ref 的映射
  const taskDataMap: Record<Status, typeof TodoTaskData> = {
    Todo: TodoTaskData,
    Doing: DoingTaskData,
    Done: DoneTaskData,
    Stopped: StoppedTaskData,
  };

  // 初始化：按状态分类填充每个 ref
  function sortByStatus(raw: TaskParams[], target: Status) {
    return raw.filter(i => i.status === target);
  }

  onMounted(() => {
    //拉取数据-该用户的任务数据
    FetchData(TaskData2.value);
  });

  //调用子组件函数获取数据
  function FetchData(task_data: TaskParams[]) {
    childRef.value?.FetchData(task_data);
  }

  //子组件完成数据获取后完成此回调函数
  function loadData() {
    //
    for (const status of STATUS_LIST) {
      taskDataMap[status].value = sortByStatus(TaskData2.value, status);
    }
  }

  // 拖拽处理函数
  function onTaskDragEnd({
    fromStatus,
    toStatus,
    oldIndex,
    newIndex,
    fromEl,
    toEl,
    itemEl,
    evt,
  }: {
    fromStatus: Status;
    toStatus: Status;
    oldIndex: number;
    newIndex: number;
    fromEl: HTMLElement;
    toEl: HTMLElement;
    itemEl: HTMLElement;
    evt: any;
  }) {
    const fromList = taskDataMap[fromStatus].value;
    const toList = taskDataMap[toStatus].value;

    const taskEl = itemEl as HTMLElement;
    const taskId = taskEl.querySelector('.card-header span')?.textContent || '';

    const task = fromList.splice(oldIndex, 1)[0];
    if (task && fromStatus !== toStatus) {
      task.status = toStatus;
    }
    toList.splice(newIndex, 0, task);
    console.log(TodoTaskData.value);
    console.log(DoingTaskData.value);
  }
</script>

<template>
  <div>
    <ElRow class="row-bg" justify="space-evenly">
      <ElCol v-for="item in STATUS_LIST" :key="item" :span="4" gutter="20">
        <div style="text-align: center">{{ item }}</div>
        <div>
          <Task :task-data="taskDataMap[item].value" :status="item" @drag-end="onTaskDragEnd" />
        </div>
      </ElCol>
    </ElRow>
    <fetchdata ref="childRef" @submit-form="loadData" />
  </div>
</template>
