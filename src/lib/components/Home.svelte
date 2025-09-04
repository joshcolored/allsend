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
  class="flex w-screen flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#10151c] to-[#1a8bbb]"
>
  <div
    on:click={openHistory}
    on:keypress={openHistory}
    class="icon mb-6 flex w-full justify-end gap-4 pr-3 pt-4 lg:cursor-pointer lg:pr-8 lg:pt-6"
  >
    <span class="material-symbols-rounded text-2xl text-white drop-shadow-lg"> history </span>
    <span
      class="material-symbols-rounded text-2xl text-white drop-shadow-lg"
      on:click={openSettings}
      on:keypress={openSettings}
    >
      tune
    </span>
  </div>
  <div
    class="relative flex h-screen w-full max-w-[900px] flex-col items-center justify-between"
  >
    <div class="m-8 text-center">
      <h1 class="text-2xl font-medium md:text-xl lg:text-3xl text-[#1a8bbb] drop-shadow-lg">
        Welcome to AllSend!
      </h1>
      <h2 class="text-2xl mt-4 font-medium md:text-xl lg:text-xl text-[#e0eafc] drop-shadow">
        Transfer anything instantly, securely and privately.
      </h2>
      <p class="mt-2 text-sm text-gray-400">What should this device do?</p>
    </div>
    <div class="relative h-[60vh] w-full flex items-center justify-center">
      <div
      class="absolute left-1/2 top-[15%] -translate-x-1/2 -translate-y-1/2 h-[60%] w-[75%] rounded-3xl border border-[#222c3a] bg-black/60 backdrop-blur-lg shadow-2xl glass-card flex flex-col items-center justify-center lg:w-[45%] lg:h-[65%] lg:top-[35%]"
      >
      <div class="flex flex-col gap-8 w-full items-center justify-center px-8 py-12">
        <div
        class="action-item flex w-full max-w-xs flex-col items-center justify-center text-sm lg:cursor-pointer bg-black/40 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-[#222c3a] hover:bg-[#1a8bbb]/30 transition"
        on:click={openSheet}
        on:keypress={openSheet}
        >
        <span class="material-symbols-rounded text-4xl text-[#1a8bbb] drop-shadow-lg">
          arrow_upward
        </span>
        <span class="mt-2 text-white font-semibold">Send</span>
        </div>
        <div
        on:click={() => showToast("Listening for senders!")}
        on:keypress={() => showToast("Listening for senders!")}
        class="action-item flex w-full max-w-xs flex-col items-center justify-center text-sm lg:cursor-pointer bg-black/40 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-[#222c3a] hover:bg-[#1a8bbb]/30 transition"
        >
        <span class="material-symbols-rounded text-4xl text-[#1a8bbb] drop-shadow-lg">
          arrow_downward
        </span>
        <span class="mt-2 text-white font-semibold">Receive</span>
        </div>
      </div>
      </div>
    </div>
    <SendingSheet />
  </div>
<footer class="fixed bottom-0 left-0 w-full  text-center py-4 text-white text-sm shadow-md">
  <p>
    Developed by 
    <a href="https://github.com/joshcolored" target="_blank" class="text-[#1a8bbb] hover:underline">
      📫 Joshua Grijaldo
    </a>
  </p>
  <p>&copy; {new Date().getFullYear()} AllSend. All rights reserved.</p>
</footer>

</div>
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
  .glass-card {
    box-shadow: 0 8px 32px 0 rgba(26, 139, 187, 0.37);
    border-radius: 24px;
    border: 1px solid rgba(26, 139, 187, 0.18);
    background: rgba(16, 21, 28, 0.7);
    backdrop-filter: blur(12px);
  }
  .action-item {
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 24px 0 rgba(26, 139, 187, 0.17);
  }
  .action-item:hover {
    background: rgba(26, 139, 187, 0.18);
    box-shadow: 0 8px 32px 0 rgba(26, 139, 187, 0.27);
  }
</style>
