<template>
  <div class="min-h-screen flex items-center flex-col p-4">
    <div class="flex  items-end gap-3">
      <div v-for="item in bigadmin" :key="item.id"
        class="relative mt-8 flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md rounded-lg border border-gray-200">
        <div @click="path(item.id)" class="relative flex flex-col md:flex-row items-center justify-between p-4 w-full">
          <div class="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
            <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
          </div>
          <div class="ml-4 flex-grow">
            <h1 class="text-2xl font-semibold text-gray-700">FIO: {{ item.surname }} {{ item.name }} {{ item.dadname }}
            </h1>
            <h1 class="text-lg text-gray-500">Login: {{ item.username }}</h1>
            <div class="mb-4 relative text-gray-700 flex w-fit break-words">
              <span class="font-medium text-gray-700">Fuqaroning lavozimi :</span>
              <span class="block group truncate text-gray-700 max-w-[450px] ml-2 cursor-pointer">
                {{ item.lavozimi }}
                <span
                  class="absolute left-0 top-full mt-1 w-auto max-w-[550px] bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                  {{ item.lavozimi }}
                </span>
              </span>
            </div>
            <div class="flex items-center">
              <span class="mr-2 text-sm text-gray-500">Holati:</span>
              <span :class="getAdminStatus(item).color">
                {{ getAdminStatus(item).status }}
              </span>
              <div class="flex items-center gap-2 ml-2">
                <div class="w-5 h-5 rounded-full" :class="checkIsOnline(item.id) ? 'bg-green-500' : 'bg-red-500'"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-for="item in yordamchi" :key="item.id" class="relative mt-8 ">
        <div @click="path(item.id)"
          class="relative bg-white p-4 flex justify-center items-center shadow-md rounded-lg border border-gray-200 ">
          <div class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
            <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
          </div>
          <div class="ml-4 flex justify-between flex-grow">
            <div class="flex">
              <div>
                <h1 class="text-xl font-semibold text-gray-700">FIO: {{ item.surname }} {{ item.name }} {{ item.dadname
                }}
                </h1>
                <div class="mb-4 relative text-gray-700 flex w-fit break-words">
                  <span class="font-medium text-gray-700">Fuqaroning lavozimi :</span>
                  <span class="block group truncate text-gray-700 max-w-[450px] ml-2 cursor-pointer">
                    {{ item.lavozimi }}
                    <span
                      class="absolute left-0 top-full mt-1 w-auto max-w-[550px] bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                      {{ item.lavozimi }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-wrap justify-center gap-4 mt-8">
      <div v-for="item in two" :key="item.id"
        class="relative w-[700px] flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md rounded-lg border border-gray-200">
        <div @click="path(item.id)" class="relative flex flex-col md:flex-row items-center justify-between p-4 w-full">
          <div class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
            <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
          </div>
          <div class="ml-4 flex-grow">
            <h1 class="text-2xl font-semibold text-gray-700">FIO: {{ item.surname }} {{ item.name }} {{ item.dadname }}
            </h1>
            <h1 class="text-lg text-gray-500">Login: {{ item.username }}</h1>
            <div class="mb-4 relative text-gray-700 flex w-fit break-words">
              <span class="font-medium text-gray-700">Fuqaroning lavozimi :</span>
              <span class="block group truncate text-gray-700 max-w-[450px] ml-2 cursor-pointer">
                {{ item.lavozimi }}
                <span
                  class="absolute left-0 top-full mt-1 w-auto max-w-[550px] bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                  {{ item.lavozimi }}
                </span>
              </span>
            </div>
            <div class="flex items-center">
              <span class="mr-2 text-sm text-gray-500">Holati:</span>
              <span :class="getAdminStatus(item).color">
                {{ getAdminStatus(item).status }}
              </span>
              <div class="flex items-center gap-2 ml-2">
                <div class="w-5 h-5 rounded-full" :class="checkIsOnline(item.id) ? 'bg-green-500' : 'bg-red-500'"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-wrap justify-center gap-4 mt-8">
        <div v-for="item in admins" :key="item.id"
          class="relative w-[700px] flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md rounded-lg border border-gray-200">
          <div @click="path(item.id)"
            class="relative flex flex-col md:flex-row items-center justify-between p-4 w-full">
            <div class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
              <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
            </div>
            <div class="ml-4 flex-grow">
              <h1 class="text-2xl font-semibold text-gray-700">FIO: {{ item.surname }} {{ item.name }} {{ item.dadname
              }}
              </h1>
              <h1 class="text-lg text-gray-500">Login: {{ item.username }}</h1>
              <div class="mb-4 relative text-gray-700 flex w-fit break-words">
                <span class="font-medium text-gray-700">Fuqaroning lavozimi :</span>
                <span class="block group truncate text-gray-700 max-w-[450px] ml-2 cursor-pointer">
                  {{ item.lavozimi }}
                  <span
                    class="absolute left-0 top-full mt-1 w-auto max-w-[550px] bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                    {{ item.lavozimi }}
                  </span>
                </span>
              </div>
              <div class="flex items-center">
                <span class="mr-2 text-sm text-gray-500">Holati:</span>
                <span :class="getAdminStatus(item).color">
                  {{ getAdminStatus(item).status }}
                </span>
                <div class="flex items-center gap-2 ml-2">
                  <div class="w-5 h-5 rounded-full" :class="checkIsOnline(item.id) ? 'bg-green-500' : 'bg-red-500'">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { uz } from "date-fns/locale";
