<template>
  <div
    class="absolute inset-0 flex flex-col min-w-0 overflow-hidden bg-[#F1F5F9] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500"
  >
    <div
      class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 dark:bg-blue-600/5 blur-[120px] rounded-full"
    ></div>
    <div
      class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 dark:bg-indigo-600/5 blur-[120px] rounded-full"
    ></div>

    <Transition name="fade">
      <div
        v-if="isDrawerOpen"
        @click="closeDrawer"
        class="fixed inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-md z-30 lg:z-40"
      ></div>
    </Transition>

    <div class="relative flex flex-auto h-full">
      <div v-if="loading" class="flex flex-auto flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p class="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">加载中...</p>
      </div>

      <main v-else class="flex flex-col flex-auto overflow-y-auto overflow-x-hidden">
        <header
          class="sticky top-0 z-20 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-6 sm:py-10 md:px-10 border-b border-white/20 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl"
        >
          <div class="space-y-1">
            <h1
              class="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent"
            >
              文件管理
            </h1>
            <nav class="flex items-center text-sm font-semibold">
              <div
                class="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400"
              >
                <a
                  @click="navigateToRoot"
                  class="hover:text-blue-500 transition-colors cursor-pointer"
                  >根目录</a
                >
                <template v-for="(path, index) in currentPath" :key="path.id">
                  <PhCaretRight :size="12" weight="bold" class="text-slate-300" />
                  <a
                    v-if="index !== currentPath.length - 1"
                    @click="navigateTo(path.id)"
                    class="hover:text-blue-500 transition-colors cursor-pointer"
                    >{{ path.name }}</a
                  >
                  <span v-else class="text-blue-600 dark:text-blue-400 truncate max-w-[120px]">{{
                    path.name
                  }}</span>
                </template>
              </div>
            </nav>
          </div>

          <div class="mt-6 sm:mt-0 flex gap-3">
            <button
              @click="showCreateFolderModal"
              class="flex items-center px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-200 shadow-sm hover:bg-slate-50 transition-all"
            >
              <PhFolderPlus :size="20" class="mr-2 text-blue-500" /> 新建
            </button>
            <button
              @click="handleFileUpload"
              class="group flex items-center px-6 py-2.5 rounded-2xl bg-blue-600 text-white font-bold shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95 transition-all"
            >
              <PhCloudArrowUp :size="20" weight="bold" class="mr-2" />
              上传文件
            </button>
          </div>
        </header>

        <div v-if="hasItems" class="p-6 md:p-10 space-y-10">
          <section v-if="folders.length > 0">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-black flex items-center gap-3">
                <span
                  class="w-2 h-6 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                ></span>
                文件夹
              </h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div
                v-for="folder in folders"
                :key="folder.id"
                class="group relative overflow-hidden bg-white/50 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/50 p-5 rounded-[2rem] hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 cursor-pointer"
                @click="navigateTo(folder.id)"
              >
                <div class="flex items-start justify-between">
                  <div
                    class="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-500"
                  >
                    <PhFolder :size="32" weight="duotone" />
                  </div>
                  <button
                    @click.stop="openDrawer(folder)"
                    class="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-500 transition-colors"
                  >
                    <PhDotsThreeCircle :size="24" weight="fill" />
                  </button>
                </div>

                <div class="mt-6">
                  <h3 class="text-base font-bold text-slate-800 dark:text-slate-100">
                    {{ folder.name }}
                  </h3>
                  <p class="text-xs font-medium text-slate-400 mt-1 flex items-center">
                    <PhFiles :size="14" class="mr-1" /> {{ folder.contents }}
                  </p>
                </div>

                <div
                  class="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity"
                >
                  <PhFolder :size="80" weight="fill" />
                </div>
              </div>
            </div>
          </section>

          <section v-if="files.length > 0">
            <h2 class="text-lg font-black flex items-center gap-3 mb-6">
              <span
                class="w-2 h-6 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              ></span>
              文件
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              <div
                v-for="file in files"
                :key="file.id"
                @click="openDrawer(file)"
                class="group relative flex flex-col items-center bg-white/40 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-[2.5rem] hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:shadow-xl cursor-pointer"
              >
                <div class="relative w-20 h-20 mb-4 flex items-center justify-center">
                  <div
                    class="absolute inset-0 bg-slate-100 dark:bg-slate-700/50 rounded-3xl group-hover:rotate-12 transition-transform duration-500"
                  ></div>
                  <PhFile
                    :size="40"
                    weight="duotone"
                    class="relative text-slate-500 dark:text-slate-400"
                  />
                  <div
                    class="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-lg text-[10px] font-black text-white shadow-lg shadow-black/10"
                    :class="getFileColor(file.type)"
                  >
                    {{ file.type }}
                  </div>
                </div>

                <span
                  class="text-sm font-bold text-slate-700 dark:text-slate-200 text-center line-clamp-1 w-full"
                  >{{ file.name }}</span
                >
                <span class="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{{
                  file.contents
                }}</span>
              </div>
            </div>
          </section>
        </div>

        <div v-else class="flex flex-auto flex-col items-center justify-center">
          <div class="relative group">
            <div
              class="absolute inset-0 bg-blue-400 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"
            ></div>
            <PhFolderOpen
              :size="120"
              weight="thin"
              class="relative text-slate-300 dark:text-slate-700"
            />
          </div>
          <p class="mt-6 text-xl font-bold text-slate-400">当前目录为空</p>
          <button @click="handleFileUpload" class="mt-4 text-blue-500 font-bold hover:underline">
            去上传一些资料吧
          </button>
        </div>
      </main>

      <Transition name="drawer">
        <aside
          v-if="isDrawerOpen"
          class="fixed right-4 top-4 bottom-4 w-[calc(100%-2rem)] sm:w-[400px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.1)] z-50 border border-white/20 dark:border-slate-800 rounded-[3rem] overflow-hidden"
        >
          <div class="h-full flex flex-col">
            <div
              class="p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
            >
              <h2 class="text-xl font-black">详情预览</h2>
              <button
                @click="closeDrawer"
                class="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-2xl transition-all"
              >
                <PhX :size="20" weight="bold" />
              </button>
            </div>

            <div class="flex-auto overflow-y-auto p-8 space-y-8">
              <div
                class="group relative aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <component
                  :is="selectedItem?.type === 'FOLDER' ? PhFolder : PhFileSearch"
                  :size="80"
                  weight="duotone"
                  class="text-slate-300 dark:text-slate-600 group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div v-if="selectedItem" class="space-y-6">
                <div>
                  <h3
                    class="text-2xl font-black text-slate-800 dark:text-white leading-tight break-all"
                  >
                    {{ selectedItem.name }}
                  </h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">资源名称</p>
                  <div
                    class="inline-flex mt-3 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold"
                  >
                    # {{ selectedItem.type }}
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div
                    class="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-700"
                  >
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      大小
                    </p>
                    <p class="mt-1 font-bold text-slate-700 dark:text-slate-200">
                      {{ selectedItem.contents }}
                    </p>
                  </div>
                  <div
                    class="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-700"
                  >
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      格式
                    </p>
                    <p class="mt-1 font-bold text-slate-700 dark:text-slate-200">
                      {{ selectedItem.type }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="p-8 grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800"
            >
              <button
                @click="showRenameModal"
                class="flex items-center justify-center p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-bold hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95"
              >
                <PhPencilSimple class="mr-2" /> 重命名
              </button>
              <button
                @click="deleteResource"
                class="flex items-center justify-center p-4 rounded-2xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
              >
                <PhTrash class="mr-2" /> 删除
              </button>
            </div>
          </div>
        </aside>
      </Transition>
    </div>

    <Transition name="fade">
      <div
        v-if="showFolderModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      >
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl w-96">
          <h3 class="text-xl font-bold mb-4">创建文件夹</h3>
          <input
            v-model="newFolderName"
            type="text"
            placeholder="输入文件夹名称"
            class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            @keyup.enter="createFolder"
          />
          <div class="flex gap-3 mt-4">
            <button
              @click="showFolderModal = false"
              class="flex-1 p-2 bg-slate-200 dark:bg-slate-600 rounded-lg"
            >
              取消
            </button>
            <button @click="createFolder" class="flex-1 p-2 bg-blue-600 text-white rounded-lg">
              创建
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="showRenameModalFlag"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      >
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl w-96">
          <h3 class="text-xl font-bold mb-2">重命名文件</h3>
          <p v-if="selectedItem?.name" class="text-sm text-slate-500 dark:text-slate-400 mb-3">
            当前名称:
            <span class="font-medium text-slate-700 dark:text-slate-300">{{
              selectedItem.name
            }}</span>
          </p>
          <input
            v-model="renameName"
            type="text"
            placeholder="输入新名称"
            class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            @keyup.enter="renameResource"
          />
          <div class="flex gap-3 mt-4">
            <button
              @click="showRenameModalFlag = false"
              class="flex-1 p-2 bg-slate-200 dark:bg-slate-600 rounded-lg"
            >
              取消
            </button>
            <button @click="renameResource" class="flex-1 p-2 bg-blue-600 text-white rounded-lg">
              确认
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PhFolder, PhFileSearch } from '@phosphor-icons/vue'
import {
  listDirectoryApi,
  createFolderApi,
  createFileApi,
  renameResourceApi,
  deleteResourceApi,
} from '@/api/file/file.api'

