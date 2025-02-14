<script lang="ts">
  const { imageFilename, tint }: { imageFilename: string; tint: number[] } =
    $props();

  const width = 500;
  const height = 500;

  let canvas: HTMLCanvasElement | undefined = $state();
  let context: CanvasRenderingContext2D | null | undefined = $state();

  function cover(
    imageWidth: number,
    imageHeight: number,
    targetWidth: number,
    targetHeight: number,
  ) {
    const targetRatio = targetWidth / targetHeight;
    const imageRatio = imageWidth / imageHeight;

    let renderWidth = targetWidth;
    let renderHeight = targetHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imageRatio > targetRatio) {
      renderHeight = targetHeight;
      renderWidth = imageWidth * (targetHeight / imageHeight);
      offsetX = -(renderWidth - targetWidth) / 2;
    } else {
      renderWidth = targetWidth;
      renderHeight = imageHeight * (targetWidth / imageWidth);
      offsetY = -(renderHeight - targetHeight) / 2;
    }

    return { renderWidth, renderHeight, offsetX, offsetY };
  }

  function apply() {
    const image = new Image();
    image.onload = () => {
      if (!canvas || !context) {
        return;
      }
      canvas.width = width;
      canvas.height = height;

      const { renderWidth, renderHeight, offsetX, offsetY } = cover(
        image.width,
        image.height,
        width,
        height,
      );

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i];
        const factor = gray / 255;
        data[i] = tint[0] + (255 - tint[0]) * factor;
        data[i + 1] = tint[1] + (255 - tint[1]) * factor;
        data[i + 2] = tint[2] + (255 - tint[2]) * factor;
      }

      context.putImageData(imageData, 0, 0);
    };
    image.src = imageFilename;
  }

  $effect(() => {
    if (canvas) {
      context = canvas.getContext("2d");
      apply();
    }
  });
</script>

<canvas bind:this={canvas} class="Image" {height} {width}></canvas>

<style>
  .Image {
    border: 1px solid white;
    box-sizing: border-box;
    height: auto;
    width: 100%;
  }
</style>
