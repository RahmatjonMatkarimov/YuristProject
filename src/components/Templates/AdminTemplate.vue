<template>
  <div>
    <div class="w-full fixed mb-32 top-0 z-20 mx-auto">
      <div v-if="dat === 'datakril'" class="bg-blue-800 flex h-[200px] p-2">
        <div class="flex items-start gap-6 mb-8">
          <div>
            <div class="w-44 h-44 border-2 border-profile-blue rounded-lg overflow-hidden">
              <img :src="getImageUrl(userInfoLotin.img)" alt="Profile Image" />
            </div>
          </div>
          <div class="flex-1 w-[300px] bg-profile-blue m-2 text-white rounded-lg">
            <div class="mb-4 relative  w-full flex border p-4 rounded-lg break-words">
              <span class="font-medium capitalize">{{ $t('fuqaro_lavozimi') }}:</span>
              <span class="block group capitalize truncate max-w-[250px] ml-2 cursor-pointer">
                {{ userInfo.lavozimi }}
                <span
                  class="absolute capitalize left-0 -bottom-7 w-auto min-w-max bg-lime-500 text-black text-[16px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="flex justify-center items-center">
                    <h1 style="text-shadow: 0 0 5px #fff,0 0 10px #fff;"
                      class="text-black text-[16px] font-bold text-center rounded-lg">{{ userInfo.lavozimi }} </h1>
                  </div>
                </span>
              </span>
            </div>
            <div class="flex border rounded-lg px-4 items-center">
              <span class="font-medium capitalize">{{ $t('tizim_holati') }}:</span>
              <div class="flex h-10 items-center ml-2">
                <span class="mr-2">{{ isOnline ? "Onlayn" : "Oflayn" }}</span>
                <div class="flex gap-1">
                  <div class="w-6 h-6 rounded-full" :class="isOnline ? 'bg-green-500' : 'bg-red-500'"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class=" flex flex-col flex-wrap">
          <h1 class="p-2 pr-10 m-2 rounded capitalize border">{{ $t('foydalanuvchi_ismi') }}: {{ userInfo.name }}
            {{ userInfo.surname }}
            {{ userInfo.dadname }}</h1>
          <h1 class="p-2 pr-10 m-2 capitalize rounded border">{{ $t('foydalanuvchi_telefon') }}: +998-{{
            formatPhoneNumber(userInfoLotin.phone)
            }}</h1>
          <h1 class="p-2 pr-10 m-2 rounded capitalize border">{{ $t('foydalanuvchi_jshir') }}:
            {{ userInfoLotin.uniqueCode }}</h1>
          <h1 class="p-2 pr-10 m-2 rounded capitalize border">{{ $t('id_karta_raqami') }}: {{
            userInfoLotin.userCode
            }}</h1>
          <h1 class="p-2 pr-10 m-2 rounded capitalize border">{{ $t('tugilgan_kuni') }}: {{ formattedBirthday }}</h1>
          <button @click="go(userInfoLotin.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('ish_haqqi_kalkulyatori') }}
          </button>
          <button @click="go3(userInfo.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hodim_vazifalari') }}
          </button>
          <button @click="go2(userInfo.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hodim_majburiyatlari') }}
          </button>
          <button @click="go1(userInfo.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hodim_malumotlari') }}
          </button>
          <a href="https://www.zoom.com/uz" target="_blank"
            class="border bg-lime-600 py-2 px-6 m-2 text-center text-black rounded hover:bg-lime-700 duration-500 capitalize">
            {{ $t('zoom_boglanish') }}
          </a>
          <div @click="gonotif(userInfo.id)"
            class="relative bg-lime-600 hover:bg-lime-700 duration-500 flex border items-center capitalize px-6 m-2 rounded">
            <img class="w-10 -ml-4 mr-9" src="../../../public/chat.png" alt="">
            {{ $t('muhim_sms') }}
            <span v-if="notificationCount > 0"
              class="ml-2 absolute top-[2px] left-[37px] bg-red-500 text-white rounded-full px-2 py-1 h-5  text-[13px]">
              <h1 class="-mt-1 capitalize ">{{ notificationCount }}</h1>
            </span>
          </div>
          <div @click="gochat1(userInfo.id)"
            class="relative bg-lime-600 hover:bg-lime-700 duration-500 flex border items-center capitalize px-6 m-2 rounded">
            <img class="w-10 -ml-4 mr-9" src="../../../public/chat.png" alt="">
            {{ $t('chat-guruh') }}
            <span v-if="messageCount > 0"
              class="ml-2 absolute top-[2px] left-[37px] bg-red-500 text-white rounded-full px-2 py-1 h-5  text-[13px]">
              <h1 class="-mt-1 capitalize ">{{ messageCount }}</h1>
            </span>
          </div>
          <div class="absolute top-1 right-1">
            <div class="relative">
              <button @click="toggleDropdown"
                class="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 rounded-lg px-4 py-2 shadow-md">
                <img :src="selectedFlag" class="w-5 rounded h-5" />
                <span>{{ selectedLabel }}</span>
                <svg class="w-4 h-4 transition-transform transform" :class="{ 'rotate-180': isOpen }"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
                </svg>
              </button>

              <div v-if="isOpen"
                class="absolute right-0 mt-2 w-40 bg-blue-700 border rounded-lg shadow-md overflow-hidden transition-opacity">
                <div @click="setLanguage('uzb', 'Uz', '/uzb.png')"
                  class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-800 transition">
                  <img src="/uzb.png" class="w-5 rounded h-5" />
                  <span>Uz</span>
                </div>
                <div @click="setLanguage('ўзб', 'Уз', '/uzb.png')"
                  class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-800 transition">
                  <img src="/uzb.png" class="w-5 rounded h-5" />
                  <span>Уз</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="dat === 'datalotin'" class="bg-blue-800 flex h-[200px] p-2">
        <div class="flex items-start gap-6 mb-8">
          <div>
            <div class="w-44 h-44 border-2 border-profile-blue rounded-lg overflow-hidden">
              <img :src="getImageUrl(userInfoLotin.img)" alt="Profile Image" />
            </div>
          </div>
          <div class="flex-1 w-[300px] bg-profile-blue m-2 text-white rounded-lg">
            <div class="mb-4 relative  w-full flex border p-4 rounded-lg break-words">
              <span class="font-medium capitalize">{{ $t('fuqaro_lavozimi') }}:</span>
              <span class="block group capitalize truncate max-w-[250px] ml-2 cursor-pointer">
                {{ userInfoLotin.lavozimi }}
                <span
                  class="absolute capitalize left-0 -bottom-7 w-auto min-w-max bg-lime-500 text-black text-[16px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="flex justify-center items-center">
                    <h1 style="text-shadow: 0 0 5px #fff,0 0 10px #fff;"
                      class="text-black text-[16px] font-bold text-center rounded-lg">{{ userInfoLotin.lavozimi }} </h1>
                  </div>
                </span>
              </span>
            </div>
            <div class="flex border rounded-lg px-4 items-center">
              <span class="font-medium capitalize">{{ $t('tizim_holati') }}:</span>
              <div class="flex h-10 items-center ml-2">
                <span class="mr-2">{{ isOnline ? "Onlayn" : "Oflayn" }}</span>
                <div class="flex gap-1">
                  <div class="w-6 h-6 rounded-full" :class="isOnline ? 'bg-green-500' : 'bg-red-500'"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class=" flex flex-col flex-wrap">
          <h1 class="p-2 pr-10 m-2 rounded capitalize border">{{ $t('foydalanuvchi_ismi') }}: {{ userInfoLotin.name }}
            {{ userInfoLotin.surname }}
            {{ userInfoLotin.dadname }}</h1>
          <h1 class="p-2 pr-10 m-2 capitalize rounded border">{{ $t('foydalanuvchi_telefon') }}: +998-{{
            formatPhoneNumber(userInfoLotin.phone)
            }}</h1>
          <h1 class="p-2 pr-10 m-2 rounded capitalize border">{{ $t('foydalanuvchi_jshir') }}:
            {{ userInfoLotin.uniqueCode }}</h1>
          <h1 class="p-2 pr-10 m-2 rounded capitalize border">{{ $t('id_karta_raqami') }}: {{
            userInfoLotin.userCode
            }}</h1>
          <h1 class="p-2 pr-10 m-2 rounded capitalize border">{{ $t('tugilgan_kuni') }}: {{ formattedBirthday }}</h1>
          <button @click="go(userInfoLotin.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('ish_haqqi_kalkulyatori') }}
          </button>
          <button @click="go3(userInfo.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hodim_vazifalari') }}
          </button>
          <button @click="go2(userInfo.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hodim_majburiyatlari') }}
          </button>
          <button @click="go1(userInfo.id)"
            class="border capitalize bg-lime-600 p-2 m-2 text-black rounded hover:bg-lime-700 duration-500">
            {{ $t('hodim_malumotlari') }}
          </button>
          <a href="https://www.zoom.com/uz" target="_blank"
            class="border bg-lime-600 py-2 px-6 m-2 text-center text-black rounded hover:bg-lime-700 duration-500 capitalize">
            {{ $t('zoom_boglanish') }}
          </a>
          <div @click="gonotif(userInfo.id)"
            class="relative bg-lime-600 hover:bg-lime-700 duration-500 flex border items-center capitalize px-6 m-2 rounded">
            <img class="w-10 -ml-4 mr-9" src="../../../public/chat.png" alt="">
            {{ $t('muhim_sms') }}
            <span v-if="notificationCount > 0"
              class="ml-2 absolute top-[2px] left-[37px] bg-red-500 text-white rounded-full px-2 py-1 h-5  text-[13px]">
              <h1 class="-mt-1 capitalize ">{{ notificationCount }}</h1>
            </span>
          </div>
          <div @click="gochat1(userInfo.id)"
            class="relative bg-lime-600 hover:bg-lime-700 duration-500 flex border items-center capitalize px-6 m-2 rounded">
            <img class="w-10 -ml-4 mr-9" src="../../../public/chat.png" alt="">
            {{ $t('chat-guruh') }}
            <span v-if="messageCount > 0"
              class="ml-2 absolute top-[2px] left-[37px] bg-red-500 text-white rounded-full px-2 py-1 h-5  text-[13px]">
              <h1 class="-mt-1 capitalize ">{{ messageCount }}</h1>
            </span>
          </div>
        </div>
        <div class="absolute top-1 right-1">
          <div class="relative">
            <button @click="toggleDropdown"
              class="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 rounded-lg px-4 py-2 shadow-md">
              <img :src="selectedFlag" class="w-5 rounded h-5" />
              <span>{{ selectedLabel }}</span>
              <svg class="w-4 h-4 transition-transform transform" :class="{ 'rotate-180': isOpen }" fill="currentColor"
                viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>

            <div v-if="isOpen"
              class="absolute right-0 mt-2 w-40 bg-blue-700 border rounded-lg shadow-md overflow-hidden transition-opacity">
              <div @click="setLanguage('uzb', 'Uz', '/uzb.png')"
                class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-800 transition">
                <img src="/uzb.png" class="w-5 rounded h-5" />
                <span>Uz</span>
              </div>
              <div @click="setLanguage('ўзб', 'Уз', '/uzb.png')"
                class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-800 transition">
                <img src="/uzb.png" class="w-5 rounded h-5" />
                <span>Уз</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <Aside class="fixed left-0 top-0 h-full w-64" />
      <main class="flex-1 ml-[420px] p-4 mt-64">
        <router-view />
      </main>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, inject, watch } from "vue";