// ================= 类型定义 =================
interface ResourceItem {
  id: string
  name: string
  type: string
  contents: string
}

interface PathNav {
  id: string
  name: string
}

// ================= 静态配置映射 =================
const FILE_COLORS: Record<string, string> = {
  PDF: 'bg-rose-500',
  DOC: 'bg-blue-500',
  XLS: 'bg-emerald-500',
  TXT: 'bg-slate-500',
  JPG: 'bg-amber-500',
  PNG: 'bg-amber-500',
  MP4: 'bg-purple-500',
  AVI: 'bg-purple-500',
  ZIP: 'bg-orange-500',
  RAR: 'bg-orange-500',
}

// ================= 响应式状态 =================
// 列表与导航
const loading = ref(true)
const folders = ref<ResourceItem[]>([])
const files = ref<ResourceItem[]>([])
const currentPath = ref<PathNav[]>([{ id: '', name: '根目录' }])

// 侧边栏与选中项
const isDrawerOpen = ref(false)
const selectedItem = ref<ResourceItem | null>(null)

// 模态框控制
const showFolderModal = ref(false)
const newFolderName = ref('')
const showRenameModalFlag = ref(false)
const renameName = ref('')

// DOM 引用
const fileInput = ref<HTMLInputElement | null>(null)

// ================= 计算属性 =================
const hasItems = computed(() => folders.value.length > 0 || files.value.length > 0)

