<script setup>
import { URL } from "@/auth/url";
import Header from "@/components/header.vue";
import axios from "axios";
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";

const isLoading = inject('isLoading'); // Global loadingni olish
const route = useRoute();
const fileId = route.params.id;
const fileUrl = ref(null);
const bubbles = ref([]);

const getData = async () => {
    isLoading.value = true;
    try {
        const res = await axios.get(`http://45.146.166.100:3000/signingFiles/signing/${fileId}`);
        console.log(res.data.filePath);
        fileUrl.value = `${URL}${res.data.filePath}`
    } catch (error) {
        console.error("Ma'lumot yuklashda xatolik:", error);
    } finally {
        isLoading.value = false;
    }
};

const openFile = () => {
    if (fileUrl.value) {
        window.open(fileUrl.value, "_blank");
    }
};

const createBubbles = () => {
    setInterval(() => {
        const id = Date.now();
        bubbles.value.push({
            id,
            style: {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                opacity: Math.random() * 0.5 + 0.5
            }
        });
        setTimeout(() => {
            bubbles.value = bubbles.value.filter(bubble => bubble.id !== id);
        }, 3000);
    }, 300);
};

onMounted(() => {
    getData();
    createBubbles();
});
</script>

<template>
    <Header />
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100 relative overflow-hidden">
      <transition name="fade">
        <button
          v-if="fileUrl"
          @click="openFile"
          class="relative mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-blue-700 active:scale-95 overflow-hidden"
        >
          Yuklab Olish
          <span v-for="bubble in bubbles" :key="bubble.id" :style="bubble.style" class="bubble"></span>
        </button>
      </transition>
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.bubble {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: rgba(252, 5, 5, 0.8);
  border-radius: 50%;
  animation: floatBubble linear infinite;
}

@keyframes floatBubble {
  0% {
    transform: translate(0, 0) scale(0.5);
  }
  50% {
    transform: translate(calc(20px - 40px * random()), calc(20px - 40px * random())) scale(1);
  }
  100% {
    transform: translate(calc(40px - 80px * random()), calc(40px - 80px * random())) scale(0.5);
    opacity: 0;
  }
}
</style>