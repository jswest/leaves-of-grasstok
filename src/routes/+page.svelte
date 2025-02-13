<script lang="ts">
  import { extent, scaleLinear } from "d3";
  import { onMount } from "svelte";

  import { average, distance } from "$lib/util";
  import type { Chunk } from "$lib/util";

  import data from "$lib/data.json";

  const chunks: Chunk[] = [];
  for (let i = 0; i < data.length; i++) {
    const poem = data[i];
    for (let j = 0; j < poem.chunks.length; j++) {
      const chunk = poem.chunks[j];
      chunks.push({
        body: chunk.body,
        book: poem.book,
        chunkIndex: j,
        embedding: chunk.embedding,
        id: `${i}-${j}`,
        image: chunk.image,
        ms: 0,
        poemIndex: i,
        title: poem.title,
        reduced: chunk.reduced,
      });
    }
  }

  let current: Chunk | null = $state(null);
  let height = $state(0);
  let history: Chunk[] = $state([]);
  let first: Chunk[] = $state([
    chunks[Math.floor(Math.random() * chunks.length)],
    chunks[Math.floor(Math.random() * chunks.length)],
    chunks[Math.floor(Math.random() * chunks.length)],
  ]);
  let g = $state();
  let r = $state();
  let timestampBegin = $state(0);
  let timestampEnd = $state(0);
  let x = $state();
  let y = $state();
  let width = $state(0);

  const handleNext = () => {
    if (current) {
      timestampEnd = new Date().getTime();
      current.ms = timestampEnd - timestampBegin;
      timestampBegin = new Date().getTime();
      timestampEnd = 0;
      history.push(current);
    }
    if (history.length >= first.length) {
      const location = average(history);
      let minDistance = Infinity;
      let nearest = null;
      for (const chunk of chunks) {
        const extant = history.find((h) => h.id === chunk.id);
        if (!extant) {
          const dist = distance(location, chunk.embedding);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = chunk;
          }
        }
      }
      current = nearest;
    } else {
      current = first[history.length];
    }
  };

  onMount(() => {
    height = window.innerHeight;
    width = window.innerWidth;

    const xExtent = extent(chunks, (d: Chunk): number => d.reduced[0]) as [number, number];
    const yExtent = extent(chunks, (d: Chunk): number => d.reduced[1]) as [number, number];
    g = scaleLinear()
      .domain(xExtent ? xExtent : [0, 1])
      .range([50, 255])
      .nice();
    r = scaleLinear()
      .domain(yExtent)
      .range([50, 255])
      .nice();
    x = scaleLinear()
      .domain(xExtent)
      .range([0, width])
      .nice();
    y = scaleLinear()
      .domain(yExtent)
      .range([0, height])
      .nice();
    current = first[0];
  });
</script>

<div class="Page">
  <div class="card">
    <header>
      <h1>Leaves of Grasstok</h1>
    </header>
    {#if current}
      <div class="image">
        {#if current.image}
          <!-- svelte-ignore a11y_missing_attribute -->
          <img src="image-{current.image}" width="70%" />
        {/if}
      </div>
      {#each current.body.split("\n") as line}
        <p>{line}</p>
      {/each}
      <div class="meta">
        {#if current.title}
          <h1><em>From</em> &ldquo;{current.title}&rdquo;</h1>
        {/if}
        {#if current.book}
          <h1>{current.book} of <em>Leaves of Grass</em></h1>
        {/if}
      </div>
    {/if}
    <button class="next" onclick={handleNext}> Next.</button>
  </div>
</div>

<style>
  .card header {
    background-color: black;
    color: white;
    margin-bottom: calc(var(--unit));
    padding: calc(var(--unit) * 0.25) var(--unit);
  }
  .card header h1 {
    font-size: calc(var(--unit) * 1.5);
    font-weight: 100;
    text-transform: uppercase;
    transform: scaleX(75%);
    transform-origin: 0 0;
  }
  .card {
    background-color: rgba(255, 255, 255, 0.75);
    border: 0.5px solid black;
    box-sizing: border-box;
    margin: calc(var(--unit) * 2) auto;
    padding: calc(var(--unit) * 0.5);
    position: relative;
    width: 500px;
    z-index: 10;
  }
  .card h1 {
    font-size: calc(var(--unit) * 0.6);
  }
  .card .image img {
    display: block;
    margin: 0 auto var(--unit) auto;
  }
  .card .meta {
    margin-top: calc(var(--unit));
  }
  .card .next {
    background-color: black;
    border: none;
    border-radius: none;
    color: white;
    cursor: pointer;
    display: block;
    font-size: calc(var(--unit) * 0.8);
    margin-top: calc(var(--unit));
    padding: calc(var(--unit) * 0.1) 0;
    width: 100%;
  }
  .card p {
    font-size: calc(var(--unit) * 0.8);
    line-height: calc(var(--unit) * 0.8 * 1.5);
  }
</style>
