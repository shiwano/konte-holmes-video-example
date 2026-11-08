import { defineSourceChunk } from "konte";

export default defineSourceChunk({
  chunk: "c6.1",
  scenes: {
    "c6.1.s1": {
      at: "c6.p1-p11",
      place: "Baker Street, Holmes's rooms",
      present: ["Holmes", "Watson"],
      change: "Holmes, risen from several days in bed with a foolscap document, tells Watson there is money in finding a Garrideb; Watson finds 'Garrideb, N., 136 Little Ryder Street, W.' in the telephone directory, but Holmes says that is the letter-writer himself and another is wanted.",
      interior: true,
    },
    "c6.1.s2": {
      at: "c6.p12-p34",
      place: "Baker Street, Holmes's rooms",
      present: ["Holmes", "Watson", "Mrs. Hudson", "John Garrideb"],
      change: "John Garrideb, Counsellor at Law of Moorville, Kansas, arrives angry that Nathan Garrideb called in a detective, is soothed by Holmes, and begins telling of Alexander Hamilton Garrideb, his land, and his wish to find more Garridebs.",
      continues: true,
    },
  },
  looks: [
    { of: "Holmes", at: "c6.p2", text: "he emerged that morning with a long foolscap document in his hand and a twinkle of amusement in his austere gray eyes." },
    { of: "John Garrideb", at: "c6.p15", text: "Mr. John Garrideb, Counsellor at Law, was a short, powerful man with the round, fresh, clean-shaven face characteristic of so many American men of affairs. The general effect was chubby and rather childlike, so that one received the impression of quite a young man with a broad set smile upon his face. His eyes, however, were arresting. Seldom in any human head have I seen a pair which bespoke a more intense inward life, so bright were they, so alert, so responsive to every change of thought. His accent was American, but was not accompanied by any eccentricity of speech." },
    { of: "John Garrideb", at: "c6.p18", text: "I seemed to read sudden suspicion in those expressive eyes." },
    { of: "John Garrideb", at: "c6.p19", text: "“Your whole outfit is English.”" },
    { of: "John Garrideb", at: "c6.p21", text: "“The shoulder cut of your coat, the toes of your boots —could anyone doubt it?”" },
    { of: "John Garrideb", at: "c6.p22", text: "my outfit is nearly all London." },
    { of: "John Garrideb", at: "c6.p23", text: "our visitor, whose chubby face had assumed a far less amiable expression." },
    { of: "John Garrideb", at: "c6.p27", text: "Our visitor’s angry face gradually cleared." },
  ],
  notes: [
    "c6.p1: Watson's retrospective frame foreshadows the outcome (one man's reason, Watson's bloodletting, another man's penalties of the law).",
    "c6.p2: Watson fixes the date as the latter end of June, 1902; the refused knighthood is mentioned only in passing.",
    "c6.p33-p34: the account of Alexander Hamilton Garrideb is John Garrideb's spoken narrative of past events in Kansas and Topeka; it runs on into c6.2.",
    "John Garrideb is later identified (c6.4) as 'Killer' Evans; this digest uses the name John Garrideb throughout.",
  ].join("\n"),
});
