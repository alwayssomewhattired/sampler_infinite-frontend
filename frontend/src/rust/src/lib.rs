// src/lib.rs
use wasm_bindgen::prelude::*;
// use rand::Rng;
use rand::rngs::SmallRng;
use rand::SeedableRng;
use rand::Rng;
use std::f32::consts::PI;
use log::info;
use console_error_panic_hook::set_once;

#[wasm_bindgen(start)]
pub fn main() {
set_once();
console_log::init_with_level(log::Level::Debug).expect("error initializing log");
info!("THIS IS A TEST BRUV")
}

fn hann_window(size: usize) -> Vec<f32> {
    (0..size).map(|n| {
        0.5 * (1.0 - (2.0 * PI * n as f32 / (size as f32)).cos())
    }).collect()
}

#[wasm_bindgen]
pub struct Grain {
    input_samples: Vec<f32>,
    window: Vec<f32>,
    grain_size: usize,
    pos_in_grain: usize,
    start_pos_in_input: usize,
    finished: bool,
}

#[wasm_bindgen]
impl Grain {
    #[wasm_bindgen(constructor)]
    pub fn new(input_samples: Vec<f32>, grain_size: usize, start_pos: usize) -> Grain {
        let window = hann_window(grain_size);
        Grain {
            input_samples,
            window,
            grain_size,
            pos_in_grain: 0,
            start_pos_in_input: start_pos,
            finished: false,
        }
    }

    // Fill the provided out slice with the next samples (in-place)
pub fn next_into(&mut self, out: &mut [f32]) {
    for v in out.iter_mut() {
        if self.pos_in_grain >= self.grain_size || self.pos_in_grain >= self.window.len() {
            self.finished = true;
            *v = 0.0;
            continue;
        }
        let input_index = self.start_pos_in_input + self.pos_in_grain;
        let sample = if input_index < self.input_samples.len() {
            self.input_samples[input_index] * self.window[self.pos_in_grain]
        } else {
            0.0
        };
        *v = sample;
        self.pos_in_grain += 1;
    }
}


    pub fn is_finished(&self) -> bool {
        self.finished
    }
}

#[wasm_bindgen]
pub struct GranularEngine {
    samples: Vec<f32>,
    grains: Vec<Grain>,
    grain_size: usize,
    spawn_prob: f32, // probability per block to spawn a grain
    max_grains: usize,
    rng: SmallRng,
}

#[wasm_bindgen]
impl GranularEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(samples: Vec<f32>) -> GranularEngine {
        assert!(!samples.is_empty(), "samples array is empty");
        let rng = SmallRng::from_seed([0; 16]);
        GranularEngine {
            samples,
            grains: Vec::new(),
            grain_size: 512,
            spawn_prob: 0.08, // tune this
            max_grains: 32,
            rng,
        }
    }

    // setters exposed to JS so you can tweak in real-time
    pub fn set_grain_size(&mut self, size: usize) {
        self.grain_size = size;
    }
    pub fn set_spawn_probability(&mut self, p: f32) {
        self.spawn_prob = p;
    }
    pub fn set_max_grains(&mut self, m: usize) {
        self.max_grains = m;
    }

    // Fill the provided output slice (interleaved mono). 
    // The worklet calls this with a Float32Array of length `renderQuantum` (usually 128).
pub fn fill_buffer(&mut self, out: &mut [f32]) {
    if self.samples.len() < self.grain_size || self.grain_size == 0 {
        info!("fill_buffer: not enough samples ({} < {})",
            self.samples.len(), self.grain_size);
        return;
    }
    // clear
    for v in out.iter_mut() { *v = 0.0; }

    // maybe spawn a new random grain
    if self.grains.len() < self.max_grains {
        let r: f32 = self.rng.r#gen();
        if r < self.spawn_prob {
            // len >= grain_size is guaranteed by the guard above
            let max_start = self.samples.len() - self.grain_size;
            // inclusive upper bound so max_start is allowed
            let start = if max_start == 0 {
                0
            } else {
                self.rng.gen_range(0..=max_start)
            };
             info!("Spawning grain at start {} with size {}", start, self.grain_size);
            let grain = Grain::new(self.samples.clone(), self.grain_size, start);
            self.grains.push(grain);
        }
    }

    // mix active grains
    self.grains.retain_mut(|grain| {
        let mut temp = vec![0.0f32; out.len()];
        grain.next_into(&mut temp);
        for (i, v) in temp.into_iter().enumerate() {
            out[i] += v;
        }
        !grain.is_finished()
    });

    // simple limiter
    for s in out.iter_mut() {
        if *s > 1.0 { *s = 1.0; }
        if *s < -1.0 { *s = -1.0; }
    }
}

}