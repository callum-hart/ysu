async function getRandomPhoto() {
  const res = await fetch("https://picsum.photos/300");
  const blob = await res.blob();

  return { imageUrl: URL.createObjectURL(blob) };
}

export { getRandomPhoto };
