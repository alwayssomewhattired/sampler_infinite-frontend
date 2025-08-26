////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
// THIS IS COMMAND TO BUILD
wasm-pack build --target web --dev
//
//

// IN ORDER FOR THE ENGINE .JS HELPER TO WORK, WE NEED TO REPLACE SOME CODE IN THE BUILT "grain.js" PKG.


// REPLACE THIS
async function __wbg_init(module_or_path) {
  if (wasm !== undefined) return wasm;

  if (typeof module_or_path !== "undefined") {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn(
        "using deprecated parameters for the initialization function; pass a single object instead"
      );
    }
  }

  if (typeof module_or_path === "undefined") {
    module_or_path = new URL("grain_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();

  if (
    typeof module_or_path === "string" ||
    (typeof Request === "function" && module_or_path instanceof Request) ||
    (typeof URL === "function" && module_or_path instanceof URL)
  ) {
    module_or_path = fetch(module_or_path);
  }

  __wbg_init_memory(imports);

  const { instance, module } = await __wbg_load(await module_or_path, imports);

  return __wbg_finalize_init(instance, module);
}

///////////////////////////////////

// WITH THIS
async function __wbg_init(input) {
  if (!input) {
    throw new Error("WASM init: no input provided");
  }

  let bytes;
  if (input instanceof ArrayBuffer || ArrayBuffer.isView(input)) {
    bytes = input;
  } else if (input.bytes) {
    bytes = input.bytes;
  } else {
    throw new Error("WASM init: expected { bytes } or ArrayBuffer");
  }

  const { instance, module } = await WebAssembly.instantiate(
    bytes,
    __wbg_get_imports()
  );
  return __wbg_finalize_init(instance, module);
}
