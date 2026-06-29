// Stub for "three/webgpu". The real module reads GPUShaderStage at import
// time, which is undefined outside secure contexts (https/localhost) and
// crashes the whole bundle. Globe rendering here only ever uses WebGL.
export class StorageInstancedBufferAttribute {}
export class WebGPURenderer {}
