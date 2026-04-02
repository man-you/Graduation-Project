<template>
  <div
    class="absolute inset-0 flex flex-col min-w-0 overflow-hidden bg-[#F1F5F9] text-slate-900 font-sans"
  >
    <div
      class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none"
    ></div>
    <div
      class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <Transition name="fade">
      <div
        v-if="isDrawerOpen"
        @click="closeDrawer"
        class="fixed inset-0 bg-slate-900/20 backdrop-blur-md z-30 lg:z-40"
      ></div>
    </Transition>

    <div class="relative flex flex-auto h-full">
      <div v-if="loading" class="flex flex-auto flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p class="mt-4 text-lg font-medium text-slate-500">加载中...</p>
      </div>

      <main v-else class="flex flex-col flex-auto overflow-y-auto overflow-x-hidden">
        <header
          class="sticky top-0 z-20 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-6 sm:py-10 md:px-10 border-b border-white/20 bg-white/60 backdrop-blur-xl"
        >
          <div class="space-y-1">
            <h1
              class="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent"
            >
              文件管理
            </h1>
            <nav class="flex items-center text-sm font-semibold">
              <div
                class="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 text-slate-500"
              >
                <a
                  @click="navigateTo('')"
                  class="hover:text-blue-500 transition-colors cursor-pointer"
                  >根目录</a
                >
                <template v-for="(path, index) in currentPath" :key="path.id">
                  <template v-if="path.id">
                    <PhCaretRight :size="12" weight="bold" class="text-slate-300" />
                    <a
                      v-if="index !== currentPath.length - 1"
                      @click="navigateTo(path.id)"
                      class="hover:text-blue-500 transition-colors cursor-pointer"
                      >{{ path.name }}</a
                    >
                    <span v-else class="text-blue-600 truncate max-w-[120px]">{{ path.name }}</span>
                  </template>
                </template>
              </div>
            </nav>
          </div>

          <div class="mt-6 sm:mt-0 flex gap-3">
            <button
              @click="showFolderModal = true"
              class="flex items-center px-5 py-2.5 rounded-2xl bg-white border border-slate-200 font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-all"
            >
              <PhFolderPlus :size="20" class="mr-2 text-blue-500" /> 新建
            </button>
            <button
              @click="fileInput?.click()"
              class="group flex items-center px-6 py-2.5 rounded-2xl bg-blue-600 text-white font-bold shadow-xl shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <PhCloudArrowUp :size="20" weight="bold" class="mr-2" /> 上传文件
            </button>
          </div>
        </header>

        <div v-if="hasItems" class="p-6 md:p-10 space-y-10">
          <section v-if="folders.length > 0">
            <h2 class="text-lg font-black flex items-center gap-3 mb-6">
              <span class="w-2 h-6 bg-blue-500 rounded-full shadow-sm"></span> 文件夹
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div
                v-for="folder in folders"
                :key="folder.id"
                class="group relative overflow-hidden bg-white/50 border border-white/20 p-5 rounded-[2rem] hover:bg-white cursor-pointer transition-all"
                @click="navigateTo(folder.id)"
              >
                <div class="flex items-start justify-between">
                  <div class="p-3 rounded-2xl bg-blue-50 text-blue-500">
                    <PhFolder :size="32" weight="duotone" />
                  </div>
                  <button
                    @click.stop="openDrawer(folder)"
                    class="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-blue-500 transition-colors"
                  >
                    <PhDotsThreeCircle :size="24" weight="fill" />
                  </button>
                </div>
                <div class="mt-6 relative z-10">
                  <h3 class="text-base font-bold text-slate-800">{{ folder.name }}</h3>
                  <p class="text-xs font-medium text-slate-400 mt-1 flex items-center">
                    <PhFiles :size="14" class="mr-1" /> {{ folder.contents }}
                  </p>
                  <Tag :isPublic="folder.isPublic" class="mt-2" />
                </div>
                <PhFolder
                  :size="80"
                  weight="fill"
                  class="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity"
                />
              </div>
            </div>
          </section>

          <section v-if="files.length > 0">
            <h2 class="text-lg font-black flex items-center gap-3 mb-6">
              <span class="w-2 h-6 bg-indigo-500 rounded-full shadow-sm"></span> 文件
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              <div
                v-for="file in files"
                :key="file.id"
                @click="openDrawer(file)"
                class="group flex flex-col items-center bg-white/40 border border-slate-200/50 p-6 rounded-[2.5rem] hover:bg-white cursor-pointer transition-all"
              >
                <div class="relative w-20 h-20 mb-4 flex items-center justify-center">
                  <div
                    class="absolute inset-0 bg-slate-100 rounded-3xl group-hover:bg-slate-50 transition-colors"
                  ></div>
                  <PhFile :size="40" weight="duotone" class="relative text-slate-500" />
                  <div
                    class="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-lg text-[10px] font-black text-white shadow-sm"
                    :class="getFileColor(file.type)"
                  >
                    {{ file.type }}
                  </div>
                </div>
                <span class="text-sm font-bold text-slate-700 text-center line-clamp-1 w-full">{{
                  file.name
                }}</span>
                <span class="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{{
                  file.contents
                }}</span>
                <Tag :isPublic="file.isPublic" class="mt-2" />
              </div>
            </div>
          </section>
        </div>

        <div v-else class="flex flex-auto flex-col items-center justify-center">
          <PhFolderOpen :size="120" weight="thin" class="text-slate-200" />
          <p class="mt-6 text-xl font-bold text-slate-400">当前目录为空</p>
          <button @click="fileInput?.click()" class="mt-4 text-blue-500 font-bold hover:underline">
            去上传一些资料吧
          </button>
        </div>
      </main>

      <Transition name="drawer">
        <aside
          v-if="isDrawerOpen"
          class="fixed right-4 top-4 bottom-4 w-[calc(100%-2rem)] sm:w-[400px] bg-white/95 backdrop-blur-2xl shadow-2xl z-50 border border-white/20 rounded-[3rem] overflow-hidden"
        >
          <div class="h-full flex flex-col">
            <div class="p-8 flex items-center justify-between border-b border-slate-100">
              <h2 class="text-xl font-black">详情预览</h2>
              <button
                @click="closeDrawer"
                class="p-3 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
              >
                <PhX :size="20" weight="bold" />
              </button>
            </div>

            <div class="flex-auto overflow-y-auto p-8 space-y-8" v-if="selectedItem">
              <div
                class="group aspect-square bg-slate-50 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-slate-200"
              >
                <component
                  :is="selectedItem.type === 'FOLDER' ? PhFolder : PhFileSearch"
                  :size="80"
                  weight="duotone"
                  class="text-slate-300"
                />
              </div>

              <div class="space-y-6">
                <div>
                  <h3 class="text-2xl font-black text-slate-800 leading-tight break-all">
                    {{ selectedItem.name }}
                  </h3>
                  <p class="text-sm text-slate-500 mt-1">资源名称</p>
                  <div
                    class="inline-flex mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase"
                  >
                    # {{ selectedItem.type }}
                  </div>
                  <Tag :isPublic="selectedItem.isPublic" class="mt-2 block" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div
                    v-for="info in [
                      { l: '大小', v: selectedItem.contents },
                      { l: '格式', v: selectedItem.type },
                    ]"
                    :key="info.l"
                    class="bg-slate-50 p-4 rounded-2xl border border-slate-100"
                  >
                    <p class="text-[10px] font-black text-slate-400 uppercase">{{ info.l }}</p>
                    <p class="mt-1 font-bold text-slate-700">{{ info.v }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="selectedItem && !selectedItem.isPublic"
              class="p-8 grid grid-cols-2 gap-4 bg-slate-50/50 border-t border-slate-100"
            >
              <button
                @click="showRenameModal"
                class="flex items-center justify-center p-4 rounded-2xl border-2 border-slate-200 font-bold hover:bg-white transition-all"
              >
                <PhPencilSimple class="mr-2" /> 重命名
              </button>
              <button
                @click="deleteResource"
                class="flex items-center justify-center p-4 rounded-2xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
              >
                <PhTrash class="mr-2" /> 删除
              </button>
            </div>
            <div
              v-else-if="selectedItem?.isPublic"
              class="p-8 bg-slate-50/50 border-t border-slate-100 text-center text-slate-500 text-sm"
            >
              <PhLock :size="20" class="mx-auto mb-2 text-slate-400" />
              <p>课程资源仅可查看，不可修改或删除</p>
            </div>
          </div>
        </aside>
      </Transition>
    </div>

    <DialogModal v-model="showFolderModal" title="创建文件夹" @confirm="createFolder">
      <input
        v-model="newFolderName"
        type="text"
        placeholder="输入文件夹名称"
        class="modal-input"
        @keyup.enter="createFolder"
      />
    </DialogModal>

    <DialogModal
      v-model="showRenameModalFlag"
      title="重命名"
      :subtitle="`原名称: ${selectedItem?.name}`"
      @confirm="renameResource"
    >
      <input
        v-model="renameName"
        type="text"
        placeholder="输入新名称"
        class="modal-input"
        @keyup.enter="renameResource"
      />
    </DialogModal>

    <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRoute } from 'vue-router'
