class GranularProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferQueue = [];
    this.workerPort = null;

    // Listen for audio buffers from the worker
    this.port.onmessage = (e) => {
      if (e.data.buffer) {
        const buf = new Float32Array(e.data.buffer);
        this.bufferQueue.push(buf);
      }
    };
  }

  process(inputs, outputs) {
    const output = outputs[0];
    if (this.bufferQueue.length === 0) {
      // Silence if no buffer
      for (let ch = 0; ch < output.length; ch++) output[ch].fill(0);
      return true;
    }
    const buffer = this.bufferQueue.shift();
    console.log(buffer);
    for (let ch = 0; ch < output.length; ch++) {
      output[ch].set(buffer);
    }

    return true;
  }
}

registerProcessor("granular-processor", GranularProcessor);
