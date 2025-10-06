import { computed, ref } from 'vue'
import { api } from '@/api/base_api'
import { useToast } from 'vue-toastification'

export function useUsers() {
  // Pagination state
  const pagination = ref({ current_page: 1, total_pages: 1 })

  const toast = useToast()
  const users = ref([])
  const managers = ref([])
  const unassignedArtists = ref([])
  const usersCount = ref(0) 

  const isLoading = ref(false)
  const error = ref(null)

  // 🔹 Add refs for unassigned artists loading/error to avoid errors
  const artistsLoading = ref(false)
  const artistsError = ref(null)

  const fetchUsers = async (page = 1) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('users', { params: { page, per_page: 20 } })
      console.log('Fetched users:', response.data.users.length, response.data.users)
      users.value = response.data.users
      pagination.value = response.data.meta
      if (response.data.meta && response.data.meta.total_entries !== undefined) {
        usersCount.value = response.data.meta.total_entries
      } 
      managers.value = users.value.filter(user => user.role === 'artist_manager')
    } catch (err) {
      error.value = err
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchUnassignedArtists = async () => {
    artistsLoading.value = true
    artistsError.value = null
    try {
      const response = await api.get('users/unassigned_artists')
      console.log('Unassigned Artists:', response.data)
      unassignedArtists.value = response.data
    } catch (err) {
      artistsError.value = err
      console.error(err)
    } finally {
      artistsLoading.value = false
    }
  }

  const managersCount = computed(() => managers.value.length)
  const unassignedArtistsCount = computed(() => unassignedArtists.value.length)

  return {
    users,
    usersCount,
    managersCount,
    unassignedArtistsCount,
    managers,
    unassignedArtists,
    isLoading,
    error,
    fetchUsers,
    fetchUnassignedArtists
  }
}
