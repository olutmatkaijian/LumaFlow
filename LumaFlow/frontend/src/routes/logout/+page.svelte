<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { logout } from '$lib/api/authApi';
    import { Button } from "carbon-components-svelte";
    
    let error = '';
    
    onMount(async () => {
      try {
        await logout();
        // Wait for a short time to show the logout message before redirecting
        setTimeout(() => goto('/login'), 2000);
      } catch (e) {
        error = 'Logout failed. Please try again.';
        console.error('Logout error:', e);
      }
    });
    </script>
    
    <div class="logout-page">
      <h1>Logging out...</h1>
      {#if error}
        <p class="error">{error}</p>
        <Button on:click={() => goto('/login')}>Return to Login</Button>
      {:else}
        <p>You have been successfully logged out. Redirecting to login page...</p>
      {/if}
    </div>
    
    <style>
      .logout-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: var(--background-light);
      }
    
      h1 {
        color: var(--primary-blue);
        margin-bottom: 1rem;
      }
    
      p {
        margin-bottom: 1rem;
      }
    
      .error {
        color: red;
      }
    </style>
    
    