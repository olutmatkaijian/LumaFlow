<script lang="ts">
import { onMount } from 'svelte';
import { marked } from 'marked';

export let query = '';

let documentation = '';

$: if (query) {
    searchDocumentation(query);
}

async function searchDocumentation(searchQuery: string) {
    // In the future, this would connect to your LLM-powered documentation search
    // For now, we'll just show some placeholder documentation
    const docs = `
# ${searchQuery}

This is placeholder documentation for "${searchQuery}".

## Usage

\`\`\`python
# Example code would go here
\`\`\`

## Parameters

- param1: Description of parameter 1
- param2: Description of parameter 2

## Returns

Description of what the function/class returns.
    `;
    
    documentation = marked(docs);
}
</script>

<div class="documentation-viewer">
    <div class="documentation-content">
        {@html documentation}
    </div>
</div>

<style>
.documentation-viewer {
    flex: 1;
    overflow-y: auto;
    padding: var(--cds-spacing-05);
}

.documentation-content {
    max-width: 100%;
    line-height: 1.6;
}

.documentation-content :global(h1) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.documentation-content :global(h2) {
    font-size: 1.25rem;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

.documentation-content :global(code) {
    background-color: var(--cds-ui-01);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
}

.documentation-content :global(pre) {
    background-color: var(--cds-ui-01);
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    margin: 1rem 0;
}
</style>