// 提取当前的相对父路径，供API复用，避免在多个函数中写重复的判断逻辑
const currentDirId = computed(() => {
  const len = currentPath.value.length
  return len > 1 ? currentPath.value[len - 1]?.id : undefined
})

// ================= 核心 API 调用 =================
const loadDirectory = async (relativePath?: string) => {
  loading.value = true
  try {
    const response = await listDirectoryApi(relativePath)

    folders.value = []
    files.value = []

    if (Array.isArray(response)) {
      // 优化：一次遍历完成分类与转换
      response.forEach((item: any) => {
        const resource: ResourceItem = {
          id: item.resourcePath || item.id,
          name: item.resourceName,
          type: item.fileFormat || (item.resourceType === 'FOLDER' ? 'FOLDER' : 'FILE'),
          contents: item.fileSize || (item.resourceType === 'FOLDER' ? '0 items' : '0 Bytes'),
        }

        if (item.resourceType === 'FOLDER') {
          folders.value.push(resource)
        } else {
          files.value.push(resource)
        }
      })

      // 构建路径导航
      if (relativePath) {
        const pathParts = relativePath.split('/').filter(Boolean)
        currentPath.value = [
          { id: '', name: '根目录' },
          ...pathParts.map((part, index) => ({
            id: pathParts.slice(0, index + 1).join('/'),
            name: part,
          })),
        ]
      } else {
        currentPath.value = [{ id: '', name: '根目录' }]
      }
    }
  } catch (error) {
    console.error('加载目录失败:', error)
    currentPath.value = [{ id: '', name: '根目录' }]
  } finally {
    loading.value = false
  }
}

