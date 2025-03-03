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
            class="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600">Yuborish</button>
        </form>
        <button @click="generateWordFile"
          class="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600">Word faylni
          tayyorlash</button>
        <button v-if="wordGenerated" @click="saveWordFile"
          class="mt-4 w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600">Kompьютerga
          saqlash</button>
      </div>
      <div class="mt-6 bg-white w-[900px] h-[900px] shadow-md rounded-lg p-6 text-gray-700">
        <h1 class="font-bold text-[20px] text-center">Xodim yillik mehnat ta’tili berishni so‘raganda</h1>
        <div class="flex justify-end">
          <p class="mt-4 w-[290px] leading-relaxed text-sm">
            Men, <strong>{{ formData.surname || 'Matkarimov' }} {{ formData.name || 'Rahmatjon' }} {{ formData.dadname
              || "Umirbek o'g'li" }}</strong>,<br>
            tug'ilgan sana: <strong>{{ formatDate(formData.birthday || '01.12.1999') }}</strong>,<br>
            telefon raqami: +<strong>{{ formatPhone(formData.phone) }}</strong>,<br>
          </p>
        </div>
        <h1 class="font-bold text-[18px] text-center">Ariza</h1>
        <p class="mt-3">             Menga haqiqatda {{ currentDate }}dan Ta’til {{ formData.qachongacha ||
          'belgilanmagan' }} tugash vaqtigacha bo‘lgan yillarda ishlagan vaqtim uchun navbatdagi yillik mehnat ta’tili
          berishingizni, <strong>{{ currentDate }}</strong> sanada so‘rayman. </p>
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
import { URL1 } from '@/auth/url';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const API_URL = URL1;
const formData = ref({
  name: '',
  surname: '',
  dadname: '',
  phone: '',
  birthday: '',
  qachongacha: '',
  jshshr: '',
});

const cameraRecorders = ref([]);
const screenRecorder = ref(null);
const cameraChunks = ref([]);
const screenChunks = ref([]);
const wordGenerated = ref(false);
const docBlob = ref(null);

const currentDate = computed(() => {
  return new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
});

// Barcha kameralardan va ekrandan yozuvni boshlash
const startRecording = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    console.log('Ulangan video qurilmalar:', videoDevices);

    if (!videoDevices.length) {
      console.warn('Hech qanday veb-kamera topilmadi.');
    }

    cameraChunks.value = [];
    cameraRecorders.value = [];

    for (const [index, device] of videoDevices.entries()) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: device.deviceId },
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => console.log(`Kamera ${index + 1} yozuvi to‘xtadi`);
        recorder.start();

        cameraRecorders.value.push(recorder);
        cameraChunks.value.push(chunks);
      } catch (err) {
        console.error(`Kamera ${index + 1} bilan xato:`, err);
      }
    }

    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    screenRecorder.value = new MediaRecorder(screenStream);
    screenRecorder.value.ondataavailable = (e) => screenChunks.value.push(e.data);
    screenRecorder.value.onstop = () => console.log('Ekran yozuvi to‘xtadi');
    screenRecorder.value.start();

    console.log('Yozuvlar boshlandi...');
  } catch (error) {
    console.error('Yozuvni boshlashda xato:', error);
    alert('Yozuv boshlanmadi. Ruxsatlarni tekshiring.');
  }
};

// Yozuvlarni to‘xtatish
const stopRecording = async () => {
  await Promise.all([
    ...cameraRecorders.value.map((recorder, index) => {
      return new Promise((resolve) => {
        if (recorder && recorder.state !== 'inactive') {
          recorder.stop();
          recorder.stream.getTracks().forEach(track => track.stop());
        }
        setTimeout(resolve, 500);
      });
    }),
    new Promise((resolve) => {
      if (screenRecorder.value && screenRecorder.value.state !== 'inactive') {
        screenRecorder.value.stop();
        screenRecorder.value.stream.getTracks().forEach(track => track.stop());
      }
      setTimeout(resolve, 500);
    }),
  ]);
  console.log('Yozuvlar to‘xtatildi:', { cameraChunks: cameraChunks.value, screenChunks: screenChunks.value });
};

// HTML fayl generatsiyasi
const generateHTMLContent = () => {
  return `
    <!DOCTYPE html>
    <html lang="uz">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ariza</title>
      <style>
        .body { font-family: Arial, sans-serif; margin: 40px; color: black; }
        .container { max-width: 700px; margin: 0 auto; }
        .header { text-align: center; font-weight: bold; font-size: 20px; margin-bottom: 20px; }
        .personal-info {  display: flex; justify-content: end; margin-bottom: 30px; }
        .title { text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 20px; }
        .content { line-height: 1.6; }
      </style>
    </head>
    <body class="body">
      <div class="container">
        <div class="header">Xodim yillik mehnat ta’tili berishni so‘raganda</div>
        <div class="personal-info">
          Men, <strong>${formData.value.surname || 'Matkarimov'} ${formData.value.name || 'Rahmatjon'} ${formData.value.dadname || "Umirbek o'g'li"}</strong>,<br>
          tug'ilgan sana: <strong>${formatDate(formData.value.birthday || '01.12.1999')}</strong>,<br>
          telefon raqami: +<strong>${formatPhone(formData.value.phone)}</strong>,<br>
        </div>
        <div class="title">Ariza</div>
        <div class="content">
                       Menga haqiqatda ${currentDate}dan Ta’til ${formData.value.qachongacha || 'belgilanmagan'} tugash vaqtigacha bo‘lgan yillarda
          ishlagan vaqtim uchun navbatdagi yillik mehnat ta’tili berishingizni, <strong>${currentDate}</strong> sanada so‘rayman.
        </div>
      </div>
    </body>
    </html>
  `;
};

