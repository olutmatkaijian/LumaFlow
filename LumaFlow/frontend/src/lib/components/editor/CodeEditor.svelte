<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import * as monaco from 'monaco-editor';

export let value = '';
export let language = 'python';
export let theme = 'vs-dark';
export let readonly = false;

let editor: monaco.editor.IStandaloneCodeEditor;
let container: HTMLElement;

onMount(() => {
    editor = monaco.editor.create(container, {
        value,
        language,
        theme,
        readOnly: readonly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        tabSize: 4,
        insertSpaces: true,
    });

    editor.onDidChangeModelContent(() => {
        value = editor.getValue();
    });

    // Register Python language features
    monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: () => {
            const suggestions = [
                {
                    label: 'MaterialStream',
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: 'MaterialStream',
                    detail: 'Class for handling material streams',
                },
                // Add more autocomplete suggestions as needed
            ];
            return { suggestions };
        }
    });
});

onDestroy(() => {
    if (editor) {
        editor.dispose();
    }
});

$: if (editor && value !== editor.getValue()) {
    editor.setValue(value);
}
</script>

<div class="editor" bind:this={container}></div>

<style>
.editor {
    width: 100%;
    height: 100%;
}
</style>

