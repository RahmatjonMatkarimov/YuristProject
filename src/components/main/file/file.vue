<template>
  <div class="relative">
    <div class="fixed top-1 right-1">
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
  <div class="bg-gray-100 flex flex-col justify-center items-center p-6">
    <div class="flex h-full w-full gap-3 justify-center">
      <form @submit.prevent="submitForm" class="w-1/2">
        <div class="bg-white shadow-md rounded-lg p-6 w-full">
          <div class="mb-6" v-if="dat === 'datalotin'">
            <div class="mt-3" v-for="(placeholder, index) in placeholders" :key="index">
              <label class="text-[18px]">{{ getPlaceholderLabel(placeholder) }}:</label>
              <input v-model="inputValues[placeholder]"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="getPlaceholderLabel(placeholder)" @input="updateContent" />
            </div>
            <button type="submit"
              class="w-full text-white duration-500 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 mt-4">
              {{ $t('jonatish') }}
            </button>
          </div>
          <div class="mb-6" v-if="dat === 'datakril'">
            <div class="mt-3" v-for="(placeholder, index) in placeholders" :key="index">
              <label class="text-[18px]">{{ getPlaceholderLabel(translateText(placeholder)) }}:</label>
              <input v-model="inputValues[placeholder]"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="getPlaceholderLabel(translateText(placeholder))" @input="updateContent" />
            </div>
            <button type="submit"
              class="w-full text-white duration-500 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 mt-4">
              {{ $t('jonatish') }}
            </button>
          </div>
        </div>
      </form>
      <div v-if="showContent" class="bg-white w-[900px] h-[100vh] shadow-md rounded-lg p-6 text-gray-700 overflow-auto">
        <div v-html="animatedContent" class="custom-content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  color: black;
}

