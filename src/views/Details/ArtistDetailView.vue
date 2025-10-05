<script setup>
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { BASE_URL } from '@/api/base_api'
import { onMounted } from 'vue'
import { useArtists } from '@/components/composables/artistFetch'

const { oneArtist, fetchOneArtist } = useArtists()

onMounted(() => {
  fetchOneArtist()
})
</script>

<template>
  <div class="relative bg-gray-900 text-white min-h-screen">
    <!-- Back Button -->
    <button
      @click="$router.go(-1)"
      class="absolute top-6 left-6 flex items-center gap-1 text-white font-medium text-sm bg-black/50 hover:bg-black/70 backdrop-blur-sm px-3 py-2 rounded-full z-50 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back
    </button>

    <!-- Artist Header -->
    <div v-if="oneArtist" class="pt-16 px-8 bg-gradient-to-b from-orange-900 to-gray-900 min-h-[300px] flex items-center">
      <div class="relative w-1/3">
        <Avatar class="w-48 h-48">
          <AvatarImage
            v-if="oneArtist.photo_url"
            :src="`${BASE_URL}${oneArtist.photo_url}`"
            alt="Artist Photo"
            class="object-cover"
          />
          <AvatarFallback class="bg-teal-600 text-white text-4xl font-bold flex items-center justify-center">
            {{ oneArtist.name[0] }}
          </AvatarFallback>
        </Avatar>
        <span class="absolute top-2 left-2 bg-blue-500 text-xs font-medium px-2 py-1 rounded-full">Verified Artist</span>
      </div>
      <div class="ml-8">
        <h1 class="text-6xl font-bold text-white mb-2">{{ oneArtist.name }}</h1>
        <p class="text-gray-400 text-lg">{{ oneArtist.monthly_listeners?.toLocaleString() || '0' }} monthly listeners</p>
      </div>
    </div>

    <!-- Artist Content (e.g., Albums, Top Tracks) -->
    <div class="px-8 py-6">
      <h2 class="text-2xl font-semibold mb-4">Top Albums</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="album in oneArtist.albums" :key="album.id" class="bg-gray-800 p-4 rounded-lg">
          <img :src="`${BASE_URL}${album.cover_art_url}`" alt="Album Cover" class="w-full h-32 object-cover rounded-md mb-2" />
          <p class="text-sm font-medium">{{ album.name }}</p>
          <p class="text-xs text-gray-400">{{ album.release_date }}</p>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
/* Custom styles to match the ornate background */
.bg-gradient-to-b {
  background: linear-gradient(to bottom, #f4a261, #1a1a1a);
}
</style>