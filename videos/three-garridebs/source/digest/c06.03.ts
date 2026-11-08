import { defineSourceChunk } from "konte";

export default defineSourceChunk({
  chunk: "c6.3",
  scenes: {
    "c6.3.s1": {
      at: "c6.p55-p82",
      place: "136 Little Ryder Street, Nathan Garrideb's ground-floor room",
      present: ["Holmes", "Watson", "Nathan Garrideb"],
      change: "Nathan Garrideb shows his collection, says he seldom goes out and dreams of buying specimens with five million dollars, and answers Holmes's questions: the American called last Tuesday, asked no money, knows of the telephone appointment; the collection is not valuable and he has lived there nearly five years.",
    },
    "c6.3.s2": {
      at: "c6.p83-p99",
      place: "136 Little Ryder Street, Nathan Garrideb's ground-floor room",
      present: ["Holmes", "Watson", "Nathan Garrideb", "John Garrideb"],
      change: "John Garrideb bursts in with an advertisement for Howard Garrideb of Aston, Birmingham, and, backed by Holmes, persuades Nathan Garrideb to travel to Birmingham tomorrow at twelve to meet him at four; the American leaves and Holmes's perplexity clears.",
      continues: true,
    },
  },
  looks: [
    { of: "Nathan Garrideb", at: "c6.p61", text: "His eyes gleamed behind his great spectacles." },
    { of: "Holmes", at: "c6.p76", text: "Holmes was lost in thought. I could see that he was puzzled." },
    { of: "Holmes", at: "c6.p99", text: "I noticed that my friend’s face cleared when the American left the room, and the look of thoughtful perplexity had vanished." },
  ],
  notes: [
    "c6.p84: John Garrideb's arrival is unannounced; Nathan had told him of the telephone appointment (c6.p75).",
    "c6.p86-p88: the text of the advertisement as printed: 'Howard Garrideb Constructor of Agricultural Machinery / Binders, reapers, steam and hand plows, drills, harrows, farmer’s carts, buckboards, and all other appliances. Estimates for Artesian Wells. / Apply Grosvenor Buildings, Aston'.",
    "c6.p91-p93: 'You want me to see him?' and 'I have not made such a journey for years' are Nathan Garrideb's lines; 'What do you say, Mr. Holmes?' (c6.p92) is the American's.",
  ].join("\n"),
});
