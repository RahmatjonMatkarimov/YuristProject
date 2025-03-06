<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
    <div class="flex h-full w-full gap-3 justify-center items-center">
      <div class="bg-white h-[96vh] shadow-md rounded-lg p-6 w-full">
        <form @submit.prevent="submitForm" class="space-y-4 h-full">
          <input v-model="formData.name"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ism" required />
          <input v-model="formData.surname"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Familiya" />
          <input v-model="formData.dadname"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Otasining ismi" />
          <input v-model="formData.jshshr"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="jshshir" />
          <input v-model="formData.birthday" type="date"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="formData.phone" type="text"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Telefon raqami" />
          <input v-model="formData.qachongacha"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Qachongacha" />
          <button type="submit"
            class="w-full text-white py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600">Yuborish</button>
        </form>
        <button @click="generateWordFile"
          class="w-full text-white py-2 rounded-lg font-semibold bg-yellow-500 hover:bg-yellow-600 mt-4">Word faylni
          tayyorlash</button>
        <button v-if="wordState.generated" @click="saveWordFile"
          class="w-full text-white py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 mt-4">Komp’yuterga
          saqlash</button>
      </div>
      <div class="mt-6 bg-white w-[900px] h-[900px] shadow-md rounded-lg p-6 text-gray-700">
        <h1 class="font-bold text-[20px] text-center">Xodim yillik mehnat ta’tili berishni so‘raganda</h1>
        <div class="flex justify-end">
          <p class="mt-4 w-[290px] leading-relaxed text-sm">
            Men, <strong>{{ fullName }}</strong>,<br>
            tug'ilgan sana: <strong>{{ formattedBirthday }}</strong>,<br>
            telefon raqami: +<strong>{{ formattedPhone }}</strong>,<br>
          </p>
        </div>
        <h1 class="font-bold text-[18px] text-center">Ariza</h1>
        <p class="mt-3">
          Menga haqiqatda {{ currentDate }}dan Ta’til {{ formData.qachongacha || 'belgilanmagan' }} tugash vaqtigacha
          bo‘lgan yillarda ishlagan vaqtim uchun navbatdagi yillik mehnat ta’tili berishingizni,
          <strong>{{ currentDate }}</strong> sanada so‘rayman.
        </p>
      </div>
      <div class="edit-controls mb-6" v-if="placeholders.length > 0">
        <div class="input-group" v-for="(placeholder, index) in placeholders" :key="index">
          <label>{{ getPlaceholderLabel(placeholder) }}:</label>
          <input v-model="inputValues[placeholder]" :placeholder="getPlaceholderLabel(placeholder)" class="input-field"
            @input="updateContent">
        </div>
        <button @click="applyChanges" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4">
          O'zgartirishlarni qo'llash
        </button>
      </div>
      <div v-else-if="htmlContent" class="text-center mb-6">
        <p>Placeholder'lar topilmadi</p>
      </div>

      <div v-if="htmlContent" v-html="modifiedContent" class="word-content"></div>
      <div v-else class="text-center mt-10">
        <p class="text-red-500">Faylni olishda xatolik yuz berdi!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  color: black;
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { URL, URL1 } from '@/auth/url';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import mammoth from "mammoth";
const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const htmlContent = ref("");
const modifiedContent = ref("");
const placeholders = ref([]); // Placeholder'larni saqlash uchun массив
const inputValues = ref({}); // Input qiymatlari uchun ob'ekt

// Computed property uchun placeholder nomini formatlash
const getPlaceholderLabel = computed(() => (placeholder) => {
  return placeholder.replaceAll('{{', '').replaceAll('}}', '');
});

// Input o'zgarishi bilan contentni yangilash funksiyasi
const updateContent = () => {
  let tempContent = htmlContent.value;

  // Har bir placeholder uchun input qiymatini yoki ichidagi matnni almashtirish
  placeholders.value.forEach(placeholder => {
    const innerText = placeholder.replaceAll('{{', '').replaceAll('}}', '');
    tempContent = tempContent.replaceAll(
      placeholder,
      inputValues.value[placeholder] || innerText
    );
  });

  modifiedContent.value = tempContent;
};

