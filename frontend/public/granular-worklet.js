import init, { GranularEngine } from "../src/rust/pkg/grain.js";

class GranularProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.engines = {}; // { 'a': GranularEngine, 's': GranularEngine, ... }
    this.activeKeys = new Set(); // which keys are currently pressed
    this.ready = false;

    this.port.onmessage = async (e) => {
      const msg = e.data;

      if (msg.type === "wasm") {
        await init({ bytes: msg.bytes });
        this.ready = true;
        this.port.postMessage({ type: "wasm-ready" });
        console.log("WASM initialized with sample bytes");
      } else if (msg.type === "samples") {
        console.log("Got samples", msg.key, msg.samples.byteLength);
        if (!this.ready) {
          console.error("WASM not initialized yet!");
          return;
        }
        const floatSamples = new Float32Array(msg.samples);
        console.log("Float samples length:", floatSamples.length);
        if (floatSamples.length === 0) {
          console.error("No audio data sent to WASM!");
        }
        this.engines[msg.key] = new GranularEngine(Array.from(floatSamples));
        console.log("Engine created", this.engines[msg.key]);
        this.port.postMessage({ type: "ready", key: msg.key });
      } else if (msg.type === "play") {
        if (this.engines[msg.key]) {
          this.activeKeys.add(msg.key);
        }
      } else if (msg.type === "stop") {
        this.activeKeys.delete(msg.key);
      } else if (msg.type === "set") {
        // Apply param to ALL engines for now
        Object.values(this.engines).forEach((engine) => {
          if (msg.key === "grain_size") engine.set_grain_size(msg.value);
          if (msg.key === "spawn_prob") engine.set_spawn_probability(msg.value);
          if (msg.key === "max_grains") engine.set_max_grains(msg.value);
        });
      }
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];

    if (!this.ready || this.activeKeys.size === 0) {
      // output silence
      for (let ch = 0; ch < output.length; ++ch) {
        output[ch].fill(0);
      }
      return true;
    }

    const renderQuantum = output[0].length;
    console.log(
      "renderQuantum:",
      renderQuantum,
      "activeKeys:",
      this.activeKeys.size
    );
    const monoMix = new Float32Array(renderQuantum);

    // Mix all active engines together
    for (const key of this.activeKeys) {
      const engine = this.engines[key];
      if (!engine) continue;

      const temp = new Float32Array(renderQuantum);
      console.log("fill_buffer start");
      engine.fill_buffer(temp);
      console.log("temp after fill", temp.slice(0, 10));

      for (let i = 0; i < renderQuantum; i++) {
        monoMix[i] += temp[i];
      }
    }

    // Simple mono → stereo copy
    for (let ch = 0; ch < output.length; ch++) {
      output[ch].set(monoMix);
    }

    return true;
  }
}

registerProcessor("granular-processor", GranularProcessor);
