<script lang="ts">
import { onMount } from 'svelte';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export let messages: string[] = [];
let terminal: XTerm;
let container: HTMLElement;

onMount(() => {
    terminal = new XTerm({
        theme: {
            background: '#1e1e1e',
            foreground: '#ffffff',
        },
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        cursorBlink: true,
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(container);
    fitAddon.fit();

    terminal.writeln('LumaFlow Terminal v1.0.0');
    terminal.writeln('Type "help" for available commands');
    terminal.writeln('');

    let currentLine = '';
    terminal.onData(data => {
        switch (data) {
            case '\r': // Enter
                terminal.writeln('');
                if (currentLine.trim()) {
                    handleCommand(currentLine.trim());
                }
                currentLine = '';
                terminal.write('$ ');
                break;
            case '\u007F': // Backspace
                if (currentLine.length > 0) {
                    currentLine = currentLine.slice(0, -1);
                    terminal.write('\b \b');
                }
                break;
            default:
                currentLine += data;
                terminal.write(data);
        }
    });

    terminal.write('$ ');
});

function handleCommand(command: string) {
    // Here you would handle the command and return appropriate output
    switch (command) {
        case 'help':
            terminal.writeln('Available commands:');
            terminal.writeln('  help     - Show this help message');
            terminal.writeln('  clear    - Clear the terminal');
            terminal.writeln('  version  - Show LumaFlow version');
            break;
        case 'clear':
            terminal.clear();
            break;
        case 'version':
            terminal.writeln('LumaFlow v1.0.0');
            break;
        default:
            terminal.writeln(`Command not found: ${command}`);
    }
}

$: if (terminal && messages) {
    messages.forEach(msg => terminal.writeln(msg));
}
</script>

<div class="terminal-container" bind:this={container}></div>

<style>
.terminal-container {
    width: 100%;
    height: 300px;
    background-color: #1e1e1e;
    padding: var(--cds-spacing-03);
}
</style>

