<script setup lang="ts">
import { ref } from 'vue'

const showAlert = ref(false)
const message = ref('')

let timer: number | null = null

declare global {
   interface Window {
      alert2: (msg: string) => void
   }
}

window.alert2 = (msg: string) => {
   message.value = msg
   showAlert.value = true
   if (timer !== null) {
      window.clearTimeout(timer)
      timer = null
   }
   timer = window.setTimeout(() => {
      showAlert.value = false
      message.value = ''
   }, 3000)
}
</script>
<template>
   <div
      v-if="showAlert"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black py-2 px-4 text-white max-w-fit"
   >
      {{ message }}
   </div>
</template>
