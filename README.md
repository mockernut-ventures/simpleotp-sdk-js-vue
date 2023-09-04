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
   After installing the plugin, you can use it in any Vue component by injecting it using the `useSimpleOTP` function. Here's an example of how to use it in a Vue component:

   ```javascript
   <template>
     <div>
       <p v-if="isAuthenticated">User is authenticated</p>
       <p v-else>User is not authenticated</p>
       <button @click="signIn">Sign In</button>
       <button @click="signOut">Sign Out</button>
     </div>
   </template>

   <script>
   import { useSimpleOTP } from '@simpleotp/vue'; // Import the useSimpleOTP function

   export default {
     setup() {
       const simpleOTP = useSimpleOTP(); // Inject the SimpleOTP instance

       const isAuthenticated = simpleOTP.isAuthenticatedRef(); // Access the isAuthenticatedRef

       const signIn = async () => {
         const response = await simpleOTP.authWithURLCode();
         // Handle the authentication response as needed
       };

       const signOut = () => {
         simpleOTP.signOut();
         // Perform any additional sign-out logic
       };

       return {
         isAuthenticated,
         signIn,
         signOut,
       };
     },
   };
   </script>
   ```

   In this example, the Vue component uses the `useSimpleOTP` function to inject the `VueSimpleOTP` instance, allowing you to access its methods and state.

4. **Methods and State**:
   The `VueSimpleOTP` class extends the `SimpleOTP` class and provides methods like `authWithURLCode`, `signOut`, and access to read-only references to `isAuthenticated` and `user`. You can call these methods and use the state in your Vue component's setup function, as shown in the example above.

   - `simpleOTP.authWithURLCode()`: This method is used for authentication with a URL code.
   - `simpleOTP.signOut()`: This method signs the user out.
   - `simpleOTP.isAuthenticatedRef()`: This function returns a read-only reference to the user's authentication status.
   - `simpleOTP.getUserRef()`: This function returns a read-only reference to the user object.

By following these steps, you can integrate the provided code into your Vue project and use the `@simpleotp/core` library with the added convenience of Vue.js features such as reactive state management and component composition.
