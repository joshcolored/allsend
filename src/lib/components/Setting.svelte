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
  class="flex h-screen w-screen flex-col bg-white justify-center items-center"
>
  <div
    on:click={closeSettings}
    on:keypress={closeSettings}
    class="icon mb-6 flex w-full justify-start pl-3 pt-4 lg:cursor-pointer lg:pr-8 lg:pt-6"
  >
    <span class="material-symbols-rounded text-3xl"> arrow_back </span>
  </div>
  <div class="relative mx-8 flex h-screen max-w-[370px] flex-col">
    <h1 class="mb-8 text-3xl font-medium">Settings</h1>
    <hr>
    <div class="settings-item my-6 w-full">
      <label for="name" class="mb-1 block text-lg font-medium"
        >Device name:</label
      >
      <div class="mb-4 text-xs text-gray-500">
        Provide a specific name for this device such as 'iPhone 12',
        'Lenovo ThinkPad' or 'moto g52'.
      </div>
      <input
        class="h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm"
        type="text"
        name="name"
        id="name"
        placeholder="Enter name here"
        value={name}
        on:change={handleNameChange}
      />
    </div>
    <hr>
    <div class="settings-item my-4 w-full">
      <label for="name" class="mb-2 block text-lg font-medium">Server:</label>
      <div class="mb-4 text-xs text-gray-500">
      Please input your local IP Address located in your settings on IOS or Android. If you're using PC, please run Command Prompt and type "ipconfig" to get your IP Address.
      </div>

      <select
        class="h-10 w-full rounded-lg bg-zinc-100 px-4 text-sm"
        name="name"
        id="name"
        on:change={handleSelectChange}
      >
        <option
          value="render"
          selected={url == "https://sendent-server.onrender.com"}
          >Server 1</option
        >
        <option
          value="glitch"
          selected={url == "https://sendent-server.onrender.com"}
          >Server 2</option
        >
        <option value="local" selected={true}>Local Server</option>
      </select>
      <input
        class="mt-2 h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm {url ==
          'https://sendent-server.onrender.com' ||
        url == 'https://sendent-server.onrender.com'
          ? 'hidden'
          : ''}"
        type="text"
        name="name"
        id="name"
        placeholder="enter local server url"
        value={url}
        on:change={handleURLChange}
      />
    </div>
      <!--<input
        class="mt-2 h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm"
        type="text"
        name="name"
        id="name"
        placeholder="Enter local server url"
        on:change={handleURLChange}
      />-->
    <hr>
    <div class="mt-8 text-center text-xs text-gray-500">No need to worry, settings are auto saved!</div>
  </div>
</div>