// Initial contentni sozlash
const fetchWordFile = async () => {
  try {
    const response = await fetch(`${URL}/files/${id.value}`);
    if (!response.ok) throw new Error(`HTTP xato! Status: ${response.status}`);

    const resData = await response.json();
    const fileResponse = await fetch(`${URL}/uploads${resData.filePath}`);
    if (!fileResponse.ok)
      throw new Error(`HTTP xato! Status: ${fileResponse.status}`);

    const arrayBuffer = await fileResponse.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    htmlContent.value = result.value;
    modifiedContent.value = result.value;

    // Placeholder'larni aniqlash
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const matches = [...result.value.matchAll(placeholderRegex)];
    placeholders.value = [...new Set(matches.map(match => match[0]))]; // Takrorlanmas placeholder'lar
    placeholders.value.forEach(placeholder => {
      inputValues.value[placeholder] = ""; // Har bir placeholder uchun bo'sh qiymat
    });

    // Initial contentni yangilash
    updateContent();
  } catch (error) {
    console.error("Faylni olishda xatolik yuz berdi:", error.message);
    modifiedContent.value = "<p class='text-red-500'>Faylni olishda xatolik yuz berdi!</p>";
  }
};
const API_URL = URL1;

const getdata = async () => {
  const res = await axios.get(URL + "/applications")
  console.log(res.data);
}

getdata()
const formData = ref({
  name: '',
  surname: '',
  dadname: '',
  phone: '',
  birthday: '',
  qachongacha: '',
  jshshr: '',
});

const recordingState = ref({
  cameraRecorders: [],
  screenRecorder: null,
  cameraChunks: [],
  screenChunks: [],
});

const wordState = ref({
  generated: false,
  blob: null,
});

const currentDate = computed(() => formatDate(new Date()));
const fullName = computed(() => `${formData.value.surname || 'Matkarimov'} ${formData.value.name || 'Rahmatjon'} ${formData.value.dadname || "Umirbek o'g'li"}`);
const formattedBirthday = computed(() => formatDate(formData.value.birthday || '1999-12-01'));
const formattedPhone = computed(() => formatPhone(formData.value.phone));

// Recording Functions
const startRecording = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    if (!videoDevices.length) {
      console.warn('Hech qanday veb-kamera topilmadi.');
    }

    for (const [index, device] of videoDevices.entries()) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: device.deviceId },
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = () => console.log(`Kamera ${index + 1} yozuvi to‘xtadi`);
        recorder.start();
        recordingState.value.cameraRecorders.push(recorder);
        recordingState.value.cameraChunks.push(chunks);
      } catch (err) {
        console.warn(`Kamera ${index + 1} bilan yozuv boshlanmadi: ${err.message}`);
      }
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      recordingState.value.screenRecorder = new MediaRecorder(screenStream);
      recordingState.value.screenRecorder.ondataavailable = e => recordingState.value.screenChunks.push(e.data);
      recordingState.value.screenRecorder.onstop = () => console.log('Ekran yozuvi to‘xtadi');
      recordingState.value.screenRecorder.start();
    } catch (err) {
      console.warn(`Ekran yozuvi boshlanmadi: ${err.message}`);
    }
  } catch (error) {
    console.error('Yozuvni boshlashda umumiy xato:', error);
    alert('Yozuv boshlanmadi. Iltimos, kamera va ekran ruxsatlarini tekshiring.');
  }
};

const stopRecording = async () => {
  await Promise.all([
    ...recordingState.value.cameraRecorders.map(recorder => {
      if (recorder?.state !== 'inactive') {
        recorder.stop();
        recorder.stream.getTracks().forEach(track => track.stop());
      }
      return new Promise(resolve => setTimeout(resolve, 500));
    }),
    new Promise(resolve => {
      if (recordingState.value.screenRecorder?.state !== 'inactive') {
        recordingState.value.screenRecorder.stop();
        recordingState.value.screenRecorder.stream.getTracks().forEach(track => track.stop());
      }
      setTimeout(resolve, 500);
    }),
  ]);
};

// Document Generation
const generateWordFile = async () => {
  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      children: [
        new Paragraph({ text: "Xodim yillik mehnat ta’tili berishni so‘raganda", bold: true, size: 40, alignment: "center", spacing: { after: 480 } }),
        new Paragraph({
          children: [
            new TextRun({ text: `Men, ${fullName.value}`, bold: true, size: 24 }),
            new TextRun({ text: `\ntug'ilgan sana: ${formattedBirthday.value}`, size: 24, break: 1 }),
            new TextRun({ text: `\ntelefon raqami: +${formattedPhone.value}`, size: 24, break: 1 }),
          ],
          alignment: "left",
          indent: { right: 1440 },
          spacing: { after: 480 },
        }),
        new Paragraph({ text: "Ariza", bold: true, size: 36, alignment: "center", spacing: { after: 480 } }),
        new Paragraph({
          text: `Menga haqiqatda ${currentDate.value}dan Ta’til ${formData.value.qachongacha || 'belgilanmagan'} tugash vaqtigacha bo‘lgan yillarda ishlagan vaqtim uchun navbatdagi yillik mehnat ta’tili berishingizni, ${currentDate.value} sanada so‘rayman.`,
          size: 24,
          indent: { left: 720 },
          spacing: { after: 240 },
        }),
      ],
    }],
  });

  try {
    wordState.value.blob = await Packer.toBlob(doc);
    wordState.value.generated = true;
  } catch (error) {
    console.error('Word faylini yaratishda xato:', error);
    alert('Word faylini yaratishda xatolik yuz berdi.');
  }
};

