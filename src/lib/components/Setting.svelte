<script lang="ts">
  import { onMount } from "svelte";
  import { settingsPageOpen } from "../store/store";
  import { showToast } from "../utilities/misc";

  let name: string;
  let url: string;
  let oldUrl: string;

  // Detect device type from user agent
  const detectDeviceType = (): string => {
    const ua = navigator.userAgent;

    if (/windows/i.test(ua)) return "Windows-PC";
    if (/macintosh|mac os x/i.test(ua)) return "Mac";
    if (/iphone/i.test(ua)) return "iPhone";
    if (/ipad/i.test(ua)) return "iPad";
    if (/android/i.test(ua)) return "Android";
    if (/linux/i.test(ua)) return "Linux";

    return "Device"; // fallback
  };

  // Generate device name like "iPhone-4821"
  const generateDeviceName = () => {
    const device = detectDeviceType();
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return `${device}-${randomId}`;
  };

  onMount(() => {
    // Load saved name or leave blank (so placeholder shows auto-generated)
    name = localStorage.getItem("name") || "";

    url = localStorage.getItem("url");
    oldUrl = localStorage.getItem("url");
  });

  // Helper to save and refresh
  const saveAndRefresh = (key: string, value: string) => {
    localStorage.setItem(key, value);
    showToast("Settings updated — refreshing...");
    setTimeout(() => {
      location.reload();
    }, 1200); // 1.2s delay so toast is visible
  };

  const handleNameChange = (e) => {
    name = e.target.value.trim();
    if (name.length === 0) {
      // If user clears input, regenerate default
      name = generateDeviceName();
    }
    saveAndRefresh("name", name);
  };

  const handleSelectChange = (e) => {
    if (e.target.value == "render") {
      url = "https://sendent-server.onrender.com";
      saveAndRefresh("url", url);
    } else if (e.target.value == "glitch") {
      url = "https://sendent-server.onrender.com";
      saveAndRefresh("url", url);
    } else {
      if (
        oldUrl != "https://sendent-server.onrender.com" &&
        oldUrl != "https://sendent-server.onrender.com"
      ) {
        url = oldUrl;
        saveAndRefresh("url", oldUrl);
      } else {
        url = "";
        saveAndRefresh("url", "");
      }
    }
  };

  const handleURLChange = (e) => {
    url = e.target.value;
    oldUrl = e.target.value;
    saveAndRefresh("url", url);
  };

  const closeSettings = () => {
    settingsPageOpen.set(false);
  };
</script>

<div
  class="flex min-h-screen w-screen flex-col items-center bg-gradient-to-br from-black via-[#10151c] to-[#1a8bbb]"
>
  <!-- Back button -->
  <div
    on:click={closeSettings}
    on:keypress={closeSettings}
    class="icon mb-4 mt-8 flex w-full justify-start pl-3.5 lg:ml-2 lg:mt-12 lg:cursor-pointer lg:pr-8"
  >
    <span class="material-symbols-rounded text-3xl text-white">
      arrow_back
    </span>
  </div>

  <!-- Settings Card -->
  <div
    class="relative mx-4 flex w-full max-w-[480px] flex-grow flex-col rounded-lg p-6 sm:max-w-[500px] md:max-w-[640px] lg:max-w-[800px]"
  >
    <h1 class="mb-6 text-3xl font-medium text-[#1a8bbb]">Settings</h1>
    <hr class="border-gray-500" />

    <!-- Device Name -->
    <div class="settings-item my-6 w-full">
      <label
        for="name"
        class="mb-1 block text-lg font-medium text-white lg:text-xl"
      >
        Device name:
      </label>
      <div class="mb-4 text-sm text-gray-300 lg:text-lg">
        Provide a specific name for this device such as 'iPhone 16', 'Samsung
        Fold 5' or 'PC-NAME'.
      </div>
      <input
        class="lg:text-md h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm text-black"
        type="text"
        name="name"
        id="name"
        placeholder={name || generateDeviceName()}
        bind:value={name}
        on:change={handleNameChange}
      />
    </div>

    <hr class="border-gray-500" />

    <!-- Server Selection -->
    <div class="settings-item my-4 w-full">
      <label
        for="server"
        class="mb-2 block text-lg font-medium text-white lg:text-xl"
      >
        Server:
      </label>
      <div class="mb-4 text-sm text-gray-300 lg:text-lg">
        Choose a server to connect to. For best performance, select a server
        geographically close to you. You can also run your own local server for
        enhanced privacy and control.
      </div>

      <select
        class="lg:text-md h-10 w-full rounded-lg bg-zinc-100 px-4 text-sm text-black"
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
