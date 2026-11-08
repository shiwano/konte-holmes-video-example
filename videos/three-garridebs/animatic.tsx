import { adapters, asset, Audio, Composition, defineAnimatic, Panel, respell } from "konte";
import type { MediaAsset } from "konte";
import { audioMinimaxH3R2a } from "konte/workspace/adapters/comfy/audio_minimax_h3_r2a.js";
import { audioZonos2VoiceClone } from "konte/workspace/adapters/comfy/audio_zonos2_voice_clone.js";
import { imageMinimaxH3R2i } from "konte/workspace/adapters/comfy/image_minimax_h3_r2i.js";
import direction from "./direction";
import reference from "./reference";

const STYLE = "2D-animated, 1980s Japanese gothic theatrical anime cel style: razor-thin angular ink lines, hard-edged two-tone cel shadows in deep indigo and blue-black, hand-painted background art with dense detail.";

const ROOM =
  "<Subject 1> is the sitting room in <Picture 2>: its dark-red leather armchair, fireplace, green velvet armchair, writing desk, bay window and panelled door, its dark patterned wallpaper, bookshelves and morning light.";

const ROOM_RETAIN =
  "<Subject 1> (appears in [Shot 1], [Shot 2]): fully_preserved - the furniture, materials and decor stay as the master shows them.";

type Cast = "holmes" | "watson" | "john" | "hudson";
type Prop = "letter" | "directory" | "card" | "pipe";

const CAST_LOOK: Record<Cast, string> = {
  holmes:
    "the tall gaunt Victorian detective with slicked-back black hair, the hair short, a narrow angular face and pale grey eyes, in a deep indigo dressing gown with a dark crimson sash over a white shirt and black waistcoat",
  watson:
    "the moustached Victorian doctor in a tweed suit, slim and upright, around fifty, with a trimmed brown moustache and side-parted brown hair greying at the temples, in a brown tweed three-piece suit with a gold watch chain",
  john: "the short stocky clean-shaven man with a round boyish face, an American with a broad fixed smile and sharp, bright eyes, in a grey English-cut lounge suit frayed at the elbows",
  hudson:
    "the elderly Victorian landlady in a dark dress and white lace cap, tall and thin, grey hair in a bun, the dress black and high-necked",
};

const PROP_LOOK: Record<Prop, string> = {
  letter: "the long handwritten foolscap letter, cream sheets of slanting brown copperplate",
  directory: "the thick London telephone directory with its dark red cloth cover",
  card: "the white calling card on a silver tray, printed in black serif type",
  pipe: "the curved briar tobacco pipe with a dark reddish-brown bowl",
};

const PROP_ALONE: Partial<Record<Prop, string>> = {
  card: "the white calling card on a silver tray, here the white calling card alone, printed in black serif type, held alone between two fingers",
};

const castRef: Record<Cast, MediaAsset<"image">> = {
  holmes: reference.holmes,
  watson: reference.watson,
  john: reference.john,
  hudson: reference.hudson,
};

const propRef: Record<Prop, MediaAsset<"image">> = {
  letter: reference.letter,
  directory: reference.directory,
  card: reference.card,
  pipe: reference.pipe,
};

type KeySpec = {
  ground: MediaAsset<"image">;
  groundLine: string;
  groundRetain: string;
  cast?: readonly Cast[];
  props?: readonly Prop[];
  alone?: readonly Prop[];
  prev?: MediaAsset<"image">;
  same?: MediaAsset<"image">;
  summary: string;
  text: string;
};

function key(name: string, spec: KeySpec) {
  const cast = spec.cast ?? [];
  const props = spec.props ?? [];
  const tag = spec.prev || spec.same ? "[Shot 2]" : "[Shot 1]";
  const images: MediaAsset<"image">[] = [spec.ground, ...cast.map((c) => castRef[c]), ...props.map((p) => propRef[p])];
  const defs: string[] = [`<Picture 1> ${spec.groundLine.replace("[Shot 1]", tag)}`];
  const retain: string[] = [`<Picture 1> (${tag} first frame): ${spec.groundRetain}`];
  cast.forEach((c, i) => {
    defs.push(`<Subject ${i + 1}> is ${CAST_LOOK[c]}, drawn from <Picture ${i + 2}>.`);
    retain.push(
      `<Subject ${i + 1}> (appears in ${tag}): fully_preserved - face, hair, build and clothing hold; the expression and pose are remade as the description writes them, overriding the sheet's.`,
    );
  });
  props.forEach((p, i) => {
    const n = cast.length + i + 1;
    const alone = spec.alone?.includes(p) ? PROP_ALONE[p] : undefined;
    defs.push(`<Subject ${n}> is ${alone ?? PROP_LOOK[p]}, drawn from <Picture ${n + 1}>.`);
    retain.push(
      alone
        ? `<Subject ${n}> (appears in ${tag}): partially_preserved - the card and its type hold; the tray is left behind.`
        : `<Subject ${n}> (appears in ${tag}): fully_preserved - the object's shape, colour and markings hold.`,
    );
  });
  if (spec.prev) {
    images.push(spec.prev);
    const n = images.length;
    defs.push(`<Picture ${n}> is the last frame of the previous shot, the frame [Shot 1] holds.`);
    retain.push(
      `<Picture ${n}> ([Shot 1] first frame): weak_reference - the light and the subjects' placement carry across the cut; its framing is left behind.`,
    );
  }
  if (spec.same) {
    images.push(spec.same);
    const n = images.length;
    defs.push(`<Picture ${n}> is an earlier instant of this same unbroken take, the frame [Shot 1] holds.`);
    retain.push(
      `<Picture ${n}> ([Shot 1] first frame): fully_preserved - the camera, framing, open book, desk top and light carry into [Shot 2] exactly as it shows them; only the hand's pose changes.`,
    );
  }
  const slots: Record<string, MediaAsset<"image">> = {};
  images.forEach((im, i) => {
    slots[`image${i + 1}`] = im;
  });
  const shots: readonly [string] | readonly [string, string] = spec.prev
    ? [`The shot holds <Picture ${images.length}>.`, `The camera cuts to a new frame. ${spec.text}`]
    : spec.same
      ? [
          `The shot holds <Picture ${images.length}>.`,
          `A moment later on the identical frame, the camera unmoved, the same framing, book, desk and light. ${spec.text}`,
        ]
      : [spec.text];
  return asset(name, imageMinimaxH3R2i, {
    image1: spec.ground,
    ...slots,
    width: 1248,
    height: 704,
    prompt: {
      subjectDefinitions: defs as [string, ...string[]],
      summary: { tasks: ["keyframe completion", "reference generation"], text: spec.summary },
      retentionAnalysis: retain as [string, ...string[]],
      detailedDescription: { style: STYLE, shots },
    },
  });
}

const PLATE = "is the empty frame [Shot 1] is set in: its set, camera height, framing and light.";
const PLATE_RETAIN = "fully_preserved - the set, camera, framing and morning light stay as the empty frame shows them.";
const MASTER =
  "is the sitting room [Shot 1] takes place in: its writing desk, bay window, armchairs, fireplace, wallpaper and morning light.";
const TOP =
  "is the overhead view of the sitting room [Shot 1] takes place in: its writing desk top, rug, armchairs and morning light seen from straight above.";
const TOP_RETAIN =
  "attribute_transfer - the room's materials, palette and morning light carry into a closer overhead framing.";
const MASTER_RETAIN =
  "attribute_transfer - the room's materials, palette and morning light carry into a new, closer framing.";

const STREET_MASTER =
  "is Baker Street outside 221B that [Shot 1] takes place in: its soot-darkened brick terrace, black iron railings, stone pavement, gas street lamp and low morning light.";
const STREET_MASTER_RETAIN =
  "attribute_transfer - the street's brick, iron, palette and morning light carry into a new, closer framing.";
const STREET_PLATE_RETAIN = "fully_preserved - the street, camera, framing and morning light stay as the empty frame shows them.";

const ROOM_SOUND =
  "A first-floor sitting room in Baker Street on a June morning in 1902: a quiet room with heavy curtains, faint carriage wheels and hooves on the street below, the tick of a mantel clock.";

const VOICE: Record<"holmes" | "watson" | "john", { sample: MediaAsset<"audio">; who: string; cast: string }> = {
  holmes: {
    sample: reference.holmesVoice,
    who: "Holmes, a tall, gaunt detective in his late forties",
    cast: "a man in his late forties with a low, clear, crisp voice",
  },
  watson: {
    sample: reference.watsonVoice,
    who: "Watson, a slim doctor around fifty",
    cast: "a man around fifty with a warm, honest mid-low voice",
  },
  john: {
    sample: reference.johnVoice,
    who: "John Garrideb, a stocky American in his forties",
    cast: "an American man in his forties with a bright, resonant voice",
  },
};

function line(
  name: string,
  who: "holmes" | "watson" | "john",
  scene: string,
  delivery: string,
  text: string,
  length?: number,
) {
  const v = VOICE[who];
  return asset(name, audioMinimaxH3R2a, {
    audio1: v.sample,
    ...(length ? { length } : {}),
    prompt: {
      subjectDefinitions: [
        `<Subject 1> is ${v.who}.`,
        "<Audio 1> is the voice-timbre reference for <Subject 1> (S1).",
      ],
      summary: { tasks: ["reference generation", "audio reference"], text: `${v.who} speaks one line in the sitting room.` },
      retentionAnalysis: [
        "<Subject 1> (appears in [Shot 1]): partially_preserved - the speaker as described, his performance acted from the scene.",
        "<Audio 1>: weak_reference - the speaker keeps its timbre; the delivery comes from the scene.",
      ],
      detailedDescription: {
        style: STYLE,
        shots: [
          `${scene} <Subject 1> (S1), ${v.cast}, ${delivery}, <d>[Japanese] ${text}</d> Then his lips close and he falls silent.`,
        ],
      },
      overallSoundscape: ROOM_SOUND,
      nonDiegeticMusic: "N/A",
    },
  });
}

function narration(name: string, text: string, padTail = false) {
  return asset(name, audioZonos2VoiceClone, {
    referenceAudio: reference.watsonVoice,
    script: text,
    ...(padTail ? { trailingSilence: "4: 0.5-1" as const, maxNewTokens: 2048 } : {}),
  });
}

