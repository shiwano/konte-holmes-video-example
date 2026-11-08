import { Animate, asset, Audio, Composition, defineVideo, soundtrack, Subtitle, Video } from "konte";
import type { MediaAsset } from "konte";
import { audioStableAudio3Medium } from "konte/workspace/adapters/comfy/audio_stable_audio_3_medium.js";
import { videoMinimaxH3R2v4step } from "konte/workspace/adapters/comfy/video_minimax_h3_r2v_4step.js";
import animatic from "./animatic";
import direction from "./direction";
import reference from "./reference";

const STYLE =
  "2D-animated, 1980s Japanese gothic theatrical anime cel animation: razor-thin angular ink lines, hard-edged two-tone cel shadows in deep indigo and blue-black, painted backgrounds. Limited, restrained animation: poses are held and only what the shot names moves, with small drifts of hair, cloth and dust in the light; the camera stays locked off unless the shot writes a move.";

const ROOM =
  "The scene is the first-floor sitting room of 221B Baker Street on a late June morning in 1902: dark patterned wallpaper, crowded bookshelves, a worn dark-red leather armchair and a green velvet armchair facing each other across the crimson Turkish hearth rug before a white marble fireplace, a cluttered writing desk before a tall lace-curtained bay window. Low gold sunlight slants in long diagonal shafts across the room, dust motes turning slowly in the beams, the corners sunk in deep indigo shadow.";

const ROOM_EVEN = ROOM.replace("Low gold sunlight slants in long diagonal shafts across the room, dust motes turning slowly in the beams,", "Soft, even daylight from the bay window lights the room exactly as in <Picture 1>, the air clear and steady for the whole shot,");

const ROOM_SOUND =
  "A quiet first-floor room in Baker Street on a summer morning: soft room tone, faint carriage wheels and hooves on the street below through the window, the slow tick of a mantel clock, the rustle of paper and cloth when someone moves.";

type Cast = "holmes" | "watson" | "john" | "hudson";

const LOOK: Record<Cast, string> = {
  holmes:
    "the tall gaunt Victorian detective with slicked-back black hair, a narrow angular face and pale grey eyes, in a deep indigo dressing gown with a dark crimson sash",
  watson:
    "the moustached Victorian doctor in a tweed suit, slim and upright, around fifty, in a brown tweed three-piece suit",
  john: "the short stocky clean-shaven man with a round boyish face, an American with a broad fixed smile and sharp bright eyes, in a grey English-cut lounge suit",
  hudson: "the elderly Victorian landlady in a dark dress and white lace cap, tall and thin",
};

const REF: Record<Cast, MediaAsset<"image">> = {
  holmes: reference.holmes,
  watson: reference.watson,
  john: reference.john,
  hudson: reference.hudson,
};

type MotionSpec = {
  key: MediaAsset<"image">;
  cast?: readonly Cast[];
  stem?: MediaAsset<"audio">;
  start?: MediaAsset<"image">;
  end?: MediaAsset<"image">;
  summary: string;
  body: string;
  sound?: string;
  setting?: string;
  partial?: readonly Cast[];
  retain?: Partial<Record<Cast, string>>;
  look?: Partial<Record<Cast, string>>;
  length?: number;
  keyRetain?: string;
};

function motion(spec: MotionSpec) {
  const cast = spec.cast ?? [];
  const defs: string[] = [
    "<Picture 1> is the animatic keyframe for [Shot 1], defining its viewpoint, subject placement, set and light.",
  ];
  const retain: string[] = [
    spec.keyRetain ??
    "<Picture 1> ([Shot 1] keyframe): partially_preserved - the camera position, angle and framing hold exactly for the whole shot: the same shot size, the same set and light, each figure and landmark at the same place in the frame; only the figures' pose and expression move, as the description writes them.",
  ];
  const slots: Record<string, MediaAsset<"image">> = {};
  cast.forEach((c, i) => {
    slots[`image${i + 2}`] = REF[c];
    defs.push(`<Subject ${i + 1}> is ${spec.look?.[c] ?? LOOK[c]}, drawn from <Picture ${i + 2}>.`);
    const own = spec.retain?.[c];
    retain.push(
      own
        ? `<Subject ${i + 1}> (appears in [Shot 1]): ${own}`
        : spec.partial?.includes(c)
        ? `<Subject ${i + 1}> (appears in [Shot 1]): partially_preserved - only the sleeve and hand appear, at the frame edge; the cuff's cloth and colour hold.`
        : `<Subject ${i + 1}> (appears in [Shot 1]): fully_preserved - face, hair, build and clothing hold; the expression and pose are acted as the description writes them.`,
    );
  });
  const tasks = ["keyframe completion", "reference generation"] as const;
  return asset("motion", videoMinimaxH3R2v4step, {
    image1: spec.key,
    ...slots,
    ...(spec.stem ? { audioStem: spec.stem } : {}),
    ...(spec.start ? { startImage: spec.start } : {}),
    ...(spec.end ? { endImage: spec.end } : {}),
    ...(spec.length ? { length: spec.length } : {}),
    prompt: {
      subjectDefinitions: defs as [string, ...string[]],
      summary: { tasks, text: spec.summary },
      retentionAnalysis: retain as [string, ...string[]],
      detailedDescription: { style: STYLE, shots: [`${spec.setting ?? ROOM} ${spec.body}`.trim()] },
      overallSoundscape: spec.sound ?? ROOM_SOUND,
      nonDiegeticMusic: "N/A",
    },
  });
}

const SILENT_LIPS = "Every mouth in the frame stays closed throughout.";

const VOICE = {
  holmes: "a man in his late forties with a low, clear, crisp voice",
  john: "an American man in his forties with a bright, resonant voice",
  watson: "a man around fifty with a warm, honest mid-low voice",
} as const;

const JOHN_UNSMILING = {
  john: "the short stocky clean-shaven man with a round boyish face and sharp bright eyes, in a grey English-cut lounge suit",
};

const OFF_HOLMES = "A man's low, clear, crisp voice (S1), off screen,";

const HOLMES_MED =
  "A medium frame at seated eye level on <Subject 1>, seen from head to knees on the left half of the frame in the worn dark-red leather armchair, his torso turned three-quarters toward screen right, the foolscap letter on his knee under the hand farther from the lens; the white marble fireplace with its black iron grate fills the right half, a dark bookshelf behind his head. Gold morning light falls across him from screen left.";

const HOLMES_CLOSE =
  "A close frame on <Subject 1>'s head and shoulders on the left half of the frame, the top of his dark-red leather armchair's back low behind his shoulders, a dark bookshelf soft behind him at the right, his face turned toward screen right in three-quarter profile. A thin rim of gold light runs along his profile.";

const JOHN_MED =
  "A medium frame at seated eye level on <Subject 1>, seen from head to boots in the green velvet armchair at the centre of the frame, his stocky body facing screen left; the white marble fireplace with its black iron grate stands at the left, the dark panelled door at the right, the crimson rug on the floorboards below.";

function clip(m: ReturnType<typeof motion>) {
  return (
    <Composition>
      <Video src={m} hasAudio />
    </Composition>
  );
}

function voiced(stem: MediaAsset<"audio">, m: ReturnType<typeof motion>) {
  return (
    <Composition>
      <Video src={m} />
      <Audio src={stem} />
    </Composition>
  );
}

const THUMPS = [1.9, 2.27, 2.8, 3.33, 3.83, 4.67];

function withThumps(m: ReturnType<typeof motion>) {
  const thump = asset("thump", audioStableAudio3Medium, {
    prompt:
      "fist pounding the thickly stuffed arm of an upholstered velvet armchair, soft heavy padded whump, dull cushioned impact, horsehair stuffing, faint creak of springs, close and dry, quiet room",
    duration: 1,
  });
  return (
    <Composition>
      <Video src={m} hasAudio />
      {THUMPS.map((t, i) => (
        <Audio key={i} src={thump} start={t} duration={0.6} volume={i === THUMPS.length - 1 ? 0.6 : 1.4} />
      ))}
    </Composition>
  );
}

const EVEN_LIGHT = (frame: string) => frame.replace("Gold morning light falls across him from screen left.", "Calm, even morning light lies on him and on the bookshelf behind him, the book spines at the upper left clear and plainly lit.");

const HOLMES_SEAT =
  "A medium frame at seated eye level on <Subject 1>, seen from head to knees on the left half of the frame in the worn dark-red leather armchair, his torso turned three-quarters toward screen right; the white marble fireplace with its black iron grate fills the right half, a dark bookshelf behind his head. Gold morning light falls across him from screen left.";

const WATSON_MED =
  "A medium frame at the height of the desk top on <Subject 1>, seated on the wooden chair at the writing desk in the centre of the frame, turned round in the chair toward screen right. The frame is filled by the bright lace-curtained bay window behind the writing desk, dark curtains hanging at both edges, a green-shaded lamp on the desk; the window light rims his hair and shoulders.";

const HAT_DOWN = "His black bowler hat lies on the floor beside the chair.";

const STREET_SOUND =
  "A Baker Street pavement on a summer morning: iron-shod carriage wheels and hooves on the cobbles, a distant street cry, brisk footsteps on stone.";

function listening(side: "left" | "right") {
  return `<Subject 1> is silent for the whole shot, listening to a man off screen at screen ${side}, his lips closed from the first frame to the last.`;
}

const JOHN_CLOSE =
  "A close frame on <Subject 1>'s round head and broad shoulders, filling the right half of the frame against the tufted green velvet wing of the armchair, the white marble fireplace soft at the left, his face turned toward screen left. Gold window light falls on the near cheek.";

const INTRIGUE =
  "gothic chamber music, pizzicato cello and double bass, dry harpsichord, muted low strings, soft ticking woodblock, sly creeping suspense, slow 72 bpm, sparse intimate room recording";

const REVEAL =
  "gothic chamber music, solo cello melody, low string ensemble slowly swelling, slow harpsichord arpeggios, pipe organ drone, distant tolling bell, dark and brooding, slow 3/4, reverberant hall";

const STUDY =
  "gothic chamber music, solo harpsichord, light pizzicato strings, soft solo cello line, curious playful mystery, unhurried 80 bpm, sparse intimate room recording";

function bgm(name: string, prompt: string, duration: number, seed: number) {
  return asset(name, audioStableAudio3Medium, { prompt, duration, seed });
}

const NARRATION_EN = [
  {
    shot: "01",
    line: 1,
    parts: [
      ["これから話すのは、喜劇とも悲劇ともつかない事件だ。", "What follows was an affair that hovered between comedy and tragedy."],
      ["その結末で、一人の男は正気を失い、私は銃弾を受け、", "By its end, one man had lost his reason, I had taken a bullet,"],
      ["もう一人の男は監獄へ送られた。", "and another man had been sent to prison."],
    ],
  },
  {
    shot: "02",
    line: 1,
    parts: [
      ["それでも、どこか可笑しみのある事件だった。", "And yet there was something comic about it all."],
      ["千九百二年、六月の終わり。", "It was the end of June, 1902."],
      ["何日も寝込んでいたホームズが、その朝、ようやく居間に姿を現した。", "Holmes, who had kept to his bed for days, at last appeared in the sitting room that morning."],
    ],
  },
  {
    shot: "07",
    line: 1,
    parts: [
      ["私はそばにあった電話帳を手に取り、", "I picked up the directory that lay beside me"],
      ["望み薄の気持ちでページをめくった。", "and turned its pages with little hope."],
    ],
  },
  { shot: "08", line: 1, text: "But to my surprise, that strange name was there after all." },
  { shot: "12", line: 1, text: "Just then Mrs. Hudson came in with a card on a tray." },
  { shot: "16", line: 1, text: "A moment later, the man himself entered the room." },
] as const;

