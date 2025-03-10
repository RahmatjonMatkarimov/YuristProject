<template>
  <div>
    <form @submit.prevent="uploadCourt">
      <div>
        <input v-model="courtName" class="text-black w-full outline-none p-3 mt-9 rounded-[15px]" type="text" id="name"
          placeholder="Court Name" required />
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
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { URL } from "../../../auth/url.js";

export default {
  setup() {
    const courtName = ref("");
    const file = ref(null);
    const successMessage = ref("");
    const errorMessage = ref("");
    const route = useRoute();

    const onFileChange = (event) => {
      file.value = event.target.files[0];
      console.log("Selected file:", file.value); // Debug: Log selected file
    };

    const id = parseInt(route.params.id);

    const uploadCourt = async () => {


      // Validation
      if (!courtName.value || !file.value) {
        errorMessage.value = "Iltimos, barcha maydonlarni to‘ldiring!";
        successMessage.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("name", courtName.value);
      formData.append("file", file.value);
      formData.append("courtsId", id);

      // Debug: Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      try {
        const response = await axios.post(`${URL}/services`, {
          body: {
            "name": courtName.value,
            "img": "asdasd",
            "courtsId": id,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Server response:", response.data); // Debug: Log success response
        successMessage.value = "Service muvaffaqiyatli yuklandi!";
        errorMessage.value = "";
        courtName.value = "";
        file.value = null;
        document.getElementById("file").value = ""; // Reset file input
      } catch (error) {
        // Improved error handling
        const errorMsg = error.response?.data?.message || "Yuklashda xato yuz berdi!";
        console.error("Error:", errorMsg, error.response?.data || error.message);
        errorMessage.value = errorMsg;
        successMessage.value = "";
      }
    };

    return {
      courtName,
      file,
      successMessage,
      errorMessage,
      onFileChange,
      uploadCourt,
    };
  },
};
</script>

<style>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
}
</style>