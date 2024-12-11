<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Header, HeaderNav, HeaderNavItem, HeaderNavMenu } from "carbon-components-svelte";
    
    const dispatch = createEventDispatcher();
    
    function saveFlowsheet() {
      dispatch('save');
    }
    
    function loadFlowsheet() {
      dispatch('load');
    }
    
    function undo() {
      dispatch('undo');
    }
    
    function redo() {
      dispatch('redo');
    }
    
    function toggleLeftSidebar() {
      dispatch('toggleLeftSidebar');
    }
    
    function toggleRightSidebar() {
      dispatch('toggleRightSidebar');
    }
    </script>
    
    <Header company="Flowsheet Designer" platformName="Collaborative">
    <HeaderNav>
      <HeaderNavMenu text="File">
        <HeaderNavItem href="#" on:click={saveFlowsheet}>Save</HeaderNavItem>
        <HeaderNavItem href="#" on:click={loadFlowsheet}>Load</HeaderNavItem>
        <HeaderNavItem href="#">Export</HeaderNavItem>
        <HeaderNavItem href="#">Exit</HeaderNavItem>
      </HeaderNavMenu>
      <HeaderNavMenu text="Edit">
        <HeaderNavItem href="#" on:click={undo}>Undo</HeaderNavItem>
        <HeaderNavItem href="#" on:click={redo}>Redo</HeaderNavItem>
        <HeaderNavItem href="#">Cut</HeaderNavItem>
        <HeaderNavItem href="#">Copy</HeaderNavItem>
        <HeaderNavItem href="#">Paste</HeaderNavItem>
      </HeaderNavMenu>
      <HeaderNavMenu text="View">
        <HeaderNavItem href="#" on:click={toggleLeftSidebar}>Toggle Left Sidebar</HeaderNavItem>
        <HeaderNavItem href="#" on:click={toggleRightSidebar}>Toggle Right Sidebar</HeaderNavItem>
      </HeaderNavMenu>
      <HeaderNavMenu text="Help">
        <HeaderNavItem href="#">About</HeaderNavItem>
        <HeaderNavItem href="#">Documentation</HeaderNavItem>
      </HeaderNavMenu>
    </HeaderNav>
    </Header>
    
    