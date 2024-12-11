<script lang="ts">
import { onMount } from 'svelte';
import { Accordion, AccordionItem, Search, ComboBox } from "carbon-components-svelte";
import DraggableSvgElement from './DraggableSvgElement.svelte';
import { FLASK_SERVER_URL } from '../../config';
import { fetchSvgElements, fetchStreams } from '$lib/api/flowsheetApi';

export let loading: boolean;
export let error: string | null;
export let onHide: () => void;

let searchTerm = '';
let domainSearchTerm = '';
let domains: string[] = [];
let selectedDomain = 'Basic';
let svgElements: Record<string, { name: string; svg: string; category: string }> = {};
let streams: Record<string, { name: string; svg: string; category: string }> = {};
let categorizedElements: Record<string, Array<{ name: string; svg: string; category: string }>> = {};

$: {
  // Categorize elements when they change
  categorizedElements = {};
  Object.values(svgElements).forEach(element => {
    if (!categorizedElements[element.category]) {
      categorizedElements[element.category] = [];
    }
    categorizedElements[element.category].push(element);
  });
}

$: filteredCategories = filterCategories(categorizedElements, searchTerm);

onMount(async () => {
  await fetchDomains();
  await loadStreams();
  await loadDomainSvgElements(selectedDomain);
});

async function fetchDomains(query: string = '') {
  try {
    const response = await fetch(`${FLASK_SERVER_URL}/api/domains?query=${query}`);
    if (response.ok) {
      domains = await response.json();
    } else {
      console.error('Failed to fetch domains');
    }
  } catch (error) {
    console.error('Error fetching domains:', error);
  }
}

async function loadStreams() {
  try {
    streams = await fetchStreams();
  } catch (error) {
    console.error('Error loading streams:', error);
  }
}

async function loadDomainSvgElements(domainName: string) {
  try {
    const elements = await fetchSvgElements(domainName);
    svgElements = elements;
  } catch (error) {
    console.error('Error loading SVG elements:', error);
  }
}

function filterCategories(
  categories: Record<string, Array<{ name: string; svg: string; category: string }>>,
  term: string
): Record<string, Array<{ name: string; svg: string; category: string }>> {
  if (!term.trim()) return categories;

  const lowercaseTerm = term.toLowerCase();
  const filtered: Record<string, Array<{ name: string; svg: string; category: string }>> = {};

  Object.entries(categories).forEach(([category, elements]) => {
    const matchingElements = elements.filter(
      element => 
        element.name.toLowerCase().includes(lowercaseTerm) ||
        category.toLowerCase().includes(lowercaseTerm)
    );
    
    if (matchingElements.length > 0) {
      filtered[category] = matchingElements;
    }
  });

  return filtered;
}

async function handleDomainSearch(event: CustomEvent) {
  domainSearchTerm = event.detail;
  await fetchDomains(domainSearchTerm);
}

async function handleDomainSelect(event: CustomEvent) {
  selectedDomain = event.detail.selectedId;
  await loadDomainSvgElements(selectedDomain);
}
</script>

<aside class="left-sidebar">
  <div class="sidebar-header">
    <h2>Component Library</h2>
  </div>
  
  <div class="domain-selector">
    <ComboBox
      titleText="Select Domain"
      placeholder="Search domains..."
      items={domains.map(domain => ({ id: domain, text: domain }))}
      selectedId={selectedDomain}
      on:input={handleDomainSearch}
      on:select={handleDomainSelect}
    />
  </div>

  <div class="search-container">
    <Search 
      bind:value={searchTerm}
      placeholder="Search components..."
      labelText="Search components"
    />
  </div>

  {#if loading}
    <p class="loading">Loading SVG elements...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <Accordion>
      <!-- Always show Streams section first -->
      <AccordionItem title="Streams" open>
        <div class="svg-elements">
          {#each Object.values(streams) as stream}
            <DraggableSvgElement 
              name={stream.name} 
              svg={stream.svg} 
              category={stream.category}
            />
          {/each}
        </div>
      </AccordionItem>

      <!-- Show other categories -->
      {#each Object.entries(filteredCategories) as [category, elements]}
        <AccordionItem title={category}>
          <div class="svg-elements">
            {#each elements as element}
              <DraggableSvgElement 
                name={element.name} 
                svg={element.svg} 
                category={element.category}
              />
            {/each}
          </div>
        </AccordionItem>
      {/each}
    </Accordion>
  {/if}
</aside>

<style>
.left-sidebar {
  width: 250px;
  background-color: rgb(0, 32, 192);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  color: white;
  height: 100%;
}

.sidebar-header {
  padding: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgb(0, 24, 144);
}

.sidebar-header h2 {
  font-size: 1rem;
  font-weight: normal;
  margin: 0;
}

.search-container, .domain-selector {
  padding: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:global(.bx--search-input),
:global(.bx--combo-box input) {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

:global(.bx--search-input::placeholder),
:global(.bx--combo-box input::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

:global(.bx--search-magnifier),
:global(.bx--combo-box__arrow) {
  fill: white;
}

:global(.bx--accordion__item) {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:global(.bx--accordion__heading) {
  background-color: rgb(0, 24, 144);
  color: white;
}

:global(.bx--accordion__content) {
  padding: 0;
  background-color: rgb(0, 32, 192);
}

.svg-elements {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  padding: 8px;
}

.loading,
.error {
  padding: 1rem;
  color: white;
}
</style>

