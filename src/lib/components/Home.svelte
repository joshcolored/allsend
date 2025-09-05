<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    historyPageOpen,
    selectedFiles,
    settingsPageOpen,
    sheetVisible,
    textInput,
  } from "../store/store";
  import { showToast } from "../utilities/misc";
  import SendingSheet from "./SendingSheet.svelte";

  let unsubVisible;
  let visible;
  unsubVisible = sheetVisible.subscribe((arg) => {
    visible = arg;
  });

  const openSheet = () => {
    sheetVisible.set(true);
  };
  const closeSheet = () => {
    sheetVisible.set(false);
    selectedFiles.set([]);
    textInput.set("");
  };

  const openSettings = (ev: Event) => {
    ev.stopPropagation();
    settingsPageOpen.set(true);
  };
  const openHistory = (ev: Event) => {
    ev.stopPropagation();
    historyPageOpen.set(true);
  };

  const drop = (ev: DragEvent) => {
    let files: File[] = [];
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      [...ev.dataTransfer.items].forEach((item, i) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          files.push(file);
        }
      });
    } else {
      [...ev.dataTransfer.files].forEach((file, i) => {
        files.push(file);
      });
    }
    showToast(`${files.length} file(s) selected!`);
    selectedFiles.set(files);
    openSheet();
  };
  const drag = (ev: DragEvent) => {
    ev.preventDefault();
  };
</script>

<div
  on:drop={drop}
  on:dragover={drag}
  class="flex flex-col min-h-screen w-screen bg-gradient-to-br from-black via-[#10151c] to-[#1a8bbb]"
>
  <!-- Header icons -->
  <div
    on:click={openHistory}
    on:keypress={openHistory}
    class="icon flex w-full justify-end gap-4 px-4 pt-4 lg:cursor-pointer lg:px-8 lg:pt-6"
  >
    <span class="material-symbols-rounded text-3xl text-white drop-shadow-lg"> history </span>
    <span
      class="material-symbols-rounded text-3xl text-white drop-shadow-lg"
      on:click={openSettings}
      on:keypress={openSettings}
    >
      tune
    </span>
  </div>

  <!-- Main content -->
  <main class="flex flex-col flex-grow items-center justify-center w-full max-w-[900px] mx-auto px-4">
    <div class="text-center mb-8">
      <h1 class="text-3xl mb-0 lg:text-5xl font-medium text-[#1a8bbb] drop-shadow-lg">
        Welcome to AllSend!
      </h1>
      <h2 class="text-lg lg:text-3xl lg:mb-8 mt-2 font-medium text-[#e0eafc] drop-shadow">
        Transfer anything instantly, securely and privately.
      </h2>
      <p class="mt-2 text-sm lg:text-xl text-gray-400">What should this device do?</p>
    </div>

    <!-- Action cards -->
    <div
      class="flex flex-col md:flex-row gap-6 w-full max-w-[20rem] md:max-w-2xl items-stretch justify-center"
    >
      <!-- Send -->
      <div
        class="action-item w-full md:flex-1 flex flex-col items-center justify-center 
               bg-black/40 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-[#222c3a] 
               hover:bg-[#1a8bbb]/30 transition cursor-pointer"
        on:click={openSheet}
        on:keypress={openSheet}
      >
        <span class="material-symbols-rounded text-4xl text-[#1a8bbb] drop-shadow-lg">
          arrow_upward
        </span>
        <span class="mt-2 text-white font-semibold">Send</span>
      </div>

      <!-- Receive -->
      <div
        on:click={() => showToast("Listening for senders!")}
        on:keypress={() => showToast("Listening for senders!")}
        class="action-item w-full md:flex-1 flex flex-col items-center justify-center 
               bg-black/40 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-[#222c3a] 
               hover:bg-[#1a8bbb]/30 transition cursor-pointer"
      >
        <span class="material-symbols-rounded text-4xl text-[#1a8bbb] drop-shadow-lg">
          arrow_downward
        </span>
        <span class="mt-2 text-white font-semibold">Receive</span>
      </div>
    </div>

    <SendingSheet />
  </main>

  <!-- Footer -->
  <footer class="w-full text-center py-4 text-white lg:text-[22px] text-sm shadow-md">
    <p class="lg:mb-3">
      Developed by
      <a href="https://github.com/joshcolored" target="_blank" class="text-[#1a8bbb] hover:underline">
        📫 Joshua Grijaldo
      </a>
    </p>
    <p>&copy; {new Date().getFullYear()} AllSend. All rights reserved.</p>
  </footer>
</div>

<!-- Overlay -->
<div
  class:visible
  class="fixed left-0 top-0 z-10 hidden h-screen w-screen bg-black opacity-60 backdrop-blur-sm"
  on:click={closeSheet}
  on:keypress={closeSheet}
/>

<style>
  .visible {
    display: flex !important;
  }
  .action-item {
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 24px 0 rgba(26, 139, 187, 0.17);
    min-height: 150px; /* ensures equal height on mobile & desktop */
  }
  .action-item:hover {
    background: rgba(26, 139, 187, 0.18);
    box-shadow: 0 8px 32px 0 rgba(26, 139, 187, 0.27);
  }
</style>
