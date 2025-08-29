import init, { GranularEngine } from "../src/rust/pkg/grain.js";

const engines = {}; // { key: GranularEngine }
let ready = false;

// Generate a buffer for the worklet to consume
self.onmessagegenerate = (bufferLength) => {
  const renderBuffer = new Float32Array(bufferLength).fill(0);

  Object.values(engines).forEach((engine) => {
    if (!engine.active) return;

    const temp = new Float32Array(bufferLength);
    engine.fill_buffer(temp);
    for (let i = 0; i < bufferLength; i++) {
      renderBuffer[i] += temp[i];
    }
  });

  return renderBuffer;
};

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === "wasm") {
    await init({ bytes: msg.bytes });
    ready = true;
    self.postMessage({ type: "wasm-ready" });
    console.log("WASM initialized in Worker");
  } else if (msg.type === "samples") {
    if (!ready) {
      console.error("WASM not initialized yet!");
      return;
    }
    const floatSamples = new Float32Array(msg.samples);
    engines[msg.key] = new GranularEngine(Array.from(floatSamples));
    console.log("Engine created in Worker", msg.key);
  } else if (msg.type === "play") {
    if (engines[msg.key]) {
      engines[msg.key].active = true;
    }
  } else if (msg.type === "stop") {
    if (engines[msg.key]) engines[msg.key].active = false;
  } else if (msg.type === "set") {
    Object.values(engines).forEach((engine) => {
      if (msg.key === "grain_size") {
        engine.set_grain_size(msg.value);
      }
      if (msg.key === "spawn_prob") engine.set_spawn_probability(msg.value);
      if (msg.key === "max_grains") engine.set_max_grains(msg.value);
    });
  } else if (msg.type == "generate") {
    const renderBuffer = self.onmessagegenerate(msg.bufferLength);
    // dropping reference for now... fix later to avoid copying
    self.postMessage({ buffer: renderBuffer }, [renderBuffer.buffer]);
  }
};
