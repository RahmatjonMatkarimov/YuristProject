<template>
    <ParticlesHeader />
    <div class="text-black flex flex-col justify-center mt-16 items-center">
      <div class="">
        <div class="rounded-[20px] max-w-[110rem] p-10 mb-16 opacity-[98%] w-[900px] shadow-2xl bg-slate-300">
          <div v-for="item in ServiceData" :key="item.id"
            class="flex items-center justify-between mb-1 p-2 shadow-2xl rounded-[10px] bg-slate-500 cursor-pointer">
            <img width="25px" class="mr-5" src="../../../../public/word.png" alt="" />
            <h1 class="text-white flex-1" @click="goToCard(item.id)">{{ item.name }}</h1>
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
  const selectedFile = ref(null);
  const selectedName = ref('');
  const togle = ref(false);
  const asd = ref(false);
  const isEditing = ref(false);
  const editingFileId = ref(null);
  const route = useRoute();
  const router = useRouter();
  const numericId = ref(parseInt(route.params.id));
  
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
  
  /* Style for file input */
  input[type="file"] {
    margin: 10px 0;
    color: white;
  }
  </style>