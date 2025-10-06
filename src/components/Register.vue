<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { api } from '@/api/base_api'
import { registerFormSchema } from '@/schema/registerFormSchema'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Calendar,
  MapPin,
  User,
  HomeIcon,
  LucideHome,
  Check,
  Music,
} from 'lucide-vue-next'
const router = useRouter()
const toast = useToast()
const visible = ref(false)
const errors = reactive({})
const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
  gender: '',
  address: '',
  phone_number: '',
  dob: '',
})

const handleSubmit = async () => {
  Object.keys(errors).forEach((key) => delete errors[key])

  const result = registerFormSchema.safeParse(form)
  console.log('Zod result:', result)

  if (!result.success) {
    result.error.issues.forEach((err) => {
    const fieldPath = err.path.join(".") 
    errors[fieldPath] = err.message
    console.log(result.error.format());
    })
    console.log('Validation errors:', { ...errors })
    toast.error('Please fix the validation errors.')
    return
  }

  try {
    const response = await api.post('register', { user: form })
    console.log('Register successful', response.data)
    toast.success('Registration successful!')
    router.push('/login')
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.keys(errors).forEach((key) => (errors[key] = ''))
      error.response.data.errors.forEach((err) => {
        const field = err.field.includes('.') ? err.field.split('.')[1] : err.field
        errors[field] = err.message
      })
      toast.error('Please fix the highlighted errors.')
    } else {
      toast.error('Registration failed. Please try again.')
    }
  }
}
</script>

<!-- <template>
  <div class="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
    <RouterLink to="/"
        class="absolute top-8 left-8 text-white/90 font-medium text-sm transition-colors hover:text-white hover:underline z-10 flex items-center gap-1"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <HomeIcon/>
    </RouterLink>
    <Card class="w-full max-w-md shadow-lg  bg-gray-50 " >
      <CardHeader class="text-center">
        <CardTitle class="text-2xl text-indigo-700">Create an account</CardTitle>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">First Name</label>
          <div class="relative">
            <Input
              v-model="form.first_name"
              placeholder="First Name"
              class="text-sm font-medium text-gray-500 mb-1"
            />
            <User class="absolute right-3 top-2.5 text-gray-400" />
          </div>
          <p v-if="errors.first_name" class="text-sm text-red-500 mt-1">{{ errors.first_name }}</p>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <div class="relative">
            <Input
              v-model="form.last_name"
              placeholder="Last Name"
              class="text-sm font-medium text-gray-500 mb-1"
            />
            <User class="absolute right-3 top-2.5 text-gray-400" />
          </div>
          <p v-if="errors.last_name" class="text-sm text-red-500 mt-1">{{ errors.last_name }}</p>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Email</label>
          <div class="relative">
            <Input
              v-model="form.email"
              type="email"
              placeholder="Email address"
              class="text-sm font-medium text-gray-500 mb-1"
            />
            <Mail class="absolute right-3 top-2.5 text-gray-400" />
          </div>
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <Input
              v-model="form.password"
              :type="visible ? 'text' : 'password'"
              placeholder="Enter your password"
              class="text-sm font-medium text-gray-500 mb-1"
            />
            <button
              type="button"
              @click="visible = !visible"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <component :is="visible ? EyeOff : Eye" />
            </button>
          </div>
          <p v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</p>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div class="relative">
            <Input
              v-model="form.password_confirmation"
              type="password"
              placeholder="Confirm your password"
              class="text-sm font-medium text-gray-500 mb-1"
            />
            <Lock class="absolute right-3 top-2.5 text-gray-400" />
          </div>
          <p v-if="errors.password_confirmation" class="text-sm text-red-500 mt-1">
            {{ errors.password_confirmation }}
          </p>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            v-model="form.gender"
            class="border rounded-md px-3 py-2 text-sm font-medium text-gray-500"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="male">Others</option>
          </select>
          <p v-if="errors.gender" class="text-sm text-red-500 mt-1">{{ errors.gender }}</p>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Address</label>
          <div class="relative">
            <Input
              v-model="form.address"
              placeholder="Address"
              class="text-sm font-medium text-gray-500 mb-1"
            />
            <MapPin class="absolute right-3 top-2.5 text-gray-400" />
          </div>
          <p v-if="errors.address" class="text-sm text-red-500 mt-1">{{ errors.address }}</p>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div class="relative">
            <Input
              v-model="form.phone_number"
              placeholder="Phone Number"
              class="text-sm font-medium text-gray-500 mb-1"
            />
            <Phone class="absolute right-3 top-2.5 text-gray-400" />
          </div>
          <p v-if="errors.phone_number" class="text-sm text-red-500 mt-1">
            {{ errors.phone_number }}
          </p>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <div class="relative">
            <Input v-model="form.dob" type="date" class="text-sm font-medium text-gray-500 mb-1" />
            <Calendar class="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>
        <p v-if="errors.dob" class="text-sm text-red-500 mt-1">{{ errors.dob }}</p>
      </CardContent>

      <CardFooter class="flex flex-col gap-2">
        <Button class="w-full" variant="default" @click.prevent="handleSubmit">Register</Button>
        <div class="text-center text-gray-600 text-sm mt-2">
          Already have an account?
          <router-link to="/login" class="text-indigo-600 font-medium hover:underline ml-1">
            Log in →
          </router-link>
        </div>
      </CardFooter>
    </Card>
  </div>
