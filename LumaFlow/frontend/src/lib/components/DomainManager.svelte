<script lang="ts">
import { onMount } from 'svelte';
import { Button, FileUploader, Select, SelectItem } from "carbon-components-svelte";

let domains = [];
let selectedDomain = '';
let file: File | null = null;

onMount(async () => {
    await fetchDomains();
});

async function fetchDomains() {
    const response = await fetch('/api/domains');
    domains = await response.json();
    if (domains.length > 0 && !selectedDomain) {
        selectedDomain = domains[0];
    }
}

async function uploadDomain() {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/domains/upload', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        await fetchDomains();
        file = null;
    } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
    }
}

function handleFileSelect(event: CustomEvent) {
    file = event.detail[0];
}

function handleDomainChange(event: CustomEvent) {
    selectedDomain = event.detail;
}
</script>

<div class="domain-manager">
    <h2>Domain Library Manager</h2>
    
    <div class="upload-section">
        <FileUploader 
            labelTitle="Upload Domain Library"
            buttonLabel="Add file"
            labelDescription="Only .zip files are accepted"
            accept={['.zip']}
            on:change={handleFileSelect}
        />
        <Button on:click={uploadDomain} disabled={!file}>Upload Domain</Button>
    </div>

    <div class="select-section">
        <Select 
            labelText="Select Domain"
            selected={selectedDomain}
            on:change={handleDomainChange}
        >
            {#each domains as domain}
                <SelectItem value={domain} text={domain} />
            {/each}
        </Select>
    </div>
</div>

<style>
.domain-manager {
    padding: 1rem;
}

.upload-section, .select-section {
    margin-bottom: 1rem;
}
</style>