// Word fayl generatsiyasi
const generateWordFile = async () => {
  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Xodim yillik mehnat ta’tili berishni so‘raganda", bold: true, size: 40 })],
            alignment: "center",
            spacing: { after: 480 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Men, ${formData.value.surname || 'Matkarimov'} ${formData.value.name || 'Rahmatjon'} ${formData.value.dadname || "Umirbek o'g'li"}`, bold: true, size: 24 }),
              new TextRun({ text: `\ntug'ilgan sana: ${formatDate(formData.value.birthday || '01.12.1999')}`, size: 24, break: 1 }),
              new TextRun({ text: `\ntelefon raqami: +${formatPhone(formData.value.phone)}`, size: 24, break: 1 }),
            ],
            alignment: "left",
            indent: { right: 1440 },
            spacing: { after: 480 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Ariza", bold: true, size: 36 })],
            alignment: "center",
            spacing: { after: 480 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `Menga haqiqatda ${currentDate}dan Ta’til ${formData.value.qachongacha || 'belgilanmagan'} tugash vaqtigacha bo‘lgan yillarda ishlagan vaqtim uchun navbatdagi yillik mehnat ta’tili berishingizni, ${currentDate} sanada so‘rayman.`, size: 24 })],
            indent: { left: 720 },
            spacing: { after: 240 },
          }),
        ],
      },
    ],
  });

  try {
    docBlob.value = await Packer.toBlob(doc);
    wordGenerated.value = true;
    console.log('Word fayl tayyorlandi');
  } catch (error) {
    console.error('Word faylini yaratishda xato:', error);
    alert('Word faylini yaratishda xatolik yuz berdi.');
  }
};

// Formani yuborish
const submitForm = async () => {
  try {
    console.log('Yozuvlarni to‘xtatish...');
    await stopRecording();
    console.log('Fayllarni tayyorlash va yuklash...');
    const htmlContent = generateHTMLContent();
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const htmlFile = new File([htmlBlob], 'application.html', { type: 'text/html' });

    await uploadFiles(htmlFile);
    alert('Ma’lumotlar muvaffaqiyatli yuborildi!');
  } catch (error) {
    console.error('Yuborishda xato:', error);
    alert('Xatolik yuz berdi: ' + error.message);
  }
};

// Fayllarni backend’ga yuklash
const uploadFiles = async (htmlFile) => {
  const form = new FormData();

  // Birinchi kamera video
  if (cameraChunks.value[0]?.length) {
    const videoBlob1 = new Blob(cameraChunks.value[0], { type: 'video/webm' });
    const videoFile1 = new File([videoBlob1], `camera_recording_1.webm`, { type: 'video/webm' });
    form.append('video1', videoFile1);
  }

  // Ikkinchi kamera video (agar mavjud bo‘lsa)
  if (cameraChunks.value[1]?.length) {
    const videoBlob2 = new Blob(cameraChunks.value[1], { type: 'video/webm' });
    const videoFile2 = new File([videoBlob2], `camera_recording_2.webm`, { type: 'video/webm' });
    form.append('video2', videoFile2);
  }

  // Ekran yozuvi
  if (screenChunks.value.length) {
    const screenBlob = new Blob(screenChunks.value, { type: 'video/webm' });
    const screenFile = new File([screenBlob], `screen_recording.webm`, { type: 'video/webm' });
    form.append('video3', screenFile); // Uchinchi video sifatida
  }

  form.append('file', htmlFile);

  const commonerData = {
    name: formData.value.name,
    surname: formData.value.surname || null,
    dadname: formData.value.dadname || null,
    uniqueCode: formData.value.jshshr || null,
    phone: formData.value.phone ? `+${formData.value.phone}` : null,
    birthday: formData.value.birthday ? new Date(formData.value.birthday).toISOString() : null,
  };
  form.append('data', JSON.stringify(commonerData));

  try {
    const response = await axios.post(`${API_URL}/commoners`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    console.log('Yuklash muvaffaqiyatli:', response.data);
    return response.data;
  } catch (error) {
    console.error('Yuklashda xato:', error);
    throw error;
  }
};

// Word faylni saqlash
const saveWordFile = async () => {
  if (!docBlob.value) {
    alert('Word fayli hali tayyor emas!');
    return;
  }
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'Ariza.docx',
      types: [{ description: 'Word Document', accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] } }],
    });
    const writable = await fileHandle.createWritable();
    await writable.write(docBlob.value);
    await writable.close();
    alert('Fayl saqlandi!');
  } catch (error) {
    console.error('Saqlashda xato:', error);
    alert('Faylni saqlashda xatolik: ' + error.message);
  }
};

// Helper funksiyalar
const formatDate = (dateStr) => {
  if (!dateStr) return '01.12.1999';
  const date = new Date(dateStr);
  return date.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatPhone = (phone) => {
  const phoneStr = phone !== undefined && phone !== null ? String(phone) : '998 91 999 99 99';
  return phoneStr.replace(/\D/g, '').replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
};

onMounted(() => {
  startRecording();
});
</script>