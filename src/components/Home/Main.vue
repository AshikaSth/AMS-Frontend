<!-- <script setup>
import Card from './Card.vue';

</script>
<template>
        <section class="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
            <Card title="👥 Manage Users" description="Easily add, edit, and manage system users with different roles and permissions."/>
            <Card title="🎤 Manage Artists" description="Keep detailed records of artists, their genres, and biographies."/>
            <Card title="💿 Manage Album" description="Organize albums and songs for a clean and professional catalog."/>
            <Card title="🎶 Music Collection" description="Organize albums and songs for a clean and professional catalog."/>
    </section>
</template> -->

<script setup>
import { Users, Music, Disc, Library } from 'lucide-vue-next';
</script>

<template>
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Your Music
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive suite of tools designed to streamline your artist management workflow
          </p>
        </div>

        <div className="space-y-12 sm:space-y-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-900">
                User Management Made Simple
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                Effortlessly manage your team with role-based access control. Add new users, assign permissions,
                and maintain complete oversight of who can access what within your system.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Role-based permissions and access control</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Activity tracking and audit logs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Quick user provisioning and deactivation</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 sm:p-12 min-h-[300px] flex items-center justify-center">
              <Users className="w-32 h-32 sm:w-40 sm:h-40 text-indigo-300" />
            </div>
          </div>


          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 sm:p-12 min-h-[300px] flex items-center justify-center">
              <Music className="w-32 h-32 sm:w-40 sm:h-40 text-purple-300" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-4">
                Complete Artist Profiles
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                Build comprehensive artist profiles with biographical information, genre classifications,
                career milestones, and social media links all in one centralized location.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Detailed biography and career timeline</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Genre tagging and classification system</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Social media integration and tracking</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4">
                Album Organization & Tracking
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                Organize your discography with detailed album information including release dates,
                cover artwork, track listings, and production credits for a complete catalog.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Complete track listings and metadata</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Release date management and scheduling</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Cover art and visual asset storage</span>
                </li>
              </ul>

            </div>
            <div className="order-1 lg:order-2 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 sm:p-12 min-h-[300px] flex items-center justify-center">
              <Disc className="w-32 h-32 sm:w-40 sm:h-40 text-indigo-300" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 sm:p-12 min-h-[300px] flex items-center justify-center">
              <Library className="w-32 h-32 sm:w-40 sm:h-40 text-pink-300" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-4">
                Comprehensive Music Library
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                Build and maintain your complete music catalog with advanced search, filtering,
                and organization tools to keep your entire collection accessible and well-structured.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Advanced search and filtering capabilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Custom playlists and collection curation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-700">Bulk import and export functionality</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>