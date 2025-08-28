class GranularProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.workerPort = null;
    this.ringBuffer = new Float32Array(16384);
    this.readIndex = 0;
    this.writeIndex = 0;
    this.hasData = false;

    this.port.onmessage = (e) => {
      if (e.data.buffer) {
        const buf = new Float32Array(e.data.buffer.slice(0));
        this.pushToRingBuffer(buf);
        this.hasData = true;
      }
    };
  }

  pushToRingBuffer(buf) {
    for (let i = 0; i < buf.length; i++) {
      this.ringBuffer[this.writeIndex] = buf[i];
      this.writeIndex = (this.writeIndex + 1) % this.ringBuffer.length;
    }
  }

  get availableSamples() {
    return (
      (this.writeIndex - this.readIndex + this.ringBuffer.length) %
      this.ringBuffer.length
    );
  }

  process(inputs, outputs) {
    const output = outputs[0];

    if (!this.hasData) {
      for (let ch = 0; ch < output.length; ch++) output[ch].fill(0);
      return true;
    }

    if (this.availableSamples < output[0].length) {
      for (let ch = 0; ch < output.length; ch++) output[ch].fill(0);
      return true;
    }

    for (let ch = 0; ch < output.length; ch++) {
      for (let i = 0; i < output[ch].length; i++) {
        const sample = this.ringBuffer[this.readIndex];
        output[ch][i] = sample;
        this.readIndex = (this.readIndex + 1) % this.ringBuffer.length;

        // if read catches up with write, stop consuming
        if (this.readIndex === this.writeIndex) {
          this.hasData = false;
          break;
        }
      }
    }

    return true;
  }
}

registerProcessor("granular-processor", GranularProcessor);
