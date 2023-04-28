import { InferenceI } from "src/core/interfaces/inference.interface";

export function convertYolo(
    boxes: Uint8Array | Float32Array | Int32Array,
    scores: Uint8Array | Float32Array | Int32Array,
    classes: Uint8Array | Float32Array | Int32Array,
) {
    const inferences: InferenceI[] = [];
    for (let i = 0; i < scores.length; ++i) {
        if (scores[i] > 0) {
            const bbox = boxes.slice(i * 4, (i + 1) * 4);
            inferences.push({
                bbox: [...bbox],
                class: classes[i],
                score: scores[i]
            });
        }
    }

    return inferences;
}