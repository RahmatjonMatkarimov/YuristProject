<template>
  <div>
    <form @submit.prevent="uploadCourt" ref="form">
      <div>
        <input
            v-model="courtName"
            class="text-black w-full outline-none p-3 mt-9 rounded-[15px]"
            type="text"
            id="name"
            required
        />
      </div>
      <div>
        <input
            ref="fileInput"
            @change="onFileChange"
            type="file"
            id="file"
            accept="image/*"
            required
        />
      </div>
      <button
          class="w-full rounded-[30px] bg-lime-600 hover:bg-lime-900 text-[20px] py-2"
          type="submit"
      >
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
    const route = useRoute(); // Fixed typo: useRoute not router
    const form = ref(null);
    const fileInput = ref(null);

    const onFileChange = (event) => {
      file.value = event.target.files[0];
    };

    const id = route.params.id;

    const uploadCourt = async () => {
      const formData = new FormData();
      formData.append("name", courtName.value);
      formData.append("file", file.value); // Matches backend FileInterceptor
      formData.append("courtsId", id);

      try {
        await axios.post(`${URL}/services`, formData, { // Fixed endpoint name
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        successMessage.value = "Service muvaffaqiyatli yuklandi!";
        errorMessage.value = "";
        courtName.value = "";
        file.value = null;
        window.location.reload()
        if (fileInput.value) fileInput.value.value = ""; // Reset file input
      } catch (error) {
        errorMessage.value = "Yuklashda xato yuz berdi: " + (error.response?.data?.message || error.message);
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
      form,
      fileInput,
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