import { URL } from "@/auth/url.js";
import { io } from "socket.io-client";
import { useRouter } from "vue-router";

const socket = io(URL);
const onlineAdmins = ref([]);
const modalOpen = ref(null);
const router = useRouter()
const admins = ref([])
const bigadmin = ref([])
const yurist = ref([])
const yordamchi = ref([])
const two = ref([])

const path = (id) => {
  router.push(`/profile/${id}`);
};

const getData = async () => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const [adminRes, yuristRes, bigadminsRes, managerRes] = await Promise.all([
    axios.get(`${URL}/admin`, config),
    axios.get(`${URL}/yurist`, config),
    axios.get(`${URL}/bigAdmin`, config),
    axios.get(`${URL}/manager`, config),
  ]);

  admins.value = [...yuristRes.data, ...managerRes.data, ...adminRes.data].filter(item => item.type === "active")
    .filter(item => item.lavozimi !== "orinbosar")
    .filter(item => item.lavozimi !== "bolim boshligi");
  bigadmin.value = bigadminsRes.data.filter(item => item.type === "active");
  const lavozimlar = ["orinbosar", "bolim boshligi"];
  two.value = yuristRes.data
    .filter(item => lavozimlar.includes(item.lavozimi))
    .filter(item => item.type === "active")
  yurist.value = yuristRes.data.filter(item => item.type === "active");
  yordamchi.value = adminRes.data.filter(item => item.lavozimi === "yordamchi");
};

const getAdminStatus = (admin) => {
  if (onlineAdmins.value.includes(admin.id.toString())) {
    return { status: "Onlayn", color: "text-green-500" };
  } else if (admin.lastSeen) {
    return {
      status: ` ${formatDistanceToNow(new Date(admin.lastSeen), {
        addSuffix: true,
        locale: uz,
      })} tarmoqda edi`,
      color: "text-red-500",
    };
  } else {
    return { status: "Oflayn", color: "text-gray-500" };
  }
};

const checkOnlineStatus = (onlineAdminIds) => {
  onlineAdmins.value = onlineAdminIds.map((id) => id.toString());
};

const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : "/default-avatar.png";
};

const checkIsOnline = (adminId) => {
  return onlineAdmins.value.includes(adminId.toString());
};

onMounted(() => {
  getData();

  socket.on("connect", () => {
    socket.emit("getOnlineAdmins");
  });

  socket.on("onlineAdmins", (onlineAdminIds) => {
    checkOnlineStatus(onlineAdminIds);
  });

  socket.on("adminOnlineUpdate", checkOnlineStatus);
  onUnmounted(() => {
    clearInterval(interval);
    socket.off("adminOnlineUpdate");
    socket.disconnect();
  });
});
</script>