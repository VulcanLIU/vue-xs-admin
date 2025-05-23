<script setup>
  import { v4 as uuid } from 'uuid';
  import { onBeforeUpdate, reactive, ref } from 'vue';
  import { useBoardsStore } from '../../stores/boards.js';
  import { useManagerStore } from '../../stores/manager.js';
  import ButtonPrimaryLarge from '../buttons/PrimaryLarge.vue';
  import ButtonSecondaryLarge from '../buttons/SecondaryLarge.vue';
  import BaseInput from '../form/BaseInput.vue';
  import BaseSelect from '../form/BaseSelect.vue';
  import BaseTextarea from '../form/BaseTextarea.vue';
  import IconCross from '../icons/IconCross.vue';
  const boardsStore = useBoardsStore();
  const managerStore = useManagerStore();
  const columnName = ref('');

  const inputTitle = ref(null);
  const inputs = ref([]);

  const form = reactive({
    task: {
      title: '',
      description: '',
      subtasks: [
        { title: '', isCompleted: false },
        { title: '', isCompleted: false },
      ],
    },
    column: 0,
  });
  const subtaskPlaceholders = {
    0: 'e.g. Make coffee',
    1: 'e.g. Drink coffee & smile',
  };
  const deleteSubtask = index => {
    if (form.task.subtasks.length === 2) {
      form.task.subtasks[index].title = '';
      form.task.subtasks[index].isCompleted = false;
    } else {
      form.task.subtasks.splice(index, 1);
    }
  };
  const addSubtask = () => {
    form.task.subtasks.push({ title: '', isCompleted: false });
  };
  const onSubmit = () => {
    if (validate()) {
      if (managerStore.taskForm.edit) {
        boardsStore.saveTaskChanges({ task: form.task, column: form.column });
      } else {
        boardsStore.getColumns[form.column].tasks.push({ ...form.task, id: uuid() });
      }
      managerStore.hideOverlay();
    }
  };
  const validate = () => {
    let valid = true;
    if (form.task.title.trim().length === 0) {
      valid = false;
      inputTitle.value.error = true;
    }
    inputs.value.forEach((e, index) => {
      if (form.task.subtasks[index]?.title.trim().length === 0) {
        valid = false;
        e.error = true;
      }
    });
    return valid;
  };
  const updateColumn = ({ index, name }) => {
    form.column = index;
    columnName.value = name;
  };

  //EDIT MODE
  if (managerStore.taskForm.edit) {
    form.task = JSON.parse(JSON.stringify(boardsStore.getTask));
    form.column = JSON.parse(JSON.stringify(boardsStore.selectedColumn));
    columnName.value = JSON.parse(JSON.stringify(boardsStore.getColumnsNames[boardsStore.selectedColumn]));
  } else {
    columnName.value = JSON.parse(JSON.stringify(boardsStore.getColumnsNames[0]));
  }

  onBeforeUpdate(() => {
    inputs.value = [];
  });
</script>
<template>
  <form class="bg-white dark:bg-dark-grey rounded-lg p-1" @submit.prevent="onSubmit">
    <div class="p-5 pr-3 flex flex-col gap-6 max-h-[90vh] overflow-y-scroll">
      <div class="flex justify-between items-center">
        <h4 class="text-black dark:text-white font-bold text-lg">
          {{ managerStore.taskForm.edit ? 'Edit Task' : 'Add New Task' }}
        </h4>
      </div>
      <BaseInput ref="inputTitle" v-model="form.task.title" input-name="Title" placeholder="e.g. Take coffee break" />
      <BaseTextarea
        v-model="form.task.description"
        input-name="Description"
        placeholder="e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little."
      />
      <div class="flex flex-col gap-3">
        <p class="text-medium-grey text-xs font-bold">Subtasks</p>
        <div
          v-for="(subtask, index) in form.task.subtasks"
          ref="errorSubtasks"
          :key="index"
          class="flex items-center justify-between gap-4"
        >
          <BaseInput
            :ref="
              el => {
                inputs[index] = el;
              }
            "
            v-model="subtask.title"
            :placeholder="subtaskPlaceholders[index] ? subtaskPlaceholders[index] : 'Your subtask title...'"
          />
          <IconCross class="cursor-pointer" @click="deleteSubtask(index)" />
        </div>
        <ButtonSecondaryLarge type="button" @click.stop="addSubtask">+ Add New Subtask</ButtonSecondaryLarge>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-medium-grey text-xs font-bold">Status</p>
        <BaseSelect :value="columnName" @on-click-option="updateColumn" />
      </div>
      <ButtonPrimaryLarge type="submit">
        {{ managerStore.taskForm.edit ? 'Save Changes' : 'Create Task' }}
      </ButtonPrimaryLarge>
    </div>
  </form>
</template>