const DIALOGUE_EN = [
  {
    shot: "03",
    line: 1,
    parts: [
      ["ワトスン、金儲けの機会だよ。", "There's money in this, Watson."],
      ["ガリデブという名前を聞いたことはあるかね？", "Have you ever heard the name Garrideb?"],
    ],
  },
  { shot: "04", line: 1, text: "No, I can't say I have." },
  { shot: "04", line: 2, text: "Then find a Garrideb, and there's money in it." },
  { shot: "05", line: 1, text: "Why?" },
  {
    shot: "05",
    line: 2,
    parts: [
      ["長い話でね——それも、ずいぶん風変わりな話だ。", "Ah, that's a long story — and a most whimsical one."],
      ["人間の複雑さをずいぶん探ってきたが、", "I have explored many complexities of human nature,"],
      ["これほど奇妙なものには出くわしたことがない。", "but I've never met anything so strange."],
    ],
  },
  {
    shot: "06",
    line: 1,
    parts: [
      ["当の本人がまもなく尋問を受けに来るから、", "The man himself will be here shortly for questioning,"],
      ["それまでは話さないでおこう。とにかく、その名前が要るんだ。", "so I'll say nothing until then. The point is, we need that name."],
    ],
  },
  { shot: "09", line: 1, text: "Here it is, Holmes! Here!" },
  {
    shot: "11",
    line: 1,
    parts: [
      ["『ガリデブ、N。リトル・ライダー街、百三十六番地』……", "'Garrideb, N. 136 Little Ryder Street.'"],
      ["残念だがワトスン、これは手紙の差出人本人だよ。", "I'm sorry, Watson, but that's the man who wrote the letter."],
      ["住所が同じだ。もう一人、対になる者が要るんだ。", "Same address. We need another to match him."],
    ],
  },
  {
    shot: "13",
    line: 1,
    parts: [
      ["なんと、ここにもいたぞ！今度は頭文字が違う。", "Why, here's another! And different initials this time."],
      ["ジョン・ガリデブ、弁護士。アメリカ合衆国、カンザス州ムアヴィル。", "John Garrideb, Counsellor at Law. Moorville, Kansas, U.S.A."],
    ],
  },
  {
    shot: "14",
    line: 1,
    parts: [
      ["残念だが、もうひと頑張りしてもらわないとね、ワトスン。", "I'm afraid you must try again, Watson."],
      ["この紳士も、すでに一枚噛んでいるんだ。", "This gentleman is already in the plot."],
    ],
  },
  {
    shot: "15",
    line: 1,
    parts: [
      ["こんなに早く来るとは思っていなかったが。", "I hadn't expected him so soon."],
      ["まあいい、私の知りたいことを、たっぷり聞かせてくれるはずだ。", "Still, he should tell us a good deal of what I want to know."],
    ],
  },
  {
    shot: "17",
    line: 1,
    parts: [
      ["ホームズさんですか？ああ、やっぱり！", "Mr. Sherlock Holmes? Ah, I thought so —"],
      ["挿絵とそっくりですな。", "you're the image of your pictures."],
      ["同じ名字のネイサン・ガリデブさんから、手紙が届いているでしょう？", "You've had a letter from my namesake, Mr. Nathan Garrideb, haven't you?"],
    ],
  },
  { shot: "18", line: 1, text: "Do sit down. I fancy we have a good deal to discuss." },
  {
    shot: "19",
    line: 1,
    parts: [
      ["あなたが、この書類にあるジョン・ガリデブ氏ですね。", "You are Mr. John Garrideb, mentioned in this document."],
      ["しかし、英国にはもうだいぶ長くおられるのでは？", "But surely you have been in England some time?"],
    ],
  },
  { shot: "20", line: 1, text: "Why do you say that, Mr. Holmes?" },
  { shot: "21", line: 1, text: "Your whole outfit is English." },
  {
    shot: "22",
    line: 1,
    parts: [
      ["あなたの手品のことは読んでますがね、まさか自分がネタにされるとは。", "I've read of your tricks, but I never thought I'd be the subject of them."],
      ["どこでそんなことを？", "Where do you read that?"],
    ],
  },
  {
    shot: "23",
    line: 1,
    parts: [
      ["上着の肩の裁ち方、ブーツのつま先——", "The shoulder cut of your coat, the toes of your boots —"],
      ["誰が見たって明らかですよ。", "could anyone doubt it?"],
    ],
  },
  {
    shot: "24",
    line: 1,
    parts: [
      ["いやはや、そんなに英国人らしく見えるとはね。", "Well, I had no idea I was so obvious a Britisher."],
      ["仕事でしばらく前にこっちへ来たもんで、", "Business brought me over here some time ago,"],
      ["おっしゃるとおり、身なりはほとんどロンドン仕込みですよ。", "and so, as you say, my outfit is nearly all London."],
    ],
  },
  {
    shot: "25",
    line: 1,
    parts: [
      ["だが、お忙しいでしょうし、", "But I guess your time is valuable,"],
      ["靴下の仕立ての話をしに来たわけじゃない。", "and we didn't meet to talk about the cut of my socks."],
      ["その手にある書類の話に入りませんか？", "What about getting down to that paper you hold in your hand?"],
    ],
  },
  {
    shot: "26",
    line: 1,
    parts: [
      ["まあまあ、落ち着いて、ガリデブさん。", "Patience, Mr. Garrideb, patience!"],
      ["ワトスン君に聞けばわかるが、私のこういう脱線は、", "Dr. Watson would tell you that these little digressions of mine"],
      ["最後には案外、本筋に関わってくるものでしてね。", "sometimes prove to bear on the matter in the end."],
    ],
  },
  { shot: "27", line: 1, text: "But why did Mr. Nathan Garrideb not come with you?" },
  {
    shot: "28",
    line: 1,
    parts: [
      ["そもそも、なんであんたなんかを引っぱり込んだんだ！", "Why did he ever drag you into it at all?"],
      ["あんたに何の関係がある？", "What in thunder has it to do with you?"],
      ["紳士二人のビジネスの話に、片方が探偵を呼ぶとはな！", "Two gentlemen have a bit of business, and one of them calls in a detective!"],
    ],
  },
  {
    shot: "29",
    line: 1,
    parts: [
      ["今朝会ったら、こんな馬鹿な真似をしたと言うんで、", "I saw him this morning and he told me of this fool trick he'd played,"],
      ["すっ飛んで来たんだ。まあ、それでも気分は悪いがね。", "so I came straight here. All the same, I feel bad about it."],
    ],
  },
  {
    shot: "30",
    line: 1,
    parts: [
      ["あなたへの当てつけではありませんよ。", "There was no reflection upon you, sir."],
      ["目的を果たしたい一心だったんでしょう——", "It was simple zeal on his part to gain your end —"],
      ["あなた方お二人にとって、同じく大事な目的をね。", "an end equally vital to you both."],
    ],
  },
  {
    shot: "30b",
    line: 1,
    parts: [
      ["私なら情報を集める手段がある。", "He knew I had means of getting information,"],
      ["だから私を頼るのは、ごく自然なことです。", "so it was very natural that he should apply to me."],
    ],
  },
  {
    shot: "31",
    line: 1,
    parts: [
      ["なるほど、そういうことなら話は別だ。", "Well, that puts a different face on it."],
      ["今朝会いに行ったら、探偵に手紙を出したと言うんで、", "When I saw him this morning he said he'd written to a detective,"],
      ["住所を聞いてすぐ来たんですよ。", "so I asked your address and came right away."],
    ],
  },
  {
    shot: "32",
    line: 1,
    parts: [
      ["内輪の話に、警察に首を突っ込まれたくないんでね。", "I don't want police butting into a private matter."],
      ["だが、人探しを手伝ってくれるだけなら、何の問題もない。", "But if you'll just help us find the man, there's no harm in that."],
    ],
  },
  {
    shot: "33",
    line: 1,
    parts: [
      ["まさにそういうことです。", "That is just how it stands."],
      ["では、せっかくですから、ご本人の口からはっきり聞かせていただきましょう。", "And now, since you are here, we had best hear it plainly from your own lips."],
      ["ここにいる友人は、詳しいことを何も知らないので。", "My friend here knows nothing of the details."],
    ],
  },
  { shot: "34", line: 1, text: "Need he know?" },
  { shot: "35", line: 1, text: "We usually work together." },
  {
    shot: "36",
    line: 1,
    parts: [
      ["まあ、隠すようなことでもない。手短に話しましょう。", "Well, there's no need for secrets. I'll put it as short as I can."],
      ["カンザスの人なら、", "If you were from Kansas, I wouldn't need to explain"],
      ["アレクサンダー・ハミルトン・ガリデブが誰か、説明はいらんのですがね。", "who Alexander Hamilton Garrideb was."],
    ],
  },
  {
    shot: "37",
    line: 1,
    parts: [
      ["不動産で財を成し、シカゴの小麦相場でも儲けた。", "He made his money in real estate, and in the wheat pit at Chicago."],
      ["その金で、アーカンソー川沿いに、こちらの州ひとつ分ほどの土地を買い占めたんです。", "Then he spent it buying up as much land as one of your counties, along the Arkansas River."],
    ],
  },
  {
    shot: "37b",
    line: 1,
    parts: [
      ["放牧地に材木林、畑に鉱山。", "Grazing land, lumber land, arable land, mineral land —"],
      ["持ち主に金をもたらす、ありとあらゆる土地ですよ。", "every sort of land that brings dollars to the man who owns it."],
    ],
  },
  {
    shot: "38",
    line: 1,
    parts: [
      ["身寄りはなかった。少なくとも、私は聞いたことがない。", "He had no kin — or if he had, I never heard of it."],
      ["だが、あの珍しい名字を妙に自慢にしていましてね。", "But he took a kind of pride in the queerness of his name."],
      ["それが縁だったんです。", "That was what brought us together."],
    ],
  },
  {
    shot: "39",
    line: 1,
    parts: [
      ["私はトピーカで弁護士をしていたんだが、ある日、あの爺さんが訪ねてきた。", "I was in the law at Topeka, and one day the old man came to see me."],
      ["同じ名字の男に会えたと、そりゃあもう大喜びでね。", "He was tickled to death to meet another man with his own name."],
    ],
  },
  {
    shot: "40",
    line: 1,
    parts: [
      ["それが爺さんの道楽で、世界にほかにもガリデブがいるかどうか、何としても突き止めたがった。", "It was his pet fad. He was dead set on finding out if there were any more Garridebs in the world."],
      ["『もう一人見つけてくれ！』とね。", "'Find me another!' he said."],
    ],
  },
  {
    shot: "41",
    line: 1,
    parts: [
      ["世界中ガリデブ探しをして回る暇はない、と言ったら、", "I told him I couldn't spend my life hiking round the world for Garridebs."],
      ["爺さんは『それでも、", "'None the less,' said he,"],
      ["私の計画どおりに運べば、君はまさにそうすることになる』と。", "'that is exactly what you will do if things pan out as I planned them.'"],
    ],
  },
  {
    shot: "41b",
    line: 1,
    parts: [
      ["冗談だと思ったが、", "I thought he was joking,"],
      ["その言葉には大変な意味があったんです。", "but there was a powerful lot of meaning in those words."],
    ],
  },
  {
    shot: "42",
    line: 1,
    parts: [
      ["爺さんはそれから一年もたたずに死んで、遺言を残した。", "He died within the year and left a will behind him —"],
      ["カンザス州始まって以来の、とびきり奇妙な遺言です。", "the queerest will ever filed in the State of Kansas."],
    ],
  },
  {
    shot: "43",
    line: 1,
    parts: [
      ["財産は三つに分けられて、", "His property was split three ways:"],
      ["私があと二人ガリデブを見つけたら、その一つを私に、残りをその二人に、という条件だった。", "one share to me, if I found two more Garridebs to take the other two."],
    ],
  },
  { shot: "43", line: 2, text: "That's five million dollars apiece, at the least." },
  { shot: "44", line: 1, text: "But we can't lay a finger on it until all three of us stand in a row." },
  {
    shot: "45",
    line: 1,
    parts: [
      ["またとない話だから、弁護士の仕事はほったらかしてガリデブ探しに出た。", "It was so big a chance that I let my practice slide and went looking for Garridebs."],
      ["合衆国には一人もいない。", "There's not one in the United States."],
      ["目の細かい櫛ですくように探したが、ガリデブは一人も引っかからなかった。", "I went through the country with a fine-toothed comb, and never caught a Garrideb."],
    ],
  },
  {
    shot: "46",
    line: 1,
    parts: [
      ["そこで本国を当たってみた。", "Then I tried the old country."],
      ["案の定、ロンドンの電話帳に名前があった。", "Sure enough, the name was in the London directory."],
      ["二日前に会いに行って、すべて説明しましたよ。", "I went to see him two days ago and explained the whole matter."],
    ],
  },
  {
    shot: "47",
    line: 1,
    parts: [
      ["ところが向こうも私と同じ一人者でね。", "But he's a lone man, like myself —"],
      ["女の親戚はいるが、男は一人もいない。", "some women relations, but no men."],
      ["遺言には『成人男子三名』とある。", "And the will says 'three adult men.'"],
    ],
  },
  {
    shot: "47b",
    line: 1,
    parts: [
      ["というわけで、まだ一人分空きがある。", "So you see, we still have a vacancy."],
      ["それを埋める手伝いをしてもらえるなら、費用はいくらでもお払いしますよ。", "If you can help fill it, we'll gladly pay your charges."],
    ],
  },
  { shot: "48", line: 1, text: "Well, Watson, I said it was rather whimsical, didn't I?" },
  { shot: "48", line: 2, text: "But I should have thought, sir, your obvious way was to advertise in the agony columns of the papers." },
  { shot: "49", line: 1, text: "I've done that, Mr. Holmes. No replies." },
  {
    shot: "50",
    line: 1,
    parts: [
      ["おやおや。いや、実に興味深い、ちょっとした問題だ。", "Dear me! Well, it is certainly a most curious little problem."],
      ["暇を見て考えてみましょう。", "I may take a glance at it in my leisure."],
    ],
  },
  {
    shot: "51",
    line: 1,
    parts: [
      ["ところで、トピーカのご出身とは奇遇ですな。", "By the way, it's curious that you come from Topeka."],
      ["昔、文通相手がいたんです——もう亡くなりましたが——", "I used to have a correspondent there — he is dead now —"],
      ["千八百九十年に市長をしていた、ライサンダー・スター博士という老人でね。", "old Dr. Lysander Starr, who was mayor in 1890."],
    ],
  },
  { shot: "52", line: 1, text: "Good old Dr. Starr! His name is still honoured." },
  {
    shot: "53",
    line: 1,
    parts: [
      ["さて、ホームズさん、我々にできるのは、進み具合をご報告することくらいですな。", "Well, Mr. Holmes, I suppose all we can do is report how we get on."],
      ["一日、二日のうちには、お知らせできるでしょう。", "I reckon you'll hear within a day or two."],
    ],
  },
  { shot: "56", line: 1, text: "Well?" },
  { shot: "57", line: 1, text: "I am wondering, Watson — just wondering!" },
  { shot: "57", line: 2, text: "At what?" },
  {
    shot: "59",
    line: 1,
    parts: [
      ["考えていたのはね、ワトスン、あの男がいったい何のつもりで、", "I was wondering, Watson, what on earth could be the man's object"],
      ["あんな嘘八百を並べたのかということさ。", "in telling us such a rigmarole of lies."],
    ],
  },
  {
    shot: "60",
    line: 1,
    parts: [
      ["よほど面と向かって問いただそうかと思ったよ。", "I nearly asked him point-blank —"],
      ["正面から殴りかかるのが一番という時もあるからね。", "there are times when a brutal frontal attack is best —"],
      ["だが、こちらが騙されたと思わせておくほうがいいと判断した。", "but I judged it better to let him think he had fooled us."],
    ],
  },
  {
    shot: "61",
    line: 1,
    parts: [
      ["肘の擦り切れた英国製の上着に、", "An English coat frayed at the elbow,"],
      ["一年も着古して膝の出たズボン。", "trousers bagged at the knee with a year's wear —"],
      ["それでいて、あの書類でも本人の話でも、", "yet by his papers and his own account,"],
      ["ロンドンに着いたばかりの田舎のアメリカ人だという。", "he is a provincial American fresh to London."],
    ],
  },
  {
    shot: "62",
    line: 1,
    parts: [
      ["尋ね人欄に広告など出ていない。", "There have been no advertisements in the agony columns."],
      ["あそこは私が何ひとつ見逃さない場所だ。", "You know I miss nothing there."],
      ["あれほどの大物を見落とすはずがない。", "I could never have overlooked so big a fish."],
    ],
  },
  {
    shot: "63",
    line: 1,
    parts: [
      ["トピーカのライサンダー・スター博士なんて人物も、私は知らない。", "And I never knew any Dr. Lysander Starr of Topeka."],
      ["どこを突いても、あの男は偽物だった。", "Touch him where you will, he is false."],
    ],
  },
  {
    shot: "64",
    line: 1,
    parts: [
      ["アメリカ人なのは本当だろう。", "I think the fellow really is an American,"],
      ["だが長年ロンドンにいて、訛りがすり減っている。", "but years in London have worn his accent smooth."],
      ["では、狙いは何だ？", "What is his game, then?"],
      ["このばかげたガリデブ探しの裏に、どんな動機がある？", "What motive lies behind this preposterous search for Garridebs?"],
    ],
  },
  { shot: "65", line: 1, text: "It's worth our attention, Watson." },
  {
    shot: "66",
    line: 1,
    parts: [
      ["あの男が悪党だとしても、", "If the man is a rascal,"],
      ["実に複雑で、手の込んだ悪党だ。", "he is certainly a complex and ingenious one."],
    ],
  },
] as const;

