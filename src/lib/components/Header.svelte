<script lang="ts">
  let dropdown: Boolean = $state(false);
</script>

<header class="Header">
  <div class="main">
    <h1>Leaves of Grasstok.</h1>
  </div>
  <div class="dropdown">
    {#if dropdown}
    <p>Poems by <em>Walt Whitman</em></p>
    <p>
      Images from <a href="https://www.loc.gov/pictures/collection/fsa/"
        >the FSA/OWI collection</a
      > at the Library of Congress.
    </p>
    <p>
      Engineering by <a href="https://bsky.app/profile/johnwest.bsky.social"
        >John West</a
      >
    </p>
    <p>
      Embeddings by <a
        href="https://huggingface.co/docs/transformers/en/model_doc/clip"
        >CLIP</a
      >.
    </p>
    <p>Learn more <a href="https://github.com/jswest/leaves-of-grasstok">here</a>.</p>
    {/if}
    <button onclick={() => dropdown = !dropdown}>{dropdown ? "Close more." : "Learn more."}</button>
  </div>
</header>

<style>
  .Header {
    color: white;
    margin-bottom: calc(var(--unit));
    padding: calc(var(--unit) * 0.25) var(--unit);
    text-align: left;
  }
  .Header a {
    color: white;
    font-style: italic;
  }
  .Header h1 {
    font-size: calc(var(--unit) * 2);
    font-weight: 900;
    transform: scaleX(60%);
    transform-origin: 0 0;
  }
  .Header .dropdown,
  .Header .main {
    max-width: 500px;
    margin: 0 auto;
    width: 100%;
  }
</style>
