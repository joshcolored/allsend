<script lang="ts">
  import { onMount } from "svelte";
  import { settingsPageOpen } from "../store/store";
  import { fade } from "svelte/transition";
  import { showToast } from "../utilities/misc";

  let name;
  let url;
  let oldUrl;
  // let visibility;

  onMount(() => {
    name = localStorage.getItem("name");
    url = localStorage.getItem("url");
    oldUrl = localStorage.getItem("url");
    // visibility = localStorage.getItem("visibility");
  });

  const handleNameChange = (e) => {
    name = e.target.value;
    localStorage.setItem("name", e.target.value);
    showToast("Please refresh the page after making any changes!");
  };

  const handleSelectChange = (e) => {
    if (e.target.value == "render") {
      url = "https://waterdrop-sqxs.onrender.com";
      localStorage.setItem("url", "https://sendent-server.onrender.com");
    } else if (e.target.value == "glitch") {
      url = "https://sendent-server.onrender.com";
      localStorage.setItem("url", "https://sendent-server.onrender.com");
    } else {
      if (
        oldUrl != "https://sendent-server.onrender.com" &&
        oldUrl != "https://sendent-server.onrender.com"
      ) {
        url = oldUrl;
        localStorage.setItem("url", oldUrl);
      } else {
        url = "";
      }
    }
    showToast("Please refresh the page after making any changes!");
  };

  const handleURLChange = (e) => {
    url = e.target.value;
    oldUrl = e.target.value;
    localStorage.setItem("url", e.target.value);
    showToast("Please refresh the page after making any changes!");
  };

  const closeSettings = () => {
    settingsPageOpen.set(false);
  };
</script>

<div
  class="flex w-screen flex-col items-center min-h-screen bg-gradient-to-br from-black via-[#10151c] to-[#1a8bbb]"
>
  <!-- Back button -->
  <div
    on:click={closeSettings}
    on:keypress={closeSettings}
    class="icon flex w-full justify-start mt-8 pl-3.5 mb-4 lg:cursor-pointer lg:pr-8 lg:ml-2 lg:mt-12"
  >
    <span class="material-symbols-rounded text-3xl text-white"> arrow_back </span>
  </div>

  <!-- Settings Card -->
  <div
    class="relative mx-4 w-full max-w-[480px] sm:max-w-[500px] md:max-w-[640px] lg:max-w-[800px] flex flex-col rounded-lg p-6 flex-grow"
  >
    <h1 class="mb-6 text-3xl font-medium text-[#1a8bbb]">Settings</h1>
    <hr class="border-gray-500" />

    <!-- Device Name -->
    <div class="settings-item my-6 w-full">
      <label for="name" class="mb-1 block text-lg font-medium text-white lg:text-xl">
        Device name:
      </label>
      <div class="mb-4 text-sm text-gray-300 lg:text-lg">
        Provide a specific name for this device such as 'iPhone 16',
        'Samsung Fold 5' or 'PC-NAME'.
      </div>
      <input
        class="h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm text-black lg:text-md"
        type="text"
        name="name"
        id="name"
        placeholder="Enter name here"
        value={name}
        on:change={handleNameChange}
      />
    </div>

    <hr class="border-gray-500" />

    <!-- Server Selection -->
    <div class="settings-item my-4 w-full">
      <label for="server" class="mb-2 block text-lg font-medium text-white lg:text-xl">
        Server:
      </label>
      <div class="mb-4 text-sm text-gray-300 lg:text-lg">
        Choose a server to connect to. For best performance, select a server geographically close to you. You can also run your own local server for enhanced privacy and control.
      </div>

      <select
        class="h-10 w-full rounded-lg bg-zinc-100 px-4 text-sm text-black lg:text-md"
        name="server"
        id="server"
        on:change={handleSelectChange}
      >
        <option
          value="render"
          selected={url == "https://sendent-server.onrender.com"}
        >
          Server 1
        </option>
        <option
          value="glitch"
          selected={url == "https://sendent-server.onrender.com"}
        >
          Default Server 2
        </option>
        <option value="local" selected={true}>Local Server</option>
      </select>

      <!-- Conditional Local URL Input -->
      <input
        class="mt-2 h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm text-black 
          {url == 'https://sendent-server.onrender.com' ? 'hidden' : ''}"
        type="text"
        name="local-server"
        id="local-server"
        placeholder="Enter local server URL"
        value={url}
        on:change={handleURLChange}
      />
    </div>

    <hr class="border-gray-500" />

    <div class="mt-8 text-center text-sm text-gray-300 lg:text-lg">
      Your settings are saved automatically, no action needed!
    </div>
  </div>
</div>


