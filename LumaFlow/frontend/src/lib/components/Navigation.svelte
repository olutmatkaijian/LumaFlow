<script lang="ts">
    import { goto } from '$app/navigation';
    import { v4 as uuidv4 } from 'uuid';
    
    function createNewFlowsheet() {
      const newId = uuidv4();
      goto(`/flowsheet/${newId}`);
    }
    </script>
    
    <!-- Your navigation HTML -->
    <button on:click={createNewFlowsheet}>Create New Flowsheet</button>
    
    