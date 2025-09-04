<script lang="ts">
  import ClipboardJS from "clipboard/dist/clipboard.min.js";

  import { sameDeviceAlreadyInRoomErrorModalVisible } from "../store/store";
  import { onDestroy, onMount } from "svelte";
  import { showToast } from "../utilities/misc";
  import initializeSocket from "../utilities/initializeSocket";

  let visible: boolean;
  const unsubscribe = sameDeviceAlreadyInRoomErrorModalVisible.subscribe(
    (val) => {
      visible = val;
    }
  );

  const connectAnyways = () => {
    initializeSocket("forced");
    sameDeviceAlreadyInRoomErrorModalVisible.set(false);
  };
  onDestroy(unsubscribe);
</script>

<div
  class="modal fixed top-0 z-50 box-border hidden h-screen w-screen bg-gradient-to-br from-black via-[#10151c] to-[#1a8bbb]"
  class:visible
/>
<div
  class="wrapper fixed top-0 z-50 box-border hidden h-screen w-screen items-center justify-center"
  class:visible
>
  <div
    class="m-4 block w-72 overflow-hidden rounded-xl bg-white bg-opacity-10 p-6 backdrop-blur-md shadow-lg lg:w-96"
    style="border: 1px solid rgba(255, 255, 255, 0.2);"
  >
    <h5 class="mb-2 text-2xl lg:text-xl font-medium text-white">
        Oops!</h5>
    <p id="content" class="line-clamp-6 text-sm font-normal text-gray-200">
      A device with the same name is already connected to Sendent!
    </p>
    <div class="mt-4 flex w-full justify-end gap-2">
      <button
        data-clipboard-target="#content"
        class="copy-button mt-2 w-full rounded-lg bg-[#1a8bbb] bg-opacity-80 p-2 px-4 font-medium text-white hover:bg-opacity-100"
        on:click={connectAnyways}>Connect Anyways</button
      >
    </div>
  </div>
</div>

<style>
  .visible {
    display: flex !important;
  }
</style>
