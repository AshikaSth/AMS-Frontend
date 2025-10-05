<script setup>
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useAlbums } from '@/components/composables/albumFetch'
import { useUsers } from '@/components/composables/userFetch'
import { useArtists } from '@/components/composables/artistsFetch'
import { useMusics } from '@/components/composables/musicFetch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Separator from '@/components/ui/separator/Separator.vue'
import { ref, onMounted, computed } from 'vue'
import { Menu, ChevronLeft, ChevronRight, Home, Users, Mic, Disc, Music, LogOut, Zap, Music4, Disc3, Play, Pause, Headset, MoreVertical, Upload, Activity, ListMusic } from 'lucide-vue-next'
import { BASE_URL } from '@/api/base_api'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { allAlbums, albumcount, allAlbumCount, fetchAlbums, fetchAllAlbums } = useAlbums()
const { usersCount, managersCount, unassignedArtistsCount, users, managers, unassignedArtists, fetchUsers, fetchUnassignedArtists } =
  useUsers()
const {
  artists,
  artistsCount,
  myArtists,
  myArtistCount,
  allArtists,
  allArtistCount,
  fetchArtists,
  fetchAllArtists,
  fetchMyArtists,
} = useArtists()
const { musics, musicCount, allMusics, allMusicCount, fetchMusics, fetchAllMusics } = useMusics()

const drawerOpen = ref(true)
const currentPlaying = ref(null)
const audio = ref(new Audio())
onMounted(() => {
  fetchUsers(), 
  fetchUnassignedArtists()
  fetchAlbums(), 
  fetchAllAlbums()
  fetchArtists(),
  fetchAllArtists(),
  fetchMyArtists(),
  fetchMusics(), 
  fetchAllMusics()
})


const playMusic = (music) => {
  if (currentPlaying.value?.id === music.id) {
    audio.value.pause()
    currentPlaying.value = null
  } else {
    if (audio.value.src) audio.value.pause()
    audio.value = new Audio(music.audio_file_url)
    audio.value.play()
    currentPlaying.value = music
  }
}