import * as Icons from '@phosphor-icons/vue'
import * as FileApi from '@/api/file/file.api'

// --- 类型与图标解构 ---
const {
  PhFolder,
  PhFileSearch,
  PhLock,
  PhFolderPlus,
  PhCloudArrowUp,
  PhFiles,
  PhFile,
  PhDotsThreeCircle,
  PhX,
  PhPencilSimple,
  PhTrash,
  PhCaretRight,
  PhFolderOpen,
} = Icons

interface ResourceItem {
  id: string
  name: string
  type: string
  contents: string
  isPublic?: boolean
}

// --- 状态管理 ---
const route = useRoute()
const courseId = Number(route.query.courseId) || null
const loading = ref(true)
const folders = ref<ResourceItem[]>([])
const files = ref<ResourceItem[]>([])
const currentPath = ref([{ id: '', name: '根目录' }])
const isDrawerOpen = ref(false)
const selectedItem = ref<ResourceItem | null>(null)
const showFolderModal = ref(false),
  newFolderName = ref('')
const showRenameModalFlag = ref(false),
  renameName = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// --- 计算属性 ---
const hasItems = computed(() => folders.value.length > 0 || files.value.length > 0)
const currentDirId = computed(
  () => currentPath.value[currentPath.value.length - 1]?.id || undefined,
)

