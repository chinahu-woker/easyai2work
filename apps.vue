async function handleSubmitTaskTask() {
    const response = await submitTask(taskData);
    // 存储任务结果到本地存储
    uni.setStorageSync('taskResult', response);
}