// ================= 交互事件处理 =================
// --- 导航与抽屉 ---
const openDrawer = (item: ResourceItem) => {
  selectedItem.value = item
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  selectedItem.value = null
}

const navigateToRoot = () => {
  loadDirectory()
}

const navigateTo = (relativePath: string) => {
  const cleanPath = relativePath.endsWith('/') ? relativePath.slice(0, -1) : relativePath
  loadDirectory(cleanPath)
}

// --- 文件上传 ---
const handleFileUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const fileList = target.files
  if (!fileList?.length) return

  try {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      if (!file) continue

      const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'FILE'

      // 获取上传 URL
      const uploadResponse = await createFileApi({
        resourceName: file.name,
        resourceType: 'FILE',
        parentPath: currentDirId.value,
        fileSize: formatFileSize(file.size),
        fileFormat: fileExtension,
      })

      // 直传 COS
      if (uploadResponse.uploadUrl) {
        await uploadFileToCos(uploadResponse.uploadUrl, file)
      }
    }

    target.value = '' // 重置输入框
    loadDirectory(currentDirId.value)
  } catch (error) {
    console.error('文件上传失败:', error)
  }
}

// --- 增删改操作 ---
const showCreateFolderModal = () => {
  newFolderName.value = ''
  showFolderModal.value = true
}

const createFolder = async () => {
  const name = newFolderName.value.trim()
  if (!name) return

  try {
    await createFolderApi({
      resourceName: name,
      resourceType: 'FOLDER',
      parentPath: currentDirId.value,
    })

    showFolderModal.value = false
    loadDirectory(currentDirId.value)
  } catch (error) {
    console.error('创建文件夹失败:', error)
  }
}

const showRenameModal = () => {
  if (selectedItem.value) {
    renameName.value = selectedItem.value.name
    showRenameModalFlag.value = true
  }
}

const renameResource = async () => {
  const newName = renameName.value.trim()
  if (!newName || !selectedItem.value) return

  try {
    await renameResourceApi({
      oldPath: selectedItem.value.id,
      newPath: newName,
    })

    showRenameModalFlag.value = false
    closeDrawer()
    loadDirectory(currentDirId.value)
  } catch (error) {
    console.error('重命名失败:', error)
  }
}

const deleteResource = async () => {
  if (!selectedItem.value) return

  try {
    await deleteResourceApi(selectedItem.value.id)
    closeDrawer()
    loadDirectory(currentDirId.value)
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// ================= 工具函数 =================
const uploadFileToCos = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
  })

  if (!response.ok) {
    throw new Error(`上传失败: ${response.status} ${response.statusText}`)
  }
  return response
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileColor = (type: string) => FILE_COLORS[type] || 'bg-indigo-500'

// ================= 生命周期 =================
onMounted(() => {
  loadDirectory()
})
</script>

<style scoped>
/* 抽屉侧滑：加入弹性阻尼感 */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(120%) scale(0.9);
  opacity: 0;
}

/* 遮罩层淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  @apply bg-slate-300 dark:bg-slate-700 rounded-full;
}

/* 隐藏部分文字溢出 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
