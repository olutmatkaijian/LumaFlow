<script lang="ts">
export let name: string;
export let svg: string;
export let category: string;

function handleDragStart(event: DragEvent) {
  if (event.dataTransfer) {
    const data = {
      name,
      svg,
      category
    };
    event.dataTransfer.setData('application/json', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'copy';
    
    // Create a drag image
    const dragImage = document.createElement('div');
    dragImage.innerHTML = svg;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 40, 40);
    
    // Clean up the drag image after dragging
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  }
}
</script>

<div 
  class="draggable-svg-element" 
  draggable="true" 
  on:dragstart={handleDragStart}
>
  <div class="svg-container">
    {@html svg}
  </div>
  <span class="element-name">{name}</span>
</div>

<style>
.draggable-svg-element {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  cursor: move;
  user-select: none;
  transition: background-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.draggable-svg-element:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.svg-container {
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.svg-container :global(svg) {
  width: 100%;
  height: 100%;
  max-width: 32px;
  max-height: 32px;
  fill: currentColor;
  color: white;
}

.element-name {
  font-size: 12px;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  color: white;
}
</style>

