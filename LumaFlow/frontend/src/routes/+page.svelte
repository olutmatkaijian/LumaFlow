<script lang="ts">
import { Button, Grid, Row, Column } from "carbon-components-svelte";
import { goto } from '$app/navigation';
import { isAuthenticated } from '$lib/api/authApi';
import { onMount } from 'svelte';

let isLoggedIn = false;

onMount(async () => {
  isLoggedIn = await isAuthenticated();
});

function handleGetStarted() {
  if (isLoggedIn) {
    goto('/dashboard');
  } else {
    goto('/login');
  }
}
</script>

<div class="landing-page">
  <header class="landing-header">
    <h1>Welcome to LumaFlow</h1>
    <p>The next-generation flowsheet designer for process engineering</p>
  </header>

  <main>
    <Grid>
      <Row>
        <Column>
          <h2>Design. Simulate. Collaborate.</h2>
          <p>LumaFlow brings together powerful design tools, real-time simulation, and seamless collaboration to revolutionize your process engineering workflow.</p>
          <Button on:click={handleGetStarted}>Get Started</Button>
        </Column>
      </Row>

      <Row>
        <Column sm={4} md={4} lg={4}>
          <h3>Intuitive Design</h3>
          <p>Create complex flowsheets with our drag-and-drop interface and extensive component library.</p>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <h3>Real-time Simulation</h3>
          <p>Run simulations on-the-fly and see results instantly as you design your process.</p>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <h3>Collaborative Workspace</h3>
          <p>Work together in real-time, share projects, and leverage collective expertise.</p>
        </Column>
      </Row>
    </Grid>
  </main>

  <footer>
    <p>&copy; 2023 LumaFlow. All rights reserved.</p>
  </footer>
</div>

<style>
  .landing-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--cds-ui-background);
    color: var(--cds-text-01);
  }

  .landing-header {
    background-color: var(--cds-ui-05);
    color: var(--cds-text-04);
    padding: var(--cds-spacing-09) var(--cds-spacing-05);
    text-align: center;
  }

  h1 {
    font-size: var(--cds-display-03);
    margin-bottom: var(--cds-spacing-05);
  }

  main {
    flex-grow: 1;
    padding: var(--cds-spacing-09) var(--cds-spacing-05);
  }

  h2 {
    font-size: var(--cds-expressive-heading-05);
    margin-bottom: var(--cds-spacing-06);
  }

  h3 {
    font-size: var(--cds-heading-03);
    margin-bottom: var(--cds-spacing-05);
  }

  p {
    margin-bottom: var(--cds-spacing-06);
  }

  footer {
    background-color: var(--cds-ui-03);
    color: var(--cds-text-02);
    padding: var(--cds-spacing-05);
    text-align: center;
  }

  @media (max-width: 672px) {
    .landing-header {
      padding: var(--cds-spacing-07) var(--cds-spacing-05);
    }

    main {
      padding: var(--cds-spacing-07) var(--cds-spacing-05);
    }

    h1 {
      font-size: var(--cds-display-02);
    }

    h2 {
      font-size: var(--cds-expressive-heading-04);
    }

    h3 {
      font-size: var(--cds-heading-02);
    }
  }
</style>

