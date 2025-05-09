<script lang="ts" setup>
  import { useUserInfoStoreHook } from '@/store/modules/user';
  import { deffHttp } from '@/utils/axios';
  import { ref } from 'vue';
  import type { TaskParams, UserParams } from '../types/task';

  const emit = defineEmits<{
    (e: 'submitForm'): boolean;
  }>();

  const userInfoStore = useUserInfoStoreHook();

  const getTaskInfo = (user: string, id: number) =>
    deffHttp.post<TaskParams, UserParams>(
      {
        url: 'http://localhost:5000/api/getTaskInfo',
        data: { username: user, userid: id },
      },
      { errorMessageMode: 'modal', withToken: false },
    );

  const FetchData = async (task_data: TaskParams[]) => {
    const res = await getTaskInfo(userInfoStore.userInfo?.name, userInfoStore.userInfo?.userid);
    console.log(res.data);
    res.data.forEach(element => {
      task_data.push(element);
    });

    console.log(task_data);

    emit('submitForm');
  };

  defineExpose({ FetchData });
</script>

<template>
  <div />
</template>
