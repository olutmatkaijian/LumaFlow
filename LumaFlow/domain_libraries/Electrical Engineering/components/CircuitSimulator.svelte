<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  onMount(() => {
    ctx = canvas.getContext('2d');
    drawCircuit();
  });

  function drawCircuit() {
    // Simple circuit drawing logic
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(150, 50);
    ctx.lineTo(150, 100);
    ctx.lineTo(50, 100);
    ctx.lineTo(50, 50);
    ctx.stroke();

    // Draw a resistor
    ctx.beginPath();
    ctx.moveTo(70, 50);
    ctx.lineTo(80, 40);
    ctx.lineTo(90, 60);
    ctx.lineTo(100, 40);
    ctx.lineTo(110, 60);
    ctx.lineTo(120, 40);
    ctx.lineTo(130, 50);
    ctx.stroke();
  }
</script>

<div class="circuit-simulator">
  <h2>Circuit Simulator</h2>
  <canvas bind:this={canvas} width="200" height="150"></canvas>
</div>

<style>
  .circuit-simulator {
    border: 1px solid #ccc;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  canvas {
    border: 1px solid #000;
  }
</style>