const countData = computed(() => {
   if (!user?.value) return [] 
  const data = []
 if (['artist', 'artist_manager', 'super_admin'].includes(user.value.role)) {
    data.push(
      { title: 'All Artists', count: allArtistCount.value, icon: Mic, color: 'text-green-600', bg: 'bg-green-100' },
      { title: 'All Albums', count: allAlbumCount.value, icon: Disc, color: 'text-red-600', bg: 'bg-red-100' },
      { title: 'All Musics', count: allMusicCount.value, icon: Music, color: 'text-teal-600', bg: 'bg-teal-100' }
    )
  }

  if (user.value.role === 'artist_manager') {
    data.push(
      { title: 'My Artists', count: myArtistCount.value, icon: Users, color: 'text-yellow-600', bg: 'bg-yellow-100' },
      { title: 'Unassigned Artists', count: unassignedArtistsCount.value, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' }
    )
  }

  if (user.value.role === 'super_admin') {
    data.push(
      { title: 'Users', count: usersCount.value, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
      { title: 'Managers', count: managersCount.value, icon: Menu, color: 'text-purple-600', bg: 'bg-purple-100' }
    )
  }

  return data
})

</script>

<template>
   <main class="flex-1 overflow-y-auto relative bg-gray-900 text-white min-h-screen">
      <div class="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8 space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight text-white-900 sm:text-4xl">Dashboard Overview</h1>
          <p class="text-lg font-medium text-white">
            Welcome back, <span class="font-semibold text-indigo-700">{{ user.first_name }}</span>.
          </p>
        </div>

        <!-- System Metrics -->
        <section class="mb-12">
          <h2 class="text-xl font-bold mb-4 text-white">System Metrics</h2>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
            <Card v-for="item in countData" :key="item.title" class="count-card p-5">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text font-medium text-white">{{ item.title }} </CardTitle>
                <div :class="['p-2 rounded-full', item.bg, item.color]">
                  <component :is="item.icon" class="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p class="text-3xl font-extrabold text-white">{{ item.count }}</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <template v-if="user?.role === 'super_admin'"> 
        <section class="mb-12">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <Zap class="h-5 w-5 text-indigo-600" /> Key Active Users (<span>{{ users.length }}</span>)
            </h2>
            <RouterLink to="/users"> <Button variant="outline" class="flex items-center gap-1">View All</Button></RouterLink>
            
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card v-for="user in users.slice(0, 10)" :key="user.id" class="p-5 text-center flex flex-col items-center border-t-4 border-indigo-500 hover:shadow-lg transition">
              <Avatar class="w-16 h-16 ring-2 ring-indigo-300 bg-indigo-500 text-white text-xl font-bold mb-3">
                <AvatarImage v-if="user.artist?.photo_url" :src="`${BASE_URL}${user.artist.photo_url}`" alt="Profile" />
                <AvatarFallback>{{ user.first_name[0] + user.last_name[0] }}</AvatarFallback>
              </Avatar>
              <p class="text-lg font-bold text-white truncate w-full mb-1">{{ user.first_name }} {{ user.last_name }}</p>
              <p class="text-sm text-white truncate w-full capitalize mb-3">{{ user.role }}</p>
              <Button class="w-full flex items-center justify-center gap-1">
                <Eye class="h-4 w-4" /> Profile
              </Button>
            </Card>
          </div>
        </section>
        </template>

        <!-- All Artists -->
         <section class="mb-12">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <Zap class="h-5 w-5 text-indigo-600" /> All Artists (<span>{{ allArtists.length }}</span>)
            </h2>
            <RouterLink to="/artists"> <Button variant="outline" class="flex items-center gap-1 text-white bg-gray-900">View All</Button></RouterLink>
            
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card v-for="artist in allArtists.slice(0, 10)" :key="artist.id" class="p-5 text-center flex flex-col items-center border-t-4 border-indigo-500 hover:shadow-lg transition">
              <Avatar class="w-16 h-16 ring-2 ring-indigo-300 bg-indigo-500 text-white text-xl font-bold mb-3">
                <AvatarImage v-if="artist.photo_url" :src="`${BASE_URL}${artist.photo_url}`" alt="Profile" />
                <AvatarFallback>{{ artist.user.first_name[0] + artist.user.last_name[0] }}</AvatarFallback>
              </Avatar>
              <p class="text-lg font-bold text-white truncate w-full mb-1">{{ artist.user.first_name }} {{ artist.user.last_name }}</p>
              <p class="text-sm text-white truncate w-full capitalize mb-3">{{ artist.user.role }}</p>
              <Button class="w-full flex items-center justify-center gap-1">
                <Eye class="h-4 w-4" /> Profile
              </Button>
            </Card>
          </div>
        </section>

      <!-- My Artists -->
        <template v-if="user?.role === 'artist_manager'">
         <section class="mb-12">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <Zap class="h-5 w-5 text-indigo-600" /> My Artists (<span>{{ myArtists.length }}</span>)
            </h2>
            <RouterLink to="/artists"> <Button variant="outline" class="flex items-center gap-1">View All</Button></RouterLink>
            
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card v-for="artist in myArtists.slice(0, 10)" :key="artist.id" class="p-5 text-center flex flex-col items-center border-t-4 border-indigo-500 hover:shadow-lg transition">
              <Avatar class="w-16 h-16 ring-2 ring-indigo-300 bg-indigo-500 text-white text-xl font-bold mb-3">
                <AvatarImage v-if="artist.photo_url" :src="`${BASE_URL}${artist.photo_url}`" alt="Profile" />
                <AvatarFallback>{{ artist.user.first_name[0] + artist.user.last_name[0] }}</AvatarFallback>
              </Avatar>
              <p class="text-lg font-bold text-white truncate w-full mb-1">{{ artist.user.first_name }} {{ artist.user.last_name }}</p>
              <p class="text-sm text-white truncate w-full capitalize mb-3">{{ artist.user.role }}</p>
              <Button class="w-full flex items-center justify-center gap-1">
                <Eye class="h-4 w-4" /> Profile
              </Button>
            </Card>
          </div>
        </section>
        </template>

        <!-- Two-Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Music Tracks -->
          <div class="lg:col-span-7">
            <section>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <Music4 class="h-5 w-5 text-pink-600" /> Recently Added Tracks (<span>{{ allMusicCount }}</span>)
                </h2>
                <Button class="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white">
                  <Upload class="h-4 w-4" /> Upload
                </Button>
              </div>
              <Card class="p-5 space-y-3">
                <div v-for="(music, index) in allMusics" :key="music.id" class="flex items-center justify-between p-2 hover:bg-gray-500 border-b border-gray-100 last:border-b-0">
                  <div class="flex items-center space-x-4 min-w-0 flex-1">
                    <span class="text-sm font-medium text-white w-4 flex-shrink-0">{{ index + 1 }}</span>
                    <Avatar class="w-10 h-10 rounded-lg shadow-sm bg-pink-100 text-pink-700 text-sm font-bold">
                     <AvatarImage v-if="music.cover_art_url" :src="`${BASE_URL}${music.cover_art_url}`" />
                      <AvatarFallback>{{ music.title[0] }}</AvatarFallback>
                    </Avatar>
                    <div class="min-w-0">
                      <p class="font-semibold text-white truncate">{{ music.title }}</p>
                      <p class="text-xs text-white truncate">
                        {{ music.artist_names?.join(', ') || 'N/A' }} - <span class="text-xs text-white">{{ music.album?.name || 'N/A' }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4 flex-shrink-0">
                    <Button
                      class="p-2 rounded-full"
                      :class="currentPlaying?.id === music.id ? 'text-white hover:bg-red-100' : 'text-gray-900 hover:bg-gray-700'"
                      @click="playMusic(music)"
                    >
                      <component :is="currentPlaying?.id === music.id ? Pause : Play" class="h-4 w-4" />
                    </Button>
                    
                  </div>
                </div>
              </Card>
            </section>
          </div>

          <!-- Artists & Albums -->
          <div class="lg:col-span-5 space-y-8">
            <!-- Artists -->
            <section>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <Mic class="h-5 w-5 text-green-600" /> Top Artists (<span>{{ allArtistCount }}</span>)
                </h2>
                <Button variant="outline" class="flex items-center gap-1 text-green-600 border-green-400 hover:bg-green-50">
                  View All
                </Button>
              </div>
              <Card class="p-5 space-y-4">
                <div v-for="artist in allArtists.slice(0, 6)" :key="artist.id" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-700 rounded-md px-1 -mx-1">
                  <div class="flex items-center space-x-3 min-w-0">
                    <Avatar class="w-8 h-8 bg-green-500 text-white text-xs font-bold">
                      <AvatarImage v-if="artist.photo_url" :src="`${BASE_URL}${artist.photo_url}`" />
                      <AvatarFallback>{{ artist.user.first_name[0] }}</AvatarFallback>
                    </Avatar>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-white truncate">{{ artist.user.first_name }} {{ artist.user.last_name }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ artist.bio || 'N/A' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 flex-shrink-0">
                    <Activity class="h-4 w-4 text-green-400" />
                  </div>
                </div>
              </Card>
            </section>

            <!-- Albums -->
            <section>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <Disc3 class="h-5 w-5 text-teal-600" /> Recent Albums (<span>{{ allAlbumCount }}</span>)
                </h2>
                <Button variant="outline" class="flex items-center gap-1 text-teal-600 border-teal-400 hover:bg-teal-50">
                  View All
                </Button>
              </div>
              <Card class="p-5 space-y-4">
                <div v-for="album in allAlbums" :key="album.id" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-700 rounded-md px-1 -mx-1">
                  <div class="flex items-center space-x-3 min-w-0">
                    <Avatar class="w-8 h-8 rounded-md shadow-sm bg-teal-600 text-white text-xs font-bold">
                      <AvatarImage v-if="album.cover_art_url" :src="`${BASE_URL}${album.cover_art_url}`" />
                      <AvatarFallback>{{ album.name[0] }}</AvatarFallback>
                    </Avatar>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-white truncate">{{ album.name }}</p>
                      <div v-for="(name,i) in album.artist_names" :key="i">
                      <p class="text-xs text-gray-500 truncate">{{ name || 'Various' }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 flex-shrink-0">
                    <span class="text-xs text-gray-500">{{ album.musics?.length || 0 }} Tracks</span>
                    <ListMusic class="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>        
      </div>


    </main>

</template>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  background-color: #3b3f43;
}

.card {
  background-color: gray-50;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease-in-out;
}

.count-card:hover {
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
  transform: translateY(-2px);
}

a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}


</style>