const saveWordFile = async () => {
  if (!wordState.value.blob) return alert('Word fayli hali tayyor emas!');
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'Ariza.docx',
      types: [{ description: 'Word Document', accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] } }],
    });
    const writable = await fileHandle.createWritable();
    await writable.write(wordState.value.blob);
    await writable.close();
    alert('Fayl saqlandi!');
  } catch (error) {
    console.error('Saqlashda xato:', error);
    alert('Faylni saqlashda xatolik: ' + error.message);
  }
};

// Form Submission
const submitForm = async () => {
  try {
    await stopRecording();
    const htmlContent = generateHTMLContent();
    const htmlFile = new File([new Blob([htmlContent], { type: 'text/html' })], 'application.html', { type: 'text/html' });
    await uploadFiles(htmlFile);
    alert('Ma’lumotlar muvaffaqiyatli yuborildi!');
  } catch (error) {
    console.error('Yuborishda xato:', error);
    alert('Xatolik yuz berdi: ' + error.message);
  }
};

const uploadFiles = async (htmlFile) => {
  const form = new FormData();

  if (recordingState.value.cameraChunks[0]?.length) {
    form.append('video1', new File([new Blob(recordingState.value.cameraChunks[0], { type: 'video/webm' })], 'camera_recording_1.webm', { type: 'video/webm' }));
  }
  if (recordingState.value.cameraChunks[1]?.length) {
    form.append('video2', new File([new Blob(recordingState.value.cameraChunks[1], { type: 'video/webm' })], 'camera_recording_2.webm', { type: 'video/webm' }));
  }
  if (recordingState.value.screenChunks.length) {
    form.append('video3', new File([new Blob(recordingState.value.screenChunks, { type: 'video/webm' })], 'screen_recording.webm', { type: 'video/webm' }));
  }

  form.append('file', htmlFile);
  form.append('data', JSON.stringify({
    name: formData.value.name,
    surname: formData.value.surname || null,
    dadname: formData.value.dadname || null,
    uniqueCode: formData.value.jshshr || null,
    phone: formData.value.phone ? `+${formData.value.phone}` : null,
    birthday: formData.value.birthday ? new Date(formData.value.birthday).toISOString() : null,
  }));

  const response = await axios.post(`${API_URL}/commoners`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return response.data;
};

const generateHTMLContent = () => `
   <!DOCTYPE html>
  <html lang="uz">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ariza</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; color: black; }
      .container { max-width: 700px; margin: 0 auto; }
      .header { text-align: center; font-weight: bold; font-size: 20px; margin-bottom: 20px; }
      .personal-info { display: flex; justify-content: end; margin-bottom: 30px; }
      .title { text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 20px; }
      .content { line-height: 1.6; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Xodim yillik mehnat ta’tili berishni so‘raganda</div>
      <div class="personal-info">
        Men, <strong>${fullName.value}</strong>,<br>
        tug'ilgan sana: <strong>${formattedBirthday.value}</strong>,<br>
        telefon raqami: +<strong>${formattedPhone.value}</strong>,<br>
      </div>
      <div class="title">Ariza</div>
      <div class="content">
        Menga haqiqatda ${currentDate.value}dan Ta’til ${formData.value.qachongacha || 'belgilanmagan'} tugash vaqtigacha bo‘lgan yillarda
        ishlagan vaqtim uchun navbatdagi yillik mehnat ta’tili berishingizni, <strong>${currentDate.value}</strong> sanada so‘rayman.
      </div>
    </div>
  </body>
  </html>
`;

// Helpers
const formatDate = (date) => new Date(date).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
const formatPhone = (phone) => (phone || '998919999999').replace(/\D/g, '').replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');

watch(inputValues, () => {
  updateContent();
}, { deep: true });
onMounted(() => {
  fetchWordFile();
  startRecording()
});
</script>