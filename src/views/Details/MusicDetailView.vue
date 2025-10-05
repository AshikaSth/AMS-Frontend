<script setup>
import { useMusics } from "@/components/composables/musicFetch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ref, computed, onMounted } from "vue";
import { BASE_URL } from "@/api/base_api"; 

const { oneMusic, fetchOneMusic } = useMusics();

// Player states
const audio = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

// --- Computed ---
const progressPercent = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0
);

// --- Methods ---
function togglePlayPause() {
  if (!audio.value) return;
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value;
}

function onTimeUpdate() {
  currentTime.value = audio.value.currentTime;
  duration.value = audio.value.duration || 0;
}

function onEnded() {
  isPlaying.value = false;
  currentTime.value = 0;
}

function seek(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const seekTime = (clickX / rect.width) * duration.value;
  audio.value.currentTime = seekTime;
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function prevTrack() {
  if (audio.value) audio.value.currentTime = 0;
}
function nextTrack() {
  if (audio.value) audio.value.currentTime = duration.value;
}

onMounted(() => {
  fetchOneMusic();
});
</script>

<style scoped>
.player-card {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.1));
}
</style>

<template>
  <div class="relative flex items-center justify-center min-h-screen p-4 bg-gray-900">

<button
  @click="$router.go(-1)"
  class="absolute top-8 left-8 text-white/90 font-medium text-sm transition-colors hover:text-white hover:underline z-10 flex items-center gap-1"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
  Back
</button>


    <!-- Music Player Card -->
    <div
      id="player-card"
      class="player-card w-full max-w-xl bg-gray-800 text-white rounded-2xl overflow-hidden p-8 shadow-2xl"
    >
      <!-- Album Art and Details -->
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-64 h-64 rounded-xl overflow-hidden mb-6 shadow-xl transform transition duration-300 ease-in-out hover:scale-[1.01] bg-gray-700 flex items-center justify-center"
        >
          <Avatar class="w-full h-full">
            <AvatarImage
              v-if="oneMusic?.cover_art_url"
              :src="`${BASE_URL}${oneMusic.cover_art_url}`"
              alt="Music Cover"
              class="object-cover w-full h-full"
            />
            <AvatarFallback>{{ oneMusic?.title[0] }}</AvatarFallback>
          </Avatar>
        </div>
        <div class="text-center min-w-0">
          <div class="text-3xl font-extrabold truncate text-gray-100 mb-1">
            {{ oneMusic?.title || "Unknown Title" }}
          </div>
          <div
            v-for="(name, i) in oneMusic?.artist_names"
            :key="i"
            class="text-lg text-indigo-400 font-medium truncate"
          >
            {{ name }}{{ i < oneMusic.artist_names.length - 1 ? "," : "" }}
          </div>
          <span v-if="!oneMusic?.artist_names?.length">N/A</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="space-y-3 mb-8">
        <div
          @click="seek"
          class="progress-bar-container w-full h-2 bg-gray-600 rounded-full cursor-pointer"
        >
          <div
            class="bg-indigo-500 rounded-full h-2 transition-all duration-100 ease-linear"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>

        <div class="flex justify-between text-sm font-mono text-gray-400">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex justify-between items-center">
        <!-- Shuffle -->
        <button
          class="text-gray-400 hover:text-indigo-400 p-2 rounded-full hover:bg-gray-700"
        >
          <i class="fas fa-random"></i>
        </button>

        <div class="flex items-center space-x-6">
          <button
            @click="prevTrack"
            class="text-indigo-300 hover:text-indigo-200 transform hover:scale-110"
          >
            ⏮
          </button>

          <button
            @click="togglePlayPause"
            class="bg-indigo-600 text-white p-5 rounded-full shadow-lg hover:bg-indigo-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <span v-if="!isPlaying">▶</span>
            <span v-else>⏸</span>
          </button>

          <button
            @click="nextTrack"
            class="text-indigo-300 hover:text-indigo-200 transform hover:scale-110"
          >
            ⏭
          </button>
        </div>

        <button
          class="text-gray-400 hover:text-indigo-400 p-2 rounded-full hover:bg-gray-700"
        >
          ⋮
        </button>
      </div>

      <!-- Audio Element -->
      <audio
        ref="audio"
        :src="oneMusic?.audio_file_url ? `${BASE_URL}${oneMusic.audio_file_url}` : ''"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
      ></audio>
    </div>
  </div>
</template>
