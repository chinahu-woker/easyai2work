"use strict";
const common_vendor = require("../common/vendor.js");
const types_index = require("../types/index.js");
const utils_common = require("../utils/common.js");
const utils_request = require("../utils/request.js");
const stores_appStore = require("../stores/appStore.js");
const composables_useCommon = require("./useCommon.js");
const submitCustomWorkflow = (data) => utils_request.request("/draw/customWorkflow", {
  method: "POST",
  data
});
const getModelListByWorkflowId = (workflow_id) => utils_request.request(`/draw/getModelListById/${workflow_id}`);
const creatDrawHistoryTask = (data) => utils_request.request("/draw/history", {
  method: "POST",
  data
});
function useWorkFlow() {
  const workflow = common_vendor.ref(null);
  const params_component_list = [
    { param: "seed", component: "Seed", title: "随机种子" },
    { param: "ckpt_name", component: "ModeSelect", title: "大模型选择" },
    { param: "positive", component: "Positive", title: "正向提示词" },
    { param: "width", component: "Width", title: "图片宽度" },
    { param: "height", component: "Height", title: "图片高度" },
    { param: "batch_size", component: "CustomNumberBox", title: "生成批次" },
    { param: "image_path_origin", component: "ImageUpload", title: "原图上传" },
    { param: "image_path_mask", component: "ImageUpload", title: "遮罩上传" },
    { param: "image_path_face", component: "ImageUpload", title: "参考上传" },
    { param: "image_path_style", component: "ImageUpload", title: "参考上传" },
    { param: "image_path", component: "ImageUpload", title: "参考上传" },
    { param: "advance_select_image_preview", component: "ImageSelectPreview", title: "高级-图像预览选择" },
    { param: "multi_image_path", component: "ImageUploadMore", title: "多图上传" },
    // { param: 'advance_onlineEdit_mask', component: 'MoreImageUpload', title: '遮罩上传' },
    { param: "advance_onlineEdit_origin", component: "MoreImageUpload", title: "遮罩上传" }
    // { param: 'advance_onlineEdit', component: 'MoreImageUpload', title: '遮罩上传' }
  ];
  const bindParam = common_vendor.ref({});
  const handleGetWorkFlwById = async (id) => {
    workflow.value = await utils_request.request(`/workflow/${id}`);
    handleWorkFlowParamsToBindParam();
  };
  const { localTasks } = common_vendor.storeToRefs(stores_appStore.useAppStore());
  const workFlowParamLists = common_vendor.computed(() => {
    var _a;
    if (!workflow.value || !((_a = workflow.value) == null ? void 0 : _a.params)) {
      return [];
    }
    return workflow.value.params.filter((item) => item.name !== "output");
  });
  const outputType = common_vendor.computed(() => {
    var _a;
    if (!workflow.value || !workflow.value.params) {
      return "image";
    }
    return ((_a = workflow.value.params.find((item) => item.name === "output")) == null ? void 0 : _a.outputType) || "image";
  });
  const handleFindComponentName = (param) => {
    const component = params_component_list.find((item) => param === item.param);
    return component == null ? void 0 : component.component;
  };
  const handleWorkFlowParamsToBindParam = () => {
    if (!workflow.value || !workflow.value.params) {
      return;
    }
    workflow.value.params.forEach((item) => {
      bindParam.value[item.name] = item.param;
    });
  };
  const socketState = common_vendor.inject("socketState");
  if (!socketState) {
    throw new Error("socketState is not provided");
  }
  const closeSocketAsync = () => {
    return new Promise((resolve) => {
      common_vendor.index.closeSocket({
        code: 1e3,
        reason: "Initializing new WebSocket",
        success(result) {
          resolve(true);
        },
        fail(result) {
          resolve(false);
        }
      });
    });
  };
  const socketInit = async (options = {
    params: {
      type: types_index.IWebsocketSceneType.drawProcessPush,
      data: { scene_str: "" }
    }
  }) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!composables_useCommon.isLogin.value) {
      throw new Error("未登录状态，不允许初始化Websocket");
    }
    console.log("socket init execution，status", (_a = socketState.socket) == null ? void 0 : _a.readyState);
    if ((socketState == null ? void 0 : socketState.isInitialized) && ((_c = (_b = socketState.options) == null ? void 0 : _b.params) == null ? void 0 : _c.type) === ((_d = options == null ? void 0 : options.params) == null ? void 0 : _d.type)) {
      console.log("WebSocket is already initialized");
      return;
    }
    if ((socketState == null ? void 0 : socketState.isInitialized) && ((_f = (_e = socketState == null ? void 0 : socketState.options) == null ? void 0 : _e.params) == null ? void 0 : _f.type) !== ((_g = options == null ? void 0 : options.params) == null ? void 0 : _g.type)) {
      console.log("WebSocket is already initialized,but scene is different,reinitialize");
      await closeSocketAsync();
      socketState.isInitialized = false;
    }
    const { params } = options;
    const { type, data } = params;
    const { uniPlatform } = common_vendor.index.getSystemInfoSync();
    const url = `${utils_request.getBaseWsURL()}?user_id=${composables_useCommon.getLoginInfo()._id}&type=${type}&platform=${uniPlatform}&data=${encodeURIComponent(data)}`;
    socketState.socket = common_vendor.index.connectSocket({
      url,
      complete: () => {
        console.log("WebSocket connect complete");
      }
    });
    socketState.isInitialized = true;
    common_vendor.index.onSocketOpen((result) => {
      console.log("WebSocket opened", result);
      socketState.options = options;
      if (options.onConnect) {
        options.onConnect();
      }
    });
    common_vendor.index.onSocketMessage((msg) => {
      if (options.onMessage) {
        options.onMessage(msg.data);
      }
      handleSocketMessage(msg.data);
    });
    common_vendor.index.onSocketError((err) => {
      console.error("WebSocket onError", err);
      socketState.isInitialized = false;
      if (options.onConnectError) {
        options.onConnectError(err);
      }
    });
    common_vendor.index.onSocketClose(() => {
      socketState.isInitialized = false;
      console.log("WebSocket onClose");
      if (options.onDisconnect) {
        options.onDisconnect();
      }
    });
  };
  const handleSocketHandShake = (timeout = 200) => {
    return new Promise((resolve) => {
      var _a;
      const timeoutID = setTimeout(() => {
        resolve(false);
      }, timeout);
      if (!socketState || !socketState.socket || !socketState.isInitialized) {
        resolve(false);
        return;
      }
      (_a = socketState.socket) == null ? void 0 : _a.send({
        data: "ping",
        success(result) {
          console.log(result);
          clearTimeout(timeoutID);
          resolve(true);
        }
      });
    });
  };
  const handleSocketMessage = (msg, callback) => {
    var _a, _b;
    console.log("原始消息", msg);
    if (typeof msg !== "string" || !msg.startsWith("{") && !msg.startsWith("[")) {
      return;
    }
    let msgObj;
    try {
      msgObj = utils_common.parseJSONToObject(msg);
    } catch (error) {
      console.error("解析WebSocket消息时出错，消息不是有效的JSON格式:", error);
      return;
    }
    if (!msgObj)
      return;
    const { queue_status } = msgObj;
    if (!queue_status) {
      return;
    }
    const index = localTasks.value.findIndex((item) => item._id === queue_status.task_id);
    if (index !== -1) {
      if (typeof queue_status.progress !== "undefined")
        localTasks.value[index].progress = queue_status.progress;
      if (typeof queue_status.queue !== "undefined")
        localTasks.value[index].queue = queue_status.queue;
      if (typeof queue_status.time_remained !== "undefined")
        localTasks.value[index].time_remained = queue_status.time_remained;
      if (queue_status.message)
        localTasks.value[index].message = queue_status.message;
    }
    if (queue_status.status === "started" && index !== -1) {
      localTasks.value[index].status = 4;
      localTasks.value[index].message = "任务开始";
    }
    if (queue_status.status !== "failed" && index !== -1 && localTasks.value[index].status === 3) {
      localTasks.value[index].status = 0;
      localTasks.value[index].message = queue_status.message;
    }
    if (queue_status.status === "success" && index !== -1 && localTasks.value[index].status !== 1) {
      localTasks.value[index].output = ((_a = queue_status == null ? void 0 : queue_status.data) == null ? void 0 : _a.output) || [];
      localTasks.value[index].type = ((_b = queue_status == null ? void 0 : queue_status.data) == null ? void 0 : _b.type) || "image";
      localTasks.value[index].status = 1;
      composables_useCommon.refreshUserInfo().then();
    }
    if (queue_status.status === "failed") {
      if (index !== -1 && localTasks.value[index].status !== 2) {
        localTasks.value[index].status = 2;
        localTasks.value[index].message = queue_status.message;
      }
    }
  };
  const handleCreateTask = async () => {
    const item = {
      params: { ...bindParam.value },
      workflow_id: workflow.value._id,
      user_id: composables_useCommon.getLoginInfo()._id,
      options: {
        workflow_id: workflow.value._id,
        workflow_title: workflow.value.title,
        workflow_name: workflow.value.name
      },
      type: outputType.value
    };
    return await creatDrawHistoryTask(item);
  };
  const handleUpdateTaskStatus = async (taskItem, output) => {
    const index = localTasks.value.findIndex((item) => item._id === taskItem._id);
    if (index !== -1) {
      localTasks.value[index].output = output.output;
      localTasks.value[index].status = 1;
    }
  };
  const handleSubmitTaskTask = async () => {
    if (!composables_useCommon.isLogin.value) {
      common_vendor.index.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2e3
      });
      return;
    }
    if (!await handleSocketHandShake()) {
      await socketInit();
    }
    const newTask = await handleCreateTask();
    console.log("newTask", newTask);
    if (!newTask) {
      return;
    }
    localTasks.value.unshift(newTask);
    const flatParams = { ...bindParam.value };
    if (flatParams.advance_onlineEdit_origin && typeof flatParams.advance_onlineEdit_origin === "object" && "advance_onlineEdit_origin" in flatParams.advance_onlineEdit_origin) {
      const maskUrl = flatParams.advance_onlineEdit_origin.advance_onlineEdit_mask || "";
      flatParams.advance_onlineEdit_origin = flatParams.advance_onlineEdit_origin.advance_onlineEdit_origin;
      flatParams.maskUrl_mask = maskUrl;
    }
    const requestParams = {
      params: flatParams,
      // 使用处理后的扁平化参数
      options: {
        workflow_id: workflow.value._id,
        task_id: newTask._id
      }
    };
    const result = await submitCustomWorkflow(requestParams);
    if (result.status === "success" && result.output && result.output.length > 0) {
      await handleUpdateTaskStatus(newTask, result);
      composables_useCommon.refreshUserInfo().then();
    }
    if (result.status === "failed" || result.status === "rejected") {
      common_vendor.index.showToast({
        title: result.message,
        icon: "none",
        duration: 2e3
      });
    }
  };
  return {
    workflow,
    workFlowParamLists,
    bindParam,
    params_component_list,
    socketInit,
    // socketState,
    // closeSocketAsync,
    handleFindComponentName,
    handleGetWorkFlwById,
    handleSubmitTaskTask
  };
}
exports.getModelListByWorkflowId = getModelListByWorkflowId;
exports.useWorkFlow = useWorkFlow;
