<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { api } from '@/api/base_api'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { loginFormSchema } from '@/schema/loginFormSchema'
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const errors = reactive({})
const visible = ref(false)
const form = reactive({
  email: '',
  password: '',
})

const handleSubmit = async () => {
   console.log('Submitting login with:', form)
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  const result = loginFormSchema.safeParse(form)
  console.log('Zod result:', result)

  if (!result.success) {
    result.error.issues.forEach((err) => {
      errors[err.path[0]] = err.message
    })
    toast.error('Please fix the validation errors.')
    return
  }

  try {
    const response = await api.post('login', {
      email: form.email,
      password: form.password,
    })
    const userData = response.data.user
    authStore.login(userData)
    console.log('Login successful', response.data)
    console.log(authStore)
    router.push('/dashboard')
    toast.success('Login successful!')
  } catch (error) {
    toast.error('Login failed')
    console.error(error)
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Left Side - Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
      <div class="w-full max-w-md">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium text-sm mb-8 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
          Back to Home
        </RouterLink>

        <div class="mb-8">
          <div class="flex items-center gap-3 mb-6">
            <img src="../assets/images/music.png" class="w-10">
            <h1 class="text-2xl font-bold text-gray-900">Artist Management System</h1>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p class="text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        <div class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                v-model="form.password"
                :type="visible ? 'text' : 'password'"
                placeholder="Enter your password"
                class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                @click="visible = !visible"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <EyeOff v-if="visible" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
            <p v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span class="text-sm text-gray-600">Remember me</span>
            </label>
            <!-- <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              Forgot password?
            </a> -->
          </div>

          <button
            type="button"
            @click="handleSubmit"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign in
          </button>

          <!-- <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div> -->

        </div>

        <p class="text-center text-gray-600 text-sm mt-6">
          Don't have an account?
          <RouterLink to="/register" class="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            Sign up
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- Right Side - Gradient Background (Hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 items-center justify-center p-12">
      <div class="max-w-md text-white">
        <Music class="w-16 h-16 mb-6" />
        <h2 class="text-4xl font-bold mb-4">
          Manage Your Music Empire
        </h2>
        <p class="text-lg text-white/90 mb-8">
          Access powerful tools to manage artists, albums, and your complete music catalog all in one place.
        </p>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-semibold mb-1">Comprehensive Dashboard</h3>
              <p class="text-sm text-white/80">Get insights at a glance with our intuitive interface</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-semibold mb-1">Secure & Reliable</h3>
              <p class="text-sm text-white/80">Your data is protected with enterprise-grade security</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
