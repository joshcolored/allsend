<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    historyPageOpen,
    historyPageSection,
    sendingList,
    receivingList,
    currentlySending,
    currentlyReceiving,
    sendingQueue,
    receivingQueue,
    sentList,
    receivedList,
    sheetVisible,
  } from "../store/store";
  import FileProgressCard from "./FileProgressCard.svelte";
  import { get } from "svelte/store";

  const goBack = () => {
    historyPageOpen.set(false);
    sheetVisible.set(false);
  };
  const clear = () => {
    if (get(historyPageSection) == "received") {
      let choice = confirm("Clear history for all received files?");
      if (choice) {
        let $totalList = get(receivingList);
        let $alreadyReceived = get(receivedList);
        $alreadyReceived.forEach((values, key) => {
          $totalList.delete(key);
        });
        receivingList.set($totalList);
      }
    } else {
      let choice = confirm("Clear history for all sent files?");
      if (choice) {
        let $totalList = get(sendingList);
        let $alreadySent = get(sentList);
        $alreadySent.forEach((values, key) => {
          $totalList.delete(key);
        });
        sendingList.set($totalList);
      }
    }
  };
</script>

<div class="flex w-screen flex-col items-center justify-start min-h-screen bg-gradient-to-br from-black via-[#10151c] to-[#1a8bbb]">
  <!-- Back button -->
  <div
    on:click={goBack}
    on:keypress={goBack}
    class="icon flex w-full justify-start mt-8 pl-3.5 mb-4 lg:cursor-pointer lg:pr-8 lg:ml-2 lg:mt-12"
  >
    <span class="material-symbols-rounded text-3xl text-white"> arrow_back </span>
  </div>

  <!-- Main content -->
  <div class="relative flex flex-col flex-grow w-full max-w-[900px] items-center">
    <!-- Header with segmented buttons + clear-all -->
    <div class="flex w-full items-center justify-between px-6">
      <h1 class="text-3xl font-medium text-white tracking-wide lg:text-4xl">History</h1>

      <div class="flex items-center gap-4">
        <!-- Segmented buttons -->
        <div class="segmented-buttons flex text-sm bg-zinc-800 rounded-full overflow-hidden shadow-lg">
          <button
            on:click={() => historyPageSection.set("sent")}
            class="rounded-l-full border-0 text-white p-2 px-8 transition-all duration-300 {$historyPageSection ==
            'sent'
              ? 'bg-[#1a8bbb] font-medium text-white lg:text-lg shadow-md'
              : 'hover:bg-zinc-700'}">
            Sent
          </button>
          <button
            on:click={() => historyPageSection.set("received")}
            class="rounded-r-full border-0 text-white p-2 px-4 transition-all duration-300 {$historyPageSection ==
            'received'
              ? 'bg-[#1a8bbb] font-medium text-white lg:text-lg shadow-md'
              : 'hover:bg-zinc-700'}">
            Received
          </button>
        </div>

        <!-- Clear-all button beside segmented buttons -->
        <button
          on:click={clear}
          on:keypress={clear}
          class="ml-2 flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-rose-600 shadow-md hover:bg-rose-700 transition-colors duration-300"
        >
          <span class="material-symbols-rounded text-rose-100"> clear_all </span>
        </button>
      </div>
    </div>

    <!-- Content list -->
    <div class="my-6 mb-20 w-full overflow-y-auto rounded-lg p-6 text-white max-h-[70vh]">
      {#if $historyPageSection == "sent"}
        {#if [...$sendingList.keys()].length}
          {#each [...$currentlySending.values(), ...$sendingQueue.values()] as progressInfo}
            <FileProgressCard
              fileName={progressInfo.fileName}
              fileType={progressInfo.fileType}
              progressSize={progressInfo.sentSize}
              size={progressInfo.size}
              deviceID={progressInfo.to}
            />
          {/each}
        {:else}
          <div class="flex h-[50vh] items-center justify-center text-white text-lg font-light">
            Nothing here yet!
          </div>
        {/if}
      {/if}

      {#if $historyPageSection == "received"}
        {#if [...$receivingList.keys()].length}
          {#each [...$currentlyReceiving.entries(), ...$receivingQueue.entries()] as progressInfo}
            <FileProgressCard
              fileName={progressInfo[1].fileName}
              fileType={progressInfo[1].fileType}
              progressSize={progressInfo[1].receivedSize}
              size={progressInfo[1].size}
              deviceID={progressInfo[1].from}
              link={progressInfo[1].link}
              id={progressInfo[0]}
            />
          {/each}
        {:else}
          <div class="flex h-[50vh] items-center justify-center text-white text-lg font-light">
            Nothing here yet!
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
