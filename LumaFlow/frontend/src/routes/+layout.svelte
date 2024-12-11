<script lang="ts">
import '../app.css';
import { browser } from '$app/environment';
import { page } from '$app/stores';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

let isLoggedIn = false;

onMount(async () => {
  if (browser) {
    const { isAuthenticated } = await import('$lib/api/authApi');
    isLoggedIn = await isAuthenticated();
  }
});

$: if (browser && !isLoggedIn && $page.url.pathname !== '/' && $page.url.pathname !== '/login' && $page.url.pathname !== '/register') {
  goto('/login');
}
</script>

<slot />

