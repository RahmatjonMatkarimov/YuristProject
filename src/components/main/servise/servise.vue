<template>
  <ParticlesHeader />
  <div class="text-black flex flex-col justify-center mt-16 items-center">
    <div class="">
      <div class="rounded-[20px] xl:min-w-[80rem] 2xl:min-w-[90rem] p-10 mb-16 opacity-[98%] shadow-2xl bg-gray-300 ">
        <div v-if="dat == 'datakril'" v-for="(item, index) in ServiceData" :key="item.id"
          class="flex items-center h-[70px] text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] hover:bg-lime-500 duration-300 border-blue-700 border-2 bg-white cursor-pointer">
          <b class="text-[20px] text-black w-[35px] text-center">{{ index + 1 }}</b>
          <img width="25px" class="mr-5" src="../../../../public/word.png" alt="" />
          <h1 class="text-black flex-1" @click="goToCard(item.id)">{{ translateText(item.name) }}</h1>
        </div>
        <div v-if="dat == 'datalotin'" v-for="(item, index) in ServiceData" :key="item.id"
          class="flex items-center  min-h-[70px] md:text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] hover:bg-lime-500 duration-300 border-blue-700 border-2 bg-white cursor-pointer">
          <b class="text-[20px] text-black w-[35px] text-center">{{ index + 1 }}</b>
          <img width="25px" class="mr-5" src="../../../../public/word.png" alt="" />
          <h1 class="text-black flex-1" @click="goToCard(item.id)">{{ item.name }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { URL } from "../../../auth/url.js";
import ParticlesHeader from "@/components/header.vue";

const ServiceId = ref(null);
const ServiceData = ref([]);
const route = useRoute();
const router = useRouter();
const numericId = ref(parseInt(route.params.id));
const dat = ref(localStorage.getItem('til') || 'datalotin');
const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const translateText = (text) => {
  if (!text) return '';
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    translated = translated.replace(new RegExp(key, "g"), translitMap[key]);
  }
  return translated;
};
onMounted(async () => {
  ServiceId.value = numericId.value;
  await getCourtsData();
});

const getCourtsData = async () => {
  try {
    const response = await fetch(`${URL}/applications/${ServiceId.value}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    ServiceData.value = data.files
      .filter(item => item.status == 'active')
      .sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Xatolik yuz berdi:", error.message);
    alert("Ma'lumotni olishda xatolik yuz berdi!");
  }
};

const goToCard = (id) => {
  router.push(`/edit/${id}`);
};
</script>

<style lang="scss" scoped>
.file-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.file-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.upload-button:hover {
  background-color: #d32f2f;
}

input[type="file"] {
  margin: 10px 0;
  color: white;
}
</style>