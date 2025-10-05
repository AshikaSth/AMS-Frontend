import { computed, ref } from 'vue'
import { api } from '@/api/base_api'
import { useToast } from 'vue-toastification'

export function useProfile() {

    const userprofile = ref([])

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('profile', { params: { t: Date.now() } })
            userprofile.value = data
        } catch (err) {
            toast.error('Failed to fetch profile')
            console.error('Error fetching profile:', err.response ? err.response.data : err)
        }
    }

    return {
    userprofile,
    fetchProfile
  }
}
