export class GranularSynth {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.buffer = null;
    this.grainSize = 0.1; // Grain duration in seconds
    this.overlap = 0.05; // Overlap time in seconds
    this.playbackRate = 1.0;
    this.position = 0.0;
    this.running = false;
    this.loop = false; // ✅ New: Looping flag
  }

  async loadSample(file) {
    const arrayBuffer = await file.arrayBuffer();
    this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
    console.log("Sample loaded!");
  }

  play() {
    if (!this.buffer || this.running) return;
    this.running = true;
    this.scheduleGrains();
  }

  stop() {
    this.running = false;
  }

  scheduleGrains() {
    if (!this.running) return;

    const grainStartTime = this.position;
    const grain = this.audioContext.createBufferSource();
    grain.buffer = this.buffer;
    grain.playbackRate.value = this.playbackRate;

    const gainNode = this.audioContext.createGain();
    const envelope = this.createGrainEnvelope();
    gainNode.gain.setValueCurveAtTime(
      envelope,
      this.audioContext.currentTime,
      this.grainSize
    );

    grain.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    grain.start(this.audioContext.currentTime, grainStartTime, this.grainSize);
    grain.stop(this.audioContext.currentTime + this.grainSize);

    // Schedule the next grain after (grainSize - overlap)
    setTimeout(
      () => this.scheduleGrains(),
      (this.grainSize - this.overlap) * 1000
    );

    // ✅ Looping: Wrap around when reaching the end
    this.position += this.grainSize;
    if (this.loop) {
      if (this.position >= this.buffer.duration - this.grainSize) {
        this.position = 0; // Reset position
      }
    } else {
      // If looping is off, pick a random position
      this.position = Math.random() * (this.buffer.duration - this.grainSize);
    }
  }

  createGrainEnvelope() {
    const length = this.audioContext.sampleRate * this.grainSize;
    const envelope = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      envelope[i] = Math.sin((Math.PI * i) / length); // Hanning window
    }
    return envelope;
  }

  setLoop(value) {
    this.loop = value;
  }
}
