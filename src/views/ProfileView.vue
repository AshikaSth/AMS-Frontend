<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { api } from '@/api/base_api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RouterLink } from 'vue-router'
import { Play, Pause, Music4, Disc3, Edit, Upload, Star, Router } from 'lucide-vue-next'
import { useAlbums } from '@/components/composables/albumFetch'
import { useMusics } from '@/components/composables/musicFetch'
import { useProfile } from '@/components/composables/profileFetch'
import CreateArtiist from '@/components/CreateArtist.vue'
import { BASE_URL } from '@/api/base_api'
const toast = useToast()
const showDialog = ref(false)
const currentPlaying = ref(null)
const audio = ref(new Audio())
const artists = ref([])
const artistToEdit = ref(null)

// Music play/pause logic
const playMusic = (music) => {
  if (currentPlaying.value?.id === music.id) {
    audio.value.pause()
    currentPlaying.value = null
  } else {
    if (audio.value.src) audio.value.pause()
    audio.value = new Audio(`${BASE_URL}${music.audio_file_url}`)
    audio.value.play()
    currentPlaying.value = music
  }
}

const openEditDialog = () => {
  showDialog.value = true
}

const { albums, fetchAlbums } = useAlbums();
const { musics,  fetchMusics } = useMusics();
const { userprofile, fetchProfile } = useProfile()
onMounted(() => {
  fetchProfile(),
  fetchAlbums(),
  fetchMusics()

})

</script>

