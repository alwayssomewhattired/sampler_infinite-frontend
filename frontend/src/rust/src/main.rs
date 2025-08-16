use hound::{WavReader, WavWriter, WavSpec, SampleFormat};
use rand::Rng;
use std::f32::consts::PI;

const GRAIN_SIZE: usize = 2048;       // Samples per grain
const NUM_GRAINS: usize = 500;        // Total grains to mix
const OUTPUT_DURATION: usize = 44100 * 5; // 5 seconds
const OVERLAP: usize = 100;           // Overlapping grains
const SAMPLE_RATE: u32 = 44100;

fn hann_window(size: usize) -> Vec<f32> {
    (0..size).map(|n| {
        0.5 * (1.0 - (2.0 * PI * n as f32 / (size as f32)).cos())
    }).collect()
}

fn load_audio(path: &str) -> Vec<f32> {
    let mut reader = WavReader::open(path).expect("Failed to open input WAV");
    reader.samples::<i16>()
        .map(|s| s.unwrap() as f32 / i16::MAX as f32)
        .collect()
}

fn write_audio(path: &str, samples: &[f32]) {
    let spec = WavSpec {
        channels: 1,
        sample_rate: SAMPLE_RATE,
        bits_per_sample: 16,
        sample_format: SampleFormat::Int,
    };

    let mut writer = WavWriter::create(path, spec).expect("Failed to write WAV");
    for sample in samples {
        let s = (sample * i16::MAX as f32).clamp(i16::MIN as f32, i16::MAX as f32) as i16;
        writer.write_sample(s).unwrap();
    }
    writer.finalize().unwrap();
}

fn granular_synthesis(input: &[f32]) -> Vec<f32> {
    let mut output = vec![0.0; OUTPUT_DURATION];
    let window = hann_window(GRAIN_SIZE);
    let mut rng = rand::thread_rng();

    for _ in 0..NUM_GRAINS {
        let start = rng.gen_range(0..input.len().saturating_sub(GRAIN_SIZE));
        let out_start = rng.gen_range(0..output.len().saturating_sub(GRAIN_SIZE));

        for i in 0..GRAIN_SIZE {
            output[out_start + i] += input[start + i] * window[i];
        }
    }

    output
}

fn main() {
    let input = load_audio("input.wav");
    let output = granular_synthesis(&input);
    write_audio("output.wav", &output);
    println!("Granular synthesis complete!");
}
