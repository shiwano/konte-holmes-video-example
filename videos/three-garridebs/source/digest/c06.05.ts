import { defineSourceChunk } from "konte";

export default defineSourceChunk({
  chunk: "c6.5",
  scenes: {
    "c6.5.s1": {
      at: "c6.p133-p150",
      place: "136 Little Ryder Street, Nathan Garrideb's ground-floor room and the cellar beneath it",
      present: ["Holmes", "Watson", "John Garrideb"],
      change: "John Garrideb lets himself in, opens a trapdoor under the carpet and goes down; caught at gunpoint, he shoots Watson in the thigh, is felled by Holmes, whose love for Watson shows; the cellar holds Prescott's counterfeiting press and notes, Evans's bribe is refused, and Watson is told to call the Yard.",
      interior: true,
    },
    "c6.5.s2": {
      at: "c6.p151",
      place: "none (Watson's closing narration)",
      present: [],
      change: "Watson relates the aftermath: Nathan Garrideb never recovered and was last heard of at a nursing-home in Brixton, the Yard was glad of the Prescott outfit, and the Killer was sent back to prison.",
    },
  },
  looks: [
    { of: "John Garrideb", at: "c6.p136", text: "His face turned upon us with a glare of baffled rage, which gradually softened into a rather shamefaced grin as he realized that two pistols were pointed at his head." },
    { of: "John Garrideb", at: "c6.p138", text: "I had a vision of him sprawling upon the floor with blood running down his face while Holmes rummaged him for weapons." },
    { of: "Holmes", at: "c6.p140", text: "The clear, hard eyes were dimmed for a moment, and the firm lips were shaking." },
    { of: "Holmes", at: "c6.p143", text: "His face set like flint as he glared at our prisoner, who was sitting up with a dazed face." },
    { of: "the cellar", at: "c6.p144", text: "together we looked down into the small cellar which had been disclosed by the secret flap. It was still illuminated by the candle which Evans had taken down with him. Our eyes fell upon a mass of rusted machinery, great rolls of paper, a litter of bottles, and, neatly arranged upon a small table, a number of neat little bundles." },
  ],
  notes: [
    "Here the narration calls the American 'the American', 'Killer Evans', 'Evans', 'our prisoner'; Holmes calls him 'Mr. Evans'. Same person as John Garrideb.",
    "c6.p140: Watson's inner reflection on Holmes's loyalty and love carries the moment after the shooting.",
    "c6.p149: Evans's account of shooting Prescott and finding Nathan Garrideb on top of the place is his own claim.",
    "c6.p151: epilogue after an unstated time jump; 'our poor old friend' is Nathan Garrideb.",
  ].join("\n"),
});
