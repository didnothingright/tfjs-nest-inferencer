export interface InferenceI {
    bbox: Uint8Array | Float32Array | Int32Array | Array<number>,
    class: number,
    score: number,
}