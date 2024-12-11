<script lang="ts">
    import { Button, TextInput } from "carbon-components-svelte";
    import { createEventDispatcher } from 'svelte';
    import { register } from '../api/authApi';
    
    const dispatch = createEventDispatcher();
    
    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let error = '';
    
    async function handleSubmit(event: Event) {
      event.preventDefault();
      if (username && email && password && confirmPassword) {
        if (password !== confirmPassword) {
          error = 'Passwords do not match.';
          return;
        }
        try {
          const response = await register(username, email, password);
          if (response.success) {
            dispatch('register', { username });
            error = '';
          } else {
            error = response.message || 'Registration failed. Please try again.';
          }
        } catch (e) {
          error = 'An error occurred. Please try again.';
          console.error('Registration error:', e);
        }
      } else {
        error = 'Please fill in all fields.';
      }
    }
    </script>
    
    <div class="register-form">
      <h1>Register for Flowsheet Designer</h1>
      <form on:submit={handleSubmit}>
        <TextInput
          labelText="Username"
          placeholder="Enter your username"
          bind:value={username}
        />
        <TextInput
          type="email"
          labelText="Email"
          placeholder="Enter your email"
          bind:value={email}
        />
        <TextInput
          type="password"
          labelText="Password"
          placeholder="Enter your password"
          bind:value={password}
        />
        <TextInput
          type="password"
          labelText="Confirm Password"
          placeholder="Confirm your password"
          bind:value={confirmPassword}
        />
        <Button type="submit">Register</Button>
        {#if error}
          <p class="error">{error}</p>
        {/if}
      </form>
    </div>
    
    <style>
    .register-form {
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
    </style>
    
    