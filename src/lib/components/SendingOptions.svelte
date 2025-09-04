<script lang="ts">
  import { selectedFiles, textInput } from "../store/store";
  import { showToast } from "../utilities/misc";

  const getText = () => {
    var input = prompt("Enter text");
    if (input) {
      textInput.set(input);
    } else {
      textInput.set("");
    }
  };

  const openSelector = () => {
    document.getElementById("file-selector").click();
  };
  const handleFileInputs = (ev: Event) => {
    ev.preventDefault();
    const input = ev.target as HTMLInputElement;
    let files: File[] = [];
    [...input.files].forEach((file, i) => {
      files.push(file);
    });
    showToast(`${files.length} file(s) selected!`);
    selectedFiles.set(files);
  };
</script>

<div
  class="flex w-full shrink-0 grow-0 basis-full flex-col gap-6 p-6  lg:pb-6 bg-gradient-to-br from-black via-[#10151c] to-[#1a8bbb]"
>
  <div
    class="option-item mt-2 flex lg:cursor-pointer items-center"
    on:click={openSelector}
    on:keypress={openSelector}
  >
    <span class="material-symbols-rounded mr-4 text-white"> file_copy </span>
    <span class="text-white">Send files</span>
  </div>
  <div
    class="option-item flex lg:cursor-pointer items-center lg:mb-2"
    on:click={getText}
    on:keypress={getText}
  >
    <span class="material-symbols-rounded mr-4 text-white">
      text_fields
    </span>
    <span class="text-white">Send text</span>
  </div>
</div>

<input
  type="file"
  id="file-selector"
  class="hidden"
  multiple
  on:change={handleFileInputs}
/>
