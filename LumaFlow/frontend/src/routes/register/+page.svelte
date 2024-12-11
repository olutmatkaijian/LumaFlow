<script lang="ts">
    import RegisterForm from '$lib/components/RegisterForm.svelte';
    import { goto } from '$app/navigation';
    
    function handleRegister(event: CustomEvent) {
      // After successful registration, redirect to login page
      goto('/login');
    }
    </script>
    
    <div class="register-page">
      <RegisterForm on:register={handleRegister} />
    </div>
    
    <style>
    .register-page {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: var(--background-light);
    }
    </style>
    
    