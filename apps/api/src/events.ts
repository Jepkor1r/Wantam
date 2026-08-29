let generation = 0;

export function bump(): number {
  generation += 1;
  return generation;
}

export function gen(): number {
  return generation;
}
