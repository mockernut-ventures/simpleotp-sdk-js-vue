# simpleotp-sdk-js-vue

1. **Installation**:
   First, make sure you have the `@simpleotp/core` library installed in your project since the Vue Simple OTP plugin depends on it. Make sure to install this plugin as well:

   ```bash
   npm install @simpleotp/core
   npm install @simpleotp/vue
   ```
   
   Then, you need to install the Vue plugin in your Vue project. You can do this by importing the plugin and installing it using Vue's `createApp` or `Vue.use` method. Typically, you would do this in your main Vue application file (e.g., `main.js` or `main.ts`).

   ```javascript
   import { createApp } from 'vue';
   import SimpleOTPPlugin from '@simpleotp/vue'; // Import the plugin

   const app = createApp(App);

   // Install the SimpleOTP plugin with your configuration options
   app.use(SimpleOTPPlugin, {
     siteID: 'your-site-id', // This will be given to you after you sign up for a Simple OTP subscription and create a site
     apiURL: 'your-api-url' // Optional, can be null - only used for self hosting
   });

   app.mount('#app');
   ```

3. **Usage**:
   After installing the plugin, you can use it in any Vue component by injecting it using the `useSimpleOTP` function. Here's an example of how to use the sign-in flow, the auth flow, and the sign-out flow in different Vue components using Tailwind CSS for styling:

   SignIn:
   ```javascript
   <template>
     <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
       <div class="sm:mx-auto sm:w-full sm:max-w-sm">
         <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
           Sign in to your account
         </h2>
       </div>
       <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
         <form @submit="signIn" class="space-y-6">
           <div v-if="signInStatus?.code in [SignInStatusCode.InternalServerError.description, SignInStatusCode.InvalidSite.description, SignInStatusCode.SiteNotFound.description]"
             class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
             <span class="block sm:inline">{{ signInStatus.message }}</span>
           </div>
           <div v-else-if="signInStatus?.code && signInStatus?.code !== SignInStatusCode.OK.description" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
             <span class="block sm:inline">{{ signInStatus.message }}</span>
           </div>
           <div>
             <label for="email" class="block text-sm font-medium leading-6 text-white">
               Email address
             </label>
             <div class="mt-2">
               <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
             </div>
           </div>
           <div>
             <button type="submit" :disabled="!email">Sign In</button>
           </div>
           <p class="mt-10 text-center text-sm text-gray-500">
             We'll send a magic sign in link to your email when you click "Sign in," even if you don't have an account
             yet.
           </p>
         </form>
       </div>
     </div>
   </template>
   
   <script setup>
   import { SignInStatusCode } from '@simpleotp/core'
   import { useSimpleOTP } from '@simpleotp/vue'
   import { ref } from 'vue'
   import { useRouter } from 'vue-router'
   
   const props = defineProps({
     email: {
       type: String,
       required: false
     }
   })
   const router = useRouter()
   const simpleOTP = useSimpleOTP()
   
   const email = ref(props.email)
   const isLoading = ref(false)
   const signInStatus = ref(null)
   
   async function signIn(e) {
     e.preventDefault()
     
     isLoading.value = true
     signInStatus.value = await simpleOTP.signIn(email.value)
     if (signInStatus.value.code === SignInStatusCode.OK.description) {
       router.push({ path: '/sign-in/confirmation', query: { email: email.value } })
     } else {
       isLoading.value = false
     }
   }
   
   if (simpleOTP.isAuthenticated()) {
     router.push({ path: '/' })
   }
   </script>
   ```
   Auth:
   ```javascript
   <template>
     <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
       <div class="sm:mx-auto sm:w-full sm:max-w-sm">
         <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
           Authentication
         </h2>
       </div>
       <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
         <span v-if="!authErrorMessage" class="text-2xl font-sans text-white">
           Authenticating you, one moment...
         </span>
         <span v-else class="text-2xl font-sans text-white">
           There was an error authenticating you: {{ authErrorMessage }}
         </span>
       </div>
     </div>
   </template>
   
   <script async setup>
     import { onMounted, ref } from 'vue'
     import { useSimpleOTP } from '@simpleotp/vue'
     import { AuthStatusCode } from '@simpleotp/core'
     import { useRouter } from 'vue-router'
     const simpleOTP = useSimpleOTP()
     const router = useRouter()
     const authErrorMessage = ref(null)
   
     onMounted(async () => {
       const authResponse = await simpleOTP.authWithURLCode()
       if (authResponse.code !== AuthStatusCode.OK.description) {
         authErrorMessage.value = authResponse.message
       } else {
         router.push({ path: '/' })
       }
     })
   </script>
   ```

   SignOut:
   ```javascript
   <template>
     <a href="#">
       <-- User Icon goes here -->
       <span @click="signIn" v-if="!isAuthenticated">&nbsp;Sign in <span aria-hidden="true">&rarr;</span></span>
       <span @click="signOut" v-else>&nbsp;Sign out <span aria-hidden="true">&rarr;</span></span>
     </a>
   </template>
   
   <script setup>
     import { useSimpleOTP } from '@simpleotp/vue'
     import { useRouter } from 'vue-router'
     const simpleOTP = useSimpleOTP()
     const router = useRouter()
   
     const isAuthenticated = simpleOTP.isAuthenticatedRef()
   
     function signIn() {
       router.push('/sign-in')
     }
   
     function signOut() {
       simpleOTP.signOut()
       router.push('/')
     }
   </script>
   ```

   In this example, the Vue component uses the `useSimpleOTP` function to inject the `VueSimpleOTP` instance, allowing you to access its methods and state.

5. **Methods and State**:
   The `VueSimpleOTP` class extends the `SimpleOTP` class and provides methods like `authWithURLCode`, `signOut`, and access to read-only references to `isAuthenticated` and `user`. You can call these methods and use the state in your Vue component's setup function, as shown in the example above.

   - `simpleOTP.authWithURLCode()`: This method is used for authentication with a URL code.
   - `simpleOTP.signOut()`: This method signs the user out.
   - `simpleOTP.isAuthenticatedRef()`: This function returns a read-only reference to the user's authentication status.
   - `simpleOTP.getUserRef()`: This function returns a read-only reference to the user object.

By following these steps, you can integrate the provided code into your Vue project and use the `@simpleotp/core` library with the added convenience of Vue.js features such as reactive state management and component composition.