import { useRouter } from "vue-router";
import Aside from "../aside.vue";
import axios from "axios";
import { URL } from "@/auth/url.js";
import { io } from "socket.io-client";
import { useI18n } from "vue-i18n";
import { provide } from "vue";

const { locale } = useI18n();
const isOpen = ref(false);
const selectedFlag = ref("/uzb.png");
const selectedLabel = ref("Uz");
const dat = ref("datalotin");
provide("dat", dat);
const isLoading = inject('isLoading');

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const setLanguage = (lang, label, flag) => {
  dat.value = lang === "ўзб" ? "datakril" : "datalotin";
  locale.value = lang;
  selectedLabel.value = label;
  selectedFlag.value = flag;
  isOpen.value = false;
};
const router = useRouter();
const id = localStorage.getItem("id");
const newId = id ? parseInt(id) : null;
const loading = ref(true);
const error = ref(null);
const userInfo = ref({});
const isOnline = ref(false);
const notificationCount = ref(0);
const socket = io(URL);
let intervalId = null;
const userInfoLotin = ref({});
const messageCount = ref(parseInt(localStorage.getItem('messageCount')) || 0);

watch(messageCount, (newVal) => {
  localStorage.setItem('messageCount', newVal);
});
const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const translateText = (text) => {
  if (!text) return "";
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    const regex = new RegExp(key, "g");
    translated = translated.replace(regex, translitMap[key]);
  }
  return translated;
};


