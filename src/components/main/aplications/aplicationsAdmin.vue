<template>
  <div v-if="showModal"
    class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
      class="absolute h-64 w-96 bg-slate-800 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
      <img @click="toggleModal" class="w-14 -mr-[290px] absolute -mt-44" src="../../../../public/reject.png" alt="" />
      <div>
        <form @submit.prevent="uploadCourt">
          <div>
            <input v-model="courtName" class="text-black w-full outline-none p-3 mt-9 rounded-[15px]" type="text"
              id="name" required />
          </div>
          <div class="my-3">
            <input @change="onFileChange" type="file" id="file" accept="image/*" required />
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
            <input @change="onFileChange" type="file" id="file" class="my-2" />
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

  <div v-if="PutModal" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
      class="absolute h-64 w-96 bg-slate-800 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
      <img @click="Modal" class="w-14 -mr-[290px] absolute -mt-44" src="../../../../public/reject.png" alt="" />
      <div>
        <form @submit.prevent="updateCourt">
          <div>
            <input v-model="courtName" class="text-black w-full outline-none p-3 mt-9 rounded-[15px]" type="text"
              id="name" required />
          </div>
          <div>
            <input @change="onFileChange" type="file" id="file" accept="image/*" required />
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

  <div v-if="asd" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div class="absolute w-96 bg-[#D9D9D9] flex flex-col items-center justify-center p-10 rounded-[15px]">
      <img @click="func(null)" class="w-14 -mr-[300px] absolute -mt-44" src="../../../../public/reject.png" alt="" />
      <div class="mt-4 flex flex-col justify-center items-center">
        <div class="flex flex-col justify-between h-40 items-center">
          <button @click="Modal"
            class="py-4 rounded-[15px] h-[70px] items-center text-black w-full min-w-[250px] flex duration-500 text-[20px] px-10 bg-[#15FF09] hover:bg-lime-600">
            <img class="w-8 mr-5" src="../../../../public/pen.png" alt="">
            {{ $t('tahrirlash') }}
          </button>
          <button @click="removeSelectedItems"
            class="py-4 rounded-[15px] h-[70px] items-center text-black flex w-full min-w-[250px] duration-500 text-[20px] px-10 bg-[#FF0C0C] hover:bg-red-700">
            <img class="w-10 mr-5" src="../../../../public/remove.png" alt="">
            {{ $t('remove') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-col items-center py-10">
    <div class="w-full flex gap-2 justify-end p-6">
      <button v-if="data.length === 0" @click="showModalfiles = true"
        class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        {{ $t('create') }}
      </button>
      <button v-if="ServiceData.length === 0" @click="showModal = true"
        class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        {{ $t("bo'lim yaratish") }}
      </button>
    </div>
    <div v-if="ServiceData.length" class="text-black flex flex-col justify-center mt-16 items-center">
      <div class="rounded-[20px] max-w-[110rem] p-10 mb-16 opacity-[98%] w-[1200px] shadow-2xl bg-gray-300">
        <div v-if="dat === 'datalotin'" v-for="(item, index) in ServiceData" :key="item.id"
          class="flex items-center h-[70px] text-xl justify-between mb-1 p-2 mt-[14px] shadow-2xl rounded-[10px] hover:bg-lime-500 duration-300 border-blue-700 border-2 bg-white cursor-pointer">
          <b class="text-[20px] text-black w-[35px] text-center">{{ index + 1 }}</b>
          <img width="25px" class="mr-5" src="../../../../public/word.png" alt="" />
          <h1 class="text-black flex-1" @click="goToCard(item.id)">{{ item }}</h1>
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
      <div class="w-full bg-gray-200 rounded-lg p-6 sm:p-10">
        <h2 class="text-xl sm:text-2xl font-semibold text-blue-800 text-center mb-6">
          Siz o'zingizga kerak bo'lgan sudni tanlang!
        </h2>
        <div class="grid grid-cols-1 justify-center items-center sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="dat === 'datakril'" v-for="item in datakril" :key="item.id" @click="goToPath(item.id)"
            class="relative hover:bg-lime-500 h-full flex items-center duration-500 active:duration-500 bg-white border-4 border-blue-800 rounded-lg p-6">
            <img @click.stop="func(item)" class="absolute top-1 right-2 w-6 h-6 cursor-pointer"
              src="../../../../public/ellipsis.png" alt="Options" />
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black capitalize">{{ item.translatedName }}</h3>
            </div>
          </div>
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id" @click="goToPath(item.id)"
            class="relative h-full flex items-center hover:bg-lime-500 duration-500 active:duration-500 bg-white border-4 border-blue-800 rounded-lg p-6">
            <img @click.stop="func(item)" class="absolute top-1 right-2 w-6 h-6 cursor-pointer"
              src="../../../../public/ellipsis.png" alt="Options" />
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
import { inject, watch } from "vue";
import { ref } from "vue";
import { URL } from "../../../auth/url.js";
import axios from "axios";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const PutId = ref(null);
const PutModal = ref(false);
const PutfileModal = ref(false);
const fileModal = ref(false); // Fayl modalini boshqarish uchun yangi ref
const data = ref([]);
const showModal = ref(false);
const showModalfiles = ref(false);
const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const asd = ref(false);
const Id = ref(null);
const selectedFileId = ref(null); // Tanlangan fayl ID si uchun
const imageBaseUrl = `${URL}/upload`;
const router = useRouter();
const route = useRoute();
const id1 = ref(route.params.id);
const ServiceData = ref([]);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const toggleFilesModal = () => {
  showModalfiles.value = !showModalfiles.value;
};

const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value;
};

const Modalfile = (id) => {
  selectedFileId.value = id;
  fileModal.value = true; // Fayl tahrirlash/o‘chirish modalini ochish
};

const func = (item) => {
  if (item) {
    PutId.value = item.id;
    Id.value = item.id;
    courtName.value = item.name;
  }
  asd.value = !asd.value;
};

const goToPath = (id) => {
  router.push(`/ServiceAdmin/${id}`);
};

const goToCard = (id) => {
  router.push(`/edit/${id}/${id1.value}`);
};

const onFileChange = (event) => {
  file.value = event.target.files[0];
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
    await axios.post(`${URL}/services/${id1.value}/files`, formData, {
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

const uploadCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);
  formData.append("servicesId", id1.value);

  try {
    await axios.post(`${URL}/applications`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    successMessage.value = "Court muvaffaqiyatli yuklandi!";
    errorMessage.value = "";
    courtName.value = "";
    file.value = null;
    getData();
    showModal.value = false;
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi!";
  }
};

const dat = inject("dat");
const datakril = ref([]);
const translitMap = {
  ch: "ч", sh: "ш", yo: "ё", yu: "ю", ya: "я", ye: "е", "oʻ": "ў", "g‘": "ғ",
  a: "а", b: "б", d: "д", e: "э", f: "ф", g: "г", h: "ҳ", i: "и", j: "ж",
  k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "қ", r: "р", s: "с",
  t: "т", u: "у", v: "в", x: "х", y: "й", z: "з", "'": "ъ"
};

const translateText = (text) => {
  if (!text) return "";
  let translated = text.toLowerCase();
  for (const [key, value] of Object.entries(translitMap)) {
    translated = translated.replace(new RegExp(key, "g"), value);
  }
  return translated;
};

const getData = async () => {
  try {
    const response = await fetch(`${URL}/services/${id1.value}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();
    if (Array.isArray(result)) {
      datakril.value = result.map((item) => ({
        ...item,
        translatedName: translateText(item.name),
      }));
      data.value = result.filter((item) => item.status === "active");
    } else if (result && typeof result === "object" && Array.isArray(result.applications)) {
      datakril.value = result.applications
        .filter((item) => item.status === "active")
        .sort((a, b) => a.id - b.id)
        .map((item) => ({
          ...item,
          translatedName: translateText(item.name),
        }));
      data.value = result.applications
        .filter((item) => item.status === "active")
        .sort((a, b) => a.id - b.id);
      ServiceData.value = result.files.sort((a, b) => a.id - b.id);
    } else {
      console.error("Kutilmagan formatda ma'lumot keldi:", result);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const removeSelectedItems = async () => {
  if (!Id.value) return;

  try {
    const response = await fetch(`${URL}/applications/${Id.value}`, {
      method: "DELETE",
    });

    if (response.ok) {
      asd.value = false;
      await getData();
      successMessage.value = "Element muvaffaqiyatli o‘chirildi!";
    } else {
      console.error("O‘chirishda xatolik:", response.statusText);
      errorMessage.value = "O‘chirishda xatolik yuz berdi!";
    }
  } catch (error) {
    console.error("Xatolik:", error);
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  }
};

const removefileItems = async (id) => {
  if (!id) {
    console.error("ID topilmadi!");
    return;
  }

  try {
    const response = await fetch(`${URL}/services/files/${id}`, {
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
    const response = await axios.put(`${URL}/services/files/${selectedFileId.value}`, formData, {
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

const updateCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);

  try {
    const response = await axios.patch(`${URL}/applications/${PutId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      successMessage.value = "Court muvaffaqiyatli yangilandi!";
      errorMessage.value = "";
      courtName.value = "";
      file.value = null;
      PutModal.value = false;
      await getData();
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  }
};

watch([showModal, PutModal, asd, fileModal], ([modalOpen, putModalOpen, asdOpen, fileModalOpen]) => {
  if (modalOpen || putModalOpen || asdOpen || fileModalOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

getData();
const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;
</script>

<style scoped></style>