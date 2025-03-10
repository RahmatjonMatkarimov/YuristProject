<template>
  <div class="flex justify-end">
    <div class="clock-container mr-2 p-[10px] flex sm:p-[15px] md:p-[20px] mt-2">
      <div>
        <b class="clock-text md:text-[25px]">{{ currentTime }}</b>
      </div>
      <div class="hidden md:block">
        <b class="clock-text md:text-[25px]">&nbsp&nbsp&nbsp-{{ currentData }}-</b>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const currentTime = ref("");
const currentData = ref("");

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};
const updateData = () => {
  const now = new Date();
  currentData.value = now
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "/");
};

onMounted(() => {
  updateTime();
  updateData();
  const interval = setInterval(updateTime, 1000);
  const interval1 = setInterval(updateData, 1000);
  onUnmounted(() => {
    clearInterval(interval);
    clearInterval(interval1);
  });
});
</script>

<style scoped>
.clock-container {
  border-radius: 10px;
  background: rgb(255, 255, 255);
  box-shadow: 0 0 50px blue;
  border: 2px solid blue;
}

.clock-text {
  color: blue;
  font-weight: bold;
  font-family: "Arial", sans-serif;
  text-align: center;
  display: inline-block;
}
</style>
