<script lang="ts">
  export let temperature: number;
  export let pressure: number;
  export let flowRate: number;

  function adjustParameters() {
    // Logic to adjust reactor parameters
    console.log("Adjusting reactor parameters");
  }
</script>

<div class="reactor-control">
  <h2>Reactor Control Panel</h2>
  <div class="parameter">
    <label for="temperature">Temperature (°C):</label>
    <input id="temperature" type="number" bind:value={temperature} />
  </div>
  <div class="parameter">
    <label for="pressure">Pressure (bar):</label>
    <input id="pressure" type="number" bind:value={pressure} />
  </div>
  <div class="parameter">
    <label for="flowRate">Flow Rate (L/min):</label>
    <input id="flowRate" type="number" bind:value={flowRate} />
  </div>
  <button on:click={adjustParameters}>Adjust Parameters</button>
</div>

<style>
  .reactor-control {
    border: 1px solid #ccc;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  .parameter {
    margin-bottom: 0.5rem;
  }
  label {
    display: inline-block;
    width: 150px;
  }
</style>
