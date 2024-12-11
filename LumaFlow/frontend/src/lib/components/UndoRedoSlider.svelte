<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Slider } from "carbon-components-svelte";
  
  export let currentStep = 0;
  export let totalSteps = 0;
  
  const dispatch = createEventDispatcher();
  
  function handleChange(event: CustomEvent) {
    dispatch('change', event.detail);
  }
  </script>
  
  <div class="undo-redo-slider">
    <Slider
      min={0}
      max={totalSteps}
      value={currentStep}
      on:change={handleChange}
      labelText="Undo/Redo"
    />
    <div class="slider-labels">
      <span>Undo</span>
      <span>{currentStep} / {totalSteps}</span>
      <span>Redo</span>
    </div>
  </div>
  
  <style>
  .undo-redo-slider {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 300px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .slider-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 12px;
  }
  </style>
  