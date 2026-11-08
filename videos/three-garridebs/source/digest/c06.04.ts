import { defineSourceChunk } from "konte";

export default defineSourceChunk({
  chunk: "c6.4",
  scenes: {
    "c6.4.s1": {
      at: "c6.p100-p110",
      place: "136 Little Ryder Street, Nathan Garrideb's ground-floor room",
      present: ["Holmes", "Watson", "Nathan Garrideb"],
      change: "Holmes arranges to look over the collection tomorrow afternoon, let in by Mrs. Saunders who is in the basement until four, and learns the house-agent is Holloway and Steele in the Edgware Road.",
    },
    "c6.4.s2": {
      at: "c6.p111-p118",
      place: "Baker Street, Holmes's rooms, after dinner",
      present: ["Holmes", "Watson"],
      change: "Having found the house-agent closed, Holmes explains after dinner that the advertisement is American in spelling and wording, and that he let the American send Nathan to Birmingham to clear the stage.",
    },
    "c6.4.s3": {
      at: "c6.p119-p130",
      place: "Baker Street, Holmes's rooms, next day at lunchtime",
      present: ["Holmes", "Watson"],
      change: "Holmes returns grave, having identified John Garrideb at Scotland Yard as 'Killer' Evans, who shot the forger Rodger Prescott, and learned from the house-agent that the previous tenant Waldron, likely Prescott, vanished; he hands Watson a revolver.",
    },
    "c6.4.s4": {
      at: "c6.p131-p132",
      place: "136 Little Ryder Street, Nathan Garrideb's ground-floor room",
      present: ["Holmes", "Watson", "Mrs. Saunders"],
      change: "At four o'clock Mrs. Saunders admits them and leaves; Holmes and Watson crouch behind a cupboard in a dark corner while Holmes whispers that the Garrideb invention was to get the collector out of his room.",
      continues: true,
    },
  },
  looks: [
    { of: "Nathan Garrideb", at: "c6.p101", text: "Our client shone with pleasure and his eyes gleamed from behind his big glasses." },
    { of: "Holmes", at: "c6.p119", text: "When he returned at lunchtime I noticed that his face was very grave." },
    { of: "John Garrideb", at: "c6.p124", text: "Sure enough, I found his chubby face smiling up at me from the rogues’ portrait gallery. ‘James Winter, alias Morecroft, alias Killer Evans,’ was the inscription below." },
    { of: "John Garrideb", at: "c6.p124", text: "Aged forty-four. Native of Chicago." },
    { of: "Waldron", at: "c6.p126", text: "He was a tall, bearded man with very dark features." },
    { of: "Prescott", at: "c6.p126", text: "Now, Prescott, the man whom Killer Evans had shot, was, according to Scotland Yard, a tall, dark man with a beard." },
    { of: "Mrs. Saunders", at: "c6.p131", text: "Shortly afterwards the outer door closed, her bonnet passed the bow window" },
    { of: "Nathan Garrideb's room", at: "c6.p131", text: "There was one cupboard in a dark corner which stood out a little from the wall." },
  ],
  notes: [
    "c6.p100-p110: 'Mr. Garrideb' here is Nathan Garrideb.",
    "c6.p108: Holmes's question about the house-agent is given a pretext (Queen Anne or Georgian); his real purpose appears in c6.p126.",
    "c6.p111-p119: time jumps — evening at Baker Street, then the next morning Holmes goes out (to Lestrade at the Yard and the house-agent's, reported, not shown), returning at lunchtime.",
    "c6.p122-p124: John Garrideb is identified as 'Killer' Evans (alias James Winter, alias Morecroft); from c6.5 the narration names him Killer Evans / Evans.",
    "c6.p126: that Waldron was Prescott is Holmes's working hypothesis.",
    "c6.p130: an hour's siesta passes between c6.p130 and c6.p131.",
    "c6.p131: Mrs. Saunders, the caretaker, is the woman in charge mentioned in c6.p53.",
  ].join("\n"),
});
