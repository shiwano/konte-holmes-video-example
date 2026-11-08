import { asset, defineReference } from "konte";
import { audioMinimaxH3R2a } from "konte/workspace/adapters/comfy/audio_minimax_h3_r2a.js";
import { imageKrea2TurboT2i } from "konte/workspace/adapters/comfy/image_krea2_turbo_t2i.js";
import { imageMinimaxH3R2i } from "konte/workspace/adapters/comfy/image_minimax_h3_r2i.js";
import direction from "./direction";

const STYLE =
  "1980s Japanese theatrical anime cel animation in a gothic, aesthetic register: fine, sharp ink linework with long tapering strokes, hard-edged two-tone cel shading, deep indigo and blue-black shadow tones, a restrained palette with deep crimson and lamp-gold accents.";

const SHEET_STYLE =
  "Stylish 1980s Japanese gothic OVA anime character design with the elegance of a fashion illustration: razor-thin, wiry black ink lines in which every contour breaks into straight segments and sharp corners, elongated figures about nine heads tall with small heads, long necks and long tapering hands, pointed chins and sharp jawlines, long narrow almond eyes under a single sharp upper lash line, hair drawn as long fine separate strands, hard angular cel shadows cut like paper in deep indigo and blue-black, a restrained palette with deep crimson and lamp-gold accents.";

const SHEET_GROUND =
  "Plain flat pale blue-grey background, even soft frontal light, the figure filling the frame from head to feet.";

const PROP_GROUND = "Plain flat pale blue-grey background, even soft light, the object filling the frame.";

const VOICE_STYLE = "Live-action, a quiet study, recorded close.";

