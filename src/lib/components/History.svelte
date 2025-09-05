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

<div
  class="flex min-h-screen w-screen flex-col items-center justify-start bg-gradient-to-br from-black via-[#10151c] to-[#1a8bbb]"
>
  <!-- Back button -->
  <div
    on:click={goBack}
    on:keypress={goBack}
    class="icon mb-4 mt-8 flex w-full justify-start pl-3.5 lg:ml-2 lg:mt-12 lg:cursor-pointer lg:pr-8"
  >
    <span class="material-symbols-rounded text-3xl text-white">
      arrow_back
    </span>
  </div>

  <!-- Main content -->
  <div
    class="relative flex w-full max-w-[900px] flex-grow flex-col items-center"
  >
    <!-- Header with segmented buttons + clear-all -->
    <div class="flex w-full items-center justify-between px-6">
      <h1 class="text-3xl font-medium tracking-wide text-white lg:text-4xl">
        History
      </h1>

      <div class="flex items-center gap-4">
        <!-- Segmented buttons -->
        <div
          class="segmented-buttons flex overflow-hidden rounded-full bg-zinc-800 text-sm shadow-lg"
        >
          <button
            on:click={() => historyPageSection.set("sent")}
            class="rounded-l-full border-0 p-2 px-8 text-white transition-all duration-300 {$historyPageSection ==
            'sent'
              ? 'bg-[#1a8bbb] font-medium text-white shadow-md lg:text-lg'
              : 'hover:bg-zinc-700'}"
          >
            Sent
          </button>
          <button
            on:click={() => historyPageSection.set("received")}
            class="rounded-r-full border-0 p-2 px-4 text-white transition-all duration-300 {$historyPageSection ==
            'received'
              ? 'bg-[#1a8bbb] font-medium text-white shadow-md lg:text-lg'
              : 'hover:bg-zinc-700'}"
          >
            Received
          </button>
        </div>

        <!-- Clear-all button beside segmented buttons -->
        <button
          on:click={clear}
          on:keypress={clear}
          class="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 shadow-md transition-colors duration-300 hover:bg-rose-700 lg:h-12 lg:w-12"
        >
          <span class="material-symbols-rounded text-rose-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
              />
              <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>

    <!-- Content list -->
    <div
      class="my-6 mb-20 max-h-[70vh] w-full overflow-y-auto rounded-lg p-6 text-white"
    >
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
          <div
            class="flex h-[50vh] items-center justify-center text-lg font-light text-white"
          >
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
          <div
            class="flex h-[50vh] items-center justify-center text-lg font-light text-white"
          >
            Nothing here yet!
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
