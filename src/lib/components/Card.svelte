<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";

  import Image from "$lib/components/Image.svelte";
  import type { Chunk } from "$lib/util";

  const {
    chunk,
    handleNext,
    tint,
  }: {
    chunk: Chunk;
    handleNext: MouseEventHandler<HTMLButtonElement>;
    tint: number[];
  } = $props();
</script>

<div class="Card">
  <div class="image">
    {#if chunk.image}
      <!-- svelte-ignore a11y_missing_attribute -->
      <Image imageFilename="image-{chunk.image}" {tint} />
    {/if}
  </div>
  <div class="body">
    {#each chunk.body.split("\n") as line}
      <p>{line}</p>
    {/each}
    <div class="meta">
      {#if chunk.title}
        <h1><em>From</em> &ldquo;{chunk.title}&rdquo;</h1>
      {/if}
      {#if chunk.book}
        <h1>{chunk.book} of <em>Leaves of Grass</em></h1>
      {/if}
    </div>
  </div>
  <button class="next" onclick={handleNext}> Next.</button>
</div>

<style>
  .Card {
    box-sizing: border-box;
    margin: 0 auto;
    max-width: 500px;
    position: relative;
    width: 100%;
    z-index: 10;
  }
  .Card .body {
    color: white;
    margin-top: var(--unit);
  }
  .Card .image {
    height: 500px;
    width: 500px;
  }
  .Card .meta h1 {
    font-size: calc(var(--unit));
    font-style: italic;
    font-weight: 300;
  }
  .Card .meta {
    margin-top: calc(var(--unit));
  }
  .Card p {
    font-size: var(--unit);
    font-weight: 600;
    line-height: 1.25;
    text-indent: var(--unit) hanging;
  }
</style>