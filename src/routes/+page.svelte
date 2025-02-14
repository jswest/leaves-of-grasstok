<script lang="ts">
  import { extent, scaleLinear } from "d3";
  import type { ScaleLinear } from "d3";
  import { onMount } from "svelte";

  import { average, distance } from "$lib/util";
  import type { Chunk } from "$lib/util";

  import Card from "$lib/components/Card.svelte";
  import Header from "$lib/components/Header.svelte";
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
  let height: number = $state(0);
  let history: Chunk[] = $state([]);
  let first: Chunk[] = $state([
    chunks[Math.floor(Math.random() * chunks.length)],
    chunks[Math.floor(Math.random() * chunks.length)],
    chunks[Math.floor(Math.random() * chunks.length)],
  ]);
  let g: ScaleLinear<number, number> = $state(scaleLinear());
  let r: ScaleLinear<number, number> = $state(scaleLinear());
  let timestampBegin: number = $state(0);
  let timestampEnd: number = $state(0);
  let tint: number[] = $state([50, 50, 50]);
  let x: ScaleLinear<number, number> = $state(scaleLinear());
  let y: ScaleLinear<number, number> = $state(scaleLinear());
  let width: number = $state(0);

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

    const xExtent = extent(chunks, (d: Chunk): number => d.reduced[0]) as [
      number,
      number,
    ];
    const yExtent = extent(chunks, (d: Chunk): number => d.reduced[1]) as [
      number,
      number,
    ];
    g = scaleLinear()
      .domain(xExtent ? xExtent : [0, 1])
      .range([50, 150])
      .nice();
    r = scaleLinear().domain(yExtent).range([50, 150]).nice();
    x = scaleLinear().domain(xExtent).range([0, width]).nice();
    y = scaleLinear().domain(yExtent).range([0, height]).nice();
    current = first[0];
  });

  $effect(() => {
    if (current) {
      tint = [r(current.reduced[1]), g(current.reduced[0]), 50];
    }
  });
</script>

<div class="Page" style="background-color: rgb({tint[0]},{tint[1]},{tint[2]})">
  <div class="guts">
    <Header />
    {#if current}
      <Card chunk={current} {handleNext} {tint} />
    {/if}
  </div>
</div>

<style>
  .Page {
    height: 100vh;
    left: 0;
    overflow: scroll;
    position: fixed;
    top: 0;
    width: 100vw;
  }
  .Page .guts {
    box-sizing: border-box;
    margin: 0 auto;
    max-width: 500px;
    padding: calc(var(--unit) * 0.5);
    width: 100%;
  }
  :global(button) {
    background-color: transparent;
    border: 1px solid white;
    border-radius: none;
    color: white;
    cursor: pointer;
    display: block;
    font-size: calc(var(--unit));
    margin-top: calc(var(--unit));
    padding: calc(var(--unit) * 0.1) 0;
    width: 100%;
  }
</style>