// --- 内部公共组件 (Tag) ---
const Tag = ({ isPublic }: { isPublic?: boolean }) => {
  if (isPublic === undefined) return null
  return h(
    'span',
    {
      class: `inline-flex px-2 py-1 rounded-full text-xs font-bold ${isPublic ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`,
    },
    isPublic ? '课程资源' : '个人资源',
  )
}

// --- 弹窗外层组件 ---
const DialogModal = (props: any, { slots, emit }: any) => {
  if (!props.modelValue) return null
  return h(
    'div',
    { class: 'fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm' },
    [
      h('div', { class: 'bg-white p-8 rounded-3xl w-[400px] shadow-2xl' }, [
        h('h3', { class: 'text-xl font-black mb-2' }, props.title),
        props.subtitle && h('p', { class: 'text-sm text-slate-400 mb-4' }, props.subtitle),
        slots.default?.(),
        h('div', { class: 'flex gap-3 mt-6' }, [
          h(
            'button',
            {
              class: 'flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl',
              onClick: () => emit('update:modelValue', false),
            },
            '取消',
          ),
          h(
            'button',
            {
              class: 'flex-1 p-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg',
              onClick: () => emit('confirm'),
            },
            '确认',
          ),
        ]),
      ]),
    ],
  )
}

// --- 逻辑封装：API调用包装器 ---
const apiWrapper = async (apiFunc: Function, ...args: any[]) => {
  const params = args[0] || {}
  if (courseId) params.courseId = courseId
  return apiFunc(...args)
}

