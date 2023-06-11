<script setup lang="ts">
import { ref } from 'vue'

const showAlert = ref(false)
const message = ref('')
const description = ref('')

let timer: number | null = null

declare global {
   interface Window {
      alert2: (msg: string) => void
   }
}

window.alert2 = (msg: string) => {
   message.value = msg
   showAlert.value = true
   restartTimeout()
}

const cancelTimeout = () => {
   if (timer !== null) {
      window.clearTimeout(timer)
      timer = null
   }
}

const restartTimeout = () => {
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
      @mouseenter="cancelTimeout"
      @mouseleave="restartTimeout"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black py-2 px-4 text-white max-w-fit"
      v-html="message"
   ></div>
</template>