</template> -->
<template>
  <div class="min-h-screen flex bg-gray-50">
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
      <div class="w-full max-w-2xl">
        <!-- Back to Home Link -->
        <a
          href="/"
          class="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium text-sm mb-6 transition-colors group"
        >
          <!-- ArrowLeft Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Home
        </a>

        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-6">
            <img src="../assets/images/music.png" class="w-10" />
            <h1 class="text-2xl font-bold text-gray-900">Artist Management System</h1>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p class="text-gray-600">Fill in your details to get started</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit"  novalidate class="space-y-5">
          <!-- Name Fields - Side by Side -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <div class="relative">
                <!-- User Icon -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="first_name"
                  type="text"
                  v-model="form.first_name"
                  placeholder="John"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <p v-if="errors.first_name" class="text-sm text-red-500 mt-1">{{ errors.first_name }}</p>
            </div>
            

            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <div class="relative">
                <!-- User Icon -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="last_name"
                  type="text"
                  v-model="form.last_name"
                  placeholder="Doe"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <p v-if="errors.last_name" class="text-sm text-red-500 mt-1">{{ errors.last_name }}</p>
            </div>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div class="relative">
              <!-- Mail Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                id="email"
                type="email"
                v-model="form.email"
                placeholder="you@example.com"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
             <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
          </div>

          <!-- Password Fields - Side by Side -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password"
                  :type="visible ? 'text' : 'password'"
                  v-model="form.password"
                  placeholder="••••••••"
                  :class="[
                    'w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all',
                    errors.password ? 'border-red-500' : 'border-gray-300',
                  ]"
                  required
                />
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>

            <div>
              <label
                for="password_confirmation"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div class="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password_confirmation"
                  type="password"
                  v-model="form.password_confirmation"
                  placeholder="••••••••"
                  :class="[
                    'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all',
                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300',
                  ]"
                  required
                />
              </div>
              <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">
                {{ errors.password_confirmation }}
              </p>
  
            </div>
          </div>

          <!-- Gender and DOB - Side by Side -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <!-- Note: Added relative container to position custom arrow for select element -->
              <div class="relative">
                <select
                  id="gender"
                  v-model="form.gender"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <p v-if="errors.gender" class="text-sm text-red-500 mt-1">{{ errors.gender }}</p>
            </div>

            <div>
              <label for="dob" class="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div class="relative">
                <!-- Calendar Icon -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                </svg>
                <input
                  id="dob"
                  type="date"
                  v-model="form.dob"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <p v-if="errors.dob" class="text-sm text-red-500 mt-1">{{ errors.dob }}</p>
              </div>
            </div>
          </div>

          <!-- Phone Number -->
          <div>
            <label for="phone_number" class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div class="relative">
              <!-- Phone Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                />
              </svg>
              <input
                id="phone_number"
                type="tel"
                v-model="form.phone_number"
                placeholder="9812345678"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <p v-if="errors.phone_number" class="text-sm text-red-500 mt-1">{{ errors.phone_number }}</p>
          </div>

          <!-- Address -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div class="relative">
              <!-- MapPin Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                id="address"
                type="text"
                v-model="form.address"
                placeholder="123 Main St, City, Country"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <p v-if="errors.address" class="text-sm text-red-500 mt-1">{{ errors.address }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/50"
          >
            Create Account
          </button>
        </form>

        <!-- Login Link -->
        <p class="text-center text-gray-600 text-sm mt-6">
          Already have an account?
          <a
            href="/login"
            class="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>

    <div
      class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 items-center justify-center p-12"
    >
      <div class="max-w-md text-white">
        <Music class="w-16 h-16 mb-6" />
        <h2 class="text-4xl font-bold mb-4">Join Our Community</h2>
        <p class="text-lg text-white/90 mb-8">
          Start managing your music catalog with powerful tools designed for artists and music
          professionals.
        </p>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div
              class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              <Check class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-semibold mb-1">Comprehensive Dashboard</h3>
              <p class="text-sm text-white/80">
                Get insights at a glance with our intuitive interface
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              <Check class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-semibold mb-1">Secure & Reliable</h3>
              <p class="text-sm text-white/80">
                Your data is protected with enterprise-grade security
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              <Check class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-semibold mb-1">Real-time Updates</h3>
              <p class="text-sm text-white/80">Stay synchronized across all your devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
