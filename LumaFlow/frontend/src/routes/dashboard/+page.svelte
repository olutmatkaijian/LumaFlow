<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button, DataTable, Pagination, InlineLoading, Grid, Row, Column, Header, HeaderNav, HeaderNavItem } from "carbon-components-svelte";
  import { Add } from "carbon-icons-svelte";
  import { fetchFlowsheets, createFlowsheet } from '$lib/api/flowsheetApi';
  import { getUserInfo, logout } from '$lib/api/authApi';
  import type { Flowsheet } from '$lib/types/flowsheet';
  
  let flowsheets: Flowsheet[] = [];
  let loading = true;
  let error: string | null = null;
  let username = '';
  
  onMount(async () => {
    try {
      const [flowsheetsData, userInfo] = await Promise.all([
        fetchFlowsheets(),
        getUserInfo()
      ]);
      flowsheets = flowsheetsData;
      username = userInfo.username;
      loading = false;
    } catch (e) {
      console.error('Error fetching data:', e);
      error = 'Failed to load data. Please try again later.';
      loading = false;
    }
  });
  
  async function handleCreateFlowsheet(): Promise<void> {
    try {
      const newFlowsheet = await createFlowsheet('New Flowsheet');
      flowsheets = [...flowsheets, newFlowsheet];
      goto(`/flowsheet/${newFlowsheet.id}`);
    } catch (e) {
      console.error('Error creating flowsheet:', e);
      error = 'Failed to create new flowsheet. Please try again.';
    }
  }
  
  function openFlowsheet(id: string): void {
    goto(`/flowsheet/${id}`);
  }
  
  async function handleLogout() {
    try {
      await logout();
      goto('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  </script>
  
  <div class="dashboard">
    <Header company="Flowsheet Designer" platformName="Dashboard">
      <HeaderNav>
        <HeaderNavItem href="#" on:click={handleLogout}>Logout</HeaderNavItem>
      </HeaderNav>
    </Header>
  
    <main class="dashboard-content">
      <Grid>
        <Row>
          <Column>
            <h1>Welcome, {username}</h1>
          </Column>
        </Row>
        <Row>
          <Column>
            <h2>Your Flowsheets</h2>
          </Column>
        </Row>
        <Row>
          <Column>
            <div class="actions">
              <Button icon={Add} on:click={handleCreateFlowsheet}>Create New Flowsheet</Button>
            </div>
          </Column>
        </Row>
        <Row>
          <Column>
            {#if loading}
              <InlineLoading description="Loading..." />
            {:else if error}
              <div class="error-state">
                <p role="alert">{error}</p>
                <Button on:click={() => window.location.reload()}>Retry</Button>
              </div>
            {:else if flowsheets.length === 0}
              <div class="empty-state">
                <p>You don't have any flowsheets yet. Click the button above to create your first flowsheet!</p>
              </div>
            {:else}
              <DataTable headers={[
                { key: 'name', value: 'Name' },
                { key: 'created_at', value: 'Created At' },
                { key: 'actions', value: 'Actions' }
              ]} rows={flowsheets.map(f => ({
                id: f.id,
                name: f.name,
                created_at: new Date(f.created_at).toLocaleString(),
                actions: ''
              }))}>
                <svelte:fragment slot="cell" let:row let:cell>
                  {#if cell.key === 'actions'}
                    <Button size="small" on:click={() => openFlowsheet(row.id)}>Open</Button>
                  {:else}
                    {cell.value}
                  {/if}
                </svelte:fragment>
              </DataTable>
              
              <div class="pagination">
                <Pagination totalItems={flowsheets.length} pageSize={10} />
              </div>
            {/if}
          </Column>
        </Row>
      </Grid>
    </main>
  </div>
  
  <style>
    @import '../../styles/components/Dashboard.css';
  </style>
  
  