const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return match ? `${match[1]}-${match[2]}-${match[3]}-${match[4]}` : phoneNumber;
};

const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : "/default-avatar.png";
};

const go1 = (id) => router.push(`/requireUserInfoFiles`);
const go2 = (id) => router.push(`/requireUserobligationsFiles`);
const go3 = (id) => router.push(`/requireUserTasksFiles`);
const gonotif = (id) => router.push(`/notifications/${id}`);
const gochat1 = (id) => router.push(`/chat/${id}`);

if (!newId || isNaN(newId)) {
  console.error("ID топилмади ёки нотўғри форматда.");
}
const getData = async () => {
  isLoading.value = true; // 🔹 Ma'lumot yuklanayotganini belgilash
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Токен топилмади. Фойдаланувчи авторизациядан ўтмаган.");

    const response = await axios.get(`${URL}/${localStorage.getItem('role')}/${newId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    userInfo.value = { ...response.data };
    for (const key in userInfo.value) {
      if (typeof userInfo.value[key] === "string") {
        userInfo.value[key] = translateText(userInfo.value[key]);
      }
    }
    userInfoLotin.value = response.data;
    const onlineResponse = await axios.get(`${URL}/${localStorage.getItem('role')}/online`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    checkOnlineStatus(onlineResponse.data.map((admin) => admin.id.toString()));

    await fetchNotifications();
  } catch (err) {
    console.error("Хатолик:", err.response?.data || err.message);
    error.value = "Маълумотларни юклашда хатолик юз берди.";
  } finally {
    isLoading.value = false; // 🔹 Yuklanish tugaganini belgilash
  }
};

socket.on("unreadCount", (message) => {
  messageCount.value++;
});



const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token topilmadi. Foydalanuvchi avtorizatsiyadan o'tmagan.");

    const response = await axios.get(`${URL}/${localStorage.getItem('role')}/${newId}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    notificationCount.value = response.data;
  } catch (error) {
    console.error("Xatolik o'qilmagan xabarnomalar sonini olishda:", error);
  }
};


const formattedBirthday = computed(() => {
  if (!userInfoLotin.value?.birthday);

  const date = new Date(userInfoLotin.value.birthday);

  if (isNaN(date.getTime())) return "Маълум эмас";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}.${month}.${year}`;
});


const checkOnlineStatus = (onlineAdmins) => {
  isOnline.value = onlineAdmins.includes(id);
};


onMounted(() => {
  getData();
  socket.emit("joinUser", id);

  socket.on("adminOnlineUpdate", checkOnlineStatus);

  socket.on("newNotification", () => {
    fetchNotifications();
  });

  fetchNotifications();

  intervalId = setInterval(fetchNotifications, 10000);
});


onUnmounted(() => {
  socket.off("adminOnlineUpdate");
  socket.off("notification");
  socket.off("getNotifications");
  clearInterval(intervalId);
  socket.disconnect();
});
</script>
