function generateECG(samples = 250, hr = 75) {
  const arr = [];
  const beatInterval = 60 / hr;

  for (let i = 0; i < samples; i++) {
    const t = i / 250;

    let v = 0;

    // P wave
    v += 0.1 * Math.sin(2 * Math.PI * (t / beatInterval));

    // QRS spike
    if (Math.abs((t % beatInterval) - 0.02) < 0.01) {
      v += 1.2;
    }

    // T wave
    if (Math.abs((t % beatInterval) - 0.25) < 0.04) {
      v += 0.3;
    }

    arr.push(Number(v.toFixed(3)));
  }

  return arr;
}

console.log(JSON.stringify(generateECG(250)));
