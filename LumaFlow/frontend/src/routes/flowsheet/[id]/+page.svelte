<script lang="ts">
    import { page } from '$app/stores';
    import FlowsheetDesigner from '$lib/components/FlowsheetDesigner.svelte';
    
    const flowsheetId = $page.params.id;
    </script>
    
    <FlowsheetDesigner {flowsheetId} />
    
    