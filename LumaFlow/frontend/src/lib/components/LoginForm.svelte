<script lang="ts">
import { Button, TextInput } from "carbon-components-svelte";
import { createEventDispatcher } from 'svelte';
import { login } from '../api/authApi';
import { goto } from '$app/navigation';

const dispatch = createEventDispatcher();

let username = '';
let password = '';
let error = '';

async function handleSubmit(event: Event) {
  event.preventDefault();
  if (username && password) {
    try {
      const response = await login(username, password);
      if (response.success) {
        dispatch('login', { username });
        error = '';
        goto('/dashboard');
      } else {
        error = response.message || 'Login failed. Please try again.';
      }
    } catch (e) {
      error = 'An error occurred. Please try again.';
      console.error('Login error:', e);
    }
  } else {
    error = 'Please enter both username and password.';
  }
}
</script>

   
    <div class="login-form">
      <h1>Login to Flowsheet Designer</h1>
      <form on:submit={handleSubmit}>
        <TextInput
          labelText="Username"
          placeholder="Enter your username"
          bind:value={username}
        />
        <TextInput
          type="password"
          labelText="Password"
          placeholder="Enter your password"
          bind:value={password}
        />
        <Button type="submit">Log in</Button>
        {#if error}
          <p class="error">{error}</p>
        {/if}
      </form>
      <p class="register-link">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
    
    <style>
    .login-form {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    
    h1 {
      color: var(--primary-blue);
      margin-bottom: 1rem;
      text-align: center;
    }
    
    :global(.bx--form-item) {
      margin-bottom: 1rem;
    }
    
    .error {
      color: red;
      margin-top: 1rem;
    }
    
    .register-link {
      margin-top: 1rem;
      text-align: center;
    }
    
    .register-link a {
      color: var(--primary-blue);
      text-decoration: none;
    }
    
    .register-link a:hover {
      text-decoration: underline;
    }
    </style>
    
    
