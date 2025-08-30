use wasm_bindgen::prelude::*;
use rand::rngs::SmallRng;
use rand::SeedableRng;
use rand::Rng;
use std::f32::consts::PI;
use log::info;
use console_error_panic_hook::set_once;
use std::rc::Rc;
use std::collections::HashMap;

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
    input_samples: Rc<Vec<f32>>,
    window: Rc<Vec<f32>>,
    grain_size: usize,
    pos_in_grain: usize,
    start_pos_in_input: usize,
    finished: bool,
}

impl Grain {

    pub fn with_shared(input_samples: Rc<Vec<f32>>, window: Rc<Vec<f32>>, grain_size: usize, start_pos: usize) -> Grain {
        Grain {
            input_samples,
            window,
            grain_size,
            pos_in_grain: 0,
            start_pos_in_input: start_pos,
            finished: false,
        }
    }

    pub fn next_add_into(&mut self, out: &mut [f32]) {
        for v in out.iter_mut() {
            if self.pos_in_grain >= self.grain_size || self.pos_in_grain >= self.window.len() {
                self.finished = true;
                break;

            }
            let input_index = self.start_pos_in_input + self.pos_in_grain;
            let sample = if input_index < self.input_samples.len() {
                self.input_samples[input_index] * self.window[self.pos_in_grain]
            } else {
                0.0
            };
            *v += sample;
            self.pos_in_grain += 1;
        }
    }


    pub fn is_finished(&self) -> bool {
        self.finished
    }
}

#[wasm_bindgen]
pub struct GranularEngine {
    samples: Rc<Vec<f32>>,
    grains: Vec<Grain>,
    grain_size: usize,
    spawn_prob: f32,
    max_grains: usize,
    smooth_radius: usize,
    smooth_envelope: usize,
    rng: SmallRng,
    window_cache: HashMap<usize, Rc<Vec<f32>>>,
}

#[wasm_bindgen]
impl GranularEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(samples: Vec<f32>) -> GranularEngine {
        assert!(!samples.is_empty(), "samples array is empty");
        let rng = SmallRng::from_seed([0; 16]);
        GranularEngine {
            samples: Rc::new(samples),
            grains: Vec::new(),
            grain_size: 128,
            spawn_prob: 0.08,
            max_grains: 32,
            smooth_radius: 2,
            smooth_envelope: 0,
            rng,
            window_cache: HashMap::new(),
        }
    }

    pub fn set_grain_size(&mut self, size: usize) {
        info!("grain size: {}", size);
        self.grain_size = size;
    }
    pub fn set_spawn_probability(&mut self, p: f32) {
        info!("spawn prob: {}", p);
        self.spawn_prob = p;
    }
    pub fn set_max_grains(&mut self, m: usize) {
        info!("max grains: {}", m);
        self.max_grains = m;
    }

    pub fn set_smooth_radius(&mut self, r: usize) {
        info!("SMOOTHNESS: {}", r);
        self.smooth_radius = r;
    }

    pub fn set_smooth_envelope(&mut self, e: usize) {
        info!("smooth: {}", e);
        self.smooth_envelope = e;
    }


    fn get_window(&mut self, size: usize) -> Rc<Vec<f32>> {
        self.window_cache
            .entry(size)
            .or_insert_with(|| Rc::new(hann_window(size)))
            .clone()
    }

    fn smooth_buffer(buf: &mut [f32], radius: usize) {
        if radius == 0 { return; }
        let mut smoothed = buf.to_vec();
        for i in 0..buf.len() {
            let start = i.saturating_sub(radius);
            let end = (i + radius + 1).min(buf.len());
            let sum: f32 = buf[start..end].iter().sum();
            smoothed[i] = sum / (end - start) as f32;
        }
        buf.copy_from_slice(&smoothed);
    }

    pub fn fill_buffer(&mut self, out: &mut [f32]) {
        if self.samples.len() < self.grain_size || self.grain_size == 0 {
            info!("fill_buffer: not enough samples ({} < {})",
                self.samples.len(), self.grain_size);
            return;
        }
        for v in out.iter_mut() { *v = 0.0; }

        if self.grains.len() < self.max_grains {
            let r: f32 = self.rng.r#gen();
            if r < self.spawn_prob {
                let max_start = self.samples.len() - self.grain_size;
                let start = if max_start == 0 {
                    0
                } else {
                    self.rng.gen_range(0..=max_start)
                };
                let window = self.get_window(self.grain_size);
                let grain = Grain::with_shared(Rc::clone(&self.samples), Rc::clone(&window), self.grain_size, start);
                self.grains.push(grain);
            }
        }

        self.grains.retain_mut(|g| {
            g.next_add_into(out);
            !g.is_finished()
        });

        let active_grains = self.grains.len().max(1) as f32;
        if self.smooth_envelope != 0 {
            for s in out.iter_mut() {
                *s /= active_grains;
            }
        }
        
        // simple limiter
        for s in out.iter_mut() {
            if *s > 1.0 { *s = 1.0; }
            if *s < -1.0 { *s = -1.0; }
        }
        

        GranularEngine::smooth_buffer(out, self.smooth_radius)
    }

}
