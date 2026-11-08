import { defineSourceChunk } from "konte";

export default defineSourceChunk({
  chunk: "c6.2",
  scenes: {
    "c6.2.s1": {
      at: "c6.p35-p40",
      place: "Baker Street, Holmes's rooms",
      present: ["Holmes", "Watson", "John Garrideb"],
      change: "John Garrideb finishes the tale of the will requiring three adult male Garridebs, five million dollars each, says he found Nathan Garrideb two days ago and that agony-column advertisements got no replies, takes Holmes's bait about Dr. Lysander Starr, and departs.",
    },
    "c6.2.s2": {
      at: "c6.p41-p50",
      place: "Baker Street, Holmes's rooms",
      present: ["Holmes", "Watson"],
      change: "Holmes tells Watson the American's story was lies (worn English clothes, no advertisements, no Dr. Lysander Starr), then telephones Nathan Garrideb and arranges to visit him at six that evening without the American.",
    },
    "c6.2.s3": {
      at: "c6.p51-p54",
      place: "136 Little Ryder Street, Nathan Garrideb's ground-floor room",
      present: ["Holmes", "Watson", "Nathan Garrideb"],
      change: "Holmes and Watson arrive at the house, note the old brass name plate, and are let in by Nathan Garrideb into his museum-like room, where he is polishing a coin.",
      continues: true,
    },
  },
  looks: [
    { of: "John Garrideb", at: "c6.p46", text: "Here is a man with an English coat frayed at the elbow and trousers bagged at the knee with a year’s wear" },
    { of: "Nathan Garrideb", at: "c6.p47", text: "I did so, and heard a thin, quavering voice at the other end of the line." },
    { of: "Little Ryder Street", at: "c6.p51", text: "It was twilight of a lovely spring evening, and even Little Ryder Street, one of the smaller offshoots from the Edgware Road, within a stone-cast of old Tyburn Tree of evil memory, looked golden and wonderful in the slanting rays of the setting sun. The particular house to which we were directed was a large, old-fashioned, Early Georgian edifice, with a flat brick face broken only by two deep bay windows on the ground floor. It was on this ground floor that our client lived, and, indeed, the low windows proved to be the front of the huge room in which he spent his waking hours. Holmes pointed as we passed to the small brass plate which bore the curious name." },
    { of: "Little Ryder Street", at: "c6.p52", text: "“Up some years, Watson,” he remarked, indicating its discoloured surface." },
    { of: "Little Ryder Street", at: "c6.p53", text: "The house had a common stair, and there were a number of names painted in the hall, some indicating offices and some private chambers. It was not a collection of residential flats, but rather the abode of Bohemian bachelors." },
    { of: "Nathan Garrideb", at: "c6.p53", text: "Mr. Nathan Garrideb proved to be a very tall, loosejointed, round-backed person, gaunt and bald, some sixty-odd years of age. He had a cadaverous face, with the dull dead skin of a man to whom exercise was unknown. Large round spectacles and a small projecting goat’s beard combined with his stooping attitude to give him an expression of peering curiosity. The general effect, however, was amiable, though eccentric." },
    { of: "Nathan Garrideb's room", at: "c6.p54", text: "The room was as curious as its occupant. It looked like a small museum. It was both broad and deep, with cupboards and cabinets all round, crowded with specimens, geological and anatomical. Cases of butterflies and moths flanked each side of the entrance. A large table in the centre was littered with all sorts of debris, while the tall brass tube of a powerful microscope bristled up among them. As I glanced round I was surprised at the universality of the man’s interests. Here was a case of ancient coins. There was a cabinet of flint instruments. Behind his central table was a large cupboard of fossil bones. Above was a line of plaster skulls with such names as “Neanderthal,” “Heidelberg,” “Cro-Magnon” printed beneath them. It was clear that he was a student of many subjects. As he stood in front of us now, he held a piece of chamois leather in his right hand with which he was polishing a coin." },
  ],
  notes: [
    "c6.p35-p36: John Garrideb's spoken narrative of the will and his search; the 'old country' is England.",
    "c6.p39: Holmes's mention of Dr. Lysander Starr is a test; c6.p46 reveals he never knew such a man.",
    "c6.p50: the telephone call is given only from Holmes's side, with Nathan's replies elided as '…'.",
    "c6.p51: 'twilight of a lovely spring evening' conflicts with the date given in c6.p2 (latter end of June, 1902).",
    "c6.p53: the woman in charge leaves at four o'clock; named Mrs. Saunders in c6.4.",
  ].join("\n"),
});
