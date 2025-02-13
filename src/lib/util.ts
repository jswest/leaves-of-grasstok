export type Chunk = {
  body: string;
  book: string | undefined;
  chunkIndex: number;
  embedding: number[];
  id: string;
  image: string;
  ms: number;
  reduced: number[];
  poemIndex: number;
  title: string | undefined;
};

export function distance(a: number[], b: number[]) {
  return Math.sqrt(
    a.reduce((sum: number, val: number, i: number) => sum + Math.pow(val - b[i], 2), 0)
  );
}

export function average(chunks: Chunk[]) {
  const last = chunks.slice(-10);
  const size = last[0].embedding.length;
  const sum = new Array(size).fill(0);
  let totalMs = 0;

  for (const item of last) {
    let weight = item.ms || 1;
    if (weight > 10000) {
      weight = 10000;
    }
    totalMs += weight;
    for (let i = 0; i < size; i++) {
      sum[i] += item.embedding[i] * weight;
    }
  }

  return sum.map(val => val / totalMs);
}