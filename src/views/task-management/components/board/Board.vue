<script setup>
  import AddNewColumn from '@/views/task-management/components/board/AddNewColumn.vue';
  import BoardTask from '@/views/task-management/components/board/Task.vue';
  import { useBoardsStore } from '@/views/task-management/stores/boards';
  import { useManagerStore } from '@/views/task-management/stores/manager';
  import { ref } from 'vue';

  const managerStore = useManagerStore();
  const boardsStore = useBoardsStore();
  const draggedTask = ref(null);
  const tempTaskStyle = ['border-main-purple', 'border-2'];
  const tempTask = ref(null); //For visual feedback
  const onDragTask = (evt, task, columnIndex, taskIndex) => {
    managerStore.dragging = true;
    draggedTask.value = {
      el: evt.target,
      task,
      columnIndex,
      taskIndex,
    };
    boardsStore.getCurrentBoard.columns[columnIndex].tasks.splice(taskIndex, 1);
    evt.dataTransfer.dropEffect = 'move';
    evt.dataTransfer.effectAllowed = 'move';
  };
  const onDragEnterColumn = columnIndex => {
    removeTempTask();
    boardsStore.boards[boardsStore.selectedBoard].columns[columnIndex].tasks.push(draggedTask.value.task);
    tempTask.value = {
      columnIndex,
      taskIndex: boardsStore.boards[boardsStore.selectedBoard].columns[columnIndex].tasks.length - 1,
    };
  };

  const onDragEnterTask = (evt, task, columnIndex, taskIndex) => {
    if (draggedTask.value.task.id !== task.id) {
      removeTempTask();
      boardsStore.boards[boardsStore.selectedBoard].columns[columnIndex].tasks.splice(
        taskIndex,
        0,
        draggedTask.value.task,
      );
      tempTask.value = {
        columnIndex,
        taskIndex,
      };
    }
  };
  const onDragLeaveTask = evt => {};
  const onDragEnd = evt => {
    if (tempTask.value) {
      const sameColumn = draggedTask.value?.columnIndex === tempTask.value?.columnIndex;
      const isAbove = draggedTask.value?.taskIndex > tempTask.value?.taskIndex;
    } else {
      boardsStore.getCurrentBoard.columns[draggedTask.value.columnIndex].tasks.splice(
        draggedTask.value.taskIndex,
        0,
        draggedTask.value.task,
      );
    }
    managerStore.dragging = false;
    draggedTask.value = null;
    tempTask.value = null;
    boardsStore.boards = boardsStore.boards;
  };
  const removeTempTask = () => {
    if (tempTask.value) {
      boardsStore.boards[boardsStore.selectedBoard].columns[tempTask.value.columnIndex].tasks.splice(
        tempTask.value.taskIndex,
        1,
      );
      tempTask.value = null;
    }
  };

  const onClickTask = (column, task) => {
    boardsStore.selectedColumn = column;
    boardsStore.selectedTask = task;
    managerStore.taskView = true;
    managerStore.overlay = true;
  };
</script>
<template>
  <div class="flex gap-6">
    <section
      v-for="(column, columnIndex) in boardsStore.getColumns"
      :key="columnIndex"
      data-dragscroll
      class="min-w-[280px] box-content flex flex-col"
      @dragover.prevent
    >
      <div class="flex items-center gap-3 pb-6">
        <div class="rounded-full h-4 w-4" :style="{ backgroundColor: column.color }" />
        <h2 class="text-medium-grey font-bold text-xs uppercase">{{ column.name }} ( {{ column.tasks.length }} )</h2>
      </div>
      <TransitionGroup tag="div" name="tasks" data-dragscroll class="flex flex-col gap-5">
        <div v-for="(task, taskIndex) in column?.tasks" :key="task.id">
          <BoardTask
            :task="task"
            draggable="true"
            :class="[
              tempTask?.taskIndex === taskIndex && tempTask?.columnIndex === columnIndex ? tempTaskStyle : '',
              draggedTask?.task?.id === task.id ? 'opacity-50' : '',
            ]"
            @click="onClickTask(columnIndex, taskIndex)"
            @dragstart="onDragTask($event, task, columnIndex, taskIndex)"
            @dragenter="onDragEnterTask($event, task, columnIndex, taskIndex)"
            @dragend="onDragEnd($event)"
            @dragleave.prevent="onDragLeaveTask($event)"
          />
        </div>
      </TransitionGroup>
      <div class="h-full mt-5" @dragenter="onDragEnterColumn(columnIndex)" />
    </section>
    <AddNewColumn />
  </div>
</template>

<style>
  .tasks-enter-from {
    opacity: 0;
    transform: scale(0.75);
  }

  .tasks-enter-to {
    opacity: 1;
    transform: scale(1);
  }

  .tasks-enter-active {
    transition: all 0.5s ease;
  }
</style>