export default defineReference(direction, {
  references: () => {
    const look = asset("look", imageKrea2TurboT2i, {
      prompt:
        "1980s Japanese theatrical anime cel animation in a gothic, aesthetic register: fine, sharp ink linework with long tapering strokes, hard-edged two-tone cel shading, hand-painted background art with dense architectural detail. A tall, slender gentleman with an elongated, elegant figure and long limbs stands half-turned on the landing of a narrow Georgian London staircase, one gloved hand resting on the dark mahogany banister, a long charcoal frock coat falling to his calves, his sharp-featured pale face half in shadow. Behind him a tall arched window with lace curtains blazes with low morning sunlight, laying long diagonal shafts across the worn stair carpet and the patterned wallpaper. Palette of deep indigo, blue-black and ink black in the shadows, warm lamp-gold in the shafts of light, a single accent of deep crimson in the carpet runner. Strong chiaroscuro, a thin rim of light tracing the figure's shoulders and hair, dust motes glittering in the beams. Wide frame from a low eye level, the figure small against the tall stairwell.",
    });

    const holmes = asset("holmes", imageKrea2TurboT2i, {
      width: 1024,
      height: 1536,
      prompt: `${SHEET_STYLE} Character reference of a tall, gaunt Victorian detective in his late forties with an elongated, elegant figure about eight heads tall and long, thin limbs: a narrow, sharply angular face with high cheekbones, hollow cheeks, a thin aquiline nose, thin firm lips, a pointed chin and long, narrow, austere pale grey eyes under straight dark brows; short black hair slicked straight back close to the skull from a high forehead, cut short at the nape. He wears a deep indigo silk dressing gown with a dark crimson sash, open over a white high-collared shirt, a black waistcoat and charcoal trousers, with black leather slippers. He stands upright in a three-quarter view turned toward screen left, arms relaxed at his sides, a calm, cold, composed face. ${SHEET_GROUND}`,
    });

    const watson = asset("watson", imageKrea2TurboT2i, {
      width: 1024,
      height: 1536,
      prompt: `${SHEET_STYLE} Character reference of a trim, upright Victorian doctor around fifty with a lean, slim build, straight military bearing and long legs: a firm, angular face with a straight nose, a defined jaw, warm brown eyes under level brows, a neatly trimmed brown moustache, short side-parted brown hair greying at the temples. He wears a close-fitting brown tweed three-piece suit with a gold watch chain across a flat waistcoat, a white wing collar and a dark green tie, and brown leather shoes. He stands upright in a three-quarter view turned toward screen right, arms relaxed at his sides, a kind, attentive face. ${SHEET_GROUND}`,
    });

    const john = asset("john", imageKrea2TurboT2i, {
      width: 1024,
      height: 1536,
      prompt: `${SHEET_STYLE} Character reference of a short, stocky, powerfully built American man who looks about forty, a single figure standing alone, compact at about six heads tall, drawn in the same wiry, angular line: a round, fresh, clean-shaven, chubby and almost childlike face outlined in crisp straight segments set in a broad fixed smile, with strikingly bright, alert, piercing narrow eyes; short light-brown hair neatly combed. He wears a grey English-cut lounge suit whose coat is worn shiny and frayed at the elbows, trousers bagged at the knees, a white collar, a dark blue tie and black boots, and holds a black bowler hat in the hand at screen right. He stands upright in a three-quarter view turned toward screen left, feet planted wide. ${SHEET_GROUND}`,
    });

    const hudson = asset("hudson", imageKrea2TurboT2i, {
      width: 1024,
      height: 1536,
      prompt: `${SHEET_STYLE} Character reference of an elderly Victorian landlady in her sixties, tall and thin with an upright, dignified posture: a long, lined, angular face with a narrow nose and thin lips, grey hair gathered in a bun under a white lace cap. She wears a high-necked black dress with long sleeves and a small white lace collar, and black buttoned shoes. She stands upright in a three-quarter view turned toward screen right, hands folded at her waist. ${SHEET_GROUND}`,
    });

    const letter = asset("letter", imageKrea2TurboT2i, {
      prompt: `${STYLE} Prop reference: several long sheets of cream foolscap paper fanned slightly, covered in dense slanting copperplate handwriting in brown ink, the top sheet ending in the signature "Nathan Garrideb", seen from straight above. ${PROP_GROUND}`,
    });

    const directory = asset("directory", imageKrea2TurboT2i, {
      prompt: `${STYLE} Prop reference: a thick 1900s London telephone directory lying open, its dark red cloth cover with worn gilt edges, both pages packed with narrow columns of tiny printed names and addresses, seen from above at a slight angle. ${PROP_GROUND}`,
    });

    const card = asset("card", imageKrea2TurboT2i, {
      prompt: `${STYLE} Prop reference: a small round polished silver salver tray with a white engraved calling card resting on it, the card printed in black serif type reading "JOHN GARRIDEB" on the first line, "Counsellor at Law" below it, and "Moorville, Kansas, U.S.A." on the last line, seen from straight above. ${PROP_GROUND}`,
    });

    const pipe = asset("pipe", imageKrea2TurboT2i, {
      prompt: `${STYLE} Prop reference: a curved briar tobacco pipe with a dark, polished reddish-brown bowl and a black vulcanite stem, lying on its side, seen from the side. ${PROP_GROUND}`,
    });

    const sittingRoom = asset("sittingRoom", imageKrea2TurboT2i, {
      prompt: `${STYLE} Hand-painted background art with dense architectural detail. The first-floor sitting room of 221B Baker Street on a late June morning in 1902, a still, unoccupied room seen at eye level from the wall opposite the fireplace, wide. From screen left to screen right: a tall Victorian bay window with lace curtains blazing with low morning sunlight; in front of it a cluttered writing desk heaped with papers and books; a worn dark-red leather armchair angled toward screen right; at the centre a Victorian fireplace whose mantelpiece is cluttered with pipes, letters pinned by a jack-knife and chemical bottles; a green velvet armchair to the right of the fireplace angled toward screen left, facing the red armchair across the crimson Turkish hearth rug; at the far right a dark wooden panelled door. Dark patterned wallpaper, crowded bookshelves and chemistry apparatus along the walls. Long diagonal shafts of gold sunlight cross the room from the bay window, the corners sunk in deep indigo shadow, the crimson Turkish hearth rug glowing between the chairs.`,
    });

    const street = asset("street", imageKrea2TurboT2i, {
      prompt: `${STYLE} Hand-painted background art with dense architectural detail. Baker Street, London, on a June morning in 1902, a quiet, deserted morning street seen from the roadway at eye level. At screen left the black Georgian front door of 221B with a semicircular fanlight above it and three worn stone steps; a terrace of soot-darkened brick houses with white sash windows runs into depth; at screen right a black iron gas street lamp stands at the kerb. Low, sharp morning sunlight rakes across the facades, laying long deep indigo shadows across the pavement and the cobbled road.`,
    });

    const holmesVoice = asset("holmesVoice", audioMinimaxH3R2a, {
      prompt: {
        integratedMultimodalDescription: {
          style: VOICE_STYLE,
          shots: [
            "A medium shot of a man in his late forties seated in an armchair, reading a letter. He (S1), a man in his late forties with a low, clear, crisp voice and an even, unhurried pace, looks up and says, <d>[Japanese] 今朝は少し冷えるね。窓を閉めておいてくれないか。</d>",
          ],
        },
        overallSoundscape: "Low room tone, the faint rustle of paper.",
        nonDiegeticMusic: "N/A",
      },
    });

    const watsonVoice = asset("watsonVoice", audioMinimaxH3R2a, {
      prompt: {
        integratedMultimodalDescription: {
          style: VOICE_STYLE,
          shots: [
            "A medium shot of a man around fifty seated at a writing desk, a pen in hand. He (S1), a man around fifty with a warm, honest mid-low voice and a slightly quick pace, looks up and says, <d>[Japanese] 昼までには、この手紙を書き終えてしまうつもりだよ。</d>",
          ],
        },
        overallSoundscape: "Low room tone, the faint scratch of a pen.",
        nonDiegeticMusic: "N/A",
      },
    });

    const johnVoice = asset("johnVoice", audioMinimaxH3R2a, {
      prompt: {
        integratedMultimodalDescription: {
          style: VOICE_STYLE,
          shots: [
            "A medium shot of a stocky man in his forties seated in an armchair, hat on his knee. He (S1), an American man in his forties with a bright, resonant voice and a brisk pace, says, <d>[Japanese] 汽車が少し遅れましてね。駅からは歩いて来たんですよ。</d>",
          ],
        },
        overallSoundscape: "Low room tone, the creak of an armchair.",
        nonDiegeticMusic: "N/A",
      },
    });

    return {
      look,
      holmes,
      watson,
      john,
      hudson,
      letter,
      directory,
      card,
      pipe,
      sittingRoom,
      street,
      holmesVoice,
      watsonVoice,
      johnVoice,
    };
  },
  views: ({ reference }) => {
    const sittingRoomTop = asset("sittingRoomTop", imageMinimaxH3R2i, {
      image1: reference.sittingRoom,
      prompt: {
        subjectDefinitions: [
          "<Subject 1> is the sitting room in <Picture 1>: its bay window, writing desk, dark-red leather armchair, fireplace, green velvet armchair and panelled door, its rug and morning light.",
        ],
        summary: {
          tasks: ["reference generation"],
          text: "The empty sitting room seen from straight above the crimson Turkish hearth rug.",
        },
        retentionAnalysis: [
          "<Subject 1> (appears in [Shot 1]): attribute_transfer - the room's furniture, materials, palette and morning light carry over; the camera position is new.",
        ],
        detailedDescription: {
          style: "2D-animated, 1980s theatrical anime cel style with gothic, hard-edged shading.",
          shots: [
            "The camera looks straight down from the ceiling over the centre of the room; the wall opposite the fireplace lies along the bottom edge of the frame, the fireplace wall along the top. The crimson Turkish hearth rug fills the centre half of the frame. The fireplace's hearth and mantel shelf run along the top edge. The dark-red leather armchair, its seat cushion and both arms seen from above, sits in the left third beside the hearth; the green velvet armchair sits in the right third facing it. The writing desk top, heaped with papers and books, fills the lower left corner, and the bay window's sill and lace edge run along the far left edge. Shafts of gold sunlight fall across the rug from the left; the edges lie in indigo shadow. The furniture stands unoccupied, the room still.",
          ],
        },
      },
    });

    return { sittingRoom: { top: sittingRoomTop } };
  },
});
