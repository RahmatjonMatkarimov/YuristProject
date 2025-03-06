<template>
    <div class="min-h-screen bg-gray-50 flex justify-center flex-col items-center p-6">
        <!-- Fayllar uchun HTML matnlari -->
        <div v-if="filesHtml.length < 1" v-for="(html, index) in filesHtml" :key="index" v-html="html"
            class="custom-html max-w-none bg-white p-4 shadow-lg rounded-lg"></div>

        <div v-if="filesHtml.length > 1">
            <ul v-for="(item, index) in files" class="bg-gray-200 w-[1000px] py-4 px-8 rounded-lg">
                <li>
                    <a :href="URL1 + item" class="text-black block text-[20px] bg-white px-4 py-2 rounded-lg">
                        <b class="text-black text-[22px] mr-2">{{ index + 1 }}</b>Fileni ko‘rish
                    </a>
                    <button @click="downloadAsPdf(index)" class="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
                        PDF sifatida yuklab olish
                    </button>
                </li>
            </ul>
        </div>

        <!-- Videolar ro'yxati -->
        <div v-if="data && data.videos.length" class="flex justify-center flex-wrap gap-6 mt-6">
            <div v-for="item in data.videos" :key="item.id"
                class="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
                <video controls :src="URL1 + item.url" class="w-full h-64 object-cover" v-if="item.url"></video>
                <div v-else class="p-4 text-center text-gray-500">Videolar mavjud emas.</div>
                <div class="p-4 text-center">
                    <p class="text-gray-700 font-bold text-lg">Video #{{ item.id }}</p>
                </div>
            </div>
        </div>

        <!-- Videolar yo'qligi haqida xabar -->
        <div v-else class="text-center text-white mt-6 text-lg font-semibold">Hech qanday video mavjud emas.</div>
    </div>
</template>

<script setup>
import { URL1 } from '@/auth/url';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { jsPDF } from 'jspdf';

const API_URL = URL1;
const data = ref({ videos: [] });
const files = ref([]);
const filesHtml = ref([]);
const route = useRoute();
const id = ref(route.params.id);
const list = ref([]);

// HTML matnini olish funksiyasi
async function gethtml(url) {
    try {
        const response = await axios.get(url);
        console.log('Fetched HTML:', response.data); // Debugging uchun
        return `<div class='p-4 bg-white shadow-md rounded-lg'>${response.data}</div>`;
    } catch (error) {
        console.error('HTML olishda xato:', error);
        return '<div>HTML yuklashda xato yuz berdi</div>'; // Fallback content
    }
}

// Fayllarning HTML matnlarini yuklash
async function loadFilesHtml() {
    try {
        const htmlPromises = files.value.map(async (file) => gethtml(URL1 + file));
        filesHtml.value = await Promise.all(htmlPromises);
        console.log('Loaded filesHtml:', filesHtml.value); // Debugging uchun
    } catch (error) {
        console.error('Fayllar HTML matnini yuklashda xato:', error);
    }
}

// Ma'lumotlarni olish
async function getdata() {
    try {
        const response = await axios.get(`${API_URL}/commoners/${id.value}`);
        data.value = response.data;
        files.value = response.data.file || [];
        console.log('API Response:', response.data); // Debugging uchun
        list.value = [new Date(response.data.createdAt).toLocaleString()];
    } catch (error) {
        console.error('Ma\'lumot olishda xato:', error);
    }
}

// HTMLdan matn va stilni ajratib olish funksiyasi
function parseHtmlToTextWithStyles(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // <style> va <script> teglarini olib tashlaymiz
    const styles = tempDiv.getElementsByTagName('style');
    const scripts = tempDiv.getElementsByTagName('script');
    while (styles.length > 0) styles[0].parentNode.removeChild(styles[0]);
    while (scripts.length > 0) scripts[0].parentNode.removeChild(scripts[0]);

    const result = [];
    
    function processNode(node, isBold = false, isItalic = false) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text) {
                result.push({ text, bold: isBold, italic: isItalic });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const newBold = isBold || node.tagName === 'B' || node.tagName === 'STRONG';
            const newItalic = isItalic || node.tagName === 'I' || node.tagName === 'EM';
            node.childNodes.forEach(child => processNode(child, newBold, newItalic));
        }
    }

    tempDiv.childNodes.forEach(node => processNode(node));
    return result.length > 0 ? result : [{ text: 'Matn topilmadi', bold: false, italic: false }];
}

// HTML contentni PDF sifatida yuklab olish funksiyasi
function downloadAsPdf(index) {
    const htmlContent = filesHtml.value[index];
    console.log('HTML to convert:', htmlContent); // Debugging uchun

    if (!htmlContent || htmlContent.trim() === '') {
        alert('Yuklab olish uchun matn mavjud emas!');
        return;
    }

    // HTMLdan matn va stilni ajratib olamiz
    const textWithStyles = parseHtmlToTextWithStyles(htmlContent);
    console.log('Parsed Text with Styles:', textWithStyles); // Debugging uchun

    // jsPDF obyektini yaratamiz
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
    });

    // Matnni PDFga qo'shamiz
    let yPosition = 0.5; // Boshlang‘ich Y pozitsiyasi
    doc.setFontSize(12);

    textWithStyles.forEach(({ text, bold, italic }) => {
        // Font stilini sozlaymiz
        doc.setFont('helvetica', italic ? 'italic' : 'normal', bold ? 'bold' : 'normal');
        
        // Matnni qo‘shamiz (satr bo‘yicha avtomatik ko‘chirish)
        const lines = doc.splitTextToSize(text, 7.5); // Maksimal kenglik 7.5 dyuym
        doc.text(lines, 0.5, yPosition);
        yPosition += lines.length * 0.2; // Har bir satr uchun Y pozitsiyasini yangilaymiz (0.2 dyuym)
        
        // Agar sahifa tugasa, yangi sahifa qo‘shamiz
        if (yPosition > 10) {
            doc.addPage();
            yPosition = 0.5;
        }
    });

    // PDFni saqlaymiz
    doc.save(`file_${index + 1}.pdf`);
}

// Komponent yuklanganda ma'lumotlarni va HTML matnlarni yuklash
onMounted(() => {
    getdata().then(() => loadFilesHtml());
});
</script>

<style scoped>
.custom-html >>> * {
    color: black !important;
}
</style>