<template>
  <div class="bg-gray-100 p-6">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Profile</h1>
      <RouterLink to="/profile/edit">
        <Button variant="outline" class="flex items-center gap-2 text-indigo-600 border-indigo-400 hover:bg-indigo-50" @click="openEditDialog">
          <Edit class="h-4 w-4" /> Edit Profile
        </Button>
      </RouterLink>
    </div>

    <!-- Profile Card -->
    <Card class="p-6 mb-12 shadow-md bg-white rounded-xl border border-gray-200">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Avatar -->
        <Avatar class="w-32 h-32 rounded-full ring-2 ring-indigo-300 flex-shrink-0">
          <AvatarImage v-if="userprofile.artist?.photo_url" :src="`${BASE_URL}${userprofile.artist.photo_url}`" alt="Profile" />
          <AvatarFallback class="bg-indigo-500 text-white text-3xl font-bold w-full h-full rounded-lg flex items-center justify-center">
            {{ userprofile.first_name?.charAt(0) || '' }}
          </AvatarFallback>
        </Avatar>

        <!-- Profile Details -->
        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p class="text-sm text-gray-600"><span class="font-semibold">ID:</span> {{ userprofile.id || 'N/A' }}</p>
          <p class="text-sm text-gray-600"><span class="font-semibold">Name:</span> {{ userprofile.first_name }} {{ userprofile.last_name }}</p>
          <p class="text-sm text-gray-600"><span class="font-semibold">Email:</span> {{ userprofile.email || 'N/A' }}</p>
          <p class="text-sm text-gray-600"><span class="font-semibold">Role:</span> {{ userprofile.role || 'N/A' }}</p>
          <p class="text-sm text-gray-600"><span class="font-semibold">Gender:</span> {{ userprofile.gender || 'N/A' }}</p>
          <p class="text-sm text-gray-600"><span class="font-semibold">Phone:</span> {{ userprofile.phone_number || 'N/A' }}</p>
          <p class="text-sm text-gray-600"><span class="font-semibold">Address:</span> {{ userprofile.address || 'N/A' }}</p>
          <p class="text-sm text-gray-600"><span class="font-semibold">DOB:</span> {{ userprofile.dob || 'N/A' }}</p>
        </div>
      </div>
    </Card>

    <!-- Artist-Specific Info -->
    <div v-if="userprofile.role === 'artist' && userprofile.artist" class="space-y-12">
      <!-- Bio & Genres -->
      <Card class="p-6 shadow-md bg-white rounded-xl border border-gray-200">
        <CardHeader>
          <CardTitle class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Star class="h-5 w-5 text-yellow-500" /> About Artist
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <p class="text-sm text-gray-600"><span class="font-semibold">Bio:</span> {{ userprofile.artist.bio || 'N/A' }}</p>
          <p class="text-sm text-gray-600">
            <span class="font-semibold">Genres:</span>
            <span
              v-for="genre in userprofile.artist.genres"
              :key="genre.id"
              class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded mr-2"
            >
              {{ genre.name.charAt(0).toUpperCase() + genre.name.slice(1) }}

            </span>
            <span v-if="!userprofile.artist.genres?.length" class="text-gray-500">N/A</span>
          </p>
          <p v-if="userprofile.artist.website" class="text-sm text-gray-600">
            <span class="font-semibold">Website:</span>
            <a :href="userprofile.artist.website" class="text-indigo-600 hover:underline" target="_blank">{{ userprofile.artist.website }}</a>
          </p>
          <p v-if="userprofile.artist.social_media_links" class="text-sm text-gray-600">
            <span class="font-semibold">Social Media:</span>
            <span v-if="userprofile.artist.social_media_links.linkedin">
              <a :href="userprofile.artist.social_media_links.linkedin" class="text-indigo-600 hover:underline" target="_blank">LinkedIn</a>
            </span>
            <span v-if="userprofile.artist.social_media_links.instagram">,
              <a :href="userprofile.artist.social_media_links.instagram" class="text-indigo-600 hover:underline" target="_blank">Instagram</a>
            </span>
          </p>
          <p class="text-sm text-gray-600"><span class="font-semibold">First Release Year:</span> {{ userprofile.artist.first_release_year || 'N/A' }}</p>
          <p class="text-sm text-gray-600"><span class="font-semibold">Albums Released:</span> {{ userprofile.artist.no_of_albums_released || '0' }}</p>
        </CardContent>
      </Card>

      <!-- All Albums -->
      <Card class="p-6 shadow-md bg-white rounded-xl border border-gray-200">
        <CardHeader>
          <CardTitle class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Disc3 class="h-5 w-5 text-teal-600" /> All Albums ({{ albums?.length || 0 }})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="album in albums"
              :key="album.id"
              class="border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
            >
            <RouterLink :to="{ name: 'AlbumDetail', params: { id: album.id } }">
              <Avatar class="w-full h-40 rounded-t-lg">
                <AvatarImage v-if="album.cover_art_url" :src="`${BASE_URL}${album.cover_art_url}`" alt="Album Cover" class="object-cover w-full h-full" />
                <AvatarFallback class="bg-teal-600 text-white text-2xl font-bold flex items-center justify-center w-full h-full rounded-lg">
                  {{ album.name[0] }}
                </AvatarFallback>
              </Avatar>
              </RouterLink>

              <div class="p-4">
                <h3 class="font-bold text-lg text-gray-900 truncate">{{ album.name }}</h3>
                <p class="text-sm text-gray-500">Released: {{ album.release_date || 'N/A' }}</p>
                <p class="text-sm text-gray-600 truncate">By: {{ album.artist_names?.join(', ') || 'Various' }}</p>
              </div>
            </div>
            <p v-if="!albums?.length" class="text-sm text-gray-500 text-center">No albums available</p>
          </div>
        </CardContent>
      </Card>

      <!-- All Music -->
      <Card class="p-6 shadow-md bg-white rounded-xl border border-gray-200">
        <CardHeader>
          <CardTitle class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Music4 class="h-5 w-5 text-pink-600" /> All Music ({{ musics?.length || 0 }})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="(music, index) in musics"
              :key="music.id"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
            >
            <RouterLink :to="{ name: 'MusicDetail', params: { id: music.id } }" class="flex items-center space-x-4 min-w-0 flex-1">
              <div class="flex items-center space-x-4 min-w-0 flex-1">
                <span class="text-sm font-medium text-gray-400 w-4 flex-shrink-0">{{ index + 1 }}</span>
                <Avatar class="w-10 h-10 rounded-lg shadow-sm bg-pink-100 text-pink-700 text-sm font-bold">
                  <AvatarImage v-if="music.cover_art_url" :src="`${BASE_URL}${music.cover_art_url}`" alt="Music Cover" />
                  <AvatarFallback class="bg-indigo-500 text-white text-3xl font-bold w-full h-full rounded-lg flex items-center justify-center">{{ music.title[0] }}</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <p class="font-semibold text-gray-900 truncate">{{ music.title }}</p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ music.artist_names?.join(', ') || 'N/A' }} - <span class="text-xs text-gray-400">{{ music.album?.name || 'N/A' }}</span>
                  </p>
                </div>
              </div>
              </RouterLink>
              <div class="flex items-center space-x-4 flex-shrink-0">
                <button
                  class="p-2 rounded-full"
                  :class="currentPlaying?.id === music.id ?  'text-red-500 hover:bg-red-100' : 'text-gray-500 hover:bg-gray-200'"
                  @click="playMusic(music)"
                >
                  <component :is="currentPlaying?.id === music.id ? Pause : Play" class="h-4 w-4" />
                </button>
              </div>
            </div>
            <p v-if="!musics?.length" class="text-sm text-gray-500 text-center">No music available</p>
          </div>
        </CardContent>
      </Card>

      <!-- Manager -->
      <Card class="p-6 shadow-md bg-white rounded-xl border border-gray-200">
        <CardHeader>
          <CardTitle class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Star class="h-5 w-5 text-yellow-500" /> Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-600"><span class="font-semibold">Name:</span> {{ userprofile.artist.manager?.userprofile.first_name }} {{ userprofile.artist.manager?.userprofile.last_name   || 'N/A' }} </p>
          <p class="text-sm text-gray-600"><span class="font-semibold">Email:</span> {{ userprofile.artist.manager?.email || 'N/A' }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}

.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease-in-out;
}

.card:hover {
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
  transform: translateY(-2px);
}
</style>
