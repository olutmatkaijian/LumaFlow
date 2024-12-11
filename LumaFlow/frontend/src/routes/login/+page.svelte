<script lang="ts">
  import LoginForm from '$lib/components/LoginForm.svelte';
  import { goto } from '$app/navigation';
  
  function handleLogin(event: CustomEvent) {
    goto('/flowsheet');
  }
  </script>
  
  <div class="login-page">
    <LoginForm on:login={handleLogin} />
  </div>
  
  <style>
    .login-page {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: var(--background-light);
    }
  </style>
  
  