const SUB_LINE = "text-[2.3vmax] font-semibold leading-snug text-[#f3ead8] [text-shadow:0_0_0.2vmax_#000,0_0_0.5vmax_#000,0_0_1vmax_#000]";

export default defineVideo(direction, {
  timeline: ({ shot }) => ({
    shots: shot("01", () => {
      const m = motion({
        key: animatic.shot("01").image("key"),
        setting: "",
          summary: "An overhead insert of the foolscap letter in the dark its signature lit by a still shaft of morning light.",
        body: "The camera looks straight down at a long handwritten foolscap letter lying on dark polished wood sunk in indigo shadow. A narrow shaft of gold morning light lies across the foot of the page, resting on the signature \"Nathan Garrideb\", which glows brighter than anything else in the frame. The shaft stays exactly where it is for the whole shot, its brightness steady; the signature stays lit from the first frame to the last. Only the dust motes drift and glitter slowly in the beam. The paper and the dark wood lie still. The camera holds a static overhead shot. " + SILENT_LIPS,
        sound: "Near silence in a dark room: faint room tone, a distant carriage passing in the street below, the slow tick of a mantel clock.",
      });
      return (
        <Composition>
          <Video src={m} hasAudio />
          <Audio src={animatic.shot("01").narrationStem} start={0} />
          <div id="title" className="absolute left-[8%] top-[10%] flex flex-row-reverse items-stretch gap-[1.6vmax]">
            <h1
              id="title-ja"
              className="m-0 whitespace-nowrap text-[3.9vmax] font-semibold leading-none tracking-[0.16em] text-[#f3ead8] [writing-mode:vertical-rl] [text-shadow:0_0_0.6vmax_rgba(201,163,90,0.45),0_0_0.15vmax_#000]"
            >
              三人ガリデブ
            </h1>
            <div id="title-rule" className="w-px bg-gradient-to-b from-transparent via-[#c9a35a] to-transparent" />
            <p
              id="title-en"
              className="m-0 whitespace-nowrap text-[1.5vmax] font-semibold uppercase leading-[1.7] tracking-[0.28em] text-[#c9a35a] [writing-mode:vertical-rl]"
            >
              The Adventure of
              <br />
              the Three Garridebs
            </p>
          </div>
          <Animate
            script={({ timeline, split }) => {
              const ja = split("#title-ja", { type: "chars", mask: "chars" });
              timeline.from("#title-rule", { scaleY: 0, transformOrigin: "50% 0%", duration: 1.4, ease: "power2.inOut" }, 1.0);
              timeline.from(ja.chars, { yPercent: -110, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.14 }, 1.4);
              timeline.from("#title-en", { opacity: 0, letterSpacing: "0.9em", filter: "blur(0.4vmax)", duration: 1.6, ease: "power3.out" }, 2.4);
              timeline.to("#title", { opacity: 0, filter: "blur(0.3vmax)", duration: 1.0, ease: "power2.in" }, 10.0);
            }}
          />
        </Composition>
      );
    })
      .nextShot("02", () => {
        const m = motion({
          key: animatic.shot("02").image("key"),
          cast: ["watson", "holmes"],
          keyRetain:
            "<Picture 1> ([Shot 1] keyframe): partially_preserved - the camera position, angle and framing hold exactly for the whole shot: the same wide size, the same set and light, every piece of furniture at the same place in the frame; the figures move as the description writes them.",
          summary: "The wide sitting room as Holmes steps in through the far door with the letter and crosses toward his armchair, Watson writing at his desk.",
          body: "A wide frame at eye level across the room. At the far left <Subject 1> sits on a high-backed wooden chair at the writing desk, head bent, his pen moving steadily across the paper. At the far right the panelled door swings open and <Subject 2> steps through it with one long, unhurried stride, the deep indigo dressing gown swinging around his legs, the foolscap letter held loosely at his side in the hand nearer the camera; he pauses a moment on the threshold looking across the room toward screen left, a faint glint of amusement in his eyes, then walks unhurriedly into the room toward screen left, across the rug to the worn dark-red leather armchair, turns, and sits down in it, settling back with his body angled toward the camera and his legs crossed toward the fireplace, the letter held up at his chest in his right hand; he stays seated there to the end. The shafts of gold light between them stay still; dust drifts in them. The camera holds a static wide shot. " + SILENT_LIPS,
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
            <Audio src={animatic.shot("02").narrationStem} start={0} />
          </Composition>
        );
      })
      .nextShot("03", ({ script }) => {
        const m = motion({
          key: animatic.shot("03").image("key"),
          cast: ["holmes"],
          stem: animatic.shot("03").stem,
          setting: "",
          summary: "Holmes in his armchair flicks the letter at his chest and teases Watson.",
          body: `A medium frame at seated eye level on <Subject 1>, seen from head to knees, filling the left half of the frame in the worn dark-red leather armchair; the white marble fireplace and the mantel above it fill the right half, a dark bookshelf behind his head. Gold morning light falls across him from screen left. His legs stay crossed toward the fireplace for the whole shot. He lifts the foolscap letter to chest height and gives it a small flick, the paper staying below his chin so his whole face stays in view, and in the first second turns his head toward screen left, his face and his grey eyes turned to his friend off screen at the left edge of the frame and staying there to the end, away from the lens, his eyes glinting, a sly smile pulling at his thin lips. <Subject 1> (S1), a man in his late forties with a low, clear, crisp voice, says in high spirits, teasing lightly, <d>[Japanese] ${script.holmes[0]}</d> then his lips meet and he stops speaking, holding the smile and the raised letter. The camera holds a static shot.`,
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
          </Composition>
        );
      })
      .nextShot("04", ({ script }) => {
        const m = motion({
          key: animatic.shot("04").image("key"),
          cast: ["watson"],
          stem: animatic.shot("04").audio("watson"),
          setting: "",
          summary: "Watson at his desk looks back over his shoulder and shakes his head.",
          body: `A medium frame at desk-top height on <Subject 1>, seated at the writing desk in the centre of the frame, the bright lace-curtained bay window behind him, a green-shaded lamp on the desk. He starts with his back to the camera, then at once twists his upper body in his chair, looks back over his right shoulder with his right forearm hooked over the chair back, and gives a slow, puzzled shake of the head. <Subject 1> (S1), a man around fifty with a warm, honest mid-low voice, says blankly, <d>[Japanese] ${script.watson[0]}</d> then closes his lips and listens quietly, blinking. The camera holds a static shot.`,
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
            <Audio src={animatic.shot("04").offFrameStem} />
          </Composition>
        );
      })
      .nextShot("05", ({ script }) => {
        const m = motion({
          key: animatic.shot("05").image("key"),
          end: animatic.shot("06").image("key"),
          cast: ["holmes"],
          stem: animatic.shot("05").stem,
          setting: "",
          summary: "Holmes lounges in his armchair, tapping the letter on his knee as he talks about the strange story.",
          body: `A medium frame at seated eye level on <Subject 1>, seen from head to knees on the left half of the frame, sitting back in the worn dark-red leather armchair, legs crossed, the foolscap letter on his knee; the white marble fireplace with its black iron grate and the mantel above it fill the right half, a dark bookshelf behind his head. Gold morning light falls across him from screen left. A man's warm voice (S1), off screen, asks curiously, <d>[Japanese] ${script.watson[0]}</d> while <Subject 1>'s lips remain completely closed. Then <Subject 1> (S2), a man in his late forties with a low, clear, crisp voice, taps the letter twice with his long forefinger and says slowly and leisurely, amused at his own story, <d>[Japanese] ${script.holmes[0]}</d> then his lips meet and he falls silent, his gaze settling on the letter on his knee with a relaxed half-smile. The camera holds a static shot.`,
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
            {/* the take already voices this line */}
            <Audio src={animatic.shot("05").offFrameStem} volume={0} />
          </Composition>
        );
      })
      .nextShot("06", ({ script }) => {
        const m = motion({
          key: animatic.shot("06").image("key"),
          start: animatic.shot("06").image("key"),
          cast: ["holmes"],
          stem: animatic.shot("06").stem,
          setting: "",
          summary: "Continuing the same take, Holmes's eyes narrow and slide toward the door as he lowers his voice.",
          body: `The same medium frame continues unbroken on <Subject 1>, seen from head to knees on the left half of the frame in the worn dark-red leather armchair, the letter on his knee, his gaze resting on it; the white marble fireplace with its black iron grate and the mantel above it fill the right half, a dark bookshelf behind his head. Gold morning light falls across him from screen left. Slowly his eyes narrow and his pupils slide toward screen right, toward the door off screen, while his head stays still and the half-smile thins into a secretive line. <Subject 1> (S1), a man in his late forties with a low, clear, crisp voice, drops his voice with a touch of theatre and says, <d>[Japanese] ${script.holmes[0]}</d> then his lips meet and the speaking stops, his eyes still on the door. The light stays exactly as in the first frame for the whole shot: the same bright gold morning light on him and the fireplace at an even, constant brightness. The camera holds a static shot.`,
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
          </Composition>
        );
      })
      .nextShot("07", () => {
        const m = motion({
          key: animatic.shot("07").image("key"),
          end: animatic.shot("08").image("key"),
          cast: ["watson"],
          setting: "",
          partial: ["watson"],
          summary: "Overhead, Watson's hand turns page after page of the telephone directory.",
          body: "The camera looks straight down at the writing desk top. The thick red-bound London telephone directory lies open, its pages packed with tiny columns of names. From the lower right, <Subject 1>'s hand in a brown tweed cuff turns a page over, then another, slowly and listlessly, each page lifting, curving and falling flat. Toward the end the hand smooths the open spread and the forefinger begins to travel down a column of names on the right-hand page. The camera holds a static overhead shot. " + SILENT_LIPS,
          sound: "A quiet room: the dry riffle and soft slap of thin directory pages turning, the faint scrape of a tweed cuff on wood, distant street sounds through the window.",
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
            <Audio src={animatic.shot("07").narrationStem} start={0} />
          </Composition>
        );
      })
      .nextShot("08", () => {
        const m = motion({
          key: animatic.shot("08").image("key"),
          start: animatic.shot("08").image("key"),
          cast: ["watson"],
          setting: "",
          partial: ["watson"],
          summary: "Continuing the same overhead take, Watson's forefinger slides down the names and stops dead on one line.",
          body: "The same overhead frame continues unbroken. <Subject 1>'s forefinger slides slowly down a column of tiny printed names on the right-hand page, then stops dead on one line and presses there, the other fingers tightening slightly against the page. The hand stays perfectly still for the rest of the shot. The camera holds a static overhead shot. " + SILENT_LIPS,
          sound: "A quiet room: the faint whisper of a fingertip sliding over paper, then stillness, distant street sounds through the window.",
        });
        return (
          <Composition>
            <Video src={m} />
            <Audio src={animatic.shot("08").narrationStem} start={0} />
          </Composition>
        );
      })
      .nextShot("09", ({ script }) => {
        const m = motion({
          key: animatic.shot("09").image("key"),
          cast: ["watson"],
          stem: animatic.shot("09").stem,
          setting: "",
          summary: "Watson springs up from his desk, holding the directory aloft in triumph.",
          body: `A medium frame at the height of the desk top on <Subject 1> in the centre of the frame. The frame is filled by the bright lace-curtained bay window behind the writing desk, dark curtains hanging at both edges, a green-shaded lamp on the desk. He pushes himself up from the chair, one hand pressing the desk, and rises to his full height, holding the thick red-bound London telephone directory open and high toward screen right, his face breaking into a triumphant grin. <Subject 1> (S1), a man around fifty with a warm, honest mid-low voice, calls out triumphantly, <d>[Japanese] ${script.watson[0]}</d> then his lips close under the moustache, the grin staying. The camera holds a static shot.`,
          sound: "A quiet room: a chair scraping back on the floorboards as he rises, the rustle of tweed, distant street sounds.",
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
          </Composition>
        );
      })
      .nextShot("10", () => {
        const m = motion({
          key: animatic.shot("10").image("key"),
          cast: ["watson", "holmes"],
          summary: "In the wide room, Watson hands the directory down to Holmes in his armchair.",
          body: "A wide frame at eye level across the room. <Subject 1> stands upright at screen left of the worn dark-red leather armchair, still on his feet as he rose from the desk, holding the thick red-bound London telephone directory closed in both hands at his chest; he bends forward from the waist and holds it out down to <Subject 2>; <Subject 2>, seated in the armchair at screen right, turns toward him and his hands close on its right edge; <Subject 1>'s hands let go, and the book settles on <Subject 2>'s lap. <Subject 1> straightens and stays standing beside the chair. The empty green armchair, the fireplace and the closed door at the right stay still. The camera holds a static wide shot. " + SILENT_LIPS,
          sound: "A quiet room: the soft thump of a heavy book changing hands, the creak of the leather armchair, distant street sounds.",
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
          </Composition>
        );
      })
      .nextShot("11", ({ script }) => {
        const m = motion({
          key: animatic.shot("11").image("key"),
          cast: ["holmes"],
          stem: animatic.shot("11").stem,
          setting: "",
          summary: "Holmes reads the entry aloud from the directory on his lap and smiles ruefully at Watson.",
          body: `A medium frame at seated eye level on <Subject 1>, seen from head to knees on the left half of the frame in the worn dark-red leather armchair, the thick red-bound London telephone directory open on his lap; the white marble fireplace with its black iron grate and the mantel above it fill the right half, a dark bookshelf behind his head. Gold morning light falls across him from screen left. He runs his forefinger along one line and reads it aloud, then lifts his head toward screen left with a rueful, slightly pitying smile. <Subject 1> (S1), a man in his late forties with a low, clear, crisp voice, reads flatly and then says gently, <d>[Japanese] ${script.holmes[0]}</d> then his lips meet and he stops speaking, still smiling. The camera holds a static shot.`,
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
          </Composition>
        );
      })
      .nextShot("12", () => {
        const m = motion({
          key: animatic.shot("12").image("key"),
          cast: ["watson", "holmes", "hudson"],
          summary: "In the wide room, Mrs Hudson comes in through the door carrying a calling card on a silver tray.",
          setting: ROOM_EVEN,
          body: "A wide frame at eye level across the room. <Subject 1> stands beside the worn dark-red leather armchair where <Subject 2> sits, the thick red-bound directory lying open across his lap the whole shot; at the start the two men are turned toward each other in the middle of their conversation, each looking at the other's face in profile. As the door opens, both turn their heads toward the door at the right. The panelled door opens and <Subject 3> walks in with small, upright steps, carrying a silver tray with a white calling card before her at waist height, and comes a few paces into the room toward screen left. The camera holds a static wide shot. " + SILENT_LIPS,
          sound: "A quiet room: the click and creak of the door opening, light, measured footsteps on floorboards, the rustle of a long skirt, distant street sounds.",
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
            <Audio src={animatic.shot("12").narrationStem} start={0} />
          </Composition>
        );
      })
      .nextShot("13", ({ script }) => {
        const m = motion({
          key: animatic.shot("13").image("key"),
          cast: ["watson", "hudson"],
          stem: animatic.shot("13").stem,
          setting: "",
          partial: ["watson", "hudson"],
          summary: "Overhead, Watson's fingers lift the calling card from Mrs Hudson's silver tray as he reads it out.",
          body: `The camera looks straight down at a round silver tray held at the right edge of frame by <Subject 2>'s thin pale hand in a black sleeve. From the left, <Subject 1>'s fingers in a brown tweed cuff pinch the white calling card and lift it slowly off the tray, tilting it toward the light. A man's warm voice (S1), whose face is out of frame, reads it out with rising excitement, <d>[Japanese] ${script.watson[0].replace("合衆国", "がっしゅうこく")}</d> Near the end the tray draws away out of the right edge of frame, leaving the card in his fingers. The camera holds a static overhead shot.`,
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
          </Composition>
        );
      })
      .nextShot("14", ({ script }) => {
        const m = motion({
          key: animatic.shot("14").image("key"),
          cast: ["watson", "holmes"],
          stem: animatic.shot("14").stem,
          setting: "",
          partial: ["watson"],
          summary: "Holmes looks down at the card Watson holds out and smiles thinly.",
          body: `A medium frame at seated eye level. At the left edge <Subject 1>'s brown tweed sleeve and hand hold out the white calling card. <Subject 2>, seen from head to knees left of centre in the worn dark-red leather armchair, the white marble fireplace with its black iron grate filling the right half behind him, lowers his eyes to the card and one corner of his mouth lifts in a thin, cool smile. <Subject 2> (S1), a man in his late forties with a low, clear, crisp voice, says, amused yet with a cool edge, <d>[Japanese] ${script.holmes[0]}</d> then his lips meet and he stops speaking. Afterwards he holds still, his eyes resting on the card, the thin smile staying on his lips. The camera holds a static shot.`,
          sound: "A quiet room: the faint tick of a clock, distant street sounds.",
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
          </Composition>
        );
      })
      .nextShot("15", ({ script }) => {
        const m = motion({
          key: animatic.shot("15").image("key"),
          cast: ["holmes"],
          stem: animatic.shot("15").stem,
          setting: "",
          summary: "Knowing the card's owner is on his way up, Holmes fixes his eyes on the door and murmurs to himself.",
          body: `A close frame on <Subject 1>'s face and shoulders, the top of his dark-red leather armchair's back low behind his shoulders. Expecting the visitor whose card has just come up, his eyes turn toward the door off screen at screen right and fix there, narrowed and hard, his lips pressing into a flat line, his jaw setting. <Subject 1> (S1), a man in his late forties with a low, clear, crisp voice, murmurs almost to himself, with the stillness of a hunter waiting for his quarry, <d>[Japanese] ${script.holmes[0]}</d> then his lips meet and the speaking stops; his eyes stay fixed on the door. The camera holds a static shot.`,
          sound: "A quiet room: the faint tick of a clock, distant street sounds.",
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
          </Composition>
        );
      })
      .nextShot("15b", () =>
        clip(
          motion({
            key: animatic.shot("15b").image("doorInsert"),
            setting: "",
            keyRetain:
              "<Picture 1> ([Shot 1] keyframe): partially_preserved - the camera position, angle and framing hold exactly for the whole shot, and the armchair, bookshelf, fireplace, wallpaper and light stay as it shows them; only the door swings open.",
            summary: "Inside the sunlit sitting room, the panelled door is pushed from outside and eases open a crack, a thin strip of the dim landing showing in the gap.",
            body: "A close frame from inside the sitting room on its dark wooden panelled door, at the right of the frame in its blue-grey moulded frame, the green velvet armchair's tufted back and the bookshelf of glass flasks and old books at the left, the edge of the white marble fireplace at the far left. The shot opens on the frame <Picture 1> shows: the door stands shut, a shaft of gold morning light lying across its lower panels and the round brass knob at its left edge. The knob turns with a click, and the door is pushed from outside: it swings inward into the room, toward the lens, on hinges at its right edge, only a little, its free edge with the brass knob easing a hand's breadth toward the camera and stopping there. A narrow upright gap opens between that edge and the door frame at its left, about as wide as the knob's backplate, showing a thin strip of the landing beyond in dim blue-grey shade, the moulded blue-grey wooden panelling of its wall faint in the strip. The door rests ajar on that narrow gap to the last frame, the leaf still nearly square to the wall, its six panels and the gold light on them almost unchanged. The armchair, the bookshelf, the flasks, the fireplace and the wallpaper hold still and unchanged throughout, only dust motes drifting in the shaft of light. The camera holds a static shot.",
            sound: "A quiet first-floor room: the click of a turning brass doorknob, the short creak of old hinges as a heavy wooden door eases ajar, a heavy footstep on the landing beyond it, faint carriage wheels in the street below.",
          }),
        ),
      )
      .nextShot("16", () => {
        const m = motion({
          key: animatic.shot("16").image("key"),
          cast: ["watson", "holmes", "hudson", "john"],
          summary: "In the wide room, Mrs Hudson slips out of the door and John Garrideb steps in, smiling broadly.",
          body: "A wide frame at eye level across the room. <Subject 1> sits at the writing desk at the far left and <Subject 2> in the worn dark-red leather armchair, both turned toward the open door at the far right. In the doorway <Subject 3> steps back out onto the landing and disappears behind the door frame, and as soon as she is gone, <Subject 4> steps into the room toward screen left, his bowler hat in one hand, his round face lit by a broad smile, and stops just inside the threshold. The camera holds a static wide shot. " + SILENT_LIPS,
          sound: "A quiet room: the last heavy footsteps arriving at the landing, the door creaking fully open, a man's firm steps onto the floorboards, distant street sounds.",
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
            <Audio src={animatic.shot("16").narrationStem} start={0} />
          </Composition>
        );
      })
      .nextShot("17", ({ script }) => {
        const m = motion({
          key: animatic.shot("17").image("key"),
          cast: ["john"],
          stem: animatic.shot("17").stem,
          setting: "",
          summary: "John Garrideb greets Holmes with a broad smile while his sharp eyes flick between the two men.",
          body: `A close frame on <Subject 1>'s round, smiling face and shoulders before the green velvet armchair. The broad smile stays fixed on his face the whole time, while his bright, hard eyes flick quickly between two people off screen to the left, measuring each in turn. <Subject 1> (S1), an American man in his forties with a bright, resonant voice, says warmly and eagerly, with appraising little pauses, <d>[Japanese] ${script.john[0]}</d> then his lips close in the same broad smile, his eyes still moving. The camera holds a static shot.`,
        });
        return (
          <Composition>
            <Video src={m} hasAudio />
          </Composition>
        );
      })
      .nextShot("18", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("18").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("18").stem,
            setting: "",
            summary: "Holmes in his armchair, the letter on his knee, waves his visitor to the empty chair.",
            body: `${HOLMES_MED.replace("Gold morning light falls across him from screen left.", "Calm, even morning light lies on him and on the bookshelf behind him, the book spines at the upper left clear and plainly lit.")} His face composed and courteous, he lifts the arm nearer the lens and extends it toward screen right, the palm open and turned up, the long fingers pointing past the right edge of the frame toward the chair off screen, a polite host's half-smile on his thin lips. <Subject 1> (S1), ${VOICE.holmes}, says graciously and calmly, as the master of the house, <d>[Japanese] ${script.holmes[0]}</d> then his lips meet and he stops speaking, the hand still held out. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("19", () =>
        voiced(
          animatic.shot("19").stem,
          motion({
            key: animatic.shot("19").image("key"),
            cast: ["john"],
            setting: "",
            summary: "John Garrideb lowers himself into the green armchair, still smiling broadly, as Holmes speaks off screen.",
            body: `${JOHN_MED} At the start he is bent over the seat, his hands on the two armrests; he lowers himself slowly until his hips meet the cushion and settles back, his hands coming to rest on the armrests. His round, clean-shaven face keeps a broad, fixed smile throughout, his bright eyes turned toward screen left. <Subject 1> is silent for the whole shot, listening to a man off screen at screen left, his lips pressed together in a closed-mouth smile from the first frame to the last; once seated he goes quite still. The camera holds a static shot.`,
            sound: `${ROOM_SOUND} The soft creak and sigh of a velvet armchair taking a man's weight.`,
          }),
        ),
      )
      .nextShot("20", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("20").image("key"),
            cast: ["john"],
            stem: animatic.shot("20").stem,
            setting: "",
            summary: "A close frame on John Garrideb as his broad smile freezes stiff.",
            body: `${JOHN_CLOSE} At the start he is smiling broadly and easily. In the first second the smile freezes into a stiff mask and stays frozen to the end: the cheeks set hard, the corners of the mouth locked, the jaw tightening; his pupils shift into the left corners of his eyes and lock there, staring hard at the left edge of the frame, the eyes cold and glassy above the frozen grin. <Subject 1> (S1), ${VOICE.john}, still smiling, asks a shade too tightly, <d>[Japanese] ${script.john[0]}</d> speaking through the frozen grin with small, tight lip movements, then his lips close in the same frozen smile, his eyes still fixed on the left edge of the frame. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("21", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("21").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("21").stem,
            setting: "",
            summary: "A close frame on Holmes sizing up his visitor at screen right with half-lidded eyes.",
            body: `${HOLMES_CLOSE} His eyelids are half lowered. In the first second his pale grey eyes lift to the level of the right edge of the frame and rest there, on the visitor out of frame at screen right, appraising him, away from the lens, while his head stays still and his face stays calm and unreadable. <Subject 1> (S1), ${VOICE.holmes}, says flatly, as a plain matter of fact, <d>[Japanese] ${script.holmes[0]}</d> then his lips meet in a level line. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("22", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("22").image("key"),
            cast: ["john"],
            stem: animatic.shot("22").stem,
            setting: "",
            summary: "John Garrideb in the green armchair laughs off the remark with a forced laugh, his eyes cold and watchful.",
            body: `${JOHN_MED} His black bowler hat rests on his knee. One hand is half raised with the palm out; his bright eyes stay narrowed and watchful, fixed on screen left the whole time. His head and shoulders stay steady as he talks, his mouth shaping each word clearly in time with the voice, a forced grin on his face between the words. <Subject 1> (S1), ${VOICE.john}, with a forced laugh in his voice, probing, says <d>[Japanese] ${script.john[0]}</d> then his lips close in a thin smile, the hand lowering to the armrest. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("23", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("23").image("key"),
            cast: ["john"],
            stem: animatic.shot("23").stem,
            setting: "",
            retain: {
              john: "partially_preserved - seen from chest to knees, his head above the frame for the whole shot; the grey English-cut suit, the frayed elbow on the armrest and the resting hand hold.",
            },
            summary: "An insert of John Garrideb sunk deep in his seat, the frayed elbow of his sleeve on the armrest, as Holmes speaks off screen.",
            body: `An insert at the height of the armrest. <Subject 1> sits deep in his seat, seen from his chest to his knees, his head above the frame. The arm nearer the lens, in its grey coat sleeve, lies along the armrest at the right, the elbow of the sleeve frayed, loose threads and a ragged edge of grey cloth showing; his hand rests at the scrolled end of the arm by the brass studs. His black bowler hat rests on his knee at the lower left of the frame, its curled brim on the grey cloth. He sits perfectly still: only his chest rises and falls slowly with his breathing, and the hand stays perfectly still. ${OFF_HOLMES} says gently, with complete certainty, <d>[Japanese] ${script.holmes[0]}</d> The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("24", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("24").image("key"),
            cast: ["john"],
            stem: animatic.shot("24").stem,
            setting: "",
            summary: "John Garrideb in the green armchair spreads both hands wide and beams as he explains himself.",
            body: `${JOHN_MED} His black bowler hat rests on his knee. He spreads both hands wide, palms up, elbows out, in a big show of good humour, his round face beaming, the cheeks bunched, his bright eyes crinkled toward screen left; as he talks his hands bob a little with the words. <Subject 1> (S1), ${VOICE.john}, trying to sound jovial again, a little fast, says <d>[Japanese] ${script.john[0]}</d> then his lips close in the broad smile and his hands settle back onto the armrests. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("25", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("25").image("key"),
            length: 243,
            look: JOHN_UNSMILING,
            cast: ["john"],
            stem: animatic.shot("25").stem,
            setting: "",
            summary: "A close frame on John Garrideb, his smile gone, jerking his chin toward the letter off screen.",
            body: `${JOHN_CLOSE} The far side of his face lies in indigo shadow. The smile is gone: his mouth is a flat, hard line, his brows lowered, his bright eyes cold and narrowed on screen left. <Subject 1> (S1), ${VOICE.john}, his geniality peeled away, biting back his irritation, growls low, <d>[Japanese] ${script.john[0]}</d> On the last words he thrusts his chin out hard, jerking his head down and forward toward the lower left corner of the frame, toward the letter off screen, a clear, sharp nod of the head pointing at it; then his lips close in the hard line, the chin still thrust toward the lower left. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("26", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("26").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("26").stem,
            setting: "",
            summary: "Holmes in his armchair raises one open hand to calm his irritated visitor.",
            body: `${HOLMES_MED} He raises the hand nearer the lens to shoulder height, the palm open and facing screen right, the fingers loose, in a slow soothing gesture, his head tilting slightly, his face mild and patient, a soft placating smile on his thin lips. From the first frame his pale grey eyes are turned toward the right edge of the frame, fixed on the visitor out of frame at screen right and away from the lens, and they stay there for the whole shot. <Subject 1> (S1), ${VOICE.holmes}, says softly and soothingly, unhurried, <d>[Japanese] ${script.holmes[0]}</d> then his lips meet and he lowers the hand slowly to the armrest. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("27", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("27").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("27").stem,
            setting: "",
            summary: "A close frame on Holmes looking straight at his visitor as he slips in a pointed question.",
            body: `${HOLMES_CLOSE} Cold shadow lies across the near half of his face. His head stays quite still; his pale grey eyes are open and level, fixed straight on the right edge of the frame, keen and unblinking, his thin lips holding a faint pleasant line. <Subject 1> (S1), ${VOICE.holmes}, in a casual tone, slipping the question in like a blade, says <d>[Japanese] ${script.holmes[0]}</d> then his lips meet and his eyes stay fixed. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("27b", () =>
        clip(
          motion({
            key: animatic.shot("27b").image("key"),
            cast: ["john"],
            setting: "",
            retain: {
              john: "partially_preserved - only his left forearm and hand are in the frame for the whole shot; the grey English-cut coat sleeve, the white shirt cuff and the hand hold.",
            },
            summary: "A tight insert on John Garrideb's left hand clenching the scrolled end of the green velvet armrest.",
            body: "A tight insert at the height of the armrest, the camera level with it. The scrolled end of the green velvet armrest with its curving row of brass studs fills the lower half of the frame. <Subject 1>'s left forearm, in its grey English-cut coat sleeve with a white shirt cuff, lies along the top of the arm from the upper right, his left hand resting on the scroll. From the first frame the hand tightens: the four fingers curl down hard round the front of the scroll, sinking into the velvet, the knuckles rising into a pale ridge, and the hand stays clenched and trembling slightly to the end. The rest of him is above the frame. The camera holds a static shot.",
            sound: "A quiet room: the soft creak and squeeze of velvet and leather under a tightening grip, faint room tone.",
          }),
        ),
      )
      .nextShot("28", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("28").image("key"),
            look: JOHN_UNSMILING,
            cast: ["john"],
            stem: animatic.shot("28").stem,
            setting: "",
            summary: "A close frame on John Garrideb as he leans forward from the green armchair and bellows in fury.",
            body: `A close frame on <Subject 1> seated in the green velvet armchair, his round head and broad shoulders at the right of centre, the tufted green wing rising behind his head, the white marble fireplace soft at the left, his face turned toward screen left, his hands gripping the armrests. His hips stay in the seat throughout: he leans forward only a little from the chair back, his round face twisting with fury, the brows knotted down hard, the eyes blazing, the teeth bared. <Subject 1> (S1), ${VOICE.john}, his smile torn away, losing his temper completely, bellows at the top of his voice, red-hot with fury, <d>[Japanese] ${script.john[0]}</d> then his lips close hard, his chest heaving, his blazing eyes still locked on the left edge of the frame to the last frame. Gold window light falls on the near cheek, the far side of his face in deep indigo shadow. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("29", ({ script }) =>
        withThumps(
          motion({
            key: animatic.shot("29").image("key"),
            look: JOHN_UNSMILING,
            cast: ["john"],
            stem: animatic.shot("29").stem,
            setting: "",
            summary: "John Garrideb in the green armchair brings his fist down on the armrest as he vents.",
            body: `${JOHN_MED} He sits forward, hunched, scowling, his bright eyes glaring toward screen left. He raises his fist and brings it down hard on the green armrest nearer the lens, the knuckles white, his shoulders hunching over it. <Subject 1> (S1), ${VOICE.john}, still furious, snarling and spitting the words out angrily, his voice hard and loud, then muttering the last words in a sour growl, says <d>[Japanese] ${script.john[0]}</d> then his lips close, turned down, the fist still pressed on the armrest. The camera holds a static shot.`,
            sound: `${ROOM_SOUND} A single heavy thump of a fist striking an upholstered armrest.`,
          }),
        ),
      )
      .nextShot("30", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("27").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("30").stem,
            setting: "",
            summary: "A close frame on Holmes, utterly still, quietly answering his visitor's glare.",
            body: `${HOLMES_CLOSE} He is perfectly still, his head unmoved; from the first frame his pale grey eyes are on the visitor out of frame at screen right, away from the lens, meeting him calmly and steadily, the brows level, the thin lips relaxed in a mild, composed line. <Subject 1> (S1), ${VOICE.holmes}, says calmly, cooling the other man's heat, <d>[Japanese] ${script.holmes[0]}</d> then his lips meet and he holds the same calm gaze. The camera is locked off: the frame edges, the bookshelf, the fireplace edge and the armchair back stay at exactly the same place in the frame from the first frame to the last; only his face moves.`,
          }),
        ),
      )
      .nextShot("30b", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("30b").image("key"),
            look: JOHN_UNSMILING,
            cast: ["john"],
            stem: animatic.shot("30b").stem,
            setting: "",
            summary: "John Garrideb in the green armchair listens as his fist on the armrest slowly opens.",
            body: `${JOHN_MED} His black bowler hat rests on his knee. At the start the hand on the green armrest nearer the lens is clenched into a tight fist, the knuckles white. Over the shot the fist slowly uncurls, the fingers opening one by one until the hand lies open and flat on the armrest; his shoulders drop a little, but his round face stays flushed and severe, the brows knotted, the mouth set hard, his bright eyes on screen left, listening. ${OFF_HOLMES} says patiently, spelling it out in an even voice, <d>[Japanese] ${script.holmes[0]}</d> while <Subject 1>'s lips remain completely closed. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("31", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("31").image("key"),
            look: JOHN_UNSMILING,
            cast: ["john"],
            stem: animatic.shot("31").stem,
            setting: "",
            summary: "A close frame on John Garrideb as his angry face loosens back into a sheepish smile.",
            body: `${JOHN_CLOSE} At the start his brows are still knotted and his mouth set hard; slowly the anger drains from his face, the brows level out, the cheeks round again and a sheepish smile comes onto his lips, a faint flush left on the cheeks, his bright eyes soft but watchful on the left edge of the frame. <Subject 1> (S1), ${VOICE.john}, his anger put away, awkwardly recovering his good humour, says <d>[Japanese] ${script.john[0]}</d> then his lips close in the sheepish smile. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("32", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("32").image("key"),
            start: animatic.shot("32").image("key"),
            cast: ["john"],
            stem: animatic.shot("32").stem,
            setting: "",
            summary: "John Garrideb settles back deep in the green armchair, at ease again, and sets his terms.",
            body: `${JOHN_MED} His black bowler hat rests on his knee. From the first frame he is already seated in the chair exactly as in <Picture 1>; over the first seconds he shifts his weight forward a little and wriggles back again, settling deeper into the chair, his shoulders coming to rest against the tufted back, one hand on the hat on his knee, the other forearm laid along the armrest; his round face wears an easy, affable smile, but his bright eyes stay sharp and level on screen left. <Subject 1> (S1), ${VOICE.john}, with a show of ease, slipping in a quiet warning, says <d>[Japanese] ${script.john[0]}</d> then his lips close in the easy smile. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("33", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("33").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("33").stem,
            setting: "",
            summary: "Holmes in his armchair gestures back over his shoulder toward his friend at the desk.",
            body: `${HOLMES_MED} His head turned toward screen right, his face polite and encouraging, a courteous smile on his thin lips. <Subject 1> (S1), ${VOICE.holmes}, says courteously, drawing his visitor out, <d>[Japanese] ${script.holmes[0]}</d> and on the last words he raises the hand nearer the lens and points back over his shoulder toward the upper left, toward his friend off screen, his eyebrows lifting slightly; then his lips meet and the hand stays raised. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("34", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("34").image("key"),
            look: JOHN_UNSMILING,
            cast: ["john"],
            stem: animatic.shot("34").stem,
            setting: "",
            summary: "A close frame on John Garrideb, smiling only with his mouth, turning his cold eyes level toward the doctor across the room.",
            body: `${JOHN_CLOSE} The far side of his face lies in indigo shadow. His mouth keeps a thin smile, but the rest of his round face goes flat and still, the eyes unsmiling. In the first second his eyelids lower halfway and his pupils slide hard into the left corners of his eyes, and they stay there to the end, his gaze level and straight at his own eye height toward someone far across the room at screen left, cold and hard, while his head stays still. <Subject 1> (S1), ${VOICE.john}, smiling only with his mouth, asks coldly, <d>[Japanese] ${script.john[0]}</d> then his lips close in the thin smile, his eyes still on screen left. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("35", () =>
        voiced(
          animatic.shot("35").stem,
          motion({
            key: animatic.shot("35").image("key"),
            start: animatic.shot("35").image("key"),
            cast: ["watson"],
            setting: "",
            summary: "Watson at his desk, turned toward the visitor, flinches under his stare as Holmes answers off screen.",
            body: `A medium frame at the height of the desk top on <Subject 1>, seated on the wooden chair at the writing desk in the centre of the frame, turned round in the chair toward screen right. The frame is filled by the bright lace-curtained bay window behind the writing desk, dark curtains hanging at both edges, a green-shaded lamp on the desk; the window light rims his hair and shoulders. From the first frame he faces screen right, toward the visitor across the room, listening. He flinches under a stare from screen right, his shoulders drawing back and stiffening, his head pulling back a little, his empty hands held up before his chest, palms out, rising a little higher, his brows raised, taken aback and uneasy. <Subject 1> is silent for the whole shot, listening to a man off screen, his lips pressed shut under the moustache from the first frame to the last. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("36", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("36").image("key"),
            end: animatic.shot("37").image("key"),
            cast: ["john"],
            stem: animatic.shot("36").stem,
            setting: "",
            summary: "John Garrideb settles into his story in the green armchair, shrugging, his fingers laced on his knee.",
            body: `${JOHN_MED} ${HAT_DOWN} His fingers laced together on his knee, he gives one easy shrug, both shoulders rising toward his ears and dropping back down a single time, and then his shoulders stay still, his round face wearing an affable, practised smile, his head tilted, his bright eyes on screen left. <Subject 1> (S1), ${VOICE.john}, says amiably, in a well-worn storyteller's tone, <d>[Japanese] ${script.john[0]}</d> then his lips close in the smile. In the last moments his laced fingers begin to part on his knee, both hands lifting a little off it, his chest drawing up. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("37", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("37").image("key"),
            start: animatic.shot("37").image("key"),
            cast: ["john"],
            stem: animatic.shot("37").stem,
            setting: "",
            summary: "Continuing the same take, John Garrideb spreads both hands wide in the air, sketching out vast lands as he boasts.",
            body: `The same medium frame continues unbroken. ${JOHN_MED} ${HAT_DOWN} His hands part from his knee and sweep up and wide apart in the air, palms open, sketching out vast lands, his round face bright with a boastful grin, his eyes wide and shining toward screen left. <Subject 1> (S1), ${VOICE.john}, boastfully, with expansive gestures, says <d>[Japanese] ${script.john[0]}</d> then his lips close in the grin, his hands still held wide. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("37b", () =>
        voiced(
          animatic.shot("37b").stem,
          motion({
            key: animatic.shot("37b").image("key"),
            cast: ["watson"],
            setting: "",
            summary: "Watson at his desk, turned round in his chair, raises his eyebrows in frank admiration at the story.",
            body: `${WATSON_MED} One forearm rests along the chair back, his pen lying forgotten on the papers. As he listens his eyebrows rise slowly high and his eyes widen in frank admiration, his lips pushed forward into a small round O under the moustache, and he gives a slow, impressed nod. ${listening("right")} The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("38", () =>
        voiced(
          animatic.shot("38").stem,
          motion({
            key: animatic.shot("38").image("key"),
            cast: ["holmes"],
            setting: "",
            summary: "Holmes in his armchair listens with half-closed eyes, his fingertips pressed together.",
            body: `${HOLMES_SEAT} He leans back against the tufted chair back, his legs crossed, his elbows on the armrests and his long fingertips pressed together in a steeple before his chest, his eyelids lowered halfway, his face still and attentive. He holds the pose, breathing slowly; once his fingertips tap lightly together and part again. ${listening("right")} The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("39", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("39").image("key"),
            cast: ["john"],
            stem: animatic.shot("39").stem,
            setting: "",
            summary: "John Garrideb in the green armchair laughs fondly as he recalls the old man.",
            body: `${JOHN_MED} ${HAT_DOWN} He leans back with one hand on his belly, his eyes narrowed into merry crescents, his round cheeks bunched up, his bright eyes toward screen left. His head and shoulders stay steady as he talks, his mouth shaping each word clearly in time with the voice, a fond grin on his face between the words. <Subject 1> (S1), ${VOICE.john}, merrily, amused at the old man's delight, says <d>[Japanese] ${script.john[0]}</d> then his lips close in the grin. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("40", () =>
        voiced(
          animatic.shot("40").stem,
          motion({
            key: animatic.shot("40").image("key"),
            cast: ["watson"],
            setting: "",
            summary: "Watson at his desk, chin in hand, completely absorbed in the story.",
            body: `${WATSON_MED} His elbow is planted on the desk and his chin rests in his hand; his eyes are on screen right, wide and absorbed, completely taken up by the story. From the first frame to the last he stays seated at the same size in the frame, hardly moving, only blinking now and then, once leaning his cheek a little further into his hand. ${listening("right")} The camera holds a static shot, the framing the same width from the first frame to the last.`,
          }),
        ),
      )
      .nextShot("41", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("41").image("key"),
            cast: ["john"],
            stem: animatic.shot("41").stem,
            setting: "",
            summary: "John Garrideb leans forward from the green armchair, one forefinger raised, and lowers his voice.",
            body: `${JOHN_MED} ${HAT_DOWN} In the first second he lifts his back off the chair and leans his whole upper body forward toward screen left, toward the man off screen at the left, and raises his forefinger beside his face; his round face, turned toward screen left in three-quarter view, grows sly and confiding, his bright eyes narrowed and gleaming at the left edge of the frame the whole time. <Subject 1> (S1), ${VOICE.john}, drops his voice to a hush and says, meaningfully, <d>[Japanese] ${script.john[0]}</d> then his lips close, the forefinger still raised. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("41b", () =>
        voiced(
          animatic.shot("41b").stem,
          motion({
            key: animatic.shot("41b").image("key"),
            cast: ["holmes"],
            setting: "",
            summary: "A close frame on Holmes listening, the corner of his lips lifting faintly.",
            body: `${HOLMES_CLOSE} His pale grey eyes rest on the right edge of the frame, calm and keen, his face quite still; slowly one corner of his thin lips lifts in the faintest, knowing curve and stays there. ${listening("right")} The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("42", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("42").image("key"),
            cast: ["john"],
            look: JOHN_UNSMILING,
            stem: animatic.shot("42").stem,
            setting: "",
            summary: "A close frame on John Garrideb, his eyes glittering with heat as he speaks of the will.",
            body: `A medium close frame on <Subject 1>, seated, his round head and his chest down to the lapels in the frame, filling the right half against the tufted green velvet wing of the armchair, the white marble fireplace at the left, his face turned toward screen left. Gold window light falls on the near cheek. His round face is eager, his brows raised; his eyes widen a little, dark-pupilled and keen, fixed on the left edge of the frame. <Subject 1> (S1), ${VOICE.john}, dropping his voice, burning with eagerness, says <d>[Japanese] ${script.john[0]}</d> then his lips close, the eyes still keen. The camera holds a static shot, the framing the same width from the first frame to the last.`,
          }),
        ),
      )
      .nextShot("43", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("43").image("key"),
            cast: ["john"],
            look: JOHN_UNSMILING,
            stem: animatic.shot("43").stem,
            setting: "",
            summary: "John Garrideb in the green armchair explains the will and holds up five spread fingers at the sum.",
            body: `${JOHN_MED} ${HAT_DOWN} His round face is earnest and emphatic, his bright eyes fixed on screen left. <Subject 1> (S1), ${VOICE.john}, spacing out each word, pressing the point home, says <d>[Japanese] ${script.john[0]}</d> then pauses a beat; as he names the sum he raises the hand nearer the lens up large before his chest, the palm toward screen left, all five fingers spread wide, and, relishing the figure, says <d>[Japanese] ${script.john[1]}</d> then his lips close, the five fingers still held up. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("44", () =>
        voiced(
          animatic.shot("44").stem,
          motion({
            key: animatic.shot("44").image("key"),
            cast: ["watson"],
            setting: "",
            summary: "Watson at his desk catches his breath at the sum, his eyes wide.",
            body: `${WATSON_MED} His hand grips the chair back. In the first second his eyes open wide, his eyebrows shoot up and his shoulders lift as he catches his breath, his lips parting on a sharp intake of breath; then his lips close and stay pressed shut under the moustache, his eyes still wide, staring toward screen right. <Subject 1> is silent for the whole shot, listening to a man off screen at screen right. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("45", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("45").image("key"),
            cast: ["john"],
            look: JOHN_UNSMILING,
            stem: animatic.shot("45").stem,
            setting: "",
            summary: "John Garrideb in the green armchair shakes his head and slumps his shoulders theatrically over his fruitless search.",
            body: `${JOHN_MED} ${HAT_DOWN} He slumps his shoulders in an exaggerated droop, both hands turned palm up on his knees, his head tilting and shaking slowly, his round face wearing a comic, hangdog grimace, the brows pulled up in the middle, his eyes on screen left. <Subject 1> (S1), ${VOICE.john}, exaggerating his troubles, with big gestures, says <d>[Japanese] ${script.john[0]}</d> then his lips close in the hangdog grimace. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("46", () =>
        voiced(
          animatic.shot("46").stem,
          motion({
            key: animatic.shot("46").image("key"),
            cast: ["holmes"],
            setting: "",
            summary: "Holmes in his armchair watches his visitor over his pressed fingertips.",
            body: `${EVEN_LIGHT(HOLMES_SEAT)} He sits back with his legs crossed and his fingertips pressed together under his chin, watching the visitor seated off screen to the right: his face is turned toward screen right and his pale grey eyes look toward the right edge of the frame. He stays quiet and still, breathing slowly. ${listening("right")} The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("47", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("47").image("key"),
            end: animatic.shot("47b").image("key"),
            cast: ["john"],
            look: JOHN_UNSMILING,
            stem: animatic.shot("47").stem,
            setting: "",
            summary: "John Garrideb leans forward in the green armchair, shrugging as if at a loss, then settles back.",
            body: `${JOHN_MED} ${HAT_DOWN} From the first frame he is leaning forward toward screen left, his shoulders hitched up in a helpless shrug, both palms turned out, his round face putting on a puzzled, put-upon look, the brows raised, the mouth turned down at the corners. <Subject 1> (S1), ${VOICE.john}, putting on a troubled air, shrugging, says <d>[Japanese] ${script.john[0]}</d> then his lips close. In the last moments he settles back in the chair, his hands coming to rest open on his knees, a broad smile spreading over his face, his eyes warm on screen left. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("47b", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("47b").image("key"),
            start: animatic.shot("47b").image("key"),
            cast: ["john"],
            stem: animatic.shot("47b").stem,
            setting: "",
            summary: "Continuing the same take, John Garrideb beams at Holmes and makes his offer.",
            body: `The same medium frame continues unbroken. ${JOHN_MED} ${HAT_DOWN} He sits settled back, his hands resting open on his knees, his round face lit by a broad, beaming smile, his bright eyes fixed warmly on screen left like a man closing a deal. <Subject 1> (S1), ${VOICE.john}, genially, like a man closing a deal, says <d>[Japanese] ${script.john[0]}</d> then his lips close in the beaming smile. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("48", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("48").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("48").stem,
            setting: "",
            summary: "Holmes turns to his friend with amusement, then back to his visitor with a suggestion.",
            body: `${EVEN_LIGHT(HOLMES_MED)} From the first frame his head is turned back over his shoulder toward the upper left, toward his friend off screen, his face amused, one eyebrow raised, a sly, conspiratorial smile on his thin lips. <Subject 1> (S1), ${VOICE.holmes}, delighted, with a wink in his voice, says <d>[Japanese] ${script.holmes[0]}</d> then he turns his head and shoulders fully round toward screen right, his face in profile toward his visitor at the right edge of the frame, and holding that turn, lightly, as a casual piece of advice, says <d>[Japanese] ${script.holmes[1]}</d> then his lips meet and he stops speaking, his face still turned toward screen right. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("49", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("49").image("key"),
            cast: ["john"],
            stem: animatic.shot("49").stem,
            setting: "",
            summary: "A close frame on John Garrideb shaking his head at once, still smiling.",
            body: `A medium frame on <Subject 1>, seated, his round head down to both hands resting on the green velvet armrests, filling the right half against the tufted green velvet wing of the armchair, the white marble fireplace at the left, his face turned toward screen left. Gold window light falls on the near cheek. At once he gives a quick shake of the head, the smile staying fixed on his lips, smooth and ready, his bright eyes steady on the left edge of the frame. <Subject 1> (S1), ${VOICE.john}, instantly, a little too smoothly, says <d>[Japanese] ${script.john[0]}</d> then his lips close in the same smile. The camera holds a static shot, the framing the same width from the first frame to the last.`,
          }),
        ),
      )
      .nextShot("50", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("48").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("50").stem,
            setting: "",
            summary: "Holmes in his armchair lazily folds the foolscap letter on his knee.",
            body: `${EVEN_LIGHT(HOLMES_MED)} From the first frame his head faces screen right and the letter lies on his knee exactly as in <Picture 1>: one thin, limp sheet of cream foolscap paper, handwritten lines of ink on it, lying open and flat. His eyes lowered to the letter, he folds the thin sheet once in half on his knee and runs his long fingers slowly along the single fold, and then leaves it as one sheet folded in half, his face mild and faintly bored, a lazy half-smile on his lips. <Subject 1> (S1), ${VOICE.holmes}, lazily, as if his interest were fading, says <d>[Japanese] ${script.holmes[0]}</d> then his lips meet, his fingers still on the folded letter. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("51", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("51").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("51").stem,
            setting: "",
            summary: "A close frame on Holmes raising only his eyes to fix his visitor with a quiet stare as he talks.",
            body: `${HOLMES_CLOSE.replace("A thin rim of gold light runs along his profile.", "Calm, even light lies on his face and collar exactly as in <Picture 1>, steady for the whole shot.")} In the first second his head turns a little toward screen right, his face settling in three-quarter profile pointing at the right edge of the frame; his eyes lift, the pale grey irises rising under his brows and sliding to the far right corners of the eyes, fixing hard on the visitor out of frame at screen right, and they stay there, turned away from the lens. A pleasant, conversational smile stays on his lips, but the eyes are cold. <Subject 1> (S1), ${VOICE.holmes}, like a chance bit of small talk, lightly, a cool, flat edge under the friendliness, says <d>[Japanese] ${script.holmes[0]}</d> then his lips meet, his eyes still fixed. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("52", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("52").image("key"),
            cast: ["john"],
            stem: animatic.shot("52").stem,
            setting: "",
            summary: "A close frame on John Garrideb, his face lighting up with joy at the name.",
            body: `${JOHN_CLOSE} All at once his round face lights up with joy: the brows lift high, the cheeks push up, the eyes crease and shine, his head tipping slightly back, as if greeting a dear old friend. <Subject 1> (S1), ${VOICE.john}, bursting with delight, almost laughing, his voice lifting with joy, says <d>[Japanese] ${script.john[0]}</d> then his lips close in a huge, delighted smile. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("53", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("53").image("key"),
            cast: ["john"],
            stem: animatic.shot("53").stem,
            setting: "",
            summary: "John Garrideb rises from the green armchair with his bowler hat in hand, in high good humour.",
            body: `${JOHN_MED} His black bowler hat is in one hand, held by its brim. He pushes on the armrest with his other hand and rises from the chair to stand on his feet in front of it, facing screen left, his round face wearing a cheerful, satisfied smile, his eyes on screen left. <Subject 1> (S1), ${VOICE.john}, in high good humour, wrapping things up, says <d>[Japanese] ${script.john[0]}</d> then his lips close in the smile, the hat at his side. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("54", () =>
        clip(
          motion({
            key: animatic.shot("54").image("key"),
            cast: ["watson", "holmes", "john"],
            keyRetain:
              "<Picture 1> ([Shot 1] keyframe): partially_preserved - the camera position, angle and framing hold exactly for the whole shot: the same wide size, the same set and light, every piece of furniture at the same place in the frame; the figures move as the description writes them.",
            summary: "In the wide room, John Garrideb bows at the closed door to Holmes and Watson, then opens it and leaves.",
            body: `A wide frame at eye level across the room. At the far left <Subject 1> sits on his chair beside the writing desk, swung round to face screen right, and <Subject 2> sits in the worn dark-red leather armchair; both watch the visitor. At the far right <Subject 3> stands before the closed panelled door, facing screen left toward them, and bows from the waist with his black bowler hat held to his chest. He straightens, turns, opens the door and steps out through it onto the landing, the door swinging closed behind him. The empty green velvet armchair stands by the fireplace. The camera holds a static wide shot. ${SILENT_LIPS}`,
            sound: `${ROOM_SOUND} The click of a door latch, the creak of the door opening and closing, footsteps going out onto the landing.`,
          }),
        ),
      )
      .nextShot("55", () =>
        clip(
          motion({
            key: animatic.shot("55").image("key"),
            cast: ["holmes"],
            setting: "",
            summary: "Holmes in his armchair puffs at his pipe in silence, a curious smile on his face.",
            body: `${HOLMES_SEAT} He leans back, the hand nearer the lens holding his pipe to his lips, the bowl cupped in his fingers; he draws on it slowly and a thin curl of blue-grey smoke rises from the bowl through the gold light. His eyes are half lowered and his face wears a curious, private little smile around the pipe stem; he stays silent. The camera holds a static shot, the framing the same width from the first frame to the last.`,
            sound: `${ROOM_SOUND} The soft draw and puff of a pipe.`,
          }),
        ),
      )
      .nextShot("56", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("56").image("key"),
            cast: ["watson"],
            stem: animatic.shot("56").stem,
            setting: "",
            summary: "Watson leans forward from his desk, impatient, and urges his friend on.",
            body: `${WATSON_MED} He leans forward over his knees, both hands gripping the chair back, his eyes bright and eager on screen right, his brows lifted. <Subject 1> (S1), ${VOICE.watson}, impatiently, urging him on, says <d>[Japanese] ${script.watson[0]}</d> then his lips close under the moustache. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("57", ({ script }) => (
        <Composition>
          <Video
            src={motion({
            key: animatic.shot("57").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("57").stem,
            setting: "",
            summary: "A close frame on Holmes narrowing his eyes behind a veil of pipe smoke.",
            body: `${HOLMES_CLOSE} The stem of his pipe is in the corner of his mouth, a thin veil of blue-grey smoke drifting up across his face; behind the smoke his pale grey eyes narrow to slits, a faint, amused smile at the corners of his mouth. <Subject 1> (S1), ${VOICE.holmes}, absently, enjoying himself, says around the pipe stem, <d>[Japanese] ${script.holmes[0]}</d> then his lips close on the stem and he stays silent, listening to his friend off screen, the smoke still drifting. The camera holds a static shot.`,
          })}
            hasAudio
          />
          <Audio src={animatic.shot("57").offFrameStem} />
        </Composition>
      ))
      .nextShot("58", () =>
        clip(
          motion({
            key: animatic.shot("58").image("key"),
            cast: ["holmes"],
            setting: "",
            retain: {
              holmes:
                "partially_preserved - only his lower face, chin and hand are in the frame for the whole shot; the skin, the collar, the dressing gown and the pipe hold.",
            },
            summary: "A tight insert on Holmes's hand slowly drawing the pipe from his lips.",
            body: `A tight insert at seated head height on <Subject 1>'s lower face, turned toward screen right in three-quarter profile, the tufted dark-red leather wing behind him. His long, pale fingers hold the pipe by its bowl and in the first second take the stem out from between his lips and draw it away, lowering the stem a fist's width below his chin; then his lips part slightly and he slowly breathes out a long, thin stream of blue-grey smoke that drifts up past his cheek through a shaft of gold light, and his thin lips close in a level line. A wisp of smoke trails from the bowl. The camera holds a static shot. ${SILENT_LIPS}`,
          }),
        ),
      )
      .nextShot("59", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("59").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("59").stem,
            setting: "",
            summary: "A close frame on Holmes, the smile gone, lowering his eyes in thought as he speaks.",
            body: `${HOLMES_CLOSE} Cold shadow lies across the near half of his face. The smile is gone, his thin lips a straight line. In the first second his gaze drops: the pale grey eyes lower to the lower right, half lidded, turned inward, his brows drawing slightly together, his head still, a man deep in thought. <Subject 1> (S1), ${VOICE.holmes}, quietly, pondering aloud, word by word, says <d>[Japanese] ${script.holmes[0]}</d> then his lips meet, his eyes still lowered in thought. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("60", () =>
        voiced(
          animatic.shot("60").stem,
          motion({
            key: animatic.shot("60").image("key"),
            start: animatic.shot("56").image("key"),
            cast: ["watson"],
            setting: "",
            sound:
              "A quiet room: the creak of a wooden chair, soft room tone.",
            summary: "Watson half rises from his chair in silent astonishment.",
            body: `${WATSON_MED} He grips the chair back and half rises from the chair, wide-eyed, looking toward screen right. His mouth stays closed under the moustache. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("61", () =>
        clip(
          motion({
            key: animatic.shot("23").image("key"),
            cast: ["john"],
            stem: animatic.shot("61").stem,
            setting: "",
            retain: {
              john: "partially_preserved - seen from chest to knees, his head above the frame for the whole shot; the grey English-cut suit, the frayed elbow on the armrest and the resting hand hold.",
            },
            summary: "Remembered: an insert of John Garrideb sunk deep in his seat, the frayed elbow of his sleeve on the armrest.",
            body: `An insert at the height of the armrest. <Subject 1> sits deep in his seat, seen from his chest to his knees, his head above the frame. The arm nearer the lens, in its grey coat sleeve, lies along the armrest at the right, the elbow of the sleeve frayed, loose threads and a ragged edge of grey cloth showing; his hand rests at the scrolled end of the arm by the brass studs. He sits perfectly still: only his chest rises and falls slowly with his breathing, and the hand stays perfectly still. A man's voice speaks off screen. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("62", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("62").image("key"),
            cast: ["holmes"],
            stem: animatic.shot("62").stem,
            setting: "",
            keyRetain:
              "<Picture 1> ([Shot 1] keyframe): partially_preserved - the camera position, angle and framing hold exactly for the whole shot: the same shot size, the same set and light, the armchair and the fireplace at the same place in the frame; the figure moves as the description writes it.",
            summary: "Holmes rises from his armchair and walks off toward the bay window as he talks.",
            body: `A medium frame at seated eye level on the worn dark-red leather armchair at the left, the white marble fireplace with its black iron grate at the right. <Subject 1> sits in it, seen waist-up, his torso turned toward screen left, both hands on the armrests, a short curved briar pipe in the hand farther from the lens, its dark reddish-brown bowl cupped in his palm and its short black stem curving up between his thumb and forefinger; the pipe keeps this same small shape and size in his hand throughout. He leans forward and pushes himself up out of the chair; standing, he turns toward screen left and strides past the armchair out of the left edge of the frame within three seconds, toward the bay window off screen. The armchair stays empty at the left and the white marble fireplace stays at the right, the room unchanged. <Subject 1> (S1), ${VOICE.holmes}, firmly, with a hint of pride, says as he goes, <d>[Japanese] ${script.holmes[0]}</d> The camera holds a static shot.`,
            sound: `${ROOM_SOUND} The creak of the leather armchair as he rises, unhurried footsteps on the floorboards.`,
          }),
        ),
      )
      .nextShot("63", () =>
        voiced(
          animatic.shot("63").stem,
          motion({
            key: animatic.shot("52").image("key"),
            cast: ["john"],
            setting: "",
            summary: "Remembered: a close frame on John Garrideb beaming with joy at a familiar name.",
            body: `${JOHN_CLOSE} His round face is lit up with joy, the brows lifted high, the cheeks pushed up, the eyes creased and shining, his head tipped slightly back, a huge, delighted closed-lipped grin on his face, his lips pressed together and completely still for the whole shot, like a held memory. <Subject 1> is silent for the whole shot. His hands stay below the bottom edge of the frame, and the frame holds only his head, shoulders and chest against the green chair. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("64", ({ script }) =>
        clip(
          motion({
            key: animatic.shot("64").image("key"),
            cast: ["watson", "holmes"],
            stem: animatic.shot("64").stem,
            setting: "",
            summary: "Holmes stands dark against the blazing bay window, looking down into the street and thinking aloud; Watson watches from the desk.",
            body: `A medium frame at the height of the desk top. The blazing lace-curtained bay window fills the frame, dark curtains at both edges. <Subject 2> stands in the bay window at the right of the desk, his tall figure dark against the bright curtains, one hand parting the lace curtain, looking down into the street below, his profile edged in gold. <Subject 1> sits in the chair at the desk at the centre of the frame, turned toward him, looking up at him, silent, his lips closed under the moustache. <Subject 2> (S1), ${VOICE.holmes}, thinking aloud, growing sharper as he goes, says <d>[Japanese] ${script.holmes[0]}</d> then falls silent. In the silence that follows he leans a little closer to the glass, drawing the lace curtain further aside with his hand, and his head turns slowly as his eyes follow a figure walking along the street below. The camera holds a static shot.`,
          }),
        ),
      )
      .nextShot("65", () =>
        voiced(
          animatic.shot("65").stem,
          motion({
            key: animatic.shot("65").image("key"),
            cast: ["john"],
            setting: "",
            summary: "John Garrideb walks briskly away along the Baker Street pavement from the door of 221B toward the gas lamp, still smiling.",
            body: `A medium frame at eye level from the roadway on a London street of brick terraced houses with black iron railings. The black door of 221B stands at the left and an iron gas lamp at the right. From the first frame <Subject 1> strides quickly along the stone pavement toward screen right, covering the whole way from the door of 221B to the iron gas lamp, and by the last frame he reaches the lamp post at the right, his black bowler hat on his head, his stride brisk and jaunty, his round face in profile with a broad, easy smile, his mouth closed. Low morning sunlight rakes across the facades, laying long indigo shadows across the pavement. The camera holds a static shot.`,
            sound: STREET_SOUND,
          }),
        ),
      )
      .nextShot("66", () =>
        clip(
          motion({
            key: animatic.shot("66").image("key"),
            cast: ["john"],
            look: JOHN_UNSMILING,
            stem: animatic.shot("66").stem,
            setting: "",
            summary: "A close frame on John Garrideb stopping in the shadow of the gas lamp, his smile dropping away.",
            body: `A close frame at standing head height on the pavement beside the black iron gas lamp, its post rising through the right third of the frame, a soot-darkened brick wall and black iron railings soft behind. <Subject 1>'s round face and shoulders fill the left two thirds, his black bowler hat on his head, his face turned toward screen right, a broad smile on it. He stops in the indigo shadow of the lamp post, only a thin rim of light on his cheek, and the smile drops away: his mouth flattens into a hard line, his round face goes cold and blank, his bright eyes narrow and go dead still, and he holds that look to the end. <Subject 1> is silent for the whole shot. A man's voice speaks off screen. The camera holds a static shot.`,
            sound: STREET_SOUND,
          }),
        ),
      ),
    overlay: () => (
      <Composition>
        <Subtitle entries={DIALOGUE_EN} lineClassName={SUB_LINE} />
        <Subtitle entries={NARRATION_EN} lineClassName={`${SUB_LINE} italic`} />
      </Composition>
    ),
    soundtracks: [
      soundtrack("prologue", bgm("bgm-prologue", REVEAL, 40, 11), {
        duck: true,
        until: { shot: "03" },
        fadeOut: 3,
      }),
      soundtrack("study", bgm("bgm-study", STUDY, 95, 12), {
        duck: true,
        from: { shot: "04" },
        until: { shot: "14" },
        fadeIn: 2,
        fadeOut: 2,
      }),
      soundtrack("intrigue-a", bgm("bgm-intrigue-a", INTRIGUE, 170, 13), {
        duck: true,
        from: { shot: "15" },
        until: { shot: "35" },
        fadeIn: 1,
        fadeOut: 3,
      }),
      soundtrack("intrigue-b", bgm("bgm-intrigue-b", INTRIGUE, 220, 14), {
        duck: true,
        from: { shot: "36" },
        until: { shot: "54" },
        fadeIn: 2,
        fadeOut: 3,
      }),
      soundtrack("reveal", bgm("bgm-reveal", REVEAL, 80, 15), {
        duck: true,
        from: { shot: "59" },
        fadeIn: 1,
        fadeOut: 3,
      }),
    ],
  }),
});