// --- 数据加载 ---
const loadDirectory = async (relativePath?: string) => {
  loading.value = true
  try {
    const res = courseId
      ? await FileApi.listPublicApi(relativePath, courseId)
      : await FileApi.listDirectoryApi(relativePath)

    folders.value = []
    files.value = []

    if (Array.isArray(res)) {
      res.forEach((item) => {
        const row = {
          id: item.resourcePath || item.id || '',
          name: item.resourceName,
          type: item.fileFormat || (item.resourceType === 'FOLDER' ? 'FOLDER' : 'FILE'),
          contents: item.fileSize || (item.resourceType === 'FOLDER' ? '目录' : '0 Bytes'),
          isPublic: item.isPublic,
        }
        item.resourceType === 'FOLDER' ? folders.value.push(row) : files.value.push(row)
      })
      // 路径解析
      const parts = relativePath?.split('/').filter(Boolean) || []
      currentPath.value = [
        { id: '', name: '根目录' },
        ...parts.map((p, i) => ({
          id: parts.slice(0, i + 1).join('/'),
          name: p,
        })),
      ]
    }
  } finally {
    loading.value = false
  }
}

// --- 交互处理 ---
const navigateTo = (path: string) => loadDirectory(path.endsWith('/') ? path.slice(0, -1) : path)

const openDrawer = (item: ResourceItem) => {
  selectedItem.value = item
  isDrawerOpen.value = true
}
const closeDrawer = () => {
  isDrawerOpen.value = false
  selectedItem.value = null
}

const handleFileSelect = async (e: Event) => {
  const filesList = (e.target as HTMLInputElement).files
  if (!filesList?.length) return
  try {
    for (const file of Array.from(filesList)) {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE'
      const uploadRes = await apiWrapper(FileApi.createFileApi, {
        resourceName: file.name,
        resourceType: 'FILE',
        parentPath: currentDirId.value,
        fileSize: formatFileSize(file.size),
        fileFormat: ext,
      })
      if (uploadRes?.uploadUrl) {
        await fetch(uploadRes.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
        })
      }
    }
    loadDirectory(currentDirId.value)
  } catch (err) {
    console.error('上传失败', err)
  }
}

const createFolder = async () => {
  if (!newFolderName.value.trim()) return
  await apiWrapper(FileApi.createFolderApi, {
    resourceName: newFolderName.value.trim(),
    resourceType: 'FOLDER',
    parentPath: currentDirId.value,
  })
  showFolderModal.value = false
  loadDirectory(currentDirId.value)
}

const renameResource = async () => {
  if (!renameName.value.trim() || !selectedItem.value || selectedItem.value.isPublic) return
  await apiWrapper(FileApi.renameResourceApi, {
    oldPath: selectedItem.value.id,
    newPath: renameName.value.trim(),
  })
  showRenameModalFlag.value = false
  closeDrawer()
  loadDirectory(currentDirId.value)
}

const deleteResource = async () => {
  if (!selectedItem.value || selectedItem.value.isPublic || !confirm('确定删除？')) return
  courseId
    ? await FileApi.deleteResourceApi(selectedItem.value.id, courseId)
    : await FileApi.deleteResourceApi(selectedItem.value.id)
  closeDrawer()
  loadDirectory(currentDirId.value)
}

const showRenameModal = () => {
  if (selectedItem.value) {
    renameName.value = selectedItem.value.name
    showRenameModalFlag.value = true
  }
}

// --- 工具函数 ---
const formatFileSize = (b: number) => {
  if (b === 0) return '0 Bytes'
  const i = Math.floor(Math.log(b) / Math.log(1024))
  return (b / Math.pow(1024, i)).toFixed(2) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i]
}

const getFileColor = (t: string) => {
  const map: any = {
    PDF: 'bg-rose-500',
    DOC: 'bg-blue-500',
    XLS: 'bg-emerald-500',
    JPG: 'bg-amber-500',
    MP4: 'bg-purple-500',
  }
  return map[t] || 'bg-slate-500'
}

onMounted(() => loadDirectory())
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.modal-input {
  @apply w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full;
}
</style>
