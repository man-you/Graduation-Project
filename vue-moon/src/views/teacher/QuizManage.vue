const loadExercises = () => { const nodeId = Number(route.params.nodeId) if (!isNaN(nodeId) &&
nodeId > 0) { quizStore.getExercises(nodeId) } else { // 如果 nodeId 无效，设置 exercises 为空数组
quizStore.exercises = [] } } onMounted(() => { loadExercises() }) //
监听路由参数变化，处理组件复用的情况 watch( () => route.params.nodeId, (newNodeId, oldNodeId) => {
if (newNodeId !== oldNodeId) { loadExercises() } }, )
