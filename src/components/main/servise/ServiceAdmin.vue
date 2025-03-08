<template>
  <div v-if="togle" class="fixed inset-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
    <div class="absolute bg-gray-900 flex flex-col opacity-[90%] items-center justify-center p-10 px-10 rounded-[15px]">
      <div class="file-upload-container">
        <div class="file-upload-area flex justify-center items-center">
          <input type="text" class="text-black w-full p-2 rounded-[25px] my-2 bg-gray-200" placeholder="Name"
            v-model="selectedName" />
          <input type="file" id="fileInput" @change="handleFileChange" />
          <div>
            <button @click="back()"
              class="upload-button mr-5 mt-2 bg-gray-600 text-white px-9 py-[10px] rounded-[5px] hover:bg-gray-700">
              {{ $t('Bekor_qilish') }}
            </button>
            <button @click="isEditing ? updateFile() : uploadFile()"
              class="bg-[#2196f3] border-none rounded-[5px] cursor-pointer px-9 py-[10px] text-white hover:bg-[#1e88e5]">
              {{ $t('yuklash') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="asd"
    class="fixed inset-0 top-0 w-full z-50 h-full flex items-center justify-center bg-black bg-opacity-50">
    <div class="absolute bg-gray-900 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
      <div class="mt-4 w-[300px] justify-evenly flex">
        <button @click="removeSelectedItems"
          class="py-2 px-7 rounded-[25px] text-white duration-500 bg-teal-500 hover:bg-teal-600">
          {{ $t('remove') }}
        </button>
        <button @click="func(null)"
          class="py-2 rounded-[25px] text-white duration-500 px-6 bg-red-600 hover:bg-red-700">
          {{ $t('Bekor_qilish') }}
        </button>
      </div>
    </div>
  </div>

  <div class="flex justify-end">
    <div>
      <button @click="back" id="add"
        class="mr-6 text-[20px] px-4 py-2 rounded-[25px] text-white duration-500 bg-teal-500 hover:bg-teal-600">
        {{ $t('create') }}
      </button>
    </div>
  </div>
  <div class="text-black flex flex-col justify-center mt-16 items-center">
    <div class="">
      <div class="rounded-[20px] max-w-[110rem] p-10 mb-16   opacity-[98%] w-[1200px] shadow-2xl bg-gray-300 ">
        <div v-if="dat === 'datalotin'" v-for="(item, index) in ServiceData" :key="item.id"
          class="flex items-center h-[70px] text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] hover:bg-lime-500 duration-300 border-blue-700 border-2 bg-white cursor-pointer">
          <b class="text-[20px] text-black w-[35px] text-center">{{ index + 1 }}</b>
          <img width="25px" class="mr-5" src="../../../../public/word.png" alt="" />
          <h1 class="text-black flex-1" @click="goToCard(item.id)"> {{ item.name
          }}</h1>
          <div class="flex gap-2">
            <img @click.stop="editFile(item)" class="w-4 h-4 cursor-pointer" src="../../../../public/pen.png"
              alt="edit" />
            <img @click.stop="func(item.id)" class="w-4 h-4 cursor-pointer" src="../../../../public/reject.png"
              alt="delete" />
          </div>
        </div>
        <div v-if="dat === 'datakril'" v-for="(item, index) in ServiceData" :key="item.id"
          class="flex items-center h-[70px] text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] hover:bg-lime-500 duration-300 border-blue-700 border-2 bg-white cursor-pointer">
          <b class="text-[20px] text-black w-[35px] text-center">{{ index + 1 }}</b>
          <img width="25px" class="mr-5" src="../../../../public/word.png" alt="" />
          <h1 class="text-black flex-1" @click="goToCard(item.id)"> {{ translateText(item.name) }}</h1>
          <div class="flex gap-2">
            <img @click.stop="editFile(item)" class="w-4 h-4 cursor-pointer" src="../../../../public/pen.png"
              alt="edit" />
            <img @click.stop="func(item.id)" class="w-4 h-4 cursor-pointer" src="../../../../public/reject.png"
              alt="delete" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { URL } from "../../../auth/url.js";

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
const dat = inject('dat');
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

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadFile = async () => {
  const formData = new FormData();
  formData.append("file", selectedFile.value);
  formData.append("applicationsId", numericId.value);
  formData.append("name", selectedName.value);

  try {
    const response = await fetch(`${URL}/files`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      togle.value = false;
      selectedName.value = '';
      selectedFile.value = null;
      await getCourtsData();
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Fayl yuklashda xatolik:", error);
    alert("Fayl yuklashda xatolik yuz berdi!");
  }
};

const editFile = (item) => {
  isEditing.value = true;
  editingFileId.value = item.id;
  selectedName.value = item.name;
  selectedFile.value = null; 
  togle.value = true;
};

const updateFile = async () => {
  try {
    const formData = new FormData();
    formData.append("name", selectedName.value);
    if (selectedFile.value) {
      formData.append("file", selectedFile.value); 
    }

    const response = await fetch(`${URL}/files/${editingFileId.value}`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      togle.value = false;
      isEditing.value = false;
      selectedName.value = '';
      selectedFile.value = null;
      editingFileId.value = null;
      await getCourtsData();
      alert("Fayl muvaffaqiyatli yangilandi!");
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    console.error("Fayl yangilashda xatolik:", error);
    alert("Faylni yangilashda xatolik yuz berdi!");
  }
};

const back = () => {
  togle.value = !togle.value;
  if (!togle.value) {
    isEditing.value = false;
    selectedName.value = '';
    selectedFile.value = null;
    editingFileId.value = null;
  }
};

const func = (id) => {
  numericId.value = id;
  asd.value = id !== null;
};

const removeSelectedItems = async () => {
  try {
    const response = await fetch(`${URL}/files/${numericId.value}`, {
      method: "DELETE",
    });

    if (response.ok) {
      asd.value = false;
      await getCourtsData();
    } else {
      const errorText = await response.text();
      console.error("O'chirishda xatolik:", errorText);
      alert(`Xatolik: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("Xatolik:", error);
    alert("Server bilan bog‘lanishda xatolik yuz berdi!");
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