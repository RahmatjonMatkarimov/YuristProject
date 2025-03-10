<template>
  <!-- Add Modal -->
  <div v-if="showModal"
    class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
      class="absolute h-auto  bg-slate-500 flex flex-col opacity-90 items-center justify-center p-6 sm:p-10 rounded-lg">
      <img @click="toggleModal" class="w-10 absolute top-4 right-4 cursor-pointer" src="../../../../public/reject.png"
        alt="Close" />
      <uploadpathadmin />
    </div>
  </div>
  <div v-if="showModalfiles"
    class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
      class="absolute h-64 w-96 bg-slate-800 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
      <img @click="toggleFilesModal" class="w-14 -mr-[290px] absolute -mt-44" src="../../../../public/reject.png"
        alt="" />
      <div>
        <form @submit.prevent="uploadfile">
          <div>
            <input v-model="courtName" class="text-black w-full outline-none p-3 mt-9 rounded-[15px]" type="text"
              id="name" required />
          </div>
          <div class="my-3">
            <input @change="onFileChange" type="file" id="file" required />
          </div>
          <button class="w-full rounded-[30px] bg-lime-600 hover:bg-lime-900 text-[20px] py-2" type="submit">
            {{ $t('yuklash') }}
          </button>
        </form>
        <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      </div>
    </div>
  </div>

  <div v-if="fileModal"
    class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
      class="absolute h-64 w-96 bg-slate-800 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
      <img @click="fileModal = false" class="w-10 -mr-[290px] absolute -mt-44" src="../../../../public/reject.png"
        alt="" />
      <div>
        <form @submit.prevent="updatefileCourt">
          <div>
            <input v-model="courtName" class="text-black w-full outline-none p-3 mt-9 rounded-[15px]" type="text"
              id="name" required />
          </div>
          <div>
            <input @change="onFileChange" type="file" id="file" accept="image/*" class="my-2" />
          </div>
          <button class="w-full rounded-[30px] bg-lime-600 hover:bg-lime-900 text-[20px] py-2" type="submit">
            {{ $t('yuklash') }}
          </button>
        </form>
        <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
  <!-- Update Modal -->
  <div v-if="PutModal" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
      class="absolute h-auto bg-slate-800 flex flex-col opacity-90 items-center justify-center p-6 sm:p-10 rounded-lg">
      <img @click="Modal" class="w-10 absolute top-4 right-4 cursor-pointer" src="../../../../public/reject.png"
        alt="Close" />
      <form @submit.prevent="updateCourt" class="w-full">
        <input v-model="courtName" class="w-full text-black outline-none p-3 mt-6 rounded-lg" type="text" id="name"
          placeholder="Court Name" />
        <input @change="onFileChange" type="file" id="file" accept="image/*" class="w-full mt-4" />
        <button class="w-full mt-6 py-2 text-lg font-medium text-white bg-lime-600 rounded-lg hover:bg-lime-900"
          type="submit">
          {{ $t('yuklash') }}
        </button>
        <p v-if="successMessage" class="mt-2 text-center text-green-500">{{ successMessage }}</p>
        <p v-if="errorMessage" class="mt-2 text-center text-red-500">{{ errorMessage }}</p>
      </form>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="asd" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div class="absolute w-[400px] bg-gray-300 flex flex-col items-center justify-center p-6 sm:p-10 rounded-lg">
      <img @click="func(null)" class="w-10 absolute top-4 right-4 cursor-pointer" src="../../../../public/reject.png"
        alt="Close" />
      <div class="mt-4 flex flex-col w-full items-center">
        <button @click="Modal"
          class="w-full py-4 px-6 mb-4 text-lg font-medium text-black bg-lime-500 rounded-lg hover:bg-lime-600">
          <img class="w-6 sm:w-8 inline-block mr-2" src="../../../../public/pen.png" alt="Edit" />
          {{ $t('tahrirlash') }}
        </button>
        <button @click="removeSelectedItems"
          class="w-full py-4 text-lg px-6 font-medium text-white bg-red-500 rounded-lg hover:bg-red-700">
          <img class="w-6 sm:w-8 inline-block mr-2" src="../../../../public/remove.png" alt="Delete" />
          {{ $t('removove') }}
        </button>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex flex-col items-center py-10">
    <div v-if="data.length || ServiceData.length" class="w-full gap-2 flex justify-end px-6">
      <button v-if="ServiceData.length" @click="showModalfiles = true"
        class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        {{ $t('create') }}
      </button>
      <button v-if="data.length" @click="toggleModal"
        class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        {{ $t("bo'lim yaratish") }}
      </button>
    </div>
    <div v-else class="w-full gap-2 flex justify-end px-6">
      <button @click="showModalfiles = true"
        class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        {{ $t('create') }}
      </button>
      <button @click="toggleModal" class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        {{ $t("bo'lim yaratish") }}
      </button>
    </div>
    <div v-if="data.length == 0" class="text-black flex flex-col justify-center mt-16 items-center">
      <div class="rounded-[20px] max-w-[110rem] p-10 mb-16 opacity-[98%] w-[1200px] shadow-2xl bg-gray-300">
        <div v-if="dat === 'datalotin'" v-for="(item, index) in ServiceData" :key="item.id"
          class="flex items-center h-[70px] text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] hover:bg-lime-500 duration-300 border-blue-700 border-2 bg-white cursor-pointer">
          <b class="text-[20px] text-black w-[35px] text-center">{{ index + 1 }}</b>
          <img width="25px" class="mr-5" src="../../../../public/word.png" alt="" />
          <h1 class="text-black flex-1" @click="goToCard(item.id)">{{ item.fileName }}</h1>
          <div class="flex relative z-40 gap-2">
            <img @click.stop="Modalfile(item.id)" class="w-4 h-4 cursor-pointer" src="../../../../public/pen.png"
              alt="edit" />
            <img @click.stop="removefileItems(item.id)" class="w-4 h-4 cursor-pointer"
              src="../../../../public/reject.png" alt="delete" />
          </div>
        </div>
        <div v-if="dat === 'datakril'" v-for="(item, index) in ServiceData" :key="item.id"
          class="flex items-center h-[70px] text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] hover:bg-lime-500 duration-300 border-blue-700 border-2 bg-white cursor-pointer">
          <b class="text-[20px] text-black w-[35px] text-center">{{ index + 1 }}</b>
          <img width="25px" class="mr-5" src="../../../../public/word.png" alt="" />
          <h1 class="text-black flex-1" @click="goToCard(item.id)">{{ translateText(item.fileName) }}</h1>
          <div class="flex gap-2">
            <img @click.stop="Modalfile(item.id)" class="w-4 h-4 cursor-pointer" src="../../../../public/pen.png"
              alt="edit" />
            <img @click.stop="removefileItems(item.id)" class="w-4 h-4 cursor-pointer"
              src="../../../../public/reject.png" alt="delete" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="data.length" class="flex flex-col items-center mt-6 px-4">
      <h1 class="text-2xl sm:text-4xl font-bold text-center text-blue-800 mb-6">
        O'zbekiston Respublikasi hududida sud tizimiga murojaat qilish tartibi
      </h1>
      <div class="w-full  bg-gray-200 rounded-lg p-6 sm:p-10">
        <h2 class="text-xl sm:text-2xl font-semibold text-blue-800 text-center mb-6">
          Siz o'zingizga kerak bo'lgan sudni tanlang!
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="dat === 'datakril'" v-for="item in data" :key="item.id" @click="goToPath(item.id)"
            class="relative hover:bg-lime-500 duration-500 bg-white border-4 border-blue-800 rounded-lg p-6">
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black capitalize">{{ translateText(item.name) }}</h3>
            </div>
          </div>
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id" @click="goToPath(item.id)"
            class="relative hover:bg-lime-500 duration-500 bg-white border-4 border-blue-800 rounded-lg p-6">
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black capitalize">{{ item.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref, onMounted, inject } from "vue";
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import uploadpathadmin from "@/components/main/path/uploadpathadmin.vue";
import { URL } from "../../../auth/url.js";
import axios from "axios";

