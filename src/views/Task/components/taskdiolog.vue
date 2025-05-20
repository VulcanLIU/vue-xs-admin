<script setup lang="ts">
import {
    Aim,
    Clock,
    Odometer,
    OfficeBuilding,
    Tickets,
    User,
} from "@element-plus/icons-vue";
import { type ComponentSize, ElSlider } from "element-plus";
import { computed, defineEmits, PropType, reactive, ref } from "vue";
import { labelMap, STATUS_LIST, statusMap } from "../types/task";
import type { TaskParams } from "../types/task";
//定义组件属性
//|-需传入绑定在ELcard上的用户信息
const props = defineProps({
    taskData: {
        type: Object as PropType<TaskParams>,
        required: true,
    },
});

const emit = defineEmits(["sendStatus"]); //向父组件发送status的emit

const size = ref<ComponentSize>("default");

//ELDiscription中的图标样式
const iconStyle = computed(() => {
    const marginMap = {
        large: "8px",
        default: "6px",
        small: "4px",
    };
    return {
        marginRight: marginMap[size.value] || marginMap.default,
    };
});

//滑块组件中的数值
const value2 = ref(0);
//|-创建滑块中的数值与任务状态之间的映射
type Marks = Record<number, string>;
const marks = reactive<Marks>({
    0: statusMap[STATUS_LIST[0]],
    1: statusMap[STATUS_LIST[1]],
    2: statusMap[STATUS_LIST[2]],
    3: statusMap[STATUS_LIST[3]],
});
function MapValue2Status(): string {
    console.log(value2.value);
    console.log(STATUS_LIST[value2.value]);
    console.log(statusMap[STATUS_LIST[value2.value]]);
    return STATUS_LIST[value2.value];
}
function status_changed() {
    emit("sendStatus", STATUS_LIST[value2.value]);
}
</script>

<template>
    <div>
        <el-descriptions class="margin-top" :column="2" :size="size" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Aim />
                        </el-icon>
                        任务ID
                    </div>
                </template>
                {{ props.taskData.id }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <User />
                        </el-icon>
                        任务下发人
                    </div>
                </template>
                {{ props.taskData.issuer }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <User />
                        </el-icon>
                        任务责任人
                    </div>
                </template>
                {{ props.taskData.responser }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Tickets />
                        </el-icon>
                        任务描述
                    </div>
                </template>
                {{ props.taskData.discription }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Odometer />
                        </el-icon>
                        紧急程度
                    </div>
                </template>
                <el-tag
                    :type="labelMap[taskData.priority].type"
                    class="flex gap-2"
                >
                    {{ labelMap[taskData.priority].label }}
                </el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <Clock />
                        </el-icon>
                        任务节点
                    </div>
                </template>
                {{ props.taskData.node }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <OfficeBuilding />
                        </el-icon>
                        任务内容
                    </div>
                </template>
                {{ props.taskData.content }}
            </el-descriptions-item>
        </el-descriptions>

        <div class="slider-demo-block">
            <span class="demonstration">进度</span>
            <ElSlider
                v-model="value2"
                :step="1"
                show-stops
                :format-tooltip="MapValue2Status"
                :min="0"
                :max="3"
                :marks="marks"
                @change="status_changed"
            />
        </div>
    </div>
</template>

<style scoped>
.el-descriptions {
    margin-top: 20px;
}
.cell-item {
    display: flex;
    align-items: center;
}
.margin-top {
    margin-top: 5px;
}

.slider-demo-block {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    max-width: 600px;
    display: flex;
    align-items: center;
}
.slider-demo-block .el-slider {
    margin-top: 0;
    margin-left: 12px;
}
.slider-demo-block .demonstration {
    font-size: 20px;
    color: var(--el-text-color-secondary);
    line-height: 44px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0;
    text-anchor: middle;
}
.slider-demo-block .demonstration + .el-slider {
    flex: 0 0 85%;
}
</style>
