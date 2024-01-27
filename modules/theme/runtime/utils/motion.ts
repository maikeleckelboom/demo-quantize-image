function getScaleYFromMatrix(transform: string) {
  return transform === 'none' ? 1 : Number(transform.split(',')[3]);
}

export { getScaleYFromMatrix };
