<template>
  <div>
    <form @submit.prevent="updateProfile">
      <input v-model="form.first_name" placeholder="First Name" />
      <input v-model="form.last_name" placeholder="Last Name" />
      <input v-model="form.email" placeholder="Email" />
      <input v-model="form.phone_number" placeholder="Phone" />
      <!-- Artist fields -->
      <textarea v-model="form.artist.bio" placeholder="Bio"></textarea>
      <input v-model="form.artist.website" placeholder="Website" />
      <input type="file" @change="handlePhotoUpload" />  <!-- For base64 -->
      <input v-model="form.artist.social_media_links.instagram" placeholder="Instagram URL" />
      <input v-model="form.artist.social_media_links.twitter" placeholder="Twitter URL" />
      <select v-model="form.artist.genres" multiple>
        <option>Pop</option>
        <option>Indie</option>
        <!-- Add more genres -->
      </select>
      <button type="submit">Update Profile</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        artist: {
          bio: '',
          website: '',
          photo: null,  // Will be base64
          social_media_links: {
            instagram: '',
            twitter: ''
          },
          genres: []
        }
      }
    };
  },
  methods: {
    handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.artist.photo = e.target.result;  // base64 data URL (e.g., 'data:image/jpeg;base64,...')
        };
        reader.readAsDataURL(file);
      }
    },
    async updateProfile() {
      try {
        const response = await axios.patch('/api/v1/auth/update_profile', {  // Adjust URL to your route
          user: this.form
        }, {
          withCredentials: true  // Crucial for sending cookies (auth)
        });
        console.log('Profile updated:', response.data);
        // Handle success (e.g., redirect or update UI)
      } catch (error) {
        console.error('Error updating profile:', error.response.data.errors);
        // Display errors in UI
      }
    }
  }
};
</script>