const dat = inject('dat');
const PutId = ref(null);
const router = useRouter();
const route = useRoute();
const url = `${URL}/courts`;
const imageBaseUrl = `${URL}/upload`;
const data = ref([]);
const showModal = ref(false);
const PutModal = ref(false);
const asd = ref(false);
const selectedId = ref(null);
const id1 = ref(route.params.id)

const PutfileModal = ref(false);
const fileModal = ref(false);
const showModalfiles = ref(false);
const Id = ref(null);
const selectedFileId = ref(null);
const ServiceData = ref([]);
const toggleFilesModal = () => {
  showModalfiles.value = !showModalfiles.value;
};
const Modalfile = (id) => {
  selectedFileId.value = id;
  fileModal.value = true; // Fayl tahrirlash/o‘chirish modalini ochish
};
const uploadfile = async () => {
  if (!file.value) {
    errorMessage.value = "Iltimos, fayl tanlang!";
    return;
  }

  const formData = new FormData();
  formData.append("fileName", courtName.value);
  formData.append("files", file.value);

  try {
    await axios.post(`${URL}/courts/${id1.value}/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    successMessage.value = "Fayllar muvaffaqiyatli yuklandi!";
    errorMessage.value = "";
    courtName.value = "";
    file.value = null;
    getData();
    showModalfiles.value = false;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Xatolik yuz berdi!";
    console.error("Xatolik tafsilotlari:", error);
  }
};
const goToCard = (id) => {
  router.push(`/edit/${id}/${id1.value}`);
};
const removefileItems = async (id) => {
  if (!id) {
    console.error("ID topilmadi!");
    return;
  }

  try {
    const response = await fetch(`${URL}/courts/files/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fileModal.value = false; // Modalni yopish
      successMessage.value = "Fayl muvaffaqiyatli o‘chirildi!";
      errorMessage.value = "";
      await getData(); // Ma'lumotlarni yangilash
    } else {
      console.error("O‘chirishda xatolik:", response.statusText);
      errorMessage.value = "Faylni o‘chirishda xatolik yuz berdi!";
    }
  } catch (error) {
    console.error("Xatolik:", error);
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  }
};
const updatefileCourt = async () => {
  const formData = new FormData();
  formData.append("fileName", courtName.value);
  formData.append("file", file.value);
  try {
    const response = await axios.put(`${URL}/courts/files/${selectedFileId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.status === 200) {
      successMessage.value = "Fayl muvaffaqiyatli yangilandi!";
      errorMessage.value = "";
      courtName.value = "";
      file.value = null;
      PutfileModal.value = false;
      await getData();
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  }
};

const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const translateText = (text) => {
  if (!text) return ''; // Agar text undefined yoki null bo‘lsa, bo‘sh qator qaytaradi
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    translated = translated.replace(new RegExp(key, "g"), translitMap[key]);
  }
  return translated;
};

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value
};

const func = (id) => {
  PutId.value = id;
  selectedId.value = id;
  asd.value = !asd.value;

  const selectedItem = data.value.find(item => item.id === id);
  if (selectedItem) {
    courtName.value = selectedItem.name;
  }
};


const getData = async () => {
  try {
    const response = await fetch(`${url}/${id1.value}`);
    if (response.ok) {
      const result = await response.json();
      data.value = (result.services)
        .sort((a, b) => a.id - b.id)
        .filter(item => item.status === "active");
      ServiceData.value = (result.files)
    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const removeSelectedItems = async () => {
  if (!selectedId.value) return;
  try {
    const response = await fetch(`${URL}/service/${selectedId.value}`, {
      method: "DELETE",
    });

    if (response.ok) {
      asd.value = false;
      getData()
    } else {
      console.error("O'chirishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

const goToPath = (id) => {
  router.push(`/aplicationsAdmin/${id}`);
};

const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const handleSubmit = async () => {
  if (PutModal.value) {
    await updateCourt();
  } else {
    await uploadCourt();
  }
};

const uploadCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);

  try {
    const response = await axios.post(`${URL}/service`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      data.value.push(response.data);
      successMessage.value = "muvaffaqiyatli yuklandi!";
      errorMessage.value = "";
      courtName.value = "";
      file.value = null;
      getData()
      showModal.value = false;
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  }
};

const updateCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);

  try {
    const response = await axios.patch(`${URL}/service/${PutId.value}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      const updatedCourt = response.data;
      const index = data.value.findIndex((item) => item.id === PutId.value);
      if (index !== -1) {
        data.value[index] = updatedCourt;
      }

      successMessage.value = "Court muvaffaqiyatli yangilandi!";
      courtName.value = "";
      file.value = null;
      PutModal.value = false;
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  }
};
watch([showModal, PutModal, asd], ([modalOpen, asdOpen, deleteModalOpen]) => {
  if (modalOpen || deleteModalOpen || asdOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  getData();
});
</script>