.custom-content,
.custom-content * {
  color: black !important;
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import mammoth from 'mammoth';
import { URL, URL1 } from '@/auth/url';
import { useI18n } from "vue-i18n";
import { provide } from "vue";

const route = useRoute();
const id = ref(route.params.id);
const htmlContent = ref('');
const modifiedContent = ref('');
const animatedContent = ref('');
const placeholders = ref([]);
const inputValues = ref({});
const showContent = ref(false);
const { locale } = useI18n();
const isOpen = ref(false);
const selectedFlag = ref("/uzb.png");
const selectedLabel = ref("Uz");
const dat = ref("datalotin");
provide("dat", dat);

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


const API_URL = URL;
const url = URL1;

const getPlaceholderLabel = computed(() => (placeholder) =>
  placeholder.replaceAll('{{', '').replaceAll('}}', '')
);

const updateContent = () => {
  let tempContent = htmlContent.value;
  placeholders.value.forEach((placeholder) => {
    const innerText = placeholder.replaceAll('{{', '').replaceAll('}}', '');
    tempContent = tempContent.replaceAll(
      placeholder,
      inputValues.value[placeholder] || innerText,
    );
  });
  modifiedContent.value = tempContent;
};

const fetchWordFile = async () => {
  try {
    const response = await fetch(`${API_URL}/files/${id.value}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const resData = await response.json();
    const fileResponse = await fetch(`${API_URL}${resData.filePath}`);
    if (!fileResponse.ok) throw new Error(`HTTP error! Status: ${fileResponse.status}`);

    const arrayBuffer = await fileResponse.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    htmlContent.value = result.value;
    modifiedContent.value = result.value;
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const matches = [...result.value.matchAll(placeholderRegex)];
    placeholders.value = [...new Set(matches.map((match) => match[0]))];
    placeholders.value.forEach((placeholder) => {
      inputValues.value[placeholder] = '';
    });
    updateContent();
  } catch (error) {
    console.error('Error fetching file:', error.message);
    modifiedContent.value = "<p class='text-red-500'>Faylni olishda xatolik yuz berdi!</p>";
  }
};

const formData = ref({
  phone: '',
  birthday: '',
  uniqueCode: '',
  userCode: '',
  surname: '',
  name: '',
  dadname: '',
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

const startRecording = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');

    if (!videoDevices.length) {
      console.warn('No cameras available');
      return;
    }

    for (const [index, device] of videoDevices.entries()) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: device.deviceId },
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) =>
          recordingState.value.cameraChunks[index].push(e.data);
        recorder.onstop = () => console.log(`Camera ${index + 1} stopped`);
        recorder.start();
        recordingState.value.cameraRecorders[index] = recorder;
        recordingState.value.cameraChunks[index] = [];
      } catch (err) {
        console.warn(`Camera ${index + 1} failed: ${err.message}`);
      }
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const recorder = new MediaRecorder(screenStream);
      recorder.ondataavailable = (e) =>
        recordingState.value.screenChunks.push(e.data);
      recorder.onstop = () => console.log('Screen recording stopped');
      recorder.start();
      recordingState.value.screenRecorder = recorder;
    } catch (err) {
      console.warn(`Screen recording failed: ${err.message}`);
    }
  } catch (error) {
    console.error('Recording error:', error);
    alert('Recording failed. Please check camera and screen permissions.');
  }
};

const stopRecording = async () => {
  const stopPromises = recordingState.value.cameraRecorders.map((recorder, index) => {
    if (recorder && recorder.state !== 'inactive') {
      return new Promise((resolve) => {
        recorder.stop();
        recorder.stream.getTracks().forEach((track) => track.stop());
        setTimeout(resolve, 500);
      });
    }
    return Promise.resolve();
  });

  if (
    recordingState.value.screenRecorder &&
    recordingState.value.screenRecorder.state !== 'inactive'
  ) {
    stopPromises.push(
      new Promise((resolve) => {
        recordingState.value.screenRecorder.stop();
        recordingState.value.screenRecorder.stream.getTracks().forEach((track) =>
          track.stop(),
        );
        setTimeout(resolve, 500);
      }),
    );
  }

  await Promise.all(stopPromises);
};

const generateWordFile = async () => {
  const paragraphs = modifiedContent.value
    .split(/<\/p>|<br\s*\/?>/)
    .map((p) => p.replace(/<[^>]+>/g, '').trim())
    .filter((p) => p);
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
        },
        children: paragraphs.map((text) => {
          const runs = [];
          if (text.includes('<b>') || text.includes('</b>')) {
            let currentText = text;
            while (currentText.length > 0) {
              const boldStart = currentText.indexOf('<b>');
              const boldEnd = currentText.indexOf('</b>');
              if (boldStart !== -1 && boldEnd !== -1 && boldStart < boldEnd) {
                if (boldStart > 0) {
                  runs.push(new TextRun({ text: currentText.substring(0, boldStart), size: 24 }));
                }
                runs.push(
                  new TextRun({
                    text: currentText.substring(boldStart + 3, boldEnd),
                    size: 24,
                    bold: true,
                  }),
                );
                currentText = currentText.substring(boldEnd + 4);
              } else {
                runs.push(new TextRun({ text: currentText, size: 24 }));
                break;
              }
            }
          } else {
            runs.push(new TextRun({ text: text, size: 24 }));
          }
          return new Paragraph({ children: runs, spacing: { after: 240 } });
        }),
      },
    ],
  });

  try {
    wordState.value.blob = await Packer.toBlob(doc);
    wordState.value.generated = true;
    saveWordFile();
  } catch (error) {
    console.error('Error generating Word file:', error);
    alert('Failed to generate Word file.');
  }
};

const saveWordFile = async () => {
  if (!wordState.value.blob) return alert('Word file not ready!');
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'Ariza.docx',
      types: [
        {
          description: 'Word Document',
          accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
          },
        },
      ],
    });
    const writable = await fileHandle.createWritable();
    await writable.write(wordState.value.blob);
    await writable.close();
  } catch (error) {
    console.error('Save error:', error);
    alert('Error saving file: ' + error.message);
  }
};

const isFieldPlaceholder = (placeholder, fieldName) => {
  const cleanPlaceholder = placeholder
    .replaceAll('{{', '')
    .replaceAll('}}', '')
    .toLowerCase();
  switch (fieldName) {
    case 'name':
      return cleanPlaceholder.includes('name') || cleanPlaceholder.includes('ism');
    case 'surname':
      return cleanPlaceholder.includes('surname') || cleanPlaceholder.includes('familiya');
    case 'dadname':
      return (
        cleanPlaceholder.includes('dadname') ||
        cleanPlaceholder.includes('otasining') ||
        cleanPlaceholder.includes('father')
      );
    case 'phone':
      return cleanPlaceholder.includes('phone') || cleanPlaceholder.includes('telefon');
    case 'birthday':
      return (
        cleanPlaceholder.includes('birthday') ||
        cleanPlaceholder.includes('tugilgan sana')
      );
    case 'userCode':
      return cleanPlaceholder.includes('usercode') || cleanPlaceholder.includes('id karta');
    case 'uniqueCode':
      return cleanPlaceholder.includes('uniquecode') || cleanPlaceholder.includes('jshshir');
    default:
      return false;
  }
};

const typeContent = (content) => {
  let index = 0;
  animatedContent.value = '';
  const typeNextChar = () => {
    if (index < content.length) {
      animatedContent.value = content.substring(0, index + 1);
      index++;
      setTimeout(typeNextChar, 50); // Harf har 50ms da qo'shiladi
    }
  };
  typeNextChar();
};

const submitForm = async () => {
  try {
    await stopRecording();

    // Placeholderlardan formData’ni yangilash
    placeholders.value.forEach((placeholder) => {
      if (isFieldPlaceholder(placeholder, 'name')) {
        formData.value.name = inputValues.value[placeholder] || formData.value.name;
      }
      if (isFieldPlaceholder(placeholder, 'surname')) {
        formData.value.surname = inputValues.value[placeholder] || formData.value.surname;
      }
      if (isFieldPlaceholder(placeholder, 'dadname')) {
        formData.value.dadname = inputValues.value[placeholder] || formData.value.dadname;
      }
      if (isFieldPlaceholder(placeholder, 'phone')) {
        formData.value.phone = inputValues.value[placeholder] || formData.value.phone;
      }
      if (isFieldPlaceholder(placeholder, 'birthday')) {
        formData.value.birthday = inputValues.value[placeholder] || formData.value.birthday;
      }
      if (isFieldPlaceholder(placeholder, 'userCode')) {
        formData.value.userCode = inputValues.value[placeholder] || formData.value.userCode;
      }
      if (isFieldPlaceholder(placeholder, 'uniqueCode')) {
        formData.value.uniqueCode = inputValues.value[placeholder] || formData.value.uniqueCode;
      }
    });

    // Majburiy maydonlarni tekshirish
    if (!formData.value.name) throw new Error('Ism majburiy!');
    if (!formData.value.phone) throw new Error('Telefon raqami majburiy!');
    if (!formData.value.birthday) throw new Error('Tug‘ilgan sana majburiy!');

    const htmlContentGenerated = generateHTMLContent();
    const htmlFile = new File(
      [new Blob([htmlContentGenerated], { type: 'text/html' })],
      'application.html',
      { type: 'text/html' },
    );

    await uploadFiles(htmlFile);
    updateContent();
    showContent.value = true;
    typeContent(modifiedContent.value); // Harfma-harf yozish effekti
    await generateWordFile();
  } catch (error) {
    console.error('Submission error:', error.response?.data || error.message);
    alert('Xatolik yuz berdi: ' + (error.response?.data?.message || error.message));
  }
};

const uploadFiles = async (htmlFile) => {
  const form = new FormData();

  if (recordingState.value.screenChunks.length) {
    form.append(
      'video3',
      new File(
        [new Blob(recordingState.value.screenChunks, { type: 'video/webm' })],
        'screen_recording.webm',
        { type: 'video/webm' },
      ),
    );
  }

  form.append('file', htmlFile);
  form.append(
    'data',
    JSON.stringify({
      uniqueCode: formData.value.uniqueCode || '',
      userCode: formData.value.userCode || '',
      name: formData.value.name,
      surname: formData.value.surname || null,
      dadname: formData.value.dadname || null,
      phone: formData.value.phone ? `+${formData.value.phone}` : formData.value.phone,
      birthday: formData.value.birthday
        ? new Date(formData.value.birthday).toISOString()
        : formData.value.birthday,
    }),
  );

  try {
    const response = await axios.post(`${url}/commoners`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Axios error:', error.response?.data);
    throw error;
  }
};

const generateHTMLContent = () => modifiedContent.value;

onMounted(() => {
  fetchWordFile();
  startRecording();
});
</script>