export default defineAnimatic(direction, {
  plates: () => {
    const roomWide = asset("roomWide", adapters.imageCrop, {
      image: reference.sittingRoom,
      x: 139,
      y: 0,
      width: 2218,
      height: 1248,
    });
    const watsonMedium = asset("watsonMedium", imageMinimaxH3R2i, {
      image1: roomWide,
      image2: reference.sittingRoom,
      width: 1248,
      height: 704,
      prompt: {
        subjectDefinitions: [
          "<Picture 1> is the wide frame of the sitting room that [Shot 1] holds.",
          ROOM,
        ],
        summary: {
          tasks: ["reference generation"],
          text: "A medium frame on the cluttered writing desk in front of the tall bay window, its chair pulled out.",
        },
        retentionAnalysis: [
          "<Picture 1> ([Shot 1] first frame): attribute_transfer - the desk, the bay window, the light and the colour of <Picture 1> carry into the closer frame; the framing is new.",
          ROOM_RETAIN,
        ],
        detailedDescription: {
          style: STYLE,
          shots: [
            "The shot holds <Picture 1>.",
            "The camera cuts in to a medium frame at the height of the desk top, square to the bay window: the cluttered writing desk, heaped with papers, books and a green-shaded brass lamp, runs across the lower half of the frame, its plain wooden desk chair pulled out in front of it at the centre; behind it the tall Victorian bay window with lace curtains fills the upper two thirds, blazing with low morning sunlight, a heavy curtain swag at each side edge. The frame's right edge stops at the curtain, the bookshelf wall beyond it in shadow. The light and colour are <Picture 1>'s.",
          ],
        },
      },
    });
    const holmesMedium = asset("holmesMedium", adapters.imageCrop, {
      image: reference.sittingRoom,
      x: 640,
      y: 520,
      width: 800,
      height: 450,
    });
    const johnMedium = asset("johnMedium", adapters.imageCrop, {
      image: reference.sittingRoom,
      x: 1150,
      y: 480,
      width: 1110,
      height: 624,
    });
    const holmesClose = asset("holmesClose", imageMinimaxH3R2i, {
      image1: holmesMedium,
      image2: reference.sittingRoom,
      width: 1248,
      height: 704,
      prompt: {
        subjectDefinitions: [
          "<Picture 1> is the frame of the dark-red leather armchair beside the fireplace that [Shot 1] holds.",
          ROOM,
        ],
        summary: {
          tasks: ["reference generation"],
          text: "A close frame, at the scale of a seated man's head and shoulders, on the top of the empty dark-red leather armchair's back, the bookshelf and the fireplace's edge behind it.",
        },
        retentionAnalysis: [
          "<Picture 1> ([Shot 1] first frame): attribute_transfer - the armchair, the light and the colour of <Picture 1> carry into the closer frame; the framing is new.",
          ROOM_RETAIN,
        ],
        detailedDescription: {
          style: STYLE,
          shots: [
            "The shot holds <Picture 1>.",
            "The camera cuts in a little from <Picture 1> to a close frame at the seated eye height of a man sitting in the chair, framed for his head and shoulders: only the upper part of the worn dark-red leather armchair's tufted back shows, spanning no more than the left half of the frame, its top curve at about the upper third where a seated man's head would rise to, its tuft buttons small, its left wing a narrow sliver at the left edge, the leather catching a thin rim of gold window light. Above and behind the chair top, the bookshelf with its rows of book spines takes the upper left, and to the right the white marble edge of the Victorian fireplace with a cluttered mantelpiece and a strip of green patterned wallpaper fill the rest, a little soft. The chair keeps its size relative to the bookshelf and the fireplace in <Picture 1>, the bookshelf and the fireplace taking more of the frame than the chair. The light and colour are <Picture 1>'s.",
          ],
        },
      },
    });
    const johnClose = asset("johnClose", imageMinimaxH3R2i, {
      image1: johnMedium,
      image2: reference.sittingRoom,
      width: 1248,
      height: 704,
      prompt: {
        subjectDefinitions: [
          "<Picture 1> is the frame of the green velvet armchair beside the fireplace that [Shot 1] holds.",
          ROOM,
        ],
        summary: {
          tasks: ["reference generation"],
          text: "A close frame on the upper back and wing of the empty green velvet armchair, the fireplace's edge soft behind it.",
        },
        retentionAnalysis: [
          "<Picture 1> ([Shot 1] first frame): attribute_transfer - the armchair, the light and the colour of <Picture 1> carry into the closer frame; the framing is new.",
          ROOM_RETAIN,
        ],
        detailedDescription: {
          style: STYLE,
          shots: [
            "The shot holds <Picture 1>.",
            "The camera cuts in to a close frame at the height of the armchair's wing tops: the tufted upper back and right wing of the green velvet armchair fill the right half of the frame; behind it to the left, out of focus, the white marble edge of the Victorian fireplace with a cluttered mantelpiece and a sliver of dark patterned wallpaper fill the rest, lit by a faint shaft of gold window light. The green velvet seat cushion shows in full below the wing. The light and colour are <Picture 1>'s.",
          ],
        },
      },
    });
    const elbowInsert = asset("elbowInsert", imageMinimaxH3R2i, {
      image1: johnMedium,
      image2: reference.sittingRoom,
      width: 1248,
      height: 704,
      prompt: {
        subjectDefinitions: [
          "<Picture 1> is the frame of the green velvet armchair beside the fireplace that [Shot 1] holds.",
          ROOM,
        ],
        summary: {
          tasks: ["reference generation"],
          text: "An insert of the green velvet armchair's seat and its rolled arm on the door side, seen from the same angle as the medium frame.",
        },
        retentionAnalysis: [
          "<Picture 1> ([Shot 1] first frame): attribute_transfer - the armchair's velvet, brass studs, light and colour carry into the insert; the framing is new.",
          ROOM_RETAIN,
        ],
        detailedDescription: {
          style: STYLE,
          shots: [
            "The shot holds <Picture 1>.",
            "The camera cuts in on the same armchair from the same three-quarter angle as <Picture 1>, to a close frame a little above the armrest, wide enough to take in the whole chair from the top of its seat back to the front edge of its seat: the empty green velvet seat cushion at the left of centre, the tufted seat back rising behind it; the chair's rolled arm on the door side, at the frame's right, runs its whole length across the right half of the frame from where it meets the seat back to its scrolled front end and row of brass studs at the lower right. The brass studs and worn nap run unbroken along the whole arm. The light and colour are <Picture 1>'s.",
          ],
        },
      },
    });
    const directoryInsert = asset("directoryInsert", imageMinimaxH3R2i, {
      image1: reference.view.sittingRoom.top,
      width: 1248,
      height: 704,
      prompt: {
        subjectDefinitions: [
          "<Picture 1> is the overhead view of the sitting room that [Shot 1] holds, with the writing desk in its lower left corner.",
        ],
        summary: {
          tasks: ["reference generation"],
          text: "An insert straight down onto the top of the cluttered writing desk.",
        },
        retentionAnalysis: [
          "<Picture 1> ([Shot 1] first frame): attribute_transfer - the desk's wood, papers, light and colour carry into the insert; the framing is new.",
        ],
        detailedDescription: {
          style: STYLE,
          shots: [
            "The shot holds <Picture 1>.",
            "The camera cuts in to an insert looking straight down onto the writing desk's top: dark polished wood fills the frame, a clear patch of bare polished wood in the centre, about a third of the frame's width, loose letters and a brass inkstand around its edges, a shaft of gold window light falling across it from the left. The light and colour are <Picture 1>'s.",
          ],
        },
      },
    });
    const streetMedium = asset("streetMedium", adapters.imageCrop, {
      image: reference.street,
      x: 0,
      y: 100,
      width: 1920,
      height: 1080,
    });
    return {
      roomWide,
      watsonMedium,
      holmesMedium,
      johnMedium,
      holmesClose,
      johnClose,
      elbowInsert,
      directoryInsert,
      streetMedium,
    };
  },
  timeline: ({ shot, plates }) => ({
    shots: shot("01", ({ script }) => {
      const k = key("key", {
        ground: reference.view.sittingRoom.top,
        groundLine: TOP,
        groundRetain: TOP_RETAIN,
        props: ["letter"],
        summary: "An insert straight down onto the foolscap letter lying in the dark, a shaft of light on its signature.",
        text: "An insert looking straight down onto dark polished wood sunk in deep indigo shadow. <Subject 1> lies flat across the frame, its last cream sheet filling the centre, the slanting brown handwriting fading into the dark at the top edge. A single narrow shaft of gold morning light falls diagonally from the lower left and lands on the signature \"Nathan Garrideb\" at the foot of the page, the only bright thing in the frame; dust motes hang in the beam. The camera holds a static overhead shot.",
      });
      return (
        <Composition>
          <Panel src={k} blocking="光の筋が手紙の上をゆっくり這い上がり、末尾の署名を照らし出す。" camera="fixed" />
          <Audio id="narration" src={narration("narration", script.narration[0])} start={0.5} />
        </Composition>
      );
    })
      .nextShot("02", ({ script }) => {
        const k = key("key", {
          ground: plates.roomWide,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson", "holmes"],
          props: ["letter"],
          summary: "The wide sitting room as Holmes steps in through the door at the right, the letter in his hand, Watson at the desk at the left.",
          text: "A wide frame at eye level across the sitting room. At the far left <Subject 1> sits on a high-backed wooden desk chair at the writing desk before the bright bay window, the chair's tall back visible behind him, his back three-quarters to the camera, head bent over his papers, pen in his right hand, his feet on the floor under the desk; he is small in the frame. At the far right <Subject 2> has just stepped through the open panelled door, standing upright on the threshold, his feet on the dark floorboards, his body facing screen left, the hand nearer the camera holding <Subject 3> loosely at his side, the far hand on the door's edge behind him; his face is pale and composed, his grey eyes glinting. Long diagonal shafts of gold sunlight cross the room between them; the armchairs and the fireplace stand empty in the middle. The camera holds a static wide shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが手紙を手に扉から一歩入って立ち止まる。机のワトスンはペンを走らせ続ける。" camera="fixed" />
            <Audio id="narration" src={narration("narration", script.narration[0], true)} start={0.4} />
          </Composition>
        );
      })
      .nextShot("03", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("02").image("key"),
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["letter"],
          summary: "Holmes seated in his dark-red armchair, raising the letter with amused grey eyes.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the worn dark-red leather armchair, seen from head to knees, his torso turned three-quarters toward screen right, his back against the tufted chair back, his legs crossed, the upper leg crossed over toward the fireplace at the right. His head turns toward screen left, chin slightly lifted; his pale grey eyes glint with amusement under level brows, the corners of his thin lips drawn into a faint, sly smile. The forearm on the screen-left armrest rises, the elbow bent, the hand holding <Subject 2> up beside his face, the cream sheets catching the gold window light; the other hand rests on the screen-right armrest. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが顔の横で手紙を軽く振り、画面左のワトスンへ目を向けて笑う。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes sits in his armchair, holding up a letter, amused.", "in high spirits, teasing lightly, says", respell(script.holmes[0], "ワトスン、かねもうけの機会だよ。ガリデブという名前を聞いたことはあるかね？"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("04", ({ script }) => {
        const k = key("key", {
          ground: plates.watsonMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson"],
          summary: "Watson at his writing desk, his back to the camera, bent over his papers.",
          text: "A medium frame at the height of the desk top. <Subject 1> sits on the wooden chair at the writing desk, seen waist-up from behind against the bright bay window, which rims his hair and shoulders with gold light. His back is toward the camera, his head bent over the papers on the desk; his right hand holds a pen on the papers, his left hand rests flat beside them. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="書き物をしていたワトスンが椅子の上で画面右へ振り返り、右腕を椅子の背に掛け、きょとんとして首を横に振る。" camera="fixed" />
            <Audio id="watson" src={line("watson", "watson", "Watson turns round at his desk toward his friend.", "looking up blankly, says", script.watson[0])} start={0.3} />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes speaks from his armchair across the room, off screen.", "with a knowing chuckle, as if setting a riddle, says off-screen", respell(script.holmes[0], "ならば、ガリデブを一人探し当てれば、かねになる。"))} start={2.6} />
          </Composition>
        );
      })
      .nextShot("05", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["letter"],
          summary: "Holmes in his armchair with the letter on his knee, tapping it with one fingertip.",
          text: "A medium frame at seated eye level. <Subject 1> sits back in the worn dark-red leather armchair, seen waist-up, his torso turned three-quarters toward screen right, his long legs crossed. <Subject 2> lies across his raised knee; his right hand rests on it, the long index finger's tip pressed on the top sheet, the other fingers resting on it; his left elbow rests on the armrest, the hand loose. His head is tilted toward screen left, eyelids lowered, a relaxed, amused half-smile on his thin lips. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが膝の手紙を指先で軽く叩きながら、ゆったりと語る。" camera="fixed" />
            <Audio id="watson" src={line("watson", "watson", "Watson calls across from his desk, off screen.", "leaning forward, plainly curious, says off-screen", script.watson[0])} start={0.2} />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes lounges in his armchair, the letter on his knee.", "slowly and leisurely, amused at his own story, says", respell(script.holmes[0], "長い話でね——それも、ずいぶんふうがわりな話だ。人間の複雑さをずいぶん探ってきたが、これほど奇妙なものには出くわしたことがない。"), 226)} start={2.1} />
          </Composition>
        );
      })
      .nextShot("06", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["letter"],
          summary: "Holmes in his armchair, the letter on his knee, his gaze resting on it with an amused half-smile.",
          text: "A medium frame at seated eye level. <Subject 1> sits back in the worn dark-red leather armchair, seen waist-up, his torso turned three-quarters toward screen right, his long legs crossed, <Subject 2> lying on his knee under his right hand. His head is tilted toward screen left, eyelids lowered, his gaze resting on <Subject 2> on his knee, a relaxed, amused half-smile on his thin lips. A thin rim of gold window light traces his cheekbone and the slicked-back hair. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズの目が細まり、視線が画面右の扉のほうへゆっくり流れる。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes in his armchair glances toward the door and lowers his voice.", "dropping his voice, with a hint of theatre, says", script.holmes[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("07", ({ script }) => {
        const k = key("key", {
          ground: plates.directoryInsert,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson"],
          props: ["directory"],
          summary: "Straight down onto the desk top, Watson's hand turning a page of the open telephone directory.",
          text: "An insert looking straight down onto the writing desk's top. <Subject 2> lies open in the centre of the frame, its dense columns of tiny names filling both pages. From the lower right edge of the frame <Subject 1>'s right hand and brown tweed cuff reach in; the thumb and forefinger pinch the corner of the right-hand page, lifting it half-turned, the page curving upright. A shaft of gold window light falls across the pages from the left. The camera holds a static overhead shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ワトスンの手が電話帳の頁を一枚、また一枚とめくっていく。" camera="fixed" />
            <Audio id="narration" src={narration("narration", script.narration[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("08", ({ script, shot }) => {
        const k = key("key", {
          same: shot("07").image("key"),
          ground: plates.directoryInsert,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson"],
          props: ["directory"],
          summary: "Straight down onto the open telephone directory, Watson's forefinger pressed under one name.",
          text: "An insert looking straight down onto the writing desk's top. <Subject 2> lies open flat in the centre of the frame, its dense columns of tiny names filling both pages, the dark polished wood of the writing desk's top showing around the book's edges, at the same size and in the same even light as the previous instant of this take. From the lower right edge of the frame <Subject 1>'s right hand and brown tweed cuff reach in; the forefinger tip rests on the left-hand page's column of names a hand's length above a single line of small print reading \"Garrideb, N.\", the other fingers curled. The camera holds a static overhead shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ワトスンの指が名前の列を下へなぞり、一行の上でぴたりと止まる。" camera="fixed" />
            <Audio id="narration" src={narration("narration", script.narration[0])} start={0.2} />
          </Composition>
        );
      })
      .nextShot("09", ({ script }) => {
        const k = key("key", {
          ground: plates.watsonMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson"],
          props: ["directory"],
          summary: "Watson rising from his desk chair, holding the telephone directory up in triumph.",
          text: "A medium frame at the height of the desk top. <Subject 1> is half risen from the wooden chair at the writing desk, seen from the thighs up against the bright bay window, his torso turned toward screen right, his knees still bent. His right arm is raised, the elbow bent, holding <Subject 2> open and aloft at shoulder height toward screen right; his left hand presses on the desk top. His head is turned toward screen right, his eyes wide and bright, his mouth open in a triumphant grin under the moustache. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ワトスンが電話帳を高く掲げたまま、椅子から立ち上がりきる。" camera="fixed" />
            <Audio id="watson" src={line("watson", "watson", "Watson rises from his desk, holding up the directory.", "triumphant, his voice bouncing, calls out", script.watson[0])} start={0.2} />
          </Composition>
        );
      })
      .nextShot("10", ({ shot }) => {
        const k = key("key", {
          prev: shot("09").image("key"),
          ground: plates.roomWide,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson", "holmes"],
          props: ["directory"],
          summary: "The wide sitting room, Watson standing upright beside Holmes's armchair with the directory at his chest.",
          text: "A wide frame at eye level across the sitting room. <Subject 1> stands fully upright on the rug just left of the worn dark-red leather armchair, clear of the wooden desk chair, both legs straight and his back straight, his body facing screen right, his head tilted down toward Holmes. He holds <Subject 3> closed in both hands at his chest. <Subject 2> sits in the armchair, turned toward screen left, looking up at Watson, his hands resting on the armrests. Both figures are small in the frame, in the left-centre, the writing desk empty behind them at the far left, the green velvet armchair empty at the right of the fireplace, the panelled door closed at the far right. Shafts of gold sunlight cross the floor. The camera holds a static wide shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ワトスンが身をかがめて電話帳を差し出し、ホームズが受け取る。" camera="fixed" />
          </Composition>
        );
      })
      .nextShot("11", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("10").image("key"),
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["directory"],
          summary: "Holmes in his armchair reading a line of the open directory with a rueful smile.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the worn dark-red leather armchair, seen waist-up, his torso turned three-quarters toward screen right. <Subject 2>, a volume several inches thick bound in dark red cloth with navy page edges, lies open across his lap and left forearm; his right index finger rests on one line of the left-hand page. His head is bowed toward the page, eyes lowered to it, one brow raised and the corner of his mouth drawn up in a rueful, slightly pitying smile. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが指で一行をなぞって読み上げ、顔を上げて苦笑する。" camera="fixed" />
            <Audio
              id="holmes"
              src={line(
                "holmes",
                "holmes",
                "Holmes reads aloud from the directory in his lap, then speaks kindly to his friend.",
                "reading the entry flatly, then gently, almost sorry for him, says",
                respell(script.holmes[0], "『ガリデブ、エヌ。リトル・ライダーガイ、136番地』……残念だがワトスン、これは手紙のサシダシニン本人だよ。住所が同じだ。もう一人、ついになる者が要るんだ。"),
                294,
              )}
              start={0.3}
            />
          </Composition>
        );
      })
      .nextShot("12", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("11").image("key"),
          ground: plates.roomWide,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson", "hudson", "holmes"],
          props: ["card", "directory"],
          summary: "The wide sitting room as Mrs Hudson, just come in through the door, holds out a silver tray with a card to Watson, the open directory on Holmes's lap.",
          text: "A wide frame at eye level across the sitting room. <Subject 1> stands on the rug at the left, his body turned toward screen right. <Subject 3> sits in the worn dark-red leather armchair at the right of the pair, facing screen left, <Subject 5> lying open across his lap. Between them, a step nearer the camera, <Subject 2> has just come up from the open panelled door at the far right, upright, her feet on the rug, both hands holding <Subject 4> out toward Watson at waist height. All three are small in the frame; the green velvet armchair stands empty by the fireplace, the door open behind. Shafts of gold sunlight cross the floor. The camera holds a static wide shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ハドスン夫人が名刺の盆を手に、扉から部屋へ数歩入ってくる。" camera="fixed" />
            <Audio id="narration" src={narration("narration", script.narration[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("13", ({ script }) => {
        const k = key("key", {
          ground: reference.view.sittingRoom.top,
          groundLine: TOP,
          groundRetain: TOP_RETAIN,
          cast: ["watson", "hudson"],
          props: ["card"],
          summary: "Straight down onto the silver tray, Watson's fingers lifting the calling card from it.",
          text: "An insert looking straight down onto <Subject 3>, the round silver tray filling the centre of the frame against the dark crimson rug below. At the right edge of the frame <Subject 2>'s black sleeve and thin, pale hand hold the tray's rim from beneath. From the left edge <Subject 1>'s brown tweed cuff and right hand reach in; thumb and forefinger pinch the white calling card and lift it a little off the tray, its black serif type reading \"JOHN GARRIDEB\" with two lines of small print beneath. Gold window light glints on the silver. The camera holds a static overhead shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ワトスンの指が名刺を盆から持ち上げ、ハドスン夫人の盆が画面右の外へ引かれていく。" camera="fixed" />
            <Audio id="watson" src={line("watson", "watson", "Watson picks the card off the tray and reads it.", "with a startled, delighted laugh at the find, then reading the card out word by word, savouring it, his voice lifting with glee on the name and slowing with relish on the address, says", respell(script.watson[0], "なんと、ここにもいたぞ！今度はかしらもじが違う。ジョン・ガリデブ、弁護士。アメリカがっしゅうこく、カンザス州ムアヴィル。"), 226)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("14", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson", "holmes"],
          props: ["card"],
          alone: ["card"],
          summary: "Holmes in his armchair glancing down at the card Watson holds out from the left, a thin smile on his lips.",
          text: "A medium frame at seated eye level. At the left edge of the frame <Subject 1>'s brown tweed sleeve and right hand reach in at chest height, holding out <Subject 3> between two fingers, the card small, its print too fine to read. <Subject 2> sits in the worn dark-red leather armchair, seen waist-up, torso turned three-quarters toward screen right, his head tilted down and turned toward the upper left, his pale grey eyes lowered and fixed on the card at the upper left of the frame, the pupils low and toward screen left; a thin, cool smile curves one corner of his mouth, the rest of his face still. His hands rest on the armrests. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが差し出された名刺に目を落とし、口の端をわずかに上げる。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes eyes the card his friend holds out.", "amused, yet with a cool edge, says", script.holmes[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("15", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("14").image("key"),
          ground: plates.holmesClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          summary: "A close frame on Holmes, lips pressed flat, his sharp eyes fixed on the right edge of the frame.",
          text: "A close frame at seated eye height. <Subject 1>'s head and shoulders fill the left half of the frame, the top of the dark-red leather armchair's back low behind his shoulders at the size <Picture 1> holds, the fireplace soft behind him at the right, his face turned in profile toward screen right. His lips are pressed into a flat line, his jaw set, his pale grey eyes wide open and fixed hard on the right edge of the frame; his brows are drawn slightly down. Cold shadow falls across the near half of his face, a thin rim of gold light along the profile. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="客が上がってくるのを待ち受けて、ホームズの目が画面右の扉へ鋭く据わる。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes turns his gaze to the door, waiting.", "murmurs, almost to himself, with the stillness of a hunter waiting for his quarry", script.holmes[0])} start={2.2} />
          </Composition>
        );
      })
      .nextShot("16", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("15").image("key"),
          ground: plates.roomWide,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson", "holmes", "hudson", "john"],
          summary: "The wide sitting room as Mrs Hudson slips out of the door and John Garrideb steps in, smiling.",
          text: "A wide frame at eye level across the sitting room. At the far left <Subject 1> sits at the writing desk before the bay window, turned in his chair toward screen right. <Subject 2> sits in the worn dark-red leather armchair, facing screen right. At the far right the panelled door stands open: <Subject 3> is half out of it, her back to the camera, stepping out onto the landing; in front of her, just over the threshold, <Subject 4> steps into the room toward screen left, his feet on the dark floorboards, his round face lit by a broad smile, his black bowler hat in one hand. All figures are small in the frame; the green velvet armchair stands empty by the fireplace. Shafts of gold sunlight cross the floor. The camera holds a static wide shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ハドスン夫人が扉の外へ退がり、入れ替わりにジョン・ガリデブが扉から一歩入る。" camera="fixed" />
            <Audio id="narration" src={narration("narration", script.narration[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("17", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("16").image("key"),
          ground: plates.johnClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "A close frame on John Garrideb's broad smile, his bright eyes flicking sideways.",
          text: "A close frame at the height of the armchair's wing tops. <Subject 1> stands in front of the green velvet armchair, his round head and broad shoulders filling the right half of the frame, the fireplace soft at the left, his body facing screen left. The grey jacket's shoulders and lapels are drawn in clean, crisp ink lines, the cloth worn smooth. His clean-shaven, boyish face is set in a broad, fixed smile, cheeks round, teeth showing; but his eyes are narrowed slightly and glittering, bright and hard, the small pupils slid sharply toward the left edge of the frame, measuring someone off screen, the brows perfectly level. Gold window light falls on the near cheek. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが満面の笑みのまま、目だけを画面左の二人のあいだで素早く往復させる。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb greets Holmes on entering the sitting room.", "warmly and eagerly, yet with appraising little pauses, says", respell(script.john[0], "ホームズさんですか？ああ、やっぱり！さしえとそっくりですな。同じ名字のネイサン・ガリデブさんから、手紙が届いているでしょう？"), 243)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("18", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["letter"],
          summary: "Holmes in his armchair, the letter in one hand, gesturing his visitor to a seat with the other.",
          text: "A medium frame at seated eye level. <Subject 1> sits upright in the worn dark-red leather armchair, seen waist-up, his torso turned three-quarters toward screen right. The hand farther from the lens holds <Subject 2> loosely on his knee; the arm nearer the lens is extended toward screen right, the palm open and turned up, the long fingers pointing past the right edge of the frame, offering a seat. His head is turned toward screen right, his face composed and courteous, the pale grey eyes steady, a polite, host's half-smile on his thin lips. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが手紙を膝に持ったまま、片手を開いて画面右の客用の椅子を示す。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, in his armchair, welcomes a visitor and waves him to a chair.", "graciously and calmly, as the master of the house, says", script.holmes[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("19", ({ script }) => {
        const k = key("key", {
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb lowering himself into the green velvet armchair, still smiling broadly.",
          text: "A medium frame at seated eye level. <Subject 1> is settling into the green velvet armchair at the centre of the frame, seen waist-up, his stocky body facing screen left, his hips just meeting the seat cushion, his hands on the two armrests as he lowers himself, his black bowler hat held against the armrest under one hand. His round, clean-shaven face wears a broad, fixed smile, his bright eyes turned toward screen left. The fireplace stands at the left of the frame and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが満面の笑みのまま、客用の椅子に腰を下ろす。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes speaks from his armchair to his seated visitor, off screen.", "casually, as if making small talk, lightly says off-screen", script.holmes[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("20", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("19").image("key"),
          ground: plates.johnClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "A close frame on John Garrideb, his broad smile frozen stiff on his face.",
          text: "A close frame at the height of the armchair's wing tops. <Subject 1> sits against the green velvet wing, his round head and broad shoulders filling the right half of the frame, the fireplace soft at the left, his face turned toward screen left. The broad smile is still stretched across his lips, but it has frozen into a stiff mask: the cheeks set hard, the corners of the mouth fixed, the jaw tight. His eyes are open wide and staring, the pupils shrunk to small hard points fixed on the left edge of the frame, the brows stiff and level; his eyes are cold and glassy above the grin. Gold window light falls on the near cheek. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブの笑顔がそのまま凍りつき、目だけが画面左に据わる。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, answers a remark that has caught him off guard.", "still smiling, asks a shade too tightly", script.john[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("21", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          summary: "A close frame on Holmes, his eyes travelling down his visitor's coat.",
          text: "A close frame at seated eye height. <Subject 1>'s head and shoulders fill the left half of the frame, the top of the dark-red leather armchair's back low behind his shoulders at the size <Picture 1> holds, the bookshelf and the edge of the fireplace soft behind him at the right, his face turned toward screen right in three-quarter profile. His eyelids are half lowered, his pale grey eyes looking down and to the right, appraising, as if running down a coat; his face is calm and unreadable, the thin lips closed in a level line. A thin rim of gold light runs along his profile. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが半眼のまま、画面右の相手の上着へ視線を這わせる。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, in his armchair, studies his visitor's clothes.", "flatly, as a plain matter of fact, says", respell(script.holmes[0], "服装が、すっかりえいこくふうだ。"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("22", ({ script }) => {
        const k = key("key", {
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb in the green armchair, shoulders shaking in a forced laugh.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the green velvet armchair at the centre of the frame, seen waist-up, his stocky body facing screen left, his black bowler hat on his knee. He is caught mid-laugh: his shoulders hunched and lifted, his head tipped back a little, his mouth open in a wide laugh showing his teeth; but his bright eyes stay narrowed and watchful, fixed on screen left. One hand rests on the armrest, the other half raised, palm out. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが肩を揺すって作り笑いをし、目だけは笑わない。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, laughs off a remark about his clothes.", "with a forced laugh, probing, says", respell(script.john[0], "あなたのてじなのことは読んでますがね、まさか自分がネタにされるとは。どこでそんなことを？"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("23", ({ script }) => {
        const k = key("key", {
          ground: plates.elbowInsert,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "An insert of John Garrideb sitting deep in the green armchair, his coat frayed at the elbow on the armrest.",
          text: "An insert at the height of the armrest. <Subject 1> is seen from his chest to his knees, his head above the frame. He sits deep and comfortably back in the chair, leaning back at ease: his hips are pushed right to the back of the seat, his back resting against the tufted seat back, his stout grey-coated body settled heavily into the chair, his grey-trousered thighs lying along the whole length of the seat cushion, at the left of centre. His left arm in its grey English-cut coat sleeve rests along the armrest at the right of the frame, the whole forearm and the bent elbow inside the frame; at the centre of the frame the elbow of the sleeve, pressed on the armrest, is frayed, loose threads and a ragged edge of grey cloth showing where the weave has worn through. His left hand rests at the scrolled end of the arm by the brass studs at the lower right, the fingers relaxed. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="椅子に深く座ったジョンの、肘掛けに置かれた灰色の袖の肘が、擦り切れてほつれている。手はじっと動かない。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes points out the signs in his visitor's clothes, off screen.", "gently, with complete certainty, says off-screen", respell(script.holmes[0], "上着の肩のたちかた、ブーツのつま先——誰が見たって明らかですよ。"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("24", ({ script }) => {
        const k = key("key", {
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb in the green armchair, spreading both hands wide with a laugh.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the green velvet armchair at the centre of the frame, seen waist-up, his stocky body facing screen left, his black bowler hat on his knee. Both his hands are spread wide, palms up, elbows out, in a big show of good humour; his round face beams with a broad smile, the cheeks bunched, his bright eyes crinkled toward screen left. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが両手を広げ、大きく笑ってみせる。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, spreads his hands and explains himself cheerfully.", "trying to sound jovial again, a little fast, says", respell(script.john[0], "いやはや、そんなにえいこくじんらしく見えるとはね。仕事でしばらく前にこっちへ来たもんで、おっしゃるとおり、身なりはほとんどロンドンじこみですよ。"), 294)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("25", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("24").image("key"),
          ground: plates.johnClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "A close frame on John Garrideb, his smile gone, jerking his chin toward the letter off screen.",
          text: "A close frame at the height of the armchair's wing tops. <Subject 1> sits against the green velvet wing, his round head and broad shoulders filling the right half of the frame, the fireplace soft at the left, his face turned toward screen left. The smile is gone: his mouth is a flat, hard line, the round cheeks slack, his brows lowered; his bright eyes are cold and narrowed, and his chin juts sharply toward the lower left edge of the frame. Gold window light falls on the near cheek, the far side of his face in indigo shadow. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="笑顔の消えたジョン・ガリデブが、顎を画面左下へ突き出す。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, loses patience with the small talk.", "his geniality peeled away, bites back his irritation and growls low", respell(script.john[0], "だが、おいそがしいでしょうし、クツシタの仕立ての話をしに来たわけじゃない。その手にある書類の話に入りませんか？"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("26", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["letter"],
          summary: "Holmes in his armchair raising one open hand to calm his visitor.",
          text: "A medium frame at seated eye level. <Subject 1> sits back in the worn dark-red leather armchair, seen waist-up, his torso turned three-quarters toward screen right, <Subject 2> resting on his knee under the hand farther from the lens. The hand nearer the lens is raised to shoulder height, palm open and facing screen right, the fingers loose, in a soothing gesture; his head is tilted slightly, his face turned well toward screen right in three-quarter profile, the far cheek turned away and his nose pointing at the right edge of the frame; his face is mild and patient, a soft, placating smile on his thin lips, his pale grey eyes level, the irises in the right corners of the eyes, fixed on the visitor out of frame at screen right and away from the lens. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが片手を上げ、なだめるように穏やかに笑う。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, in his armchair, calms his irritated visitor.", "softly and soothingly, unhurried, says", script.holmes[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("27", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("26").image("key"),
          ground: plates.holmesClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          summary: "A close frame on Holmes looking straight at his visitor, his gaze level and keen.",
          text: "A close frame at seated eye height. <Subject 1>'s head and shoulders fill the left half of the frame, the top of the dark-red leather armchair's back low behind his shoulders at the size <Picture 1> holds, the bookshelf and the edge of the fireplace soft behind him at the right, his face turned well toward screen right in three-quarter profile, the far cheek turned away and his nose pointing at the right edge of the frame. His pale grey eyes are open and level, the irises in the right corners of the eyes, fixed on the visitor out of frame at screen right and away from the lens, keen and unblinking; his face is quite still, the thin lips holding a faint, pleasant line. Cold shadow lies across the near half of his face, a thin rim of gold light along the profile. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが画面右をまっすぐ見据え、静かに問いかける。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, in his armchair, asks his visitor a pointed question.", "in the same casual tone, slipping the question in like a blade, says", script.holmes[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("27b", () => {
        const k = key("key", {
          ground: plates.elbowInsert,
          groundLine: "is the insert of the green velvet armchair's arm that [Shot 1] cuts in closer on, from the same angle and height.",
          groundRetain: "attribute_transfer - the armchair's velvet, brass studs, light and colour carry into the tighter insert on the arm's scrolled end; the framing is new.",
          cast: ["john"],
          summary: "An insert of John Garrideb's left hand clenched hard on the scrolled end of the armchair's arm.",
          text: "A tight insert at the height of the armrest, the camera level with it. The scrolled front end of the green velvet arm with its curving row of brass studs sits at the centre of the frame. Only <Subject 1>'s left forearm and hand are in the frame: the forearm, in its grey English-cut coat sleeve with a white shirt cuff at the wrist, lies along the top of the arm from the upper left edge of the frame; the hand closes over the scrolled end, the four fingers curled hard round the front of the scroll and sunk into the velvet, the knuckles raised in a ridge and pale, the thumb pressed flat on top of the arm beside the brass studs. The rest of him is above and left of the frame.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="肘掛けの先に置かれたジョンの左手の指に、じわりと力がこもり、肘掛けをぎゅっと握りしめる。" camera="fixed" />
          </Composition>
        );
      })
      .nextShot("28", ({ script }) => {
        const k = key("key", {
          ground: plates.johnClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "A close frame on John Garrideb, his round face twisted with rage.",
          text: "A close frame at the height of the armchair's wing tops. <Subject 1> sits in the green velvet armchair, his back against it, the tufted wing rising behind his head and shoulders, leaning forward only a little from it, his round head and broad shoulders filling the right half of the frame, the fireplace soft at the left, his face turned toward screen left. His round face is twisted with fury, his skin its usual tone; his brows are knotted down hard, his bright eyes blazing, his mouth open mid-shout, the teeth bared, his face still round and boyish, a man in his forties. Gold window light falls on the near cheek, the far side of his face in deep indigo shadow. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブの丸い顔が怒りで歪み、怒鳴る。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, loses his temper with Holmes.", "his smile torn away, losing his temper completely, bellowing at the top of his voice, red-hot with fury, yells", script.john[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("29", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("28").image("key"),
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb in the green armchair, bringing his fist down on the armrest.",
          text: "A medium frame at seated eye level. <Subject 1> sits forward in the green velvet armchair at the centre of the frame, seen waist-up, his stocky body facing screen left; the chair stands exactly as in the empty frame, its tufted back at the right and its seat facing screen left. His black bowler hat is on his knee. The fist nearest the lens has just come down hard on the near green armrest in the lower foreground, the knuckles white, his shoulders hunched over it, his scowling face above it; his round face is red and scowling, the brows knotted, the mouth turned down, his bright eyes glaring toward screen left. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが手前の肘掛けに拳を打ちつけ、睨みつける。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, pounds the armrest as he vents.", "still furious, snarling and spitting the words out angrily, his voice hard and loud, then muttering the last words in a sour growl, says", script.john[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("30", ({ script, shot }) => {
        return (
          <Composition>
            <Panel src={shot("27").image("key")} blocking="ホームズが身じろぎもせず、画面右の相手を静かに見つめ返す。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, in his armchair, answers an angry visitor quietly.", "calmly, cooling the other man's heat, says", respell(script.holmes[0], "あなたへの当てつけではありませんよ。目的を果たしたい一心だったんでしょう——あなたがたお二人にとって、同じく大事な目的をね。"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("30b", ({ script }) => {
        const k = key("key", {
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb in the green armchair, his fist on the armrest slowly opening.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the green velvet armchair at the centre of the frame, seen waist-up, his stocky body facing screen left, his black bowler hat on his knee. The hand nearest the lens, on the near green armrest, is half open, the fingers uncurling from a fist; his shoulders have dropped a little, but his round face is still flushed dark red and severe, the brows still knotted, the mouth set hard, his bright eyes on screen left, listening. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="肘掛けの上のジョン・ガリデブの拳が、ゆっくりとほどける。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes reasons with his visitor from his armchair, off screen.", "patiently spelling it out, in an even voice, says off-screen", script.holmes[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("31", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("30b").image("key"),
          ground: plates.johnClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "A close frame on John Garrideb, his angry face loosening back into a smile.",
          text: "A close frame at the height of the armchair's wing tops. <Subject 1> sits against the green velvet wing, his round head and broad shoulders filling the right half of the frame, the fireplace soft at the left, his face turned toward screen left. A sheepish smile is on his lips, the cheeks round again, the brows level, a faint flush left on the cheeks; his bright eyes soft but watchful on the left edge of the frame. Gold window light falls on the near cheek. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブの顔から怒りが抜け、きまり悪そうな笑顔が戻る。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, calms down and explains why he came.", "his anger put away, awkwardly recovering his good humour, says", script.john[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("32", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("31").image("key"),
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb settling back deep in the green armchair, at ease again.",
          text: "A medium frame at seated eye level. <Subject 1> sits back deep in the green velvet armchair at the centre of the frame, seen waist-up, his stocky body facing screen left, his shoulders against the tufted back, his black bowler hat on his knee under one hand, the other forearm laid along the armrest. His round face wears an easy, affable smile, but his bright eyes are sharp and level on screen left. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが椅子に深く座り直し、くつろいだ笑みを浮かべる。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, settled back in his chair, sets his terms.", "with a show of ease, slipping in a quiet warning, says", respell(script.john[0], "うちわの話に、警察に首を突っ込まれたくないんでね。だが、人探しを手伝ってくれるだけなら、何の問題もない。"), 209)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("33", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["letter"],
          summary: "Holmes in his armchair gesturing back toward his friend at the desk.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the worn dark-red leather armchair, seen waist-up, his torso turned three-quarters toward screen right, <Subject 2> on his knee under the hand farther from the lens. The hand nearer the lens is raised and pointing back over his shoulder toward the upper left; his head is turned toward screen right, his face polite and encouraging, eyebrows slightly raised, a courteous smile on his thin lips. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが肩越しに画面左上の書き物机のほうを手で示す。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, in his armchair, invites his visitor to tell his story.", "courteously, drawing him out, says", script.holmes[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("34", ({ script }) => {
        const k = key("key", {
          ground: plates.johnClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "A close frame on John Garrideb, smiling only with his mouth, his cold eyes turned level toward the doctor across the room.",
          text: "A close frame at the height of the armchair's wing tops. <Subject 1> sits against the green velvet wing, his round head and broad shoulders filling the right half of the frame, the fireplace soft at the left, his face turned toward screen left. His mouth keeps a thin smile, but only the mouth: the rest of his round face is flat and still, the eyelids lowered halfway, and his eyes are cold and hard, the pupils turned into the left corners of his eyes, looking toward screen left, his gaze level and straight at his own eye height, at someone far across the room. Gold window light falls on the near cheek, the far side of his face in indigo shadow. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが口元だけで笑い、冷たい目を画面左のワトスンへ水平に向ける。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, glances coldly at the doctor across the room.", "asks coldly, smiling only with his mouth", script.john[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("35", ({ script }) => {
        const k = key("key", {
          ground: plates.watsonMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson"],
          summary: "Watson at his desk, unsettled by the stare, laying down his pen.",
          text: "A medium frame at the height of the desk top. <Subject 1> sits on the wooden chair at the writing desk, seen waist-up against the bright bay window, which rims his hair and shoulders with gold light. His torso is turned round in the chair toward screen right, away from the desk; both his hands are raised off the desk in front of his chest, empty and open, palms out, and the pen lies apart on the desk top behind them. His shoulders are drawn back and stiff, his head pulled back a little, his eyes on screen right, his brows lifted and his moustached mouth closed tight, taken aback and uneasy. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ワトスンがその視線にたじろぎ、机の上にペンを置く。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes answers his visitor from his armchair, off screen.", "lightly, with quiet finality, says off-screen", script.holmes[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("36", ({ script }) => {
        const k = key("key", {
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb in the green armchair, shrugging, his fingers laced on his knee.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the green velvet armchair at the centre of the frame, seen in full, seated, his stocky body facing screen left, his black bowler hat set on the floor beside the chair. His shoulders are lifted in an easy shrug, his fingers laced together on his knee; his round face wears an affable, practised smile, his head tilted, his bright eyes on screen left. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが肩をすくめ、膝の上で指を組んで語り出す。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, begins to tell his story.", "amiably, in a well-worn storyteller's tone, says", script.john[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("37", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("36").image("key"),
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb in the green armchair, both hands spread wide in the air, sketching out vast lands.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the green velvet armchair at the centre of the frame, seen in full, seated, his stocky body facing screen left, his black bowler hat set on the floor beside the chair. His laced fingers are just parting on his knee, both hands lifting a little off it, his chest drawing up; his round face is bright with a boastful grin, his eyes wide and shining toward screen left. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが両手を大きく広げ、土地の広さを宙に描く。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, boasts of the old man's fortune with big gestures.", "boastfully, with expansive gestures, says", respell(script.john[0], "不動産でざいをなし、シカゴの小麦そうばでも儲けた。そのかねで、アーカンソー川沿いに、こちらのしゅうひとつ分ほどの土地をかいしめたんです。"), 243)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("37b", ({ script }) => {
        const k = key("key", {
          ground: plates.watsonMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson"],
          summary: "Watson at his desk, turned round in his chair, eyebrows raised in frank admiration.",
          text: "A medium frame at the height of the desk top. <Subject 1> sits on the wooden chair at the writing desk, seen in full, seated, against the bright bay window, which rims his hair and shoulders with gold light. His torso is turned round in the chair toward screen right, one forearm resting along the chair back, his pen lying forgotten on the papers. His eyebrows are raised high, his eyes widened, his moustached lips pursed in a soundless whistle of frank admiration. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="書き物机のワトスンが振り返ったまま、感心したように眉を上げる。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb lists the old man's lands, off screen.", "counting them off on his fingers, dreamily, says off-screen", respell(script.john[0], "放牧地に、ざいもくりん、はたけに鉱山。持ち主にかねをもたらす、ありとあらゆる土地ですよ。"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("38", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          summary: "Holmes in his armchair, eyes half closed, fingertips pressed together, listening.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the worn dark-red leather armchair, seen in full, seated, his torso turned three-quarters toward screen right, leaning back against the tufted chair back. His elbows rest on the armrests and his long fingertips are pressed together in a steeple before his chest; his eyelids are lowered halfway, his face still and attentive, the thin lips closed. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが目を半ば閉じ、指先を合わせてじっと聞き入る。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb goes on with his story, off screen.", "lowering his voice a little, as if reminiscing, says off-screen", respell(script.john[0], "身寄りはなかった。少なくとも、私は聞いたことがない。だが、あの珍しいみょうじを妙に自慢にしていましてね。それがえんだったんです。"), 277)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("39", ({ script }) => {
        const k = key("key", {
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb in the green armchair, eyes crinkled in a fond laugh at the memory.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the green velvet armchair at the centre of the frame, seen in full, seated, his stocky body facing screen left, his black bowler hat set on the floor beside the chair. He leans back with one hand on his belly, laughing at a memory; his eyes are narrowed into merry crescents, his round cheeks bunched up, his mouth open in a chuckle. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが老人の喜びようを思い出し、目を細めて笑う。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, laughs as he recalls the old man.", "merrily, amused at the old man's delight, says", respell(script.john[0], "わたしはトピーカで弁護士をしていたんだが、ある日、あのじいさんが、たずねてきた。同じみょうじの男に会えたと、そりゃあもう大喜びでね。"), 277)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("40", ({ script }) => {
        const k = key("key", {
          ground: plates.watsonMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson"],
          summary: "Watson at his desk, chin in hand, absorbed in the story.",
          text: "A medium frame at the height of the desk top. <Subject 1> sits on the wooden chair at the writing desk, seen in full, seated, against the bright bay window, which rims his hair and shoulders with gold light. His torso is turned round in the chair toward screen right, his elbow planted on the desk and his chin resting in his hand; his eyes are on screen right, wide and absorbed, his moustached mouth slightly open, completely taken up by the story. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="書き物机のワトスンが頬杖をつき、話にすっかり聞き入る。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb imitates the old man, off screen.", "mimicking the old man, changing his voice for the last words, says off-screen", respell(script.john[0], "それがじいさんの道楽で、世界にほかにもガリデブがいるかどうか、何としても突き止めたがった。『もう一人見つけてくれ！』とね。"), 277)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("41", ({ script }) => {
        const k = key("key", {
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb leaning forward from the green armchair, one forefinger raised, confiding.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the green velvet armchair at the centre of the frame, seen in full, seated, his stocky body facing screen left, his black bowler hat set on the floor beside the chair. His torso is pitched forward toward screen left, his raised forefinger beside his face; his round face sly and confiding, his bright eyes narrowed and gleaming. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが人差し指を立て、声をひそめるように身を乗り出す。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, leans in and lowers his voice.", "drops his voice to a hush and says, meaningfully,", respell(script.john[0], "世界中ガリデブ探しをして回る暇はない、と言ったら、じいさんは『それでも、私の計画どおりに運べば、君はまさにそうすることになる』と。"), 243)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("41b", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          summary: "A close frame on Holmes, the corner of his lips lifting faintly.",
          text: "A close frame at seated eye height. <Subject 1>'s head and shoulders fill the left half of the frame, the top of the dark-red leather armchair's back low behind his shoulders at the size <Picture 1> holds, the bookshelf and the edge of the fireplace soft behind him at the right, his face turned toward screen right in three-quarter profile. His pale grey eyes rest on the right edge of the frame, calm and keen; one corner of his thin lips is lifted in the faintest, knowing curve, the rest of his face quite still. A thin rim of gold light runs along his profile. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズの唇の端が、かすかに持ち上がる。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb speaks portentously, off screen.", "slowly, making the most of it, says off-screen", script.john[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("42", ({ script }) => {
        const k = key("key", {
          ground: plates.johnClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "A close frame on John Garrideb, his eyes glittering with heat as he speaks of the will.",
          text: "A close frame at the height of the armchair's wing tops. <Subject 1> sits against the green velvet wing, his round head and broad shoulders filling the right half of the frame, the fireplace soft at the left, his face turned toward screen left. His round face is flushed with eagerness, his brows raised, his mouth mid-word; his bright eyes are wide and glittering with a hungry gleam, the pupils hard points of light fixed on the left edge of the frame. Gold window light falls on the near cheek. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブの瞳が、遺言の話に熱を帯びてぎらりと光る。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, speaks of the will with growing heat.", "dropping his voice, burning with eagerness, says", respell(script.john[0], "じいさんはそれから一年もたたずに死んで、ゆいごんを残した。カンザス州始まって以来の、とびきり奇妙なゆいごんです。"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("43", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("42").image("key"),
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb in the green armchair, holding up an open hand with five fingers spread.",
          text: "A medium frame at seated eye level. <Subject 1> sits forward in the green velvet armchair at the centre of the frame, seen in full, seated, his stocky body facing screen left, a big, heavy-set man whose broad shoulders fill the chair from wing to wing and whose head rises well above the top of the chair back, his bulk large in the frame, his black bowler hat set on the floor beside the chair. He holds his left hand up large before his chest, the palm toward screen left, all five fingers spread wide; his round face is earnest and emphatic, his bright eyes fixed on screen left, his mouth mid-word. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが五本の指を広げてみせ、金額を噛みしめる。" camera="fixed" />
            <Audio id="john1" src={line("john1", "john", "John Garrideb, seated, explains the terms of the will.", "spacing out each word, pressing the point home, says", script.john[0], 209)} start={0.3} />
            <Audio id="john2" src={line("john2", "john", "John Garrideb, seated, names the sum.", "relishing the figure, says", script.john[1])} start={9.6} />
          </Composition>
        );
      })
      .nextShot("44", ({ script }) => {
        const k = key("key", {
          ground: plates.watsonMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson"],
          summary: "Watson at his desk, eyes wide, catching his breath at the sum.",
          text: "A medium frame at the height of the desk top. <Subject 1> sits on the wooden chair at the writing desk, seen in full, seated, against the bright bay window, which rims his hair and shoulders with gold light. His torso is turned round in the chair toward screen right, his hand gripping the chair back. His eyes are open wide, his eyebrows shot up, his mouth fallen open under the moustache in a sharp intake of breath, his shoulders lifted. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ワトスンが目を見開き、息をのむ。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb sighs over the condition, off screen.", "regretfully, with a sigh, says off-screen", script.john[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("45", ({ script }) => {
        const k = key("key", {
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb in the green armchair, shaking his head with his shoulders slumped theatrically.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the green velvet armchair at the centre of the frame, seen in full, seated, his stocky body facing screen left, his black bowler hat set on the floor beside the chair. His shoulders are slumped in an exaggerated droop, both hands turned palm up on his knees, his head tilted and shaking; his round face wears a comic, hangdog grimace, the brows pulled up in the middle. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが首を振り、大げさに肩を落としてみせる。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, tells of his fruitless search.", "exaggerating his troubles, with big gestures, says", respell(script.john[0], "またとない話だから、弁護士の仕事はほったらかしてガリデブ探しに出た。合衆国には一人もいない。目の細かいくしですくように探したが、ガリデブは一人も引っかからなかった。"), 345)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("46", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          summary: "Holmes in his armchair, watching his visitor over his pressed fingertips.",
          text: "A medium frame, the camera at seated eye level and level. <Subject 1> sits deep in the worn dark-red leather armchair on the left half of the frame, seen in full; his torso leans back against the chair, turned three-quarters toward screen right. His head is turned well toward screen right in three-quarter profile, the far cheek turned away and his nose pointing at the right edge of the frame; his brows are level, his pale grey eyes half-lidded, cool and measuring, the irises in the right corners of the eyes, fixed on the visitor seated off the right edge of the frame. Both upper arms hang close to his sides, the elbows sharply bent, the forearms rising nearly vertical, the long fingertips of both hands pressed together in a steeple just below his chin. His legs are crossed, the upper thigh angled toward screen right, the knee bent. The white marble fireplace stands behind him at the right.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが、合わせた指先越しにジョン・ガリデブを見る。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb tells how he found the name, off screen.", "pleased with himself, says off-screen", respell(script.john[0], "そこでほんごくを当たってみた。案の定、ロンドンの電話帳に名前があった。ふつかまえに会いに行って、すべて説明しましたよ。"), 277)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("47", ({ script }) => {
        const k = key("key", {
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb leaning forward in the green armchair, shrugging as if at a loss.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the green velvet armchair at the centre of the frame, seen in full, seated, his stocky body facing screen left, his black bowler hat set on the floor beside the chair. He leans forward toward screen left, his shoulders hitched up in a helpless shrug, both palms turned out; his round face puts on a puzzled, put-upon look, the brows raised, the mouth turned down at the corners. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが身を乗り出し、困ったように肩をすくめる。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, explains the difficulty.", "putting on a troubled air, shrugging, says", respell(script.john[0], "ところが向こうもわたしと同じ独り者でね。女の親戚はいるが、男は一人もいない。ユイゴンには『成人男子三名』とある。"), 277)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("47b", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("47").image("key"),
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb in the green armchair, beaming broadly at Holmes.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the green velvet armchair at the centre of the frame, seen in full, seated, his stocky body facing screen left, his black bowler hat set on the floor beside the chair. He has settled back, his hands resting open on his knees; his round face is lit by a broad, beaming smile, the cheeks round, his bright eyes fixed warmly on screen left like a man closing a deal. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが満面の笑みでホームズを見つめる。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, makes his offer.", "genially, like a man closing a deal, says", script.john[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("48", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["letter"],
          summary: "Holmes in his armchair, smiling and turning his head toward his friend behind him.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the worn dark-red leather armchair, seen in full, seated, his torso turned three-quarters toward screen right, the foolscap letter on his knee under the hand farther from the lens. His head is turned back over his shoulder toward the upper left, toward his friend off screen; his face is amused, one eyebrow raised, a sly, conspiratorial smile on his thin lips. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが微笑んでワトスンのほうへ顔を向け、また客へ向き直る。" camera="fixed" />
            <Audio id="holmes1" src={line("holmes1", "holmes", "Holmes, in his armchair, turns to his friend with amusement.", "delighted, with a wink in his voice to his friend, says", respell(script.holmes[0], "どうだい、ワトスン、ふうがわりだと言っただろう？"))} start={0} />
            <Audio id="holmes2" src={line("holmes2", "holmes", "Holmes, in his armchair, offers his visitor a suggestion.", "lightly, as a casual piece of advice, says", respell(script.holmes[1], "しかし、それなら新聞のたずねびとらんに広告を出すのが、一番のちかみちだと思いますがね。"))} start={3.9} />
          </Composition>
        );
      })
      .nextShot("49", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("48").image("key"),
          ground: plates.johnClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "A close frame on John Garrideb, shaking his head at once, still smiling.",
          text: "A close frame at the height of the armchair's wing tops. <Subject 1> sits against the green velvet wing, his round head and broad shoulders filling the right half of the frame, the fireplace soft at the left, his face turned toward screen left. His head is turned a little aside mid-shake; the smile stays fixed on his lips, smooth and ready, his bright eyes steady on the left edge of the frame. Gold window light falls on the near cheek. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが笑顔のまま、即座に首を横に振る。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, answers at once.", "instantly, a little too smoothly, says", respell(script.john[0], "それはやりましたよ、ホームズさん。へんじはなしです。"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("50", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["letter"],
          summary: "Holmes in his armchair, folding the foolscap letter in his hands.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the worn dark-red leather armchair, seen in full, seated, his torso turned three-quarters toward screen right. <Subject 2> lies folded in half on his knee, a neat, closed oblong of cream paper, his long fingers pressing flat along its fold; his eyes are lowered to it, his face mild and faintly bored, a lazy half-smile on his lips. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズがフールスキャップの手紙をのんびりと折りたたむ。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, in his armchair, folds the letter, apparently losing interest.", "lazily, as if his interest were fading, says", script.holmes[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("51", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("50").image("key"),
          ground: plates.holmesClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          summary: "A close frame on Holmes, raising only his eyes to fix his visitor with a quiet stare.",
          text: "A close frame at seated eye height. <Subject 1>'s head and shoulders fill the left half of the frame, the top of the dark-red leather armchair's back low behind his shoulders at the size <Picture 1> holds, the bookshelf and the edge of the fireplace soft behind him at the right, his face turned toward screen right in three-quarter profile. His head is bowed slightly, as if over the letter, but his eyes alone are raised, the pale grey irises lifted under his brows and fixed hard on the right edge of the frame; a pleasant, conversational smile stays on his lips, but the eyes are cold. A thin rim of gold light runs along his profile. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが目だけを上げ、ジョン・ガリデブを静かに見据える。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, in his armchair, makes a remark as if in passing.", "like a chance bit of small talk, says lightly, a cool, flat edge under the friendliness,", respell(script.holmes[0], "ところで、トピーカのご出身とは奇遇ですな。昔、文通相手がいたんです——もう亡くなりましたが——せんはっぴゃくきゅうじゅうねんに市長をしていた、ライサンダー・スターはかせという老人でね。"), 328)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("52", ({ script }) => {
        const k = key("key", {
          ground: plates.johnClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "A close frame on John Garrideb, his face lighting up at the name.",
          text: "A close frame at the height of the armchair's wing tops. <Subject 1> sits against the green velvet wing, his round head and broad shoulders filling the right half of the frame, the fireplace soft at the left, his face turned toward screen left. His round face has lit up all at once with joy: he is laughing aloud, the brows lifted high, the cheeks pushed up, the eyes creased and shining, the mouth wide open in a huge, delighted grin, his head thrown slightly back, as if greeting a dear old friend. Gold window light falls on the near cheek. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブがぱっと顔を輝かせる。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb, seated, hears a familiar name.", "bursting with delight, almost laughing, his voice lifting with joy, says", respell(script.john[0], "なつかしい、スター・ハカセ！あのひとの名は、今でも尊敬されていますよ。"), 124)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("53", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("52").image("key"),
          ground: plates.johnMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["john"],
          summary: "John Garrideb rising from the green armchair, his bowler hat in his hand.",
          text: "A medium frame at seated eye level. <Subject 1> is rising from the green velvet armchair at the centre of the frame, seen in full from the top of his head to his feet, his body facing screen left, half up, one hand pushing on the armrest, the other holding his black bowler hat by its brim; his round face wears a cheerful, satisfied smile, his eyes on screen left. The fireplace stands at the left and the panelled door at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ジョン・ガリデブが帽子を手に、上機嫌で客用の椅子から立ち上がる。" camera="fixed" />
            <Audio id="john" src={line("john", "john", "John Garrideb rises to take his leave.", "in high good humour, wrapping things up, says", respell(script.john[0], "さて、ホームズさん、我々にできるのは、進み具合をご報告することくらいですな。いちにち、ふつかのうちには、お知らせできるでしょう。"), 226)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("54", ({ shot }) => {
        const k = key("key", {
          prev: shot("53").image("key"),
          ground: plates.roomWide,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson", "holmes", "john"],
          summary: "The wide sitting room, John Garrideb at the closed door, bowing to Holmes and Watson.",
          text: "A wide frame at eye level across the sitting room. At the far left <Subject 1> sits on his chair beside the writing desk, the chair swung round so that he faces screen right, his back to the desk and the window; his face and the front of his brown suit are seen in three-quarter view toward screen right, his eyes on <Subject 3>. <Subject 2> sits in the worn dark-red leather armchair, facing screen right toward <Subject 3>. At the far right <Subject 3> stands before the closed panelled door, his back to it, facing screen left toward Holmes and Watson, bowing to them from the waist with his black bowler hat held to his chest. All figures are small in the frame; the green velvet armchair stands empty by the fireplace. Shafts of gold sunlight cross the floor. The camera holds a static wide shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="閉じた扉の前でジョン・ガリデブがホームズとワトスンへ一礼し、扉を開けて出ていく。" camera="fixed" />
          </Composition>
        );
      })
      .nextShot("55", ({ shot }) => {
        const k = key("key", {
          prev: shot("54").image("key"),
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["pipe"],
          summary: "Holmes in his armchair, puffing at his pipe, a curious smile on his face.",
          text: "A medium frame at seated eye level. <Subject 1> sits in the worn dark-red leather armchair, seen in full, seated, his torso turned three-quarters toward screen right, leaning back. The hand nearer the lens holds <Subject 2> to his lips, the bowl cupped in his fingers; a thin curl of blue-grey smoke rises from the bowl through the gold light. His eyes are half lowered and his face wears a curious, private little smile around the pipe stem. The fireplace stands behind him at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズがパイプをくゆらせ、奇妙な笑みを浮かべたまま黙り込む。" camera="fixed" />
          </Composition>
        );
      })
      .nextShot("56", ({ script }) => {
        const k = key("key", {
          ground: plates.watsonMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson"],
          summary: "Watson leaning forward from his desk, impatient.",
          text: "A medium frame at the height of the desk top. <Subject 1> sits on the wooden chair at the writing desk, seen in full, seated, against the bright bay window, which rims his hair and shoulders with gold light. His torso is turned round in the chair toward screen right and he leans forward over his knees, both hands gripping the chair back; his eyes are bright and eager on screen right, his brows lifted, his moustached mouth open mid-question. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ワトスンが書き物机から身を乗り出し、待ちきれずに促す。" camera="fixed" />
            <Audio id="watson" src={line("watson", "watson", "Watson, at his desk, presses his friend.", "impatiently, urging him on, says", script.watson[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("57", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("56").image("key"),
          ground: plates.holmesClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["pipe"],
          summary: "A close frame on Holmes narrowing his eyes behind a veil of pipe smoke.",
          text: "A close frame at seated eye height. <Subject 1>'s head and shoulders fill the left half of the frame, the top of the dark-red leather armchair's back low behind his shoulders at the size <Picture 1> holds, the bookshelf and the edge of the fireplace soft behind him at the right, his face turned toward screen right in three-quarter profile. The stem of <Subject 2> is in the corner of his mouth, a thin veil of blue-grey smoke drifting up across his face, his pale skin evenly lit as in the other close frames of him; behind the smoke his pale grey eyes are narrowed to slits, a faint, amused smile at the corners of his mouth. A thin rim of gold light runs along his profile. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが煙の向こうで目を細める。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, in his armchair, puffs at his pipe.", "absently, enjoying himself, says", script.holmes[0])} start={0.3} />
            <Audio id="watson" src={line("watson", "watson", "Watson presses from his desk, off screen.", "impatiently, says off-screen", script.watson[0])} start={3.4} />
          </Composition>
        );
      })
      .nextShot("58", () => {
        const k = key("key", {
          ground: reference.sittingRoom,
          groundLine: MASTER,
          groundRetain: MASTER_RETAIN,
          cast: ["holmes"],
          props: ["pipe"],
          summary: "A tight insert on Holmes's hand drawing the pipe from his lips.",
          text: "A tight insert at seated head height, his lower face turned toward screen right in three-quarter profile, the tufted dark-red leather wing behind him at the left. <Subject 1>'s long, pale fingers hold <Subject 2> by its bowl, its stem lowered a fist's width below his chin, clear of his mouth; his thin lips are closed in a level line; only his lower face, chin and hand are in the frame. A last wisp of blue-grey smoke trails from the bowl through a shaft of gold light. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズの手が、パイプを口からゆっくりと離す。" camera="fixed" />
          </Composition>
        );
      })
      .nextShot("59", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("58").image("key"),
          ground: plates.holmesClose,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          summary: "A close frame on Holmes, the smile gone, his grey eyes glinting coldly.",
          text: "A close frame at seated eye height. <Subject 1>'s head and shoulders fill the left half of the frame, the top of the dark-red leather armchair's back low behind his shoulders at the size <Picture 1> holds, the bookshelf and the edge of the fireplace soft behind him at the right, his face turned toward screen right in three-quarter profile. His thin lips are pressed into one straight, hard line, the corners of the mouth level, his jaw set, and his pale grey eyes are open and fixed hard on the right edge of the frame with a cold, steely glint. Cold shadow lies across the near half of his face. A thin rim of gold light runs along his profile. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="笑みの消えたホームズの灰色の目が、冷たく光る。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, in his armchair, speaks coldly to his friend.", "quietly, coldly, word by word, says", respell(script.holmes[0], "考えていたのはね、ワトスン、あの男がいったい何のつもりで、あんなうそはっぴゃくを並べたのかということさ。"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("60", ({ script }) => {
        const k = key("key", {
          ground: plates.watsonMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson"],
          summary: "Watson half rising from his chair at the desk in astonishment.",
          text: "A medium frame at the height of the desk top. <Subject 1> stands half up from the wooden chair at the writing desk, seen in full against the bright bay window, which rims his hair and shoulders with gold light. He is half risen from the chair, turned toward screen right, one hand pressing on the desk top and the other gripping the chair back, his knees bent; his eyes are wide with astonishment, his brows shot up, his mouth open under the moustache. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ワトスンが書き物机から思わず腰を浮かせる。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes explains himself to his friend, off screen.", "flatly, weighing his own judgement, says off-screen", respell(script.holmes[0], "よほどめんと向かって問いただそうかと思ったよ。正面から殴りかかるのが一番という時もあるからね。だが、こちらが騙されたと思わせておくほうがいいと判断した。"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("61", ({ script, shot }) => (
        <Composition>
          <Panel src={shot("23").image("key")} blocking="回想：肘掛けに置かれたジョン・ガリデブの上着の肘が、擦り切れてほつれている。" camera="fixed" />
          <Audio id="holmes" src={line("holmes", "holmes", "Holmes lays out the evidence to his friend, off screen.", "coolly, setting out the proofs one by one, says off-screen", respell(script.holmes[0], "肘のすりきれたえいこくせいのうわぎに、一年も着古して膝の出たズボン。それでいて、あの書類でも本人の話でも、ロンドンに着いたばかりの田舎のアメリカ人だという。"), 328)} start={0.3} />
        </Composition>
      ))
      .nextShot("62", ({ script }) => {
        const k = key("key", {
          ground: plates.holmesMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["holmes"],
          props: ["pipe"],
          summary: "Holmes in his armchair, about to rise and walk toward the bay window.",
          text: "A medium frame at seated eye level on the worn dark-red leather armchair. <Subject 1> sits in it, seen waist-up with his whole head and a space above it inside the frame, his torso turned toward screen left, both hands on the armrests, the pipe held in the hand farther from the lens, leaning forward as he begins to push himself up, his gaze set toward screen left. The fireplace stands at the right. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ホームズが肘掛け椅子から立ち上がり、画面左の出窓のほうへ歩いていく。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes gets up and walks to the window as he talks.", "firmly, with a hint of pride, says", respell(script.holmes[0], "たずねびとらんに広告など出ていない。あそこは私が何ひとつ見逃さない場所だ。あれほどの大物を見落とすはずがない。"))} start={0.3} />
          </Composition>
        );
      })
      .nextShot("63", ({ script, shot }) => (
        <Composition>
          <Panel src={shot("52").image("key")} blocking="回想：満面の笑みのジョン・ガリデブが、懐かしそうに顔を輝かせる。" camera="fixed" />
          <Audio id="holmes" src={line("holmes", "holmes", "Holmes passes judgement to his friend, off screen.", "low, condemning, says off-screen", respell(script.holmes[0], "トピーカのライサンダー・スター・ハカセなんて人物も、私は知らない。どこを突いても、あの男は偽物だった。"))} start={0.3} />
        </Composition>
      ))
      .nextShot("64", ({ script }) => {
        const k = key("key", {
          ground: plates.watsonMedium,
          groundLine: PLATE,
          groundRetain: PLATE_RETAIN,
          cast: ["watson", "holmes"],
          summary: "Holmes standing dark against the blazing bay window, looking down into the street, Watson at the desk.",
          text: "A medium frame at the height of the desk top. <Subject 2> stands in the bay window at the right of the desk, his tall figure in black silhouette against the blazing lace curtains, one hand parting the curtain, looking down into the street below, his profile edged in gold. <Subject 1> sits in the chair at the desk at the centre of the frame, turned toward him, looking up at him. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="出窓の逆光の中に立つホームズが通りを見下ろし、机のワトスンがそれを見上げる。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, standing at the window, thinks aloud.", "thinking aloud, growing sharper as he goes, says", respell(script.holmes[0], "アメリカ人なのは本当だろう。だが長年ロンドンにいて、なまりがすり減っている。では、狙いは何だ？このばかげたガリデブ探しの裏に、どんな動機がある？"), 345)} start={0.3} />
          </Composition>
        );
      })
      .nextShot("65", ({ script }) => {
        const k = key("key", {
          ground: plates.streetMedium,
          groundLine: PLATE,
          groundRetain: STREET_PLATE_RETAIN,
          cast: ["john"],
          summary: "Baker Street pavement as John Garrideb walks away from the door of 221B toward the gas lamp, still smiling.",
          text: "A medium frame at eye level from the roadway. <Subject 1> walks along the stone pavement toward screen right, halfway between the black door of 221B at the left and the iron gas lamp at the right, his black bowler hat on his head, his stride brisk and jaunty, his round face in profile with a broad, easy smile. Low morning sunlight rakes across the facades, laying long indigo shadows across the pavement. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="221Bの玄関から出てきたジョン・ガリデブが、笑顔のまま歩道をガス灯のほうへ歩いていく。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes, at the window above, murmurs to his friend.", "quietly, with open interest, says", script.holmes[0])} start={0.3} />
          </Composition>
        );
      })
      .nextShot("66", ({ script, shot }) => {
        const k = key("key", {
          prev: shot("65").image("key"),
          ground: reference.street,
          groundLine: STREET_MASTER,
          groundRetain: STREET_MASTER_RETAIN,
          cast: ["john"],
          summary: "A close frame on John Garrideb's face in the shadow of the gas lamp, the smile gone.",
          text: "A close frame at standing head height on the pavement beside the gas lamp. The post of the black iron gas street lamp rises through the right third of the frame; behind it, soft, the soot-darkened brick wall and the tops of the black iron railings. <Subject 1>'s round face and shoulders fill the left two thirds, his black bowler hat on his head, his face turned toward screen right. A hard diagonal edge of low sunlight crosses the frame: his face has stepped into the lamp post's indigo shadow, only a thin rim of light on his cheek. His mouth is a flat, hard line, his round face cold and blank, his bright eyes narrowed and dead still. The camera holds a static shot.",
        });
        return (
          <Composition>
            <Panel src={k} blocking="ガス灯の影に入ったジョン・ガリデブの顔から、笑みが消えている。" camera="fixed" />
            <Audio id="holmes" src={line("holmes", "holmes", "Holmes delivers his verdict to his friend, off screen.", "low, with conviction, slowly, says off-screen", script.holmes[0])} start={0.3} />
          </Composition>
        );
      }),
  }),
});
