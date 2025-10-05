<script setup>
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { BASE_URL } from '@/api/base_api'
import { onMounted } from 'vue'
import { useAlbums } from '@/components/composables/albumFetch'
import { RouterLink } from 'vue-router'
import { Router } from 'lucide-vue-next'

const { oneAlbum, fetchOneAlbum } = useAlbums()

onMounted(() => {
  fetchOneAlbum()
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

    <!-- Album Header -->
    <div v-if="oneAlbum" class="pt-16 px-8 bg-gradient-to-b from-purple-900 to-gray-900 min-h-[300px] flex items-center">
      <Avatar class="w-32 h-32 mr-6">
        <AvatarImage
          v-if="oneAlbum.cover_art_url"
          :src="`${BASE_URL}${oneAlbum.cover_art_url}`"
          alt="Album Cover"
          class="object-cover"
        />
        <AvatarFallback class="bg-teal-600 text-white text-2xl font-bold flex items-center justify-center">
          {{ oneAlbum.name[0] }}
        </AvatarFallback>
      </Avatar>
      <div>
        <p class="text-sm text-gray-400">Album</p>
        <h1 class="text-6xl font-bold text-white mb-2">{{ oneAlbum.name }}</h1>
        <p class="text-gray-400 text-sm">
          {{ oneAlbum.artist_names?.join(', ') }} &bull; {{ oneAlbum.release_date }} &bull; {{ oneAlbum.musics?.length }} songs
        </p>
      </div>
    </div>

    <!-- Track List Controls -->
    <!-- <div class="px-8 py-4 flex justify-between items-center bg-gray-800">
      <button class="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-600">
        ▶
      </button>
      <span class="text-xl cursor-pointer">...</span>
      <span class="text-sm text-gray-400">List</span>
    </div> -->

    <!-- Artist Info -->
    <div v-if="oneAlbum" class="px-8 py-2  bg-gray-800">
      <RouterLink :to="{ name: 'ArtistDetail', params: { id: oneAlbum.artists?.[0]?.id } }" class="no-underline">
      <div class="flex items-center">
      <Avatar
        v-for="(name, i) in oneAlbum.artist_names"
        :key="i"
        class="w-10 h-10 rounded-full mr-4"
      >
        <AvatarImage
          v-if="oneAlbum.artists?.[i]?.photo_url"
          :src="`${BASE_URL}${oneAlbum.artists[i].photo_url}`"
          alt="Artist Profile"
        />
        <AvatarFallback class="bg-teal-600 text-white text-sm flex items-center justify-center">
          {{ name[0] }}
        </AvatarFallback>
      </Avatar>
      <span class="text-sm text-gray-400">
        {{ oneAlbum.artist_names?.join(', ') }}
      </span>
      </div>
      </RouterLink>
    </div>

    <!-- Track List -->
    <div class="px-8 py-4">
      <ul class="space-y-1">
        <RouterLink
          v-for="(music, index) in oneAlbum?.musics"
          :key="music.id"
          :to="{ name: 'MusicDetail', params: { id: music.id } }"
          class="block">

        <li class="flex items-center py-2 hover:bg-gray-700 rounded-md">
          <span class="text-gray-400 w-10 text-center">{{ index + 1 }}</span>
          <!-- <button class="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-4 hover:bg-green-600">
            ▶
          </button> -->
          <img
            v-if="music.cover_art_url"
            :src="`${BASE_URL}${music.cover_art_url}`"
            alt="Song Cover"
            class="w-10 h-10 mr-4 object-cover"
          />
          <div class="flex-1">
            <p class="text-sm font-medium">{{ music.title }}</p>
            <p class="text-xs text-gray-400">{{ music.artist_names?.join(', ') || 'N/A' }}</p>
          </div>
          <span class="text-sm text-gray-400 w-12 text-right">{{ music.duration || '0:00' }}</span>
        </li>
        </RouterLink>
      </ul>
    </div>
    
  </div>
</template>

<style scoped>
/* Custom styles to match Spotify gradient and layout */
.bg-gradient-to-b {
  background: linear-gradient(to bottom, #4b0082, #1a1a1a);
}
</style>