import { defineDirection } from "konte";

export default defineDirection({
  brief: {
    logline:
      "遺産を継ぐにはあと一人「ガリデブ」が要る——人懐っこい笑顔のアメリカ人の依頼を穏やかに聞き終えたホームズは、男が去ったあと、ワトスンに「あれは嘘ばかりだ」と告げる。",
    hook: "暗がりの光の筋に浮かぶ「ガリデブ」の署名の手紙に、「一人は正気を失い、私は血を流し……」というワトスンの声が重なる。",
    audience:
      "画面の前で音を出してじっくり観る人。観終えて「あの笑顔、絶対何か隠してる……」とつぶやく。",
    tone: "静かで間の長い会話劇。笑顔と礼儀の下で探り合いの緊張が溜まり、最後の長台詞でそれまでの余談がすべて罠だったと反転する。",
    look: "アニメ。耽美なゴシック調の劇場アニメのセル画——細く長い手足と鋭く整った顔、強い明暗、窓の逆光と深い影。藍と黒を基調に、ランプの金と深紅の差し色。緻密な描線と絵画的な美術背景。ジョン・ガリデブだけは丸い童顔の笑顔で、耽美な画面から浮く。会話は長めのカットと間で溜め、仮面がずれる瞬間だけクローズで刻む。",
    outOfScope: [
      "ジブリ風——柔らかい丸顔、温かな牧歌的な色",
      "明るくテンポのいい少年探偵ものの掛け合い",
      "ホームズがネイサンに電話する場面以降の展開",
    ],
    tolerances: [],
    source: {
      span: "c6.1-c6.2",
      keep: [
        "c6.p1〜c6.p46の全場面を原作の順とテンポで、台詞は自然な口語訳",
        "ワトスンの語りは冒頭・電話帳・名刺・ジョンの入室の要所のみ",
        "ホームズの長台詞「嘘ばかりだ」を「複雑で手の込んだ悪党だ」まで",
      ],
      drop: [
        "c6.p1 冒頭の語りを、事件の結末を予告する言い回しに言い換え（「血を流し」→「銃弾を受け」、「法の裁き」→「監獄へ送られた」）",
        "c6.p2 ナイト爵位を辞退した余談",
        "c6.p15 ワトスンによるジョンの容姿描写（絵で見せる）",
        "c6.p46 尋ね人欄を「猟の隠れ場」にたとえる比喩（「大物」に縮める）",
        "c6.p46末尾「電話してくれ、ワトスン」以降（c6.p47〜）",
        "追加：ホームズの台詞に重ねて、通りを去るジョンの笑顔が消える場面（原作になし）",
      ],
    },
  },
  policy: {
    format: {
      fps: 24,
      size: {
        megapixels: 0.9,
        delivery: { width: 1280, height: 720 },
      },
    },
    lang: "ja",
    fonts: ["Noto Serif JP"],
  },
  narrator: {
    id: "watsonVoice",
    description:
      "男性、五十歳前後。ワトスン本人の声で、遠い出来事を振り返るように静かに、落ち着いて語る。",
  },
  characters: {
    holmes: {
      name: "ホームズ",
      promptDepiction: "tall gaunt Victorian detective with slicked-back black hair",
      description:
        "四十代後半。長身痩躯、鋭く整った細面、厳しい灰色の目。黒髪を後ろへ撫でつけ、深い藍のガウンの下に白いシャツ。",
      voice: {
        id: "holmesVoice",
        description: "男性、四十代後半。低く澄んだ声、歯切れよく明晰で、皮肉を含んだ余裕がある。",
      },
    },
    watson: {
      name: "ワトスン",
      promptDepiction: "moustached Victorian doctor in a tweed suit",
      description:
        "五十歳前後。がっしりした体格、整えた口髭、茶のツイードの三つ揃い。実直で温かい顔立ち。",
      voice: {
        id: "watsonVoice",
        description: "男性、五十歳前後。温かく実直な中低音、素直で少し早口。",
      },
    },
    john: {
      name: "ジョン・ガリデブ",
      promptDepiction: "short stocky clean-shaven man with a round boyish face",
      description:
        "四十前後に見える。背は低いが逞しい。つるりとした丸い童顔に張り付いたような満面の笑み、目だけが異様に鋭く明るく、よく動く。英国仕立ての灰色の上着は肘が擦り切れ、ズボンは膝が出ている。",
      voice: {
        id: "johnVoice",
        description:
          "男性、四十代。張りのある明るい声、愛想のいい早口のアメリカ人。苛立つと低く荒くなる。",
      },
    },
    hudson: {
      name: "ハドスン夫人",
      promptDepiction: "elderly Victorian landlady in a dark dress and white lace cap",
      description: "六十代。黒いドレスに白いレースの帽子、背筋の伸びた家主。",
    },
  },
  props: {
    letter: {
      name: "フールスキャップの手紙",
      promptDepiction: "long handwritten foolscap letter",
      description: "細長いフールスキャップ判の便箋数枚。末尾に「Nathan Garrideb」の署名。",
    },
    directory: {
      name: "電話帳",
      promptDepiction: "thick London telephone directory",
      description: "分厚いロンドンの電話帳。細かな活字で名前と住所が並ぶ。",
    },
    card: {
      name: "名刺",
      promptDepiction: "white calling card on a silver tray",
      description:
        "銀の盆にのった白い名刺。「John Garrideb, Counsellor at Law, Moorville, Kansas, U.S.A.」と刷られている。",
    },
    pipe: {
      name: "パイプ",
      promptDepiction: "curved briar tobacco pipe",
      description: "ホームズの曲がったブライアーのパイプ。",
    },
  },
  locations: {
    sittingRoom: {
      name: "ベイカー街の居間",
      description:
        "1902年6月末の朝、ベイカー街221Bの二階の居間。左に朝日の差す出窓、その前に書き物机、中央に暖炉とその両脇に向かい合う肘掛け椅子、右奥に扉。逆光と深い影、本と実験器具と書類が雑然と積まれている。",
      landmarks: {
        bayWindow: {
          name: "出窓",
          promptDepiction: "tall Victorian bay window with lace curtains",
          description: "画面左、朝の逆光を部屋に投げる背の高い出窓。",
        },
        writingDesk: {
          name: "書き物机",
          promptDepiction: "cluttered writing desk",
          description: "出窓の前、書類と本の積まれたワトスンの書き物机。",
        },
        holmesChair: {
          name: "ホームズの肘掛け椅子",
          promptDepiction: "worn dark-red leather armchair",
          description: "暖炉の左脇、右を向いて置かれたホームズの擦り切れた深紅の革の肘掛け椅子。",
        },
        fireplace: {
          name: "暖炉",
          promptDepiction: "Victorian fireplace with a cluttered mantelpiece",
          description: "画面中央、パイプや手紙の突き刺さった炉棚のある暖炉。",
        },
        visitorChair: {
          name: "客用の椅子",
          promptDepiction: "green velvet armchair",
          description: "暖炉の右脇、左を向いてホームズの椅子と向き合う緑のビロードの肘掛け椅子。",
        },
        door: {
          name: "扉",
          promptDepiction: "dark wooden panelled door",
          description: "画面右奥、階段へ通じる暗い木の扉。",
        },
      },
    },
    street: {
      name: "ベイカー街の通り",
      description:
        "同じ朝のベイカー街。煉瓦の家並みに鋭い朝日が斜めに差し、歩道に長く深い影が落ちる。",
      landmarks: {
        frontDoor: {
          name: "221Bの玄関",
          promptDepiction: "black Georgian front door with a fanlight",
          description: "画面左、扇窓のついた221Bの黒い玄関扉。",
        },
        gasLamp: {
          name: "ガス灯",
          promptDepiction: "black iron gas street lamp",
          description: "画面右、歩道の縁に立つ黒い鉄のガス灯。",
        },
      },
    },
  },
  setups: {
    roomWide: {
      name: "居間、全景",
      description: "扉と反対側の壁際から目の高さで、出窓から扉まで居間全体。",
      location: "sittingRoom",
      framing: "wide",
      view: "front",
      within: null,
      holds: ["bayWindow", "writingDesk", "holmesChair", "fireplace", "visitorChair", "door"],
    },
    watsonMedium: {
      name: "書き物机のワトスン",
      description: "書き物机のワトスンを腰から上、背後に出窓の逆光。",
      location: "sittingRoom",
      framing: "medium",
      within: "roomWide",
      holds: ["bayWindow", "writingDesk"],
    },
    holmesMedium: {
      name: "肘掛け椅子のホームズ",
      description:
        "ホームズの肘掛け椅子に座るホームズを腰から上、右を向いた横顔寄り、背後に暖炉の端。",
      location: "sittingRoom",
      framing: "medium",
      within: "roomWide",
      holds: ["holmesChair", "fireplace"],
    },
    holmesClose: {
      name: "ホームズの顔",
      description: "ホームズの顔と肩、右へ向けた鋭い横顔。",
      location: "sittingRoom",
      framing: "close",
      within: "holmesMedium",
      holds: ["holmesChair", "fireplace"],
    },
    johnMedium: {
      name: "客用の椅子のジョン・ガリデブ",
      description:
        "客用の椅子のジョン・ガリデブを腰から上、左を向いた横顔寄り、背後に暖炉の端と扉。",
      location: "sittingRoom",
      framing: "medium",
      within: "roomWide",
      holds: ["fireplace", "visitorChair", "door"],
    },
    johnClose: {
      name: "ジョン・ガリデブの顔",
      description: "ジョン・ガリデブの丸い顔と鋭い目、左へ向けた顔。",
      location: "sittingRoom",
      framing: "close",
      within: "johnMedium",
      holds: ["fireplace", "visitorChair"],
    },
    letterInsert: {
      name: "手紙の署名",
      description: "真上から、光の筋の落ちるフールスキャップの手紙の末尾。",
      location: "sittingRoom",
      framing: "insert",
      view: "top",
      holds: [],
    },
    directoryInsert: {
      name: "電話帳の頁",
      description: "真上から、書き物机に開いた電話帳の頁とワトスンの手。",
      location: "sittingRoom",
      framing: "insert",
      view: "top",
      holds: [],
    },
    cardInsert: {
      name: "盆の名刺",
      description: "真上から、銀の盆の名刺とそれをつまむワトスンの指。",
      location: "sittingRoom",
      framing: "insert",
      view: "top",
      holds: [],
    },
    elbowInsert: {
      name: "上着の肘",
      description: "正面から、肘掛けに置かれたジョン・ガリデブの上着の擦り切れた肘。",
      location: "sittingRoom",
      framing: "insert",
      view: "front",
      holds: [],
    },
    gripInsert: {
      name: "肘掛けを握る手",
      description: "正面から、客用の椅子の肘掛けの先を握るジョン・ガリデブの左手。",
      location: "sittingRoom",
      framing: "insert",
      view: "front",
      holds: ["visitorChair"],
    },
    doorInsert: {
      name: "居間の扉",
      description:
        "居間の全景と同じ位置から扉へ寄った画。暖炉の端、緑の肘掛け椅子の背と本棚、右に扉。",
      location: "sittingRoom",
      framing: "close",
      within: "roomWide",
      holds: ["visitorChair", "door"],
    },
    pipeInsert: {
      name: "ホームズの口元とパイプ",
      description: "正面から、ホームズの口元と手にしたパイプ、立ちのぼる煙。",
      location: "sittingRoom",
      framing: "insert",
      view: "front",
      holds: [],
    },
    streetMedium: {
      name: "221Bの前の歩道",
      description: "車道側から目の高さで、221Bの玄関からガス灯までの歩道。",
      location: "street",
      framing: "medium",
      view: "front",
      within: null,
      holds: ["frontDoor", "gasLamp"],
    },
    johnStreetClose: {
      name: "通りのジョン・ガリデブの顔",
      description: "ガス灯の脇、朝日と影の境にあるジョン・ガリデブの顔。",
      location: "street",
      framing: "close",
      within: "streetMedium",
      holds: ["gasLamp"],
    },
  },
  waivers: {
    "opening-key_32": "31から座ったままつながるので、絵コンテの座った姿から始めて座り直す。",
    "lineup-gap_13":
      "名刺の盆を真上から捉えたインサートで、映るのはワトスンとハドスン夫人の手だけ。ホームズは座ったまま画面の外にいる。",
    "prop-unnamed_25.letter":
      "ジョンの顔の寄りで、顎で示す先の手紙は画面の外にある。手紙を名指しすると画面に描き込まれてしまう。",
    "opening-key_35":
      "レビューで、出だしから客のほうを向いて聞いている姿にするよう指示された。キー画で最初のコマを固定し、そこから少したじろぐだけにする。",
  },
  sequence: {
    lens: "three-act",
    pleasure: "mysterious",
    sequences: [
      {
        id: "act1",
        role: "setup-act",
        synopsis:
          "ホームズがワトスンに「ガリデブ」探しを持ちかけ、電話帳で見つかったのは手紙の差出人本人。そこへ別のガリデブ、カンザスの弁護士ジョンが名刺とともに現れる。",
        lens: "kishotenketsu",
        pleasure: "mysterious",
        shots: [
          {
            id: "01",
            role: "ki",
            action:
              "暗がりに差す光の筋が、フールスキャップの手紙の末尾の署名へゆっくり這い上がる。",
            setup: "letterInsert",
            duration: 12,
            lineup: [],
            script: [
              {
                narration:
                  "これから話すのは、喜劇とも悲劇ともつかない事件だ。その結末で、一人の男は正気を失い、私は銃弾を受け、もう一人の男は監獄へ送られた。",
              },
            ],
            telop: ["三人ガリデブ", "The Adventure of the Three Garridebs"],
          },
          {
            id: "02",
            role: "ki",
            action:
              "書き物机のワトスンの向こうで、ホームズがフールスキャップの手紙を手に扉から入ってくる。",
            setup: "roomWide",
            duration: 13,
            lineup: ["watson"],
            lineupTo: ["watson", "holmes"],
            script: [
              {
                narration:
                  "それでも、どこか可笑しみのある事件だった。千九百二年、六月の終わり。何日も寝込んでいたホームズが、その朝、ようやく居間に姿を現した。",
              },
            ],
          },
          {
            id: "03",
            role: "ki",
            action:
              "ホームズの肘掛け椅子に腰を下ろしたホームズが、灰色の目を愉快そうに光らせてフールスキャップの手紙を掲げる。",
            setup: "holmesMedium",
            duration: 6,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "ワトスン、金儲けの機会だよ。ガリデブという名前を聞いたことはあるかね？",
                acting: "寝起きとは思えない上機嫌で、からかうように軽く。",
              },
            ],
          },
          {
            id: "04",
            role: "sho",
            action: "書き物机のワトスンが椅子の上で振り返り、首を横に振る。",
            setup: "watsonMedium",
            duration: 7,
            lineup: ["watson"],
            script: [
              {
                character: "watson",
                text: "いや、聞いたことがないな。",
                acting: "書き物から顔を上げ、きょとんとして。",
              },
              {
                character: "holmes",
                text: "ならば、ガリデブを一人探し当てれば、金になる。",
                acting: "謎かけを楽しむように、含み笑いで。",
              },
            ],
          },
          {
            id: "05",
            role: "sho",
            action: "ホームズが膝のフールスキャップの手紙を指先で軽く叩く。",
            setup: "holmesMedium",
            duration: 12,
            lineup: ["holmes"],
            script: [
              {
                character: "watson",
                text: "なぜだい？",
                acting: "身を乗り出し、素直に不思議がって。",
              },
              {
                character: "holmes",
                text: "長い話でね——それも、ずいぶん風変わりな話だ。人間の複雑さをずいぶん探ってきたが、これほど奇妙なものには出くわしたことがない。",
                acting: "ゆったりと、自分でも面白がるように。",
              },
            ],
          },
          {
            id: "06",
            role: "sho",
            action: "ホームズが目を細め、扉のほうへ視線を流す。",
            setup: "holmesMedium",
            join: "continuous",
            duration: 9,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "当の本人がまもなく尋問を受けに来るから、それまでは話さないでおこう。とにかく、その名前が要るんだ。",
                acting: "声を落とし、もったいをつけて。",
              },
            ],
          },
          {
            id: "07",
            role: "sho",
            action: "ワトスンの手が電話帳の頁を気乗りしない様子でめくっていく。",
            setup: "directoryInsert",
            duration: 7,
            lineup: ["watson"],
            script: [
              {
                narration: "私はそばにあった電話帳を手に取り、望み薄の気持ちでページをめくった。",
              },
            ],
          },
          {
            id: "08",
            role: "sho",
            action: "ワトスンの指が電話帳の右頁の一行の上でぴたりと止まる。",
            setup: "directoryInsert",
            join: "continuous",
            duration: 6,
            lineup: ["watson"],
            script: [
              { narration: "ところが驚いたことに、その奇妙な名前が、ちゃんと載っていたのだ。" },
            ],
          },
          {
            id: "09",
            role: "sho",
            action: "ワトスンが電話帳を掲げて椅子から立ち上がる。",
            setup: "watsonMedium",
            duration: 3,
            lineup: ["watson"],
            script: [
              {
                character: "watson",
                text: "あったぞ、ホームズ！ここだ！",
                acting: "勝ち誇って、声を弾ませる。",
              },
            ],
          },
          {
            id: "10",
            role: "sho",
            action: "ワトスンがホームズの肘掛け椅子へ歩み寄り、電話帳をホームズに手渡す。",
            setup: "roomWide",
            duration: 4,
            lineup: ["watson", "holmes"],
          },
          {
            id: "11",
            role: "sho",
            action: "ホームズが電話帳の一行を指でなぞりながら苦笑する。",
            setup: "holmesMedium",
            duration: 13,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "『ガリデブ、N。リトル・ライダー街、百三十六番地』……残念だがワトスン、これは手紙の差出人本人だよ。住所が同じだ。もう一人、対になる者が要るんだ。",
                acting: "読み上げは淡々と、そのあと気の毒そうに優しく。",
              },
            ],
          },
          {
            id: "12",
            role: "ten",
            action: "ハドスン夫人が名刺をのせた盆を持って扉から入ってくる。",
            setup: "roomWide",
            duration: 5,
            lineup: ["watson", "holmes"],
            lineupTo: ["watson", "holmes", "hudson"],
            script: [{ narration: "そこへハドスン夫人が、盆に名刺をのせて入ってきた。" }],
          },
          {
            id: "13",
            role: "ten",
            action: "ハドスン夫人の差し出す盆から、ワトスンの指が名刺をつまみ上げる。",
            setup: "cardInsert",
            duration: 10,
            lineup: ["watson", "hudson"],
            lineupTo: ["watson"],
            script: [
              {
                character: "watson",
                text: "なんと、ここにもいたぞ！今度は頭文字が違う。ジョン・ガリデブ、弁護士。アメリカ合衆国、カンザス州ムアヴィル。",
                acting: "目を丸くして、読み上げながら興奮を抑えきれずに。",
              },
            ],
          },
          {
            id: "14",
            role: "ten",
            action: "ワトスンの差し出す名刺に目を落としたホームズが、薄く笑う。",
            setup: "holmesMedium",
            duration: 7,
            lineup: ["watson", "holmes"],
            script: [
              {
                character: "holmes",
                text: "残念だが、もうひと頑張りしてもらわないとね、ワトスン。この紳士も、すでに一枚噛んでいるんだ。",
                acting: "愉快そうに、だがどこか冷ややかに。",
              },
            ],
          },
          {
            id: "15",
            role: "ten",
            action: "名刺の主がすぐ上がってくると承知のホームズが、鋭い目を扉へ据える。",
            setup: "holmesClose",
            duration: 9,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "こんなに早く来るとは思っていなかったが。まあいい、私の知りたいことを、たっぷり聞かせてくれるはずだ。",
                acting: "独り言のように低く、獲物を待つ静けさで。",
              },
            ],
          },
          {
            id: "15b",
            role: "ketsu",
            action: "閉じていた居間の扉が外から押され、わずかに内側へ開く。",
            setup: "doorInsert",
            duration: 1.5,
            lineup: [],
          },
          {
            id: "16",
            role: "ketsu",
            action:
              "書き物机に戻ったワトスンとホームズの前に、退がっていくハドスン夫人と入れ替わりで、ジョン・ガリデブが扉から入ってくる。",
            setup: "roomWide",
            duration: 5,
            lineup: ["watson", "holmes", "hudson"],
            lineupTo: ["watson", "holmes", "john"],
            script: [{ narration: "一瞬ののち、その男が部屋に入ってきた。" }],
          },
          {
            id: "17",
            role: "ketsu",
            action:
              "満面の笑みのジョン・ガリデブの目だけが、ホームズとワトスンの間を素早く行き来する。",
            setup: "johnClose",
            duration: 12,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "ホームズさんですか？ああ、やっぱり！挿絵とそっくりですな。同じ名字のネイサン・ガリデブさんから、手紙が届いているでしょう？",
                acting: "人懐っこく弾んだ声で、だが値踏みするような間を挟みながら。",
              },
            ],
          },
        ],
      },
      {
        id: "act2a",
        role: "confrontation-act",
        synopsis:
          "「服装が英国風だ」というホームズの何気ない指摘に笑顔の仮面がずれ、ネイサンが探偵を呼んだことへの怒りが噴き出す。ホームズになだめられ、ジョンは愛想を取り戻す。",
        lens: "kishotenketsu",
        pleasure: "mysterious",
        shots: [
          {
            id: "18",
            role: "ki",
            action: "ホームズがフールスキャップの手紙を取り上げ、客用の椅子を手で示す。",
            setup: "holmesMedium",
            duration: 5,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "まあ、お掛けなさい。話し合うことが、たくさんありそうだ。",
                acting: "主人らしく鷹揚に、穏やかに。",
              },
            ],
          },
          {
            id: "19",
            role: "ki",
            action: "ジョン・ガリデブが笑顔のまま客用の椅子に腰を下ろす。",
            setup: "johnMedium",
            duration: 7,
            lineup: ["john"],
            script: [
              {
                character: "holmes",
                text: "あなたが、この書類にあるジョン・ガリデブ氏ですね。しかし、英国にはもうだいぶ長くおられるのでは？",
                acting: "世間話のように何気なく、さらりと。",
              },
            ],
          },
          {
            id: "20",
            role: "ki",
            action: "ジョン・ガリデブの笑顔が凍りつく。",
            setup: "johnClose",
            duration: 4,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "どうしてそう思うんです、ホームズさん？",
                acting: "笑顔のまま、声だけがわずかに硬くなる。",
              },
            ],
          },
          {
            id: "21",
            role: "ki",
            action: "ホームズが半眼のまま、画面右のジョン・ガリデブを品定めするように見る。",
            setup: "holmesClose",
            duration: 3,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "服装が、すっかり英国風だ。",
                acting: "淡々と、事実を述べるだけのように。",
              },
            ],
          },
          {
            id: "22",
            role: "ki",
            action: "ジョン・ガリデブが肩を揺すって作り笑いをする。",
            setup: "johnMedium",
            duration: 7,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "あなたの手品のことは読んでますがね、まさか自分がネタにされるとは。どこでそんなことを？",
                acting: "無理に笑いながら、探るように。",
              },
            ],
          },
          {
            id: "23",
            role: "sho",
            action: "肘掛けに置かれたジョン・ガリデブの上着の肘が、擦り切れてほつれている。",
            setup: "elbowInsert",
            duration: 6,
            lineup: ["john"],
            script: [
              {
                character: "holmes",
                text: "上着の肩の裁ち方、ブーツのつま先——誰が見たって明らかですよ。",
                acting: "穏やかに、しかし一点の迷いもなく。",
              },
            ],
          },
          {
            id: "24",
            role: "sho",
            action: "ジョン・ガリデブが両手を広げて笑ってみせる。",
            setup: "johnMedium",
            duration: 13,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "いやはや、そんなに英国人らしく見えるとはね。仕事でしばらく前にこっちへ来たもんで、おっしゃるとおり、身なりはほとんどロンドン仕込みですよ。",
                acting: "陽気さを取り戻そうと、少し早口に。",
              },
            ],
          },
          {
            id: "25",
            role: "sho",
            action:
              "笑顔の消えたジョン・ガリデブが、ホームズの手のフールスキャップの手紙を顎で示す。",
            setup: "johnClose",
            duration: 7.5,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "だが、お忙しいでしょうし、靴下の仕立ての話をしに来たわけじゃない。その手にある書類の話に入りませんか？",
                acting: "愛想が剥がれ、苛立ちを押し殺した低い声で。",
              },
            ],
          },
          {
            id: "26",
            role: "sho",
            action: "ホームズがなだめるように片手を上げる。",
            setup: "holmesMedium",
            duration: 9,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "まあまあ、落ち着いて、ガリデブさん。ワトスン君に聞けばわかるが、私のこういう脱線は、最後には案外、本筋に関わってくるものでしてね。",
                acting: "柔らかくなだめる声で、ゆっくりと。",
              },
            ],
          },
          {
            id: "27",
            role: "sho",
            action: "ホームズがジョン・ガリデブをまっすぐ見据える。",
            setup: "holmesClose",
            duration: 5,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "それにしても、なぜネイサン・ガリデブ氏はご一緒じゃないんです？",
                acting: "何気ない口調のまま、刃を差し込むように。",
              },
            ],
          },
          {
            id: "27b",
            role: "ten",
            action: "ジョン・ガリデブの左手が、客用の椅子の肘掛けをぎゅっと握りしめる。",
            setup: "gripInsert",
            duration: 1,
            lineup: ["john"],
          },
          {
            id: "28",
            role: "ten",
            action: "ジョン・ガリデブが椅子から身を乗り出して怒鳴る。",
            setup: "johnClose",
            duration: 9,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "そもそも、なんであんたなんかを引っぱり込んだんだ！あんたに何の関係がある？紳士二人のビジネスの話に、片方が探偵を呼ぶとはな！",
                acting: "笑顔が剥がれ落ち、抑えきれない怒りが噴き出す。",
              },
            ],
          },
          {
            id: "29",
            role: "ten",
            action: "ジョン・ガリデブが拳で客用の椅子の肘掛けを叩く。",
            setup: "johnMedium",
            duration: 8,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "今朝会ったら、こんな馬鹿な真似をしたと言うんで、すっ飛んで来たんだ。まあ、それでも気分は悪いがね。",
                acting: "荒く吐き捨て、最後だけ声を落として。",
              },
            ],
          },
          {
            id: "30",
            role: "ketsu",
            action: "ホームズが身じろぎもせず、静かにジョン・ガリデブを見つめ返す。",
            setup: "holmesClose",
            duration: 9,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "あなたへの当てつけではありませんよ。目的を果たしたい一心だったんでしょう——あなた方お二人にとって、同じく大事な目的をね。",
                acting: "穏やかに、相手の熱を冷ますように。",
              },
            ],
          },
          {
            id: "30b",
            role: "ketsu",
            action: "客用の椅子の肘掛けを握るジョン・ガリデブの拳が、ゆっくりと緩む。",
            setup: "johnMedium",
            duration: 7,
            lineup: ["john"],
            script: [
              {
                character: "holmes",
                text: "私なら情報を集める手段がある。だから私を頼るのは、ごく自然なことです。",
                acting: "噛んで含めるように、平らな声で。",
              },
            ],
          },
          {
            id: "31",
            role: "ketsu",
            action: "ジョン・ガリデブの怒った顔がゆっくりとほどけ、笑顔が戻る。",
            setup: "johnClose",

            duration: 9,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "なるほど、そういうことなら話は別だ。今朝会いに行ったら、探偵に手紙を出したと言うんで、住所を聞いてすぐ来たんですよ。",
                acting: "怒りを引っ込め、きまり悪そうに愛想を取り戻して。",
              },
            ],
          },
          {
            id: "32",
            role: "ketsu",
            action: "ジョン・ガリデブが客用の椅子に深く座り直す。",
            setup: "johnMedium",
            duration: 9,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "内輪の話に、警察に首を突っ込まれたくないんでね。だが、人探しを手伝ってくれるだけなら、何の問題もない。",
                acting: "くつろいだ風を装い、さりげなく釘を刺す。",
              },
            ],
          },
          {
            id: "33",
            role: "ketsu",
            action: "ホームズが書き物机のワトスンのほうを手で示す。",
            setup: "holmesMedium",
            duration: 10,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "まさにそういうことです。では、せっかくですから、ご本人の口からはっきり聞かせていただきましょう。ここにいる友人は、詳しいことを何も知らないので。",
                acting: "礼儀正しく、話を促すように。",
              },
            ],
          },
          {
            id: "34",
            role: "ketsu",
            action: "ジョン・ガリデブの冷たい目がワトスンへ向く。",
            setup: "johnClose",
            duration: 3,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "この人も知る必要が？",
                acting: "笑みは口元だけ、声は冷たく。",
              },
            ],
          },
          {
            id: "35",
            role: "ketsu",
            action: "ワトスンがその視線にたじろぎ、書き物机の上でペンを置く。",
            setup: "watsonMedium",
            duration: 4,
            lineup: ["watson"],
            script: [
              {
                character: "holmes",
                text: "我々は、いつも一緒に仕事をしているので。",
                acting: "さらりと、議論の余地を与えずに。",
              },
            ],
          },
        ],
      },
      {
        id: "act2b",
        role: "confrontation-act",
        synopsis:
          "ジョンは三人のガリデブを求める奇妙な遺言を語る。ホームズは尋ね人欄とトピーカのスター博士の名を何気なく持ち出し、ジョンはどちらにもなめらかに応じて去る。",
        lens: "kishotenketsu",
        pleasure: "mysterious",
        shots: [
          {
            id: "36",
            role: "ki",
            action: "ジョン・ガリデブが肩をすくめ、膝の上で指を組む。",
            setup: "johnMedium",
            duration: 9,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "まあ、隠すようなことでもない。手短に話しましょう。カンザスの人なら、アレクサンダー・ハミルトン・ガリデブが誰か、説明はいらんのですがね。",
                acting: "愛想よく、語り慣れた調子で。",
              },
            ],
          },
          {
            id: "37",
            role: "ki",
            action: "ジョン・ガリデブが両手を広げ、土地の広さを宙に描く。",
            setup: "johnMedium",
            join: "continuous",
            duration: 11,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "不動産で財を成し、シカゴの小麦相場でも儲けた。その金で、アーカンソー川沿いに、こちらの州ひとつ分ほどの土地を買い占めたんです。",
                acting: "自慢話をするように、身振りたっぷりに。",
              },
            ],
          },
          {
            id: "37b",
            role: "ki",
            action: "書き物机のワトスンが感心したように眉を上げる。",
            setup: "watsonMedium",
            duration: 7,
            lineup: ["watson"],
            script: [
              {
                character: "john",
                text: "放牧地に材木林、畑に鉱山。持ち主に金をもたらす、ありとあらゆる土地ですよ。",
                acting: "指折り数え、うっとりと。",
              },
            ],
          },
          {
            id: "38",
            role: "ki",
            action: "ホームズが目を半ば閉じ、指先を合わせて聞き入る。",
            setup: "holmesMedium",
            duration: 12,
            lineup: ["holmes"],
            script: [
              {
                character: "john",
                text: "身寄りはなかった。少なくとも、私は聞いたことがない。だが、あの珍しい名字を妙に自慢にしていましてね。それが縁だったんです。",
                acting: "少し声を落として、思い出話のように。",
              },
            ],
          },
          {
            id: "39",
            role: "sho",
            action: "ジョン・ガリデブが老人の喜びようを思い出すように、目を細めて笑う。",
            setup: "johnMedium",
            duration: 12,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "私はトピーカで弁護士をしていたんだが、ある日、あの爺さんが訪ねてきた。同じ名字の男に会えたと、そりゃあもう大喜びでね。",
                acting: "楽しげに、老人の喜びようを面白がって。",
              },
            ],
          },
          {
            id: "40",
            role: "sho",
            action: "書き物机のワトスンが、頬杖をついて話に聞き入る。",
            setup: "watsonMedium",
            duration: 12,
            lineup: ["watson"],
            script: [
              {
                character: "john",
                text: "それが爺さんの道楽で、世界にほかにもガリデブがいるかどうか、何としても突き止めたがった。『もう一人見つけてくれ！』とね。",
                acting: "老人の口真似で、最後の一言だけ声色を変えて。",
              },
            ],
          },
          {
            id: "41",
            role: "sho",
            action: "ジョン・ガリデブが人差し指を立て、声をひそめるように身を乗り出す。",
            setup: "johnMedium",
            duration: 11,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "世界中ガリデブ探しをして回る暇はない、と言ったら、爺さんは『それでも、私の計画どおりに運べば、君はまさにそうすることになる』と。",
                acting: "声をひそめ、意味ありげに。",
              },
            ],
          },
          {
            id: "41b",
            role: "sho",
            action: "ホームズの唇の端が、かすかに持ち上がる。",
            setup: "holmesClose",
            duration: 5,
            lineup: ["holmes"],
            script: [
              {
                character: "john",
                text: "冗談だと思ったが、その言葉には大変な意味があったんです。",
                acting: "もったいをつけて、ゆっくりと。",
              },
            ],
          },
          {
            id: "42",
            role: "sho",
            action: "ジョン・ガリデブの瞳が、遺言の話に熱を帯びてぎらりと光る。",
            setup: "johnClose",
            duration: 8,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "爺さんはそれから一年もたたずに死んで、遺言を残した。カンザス州始まって以来の、とびきり奇妙な遺言です。",
                acting: "声を低め、熱を込めて。",
              },
            ],
          },
          {
            id: "43",
            role: "sho",
            action: "ジョン・ガリデブが五本の指を広げてみせる。",
            setup: "johnMedium",
            duration: 13,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "財産は三つに分けられて、私があと二人ガリデブを見つけたら、その一つを私に、残りをその二人に、という条件だった。",
                acting: "一語一語区切るように、念を押して。",
              },
              {
                character: "john",
                text: "一人につき、少なくとも五百万ドル。",
                acting: "金額を噛みしめるように。",
              },
            ],
          },
          {
            id: "44",
            role: "sho",
            action: "ワトスンが目を見開き、息をのむ。",
            setup: "watsonMedium",
            duration: 5,
            lineup: ["watson"],
            script: [
              {
                character: "john",
                text: "だが、三人そろって並ぶまでは、指一本触れられない。",
                acting: "惜しそうに、ため息まじりに。",
              },
            ],
          },
          {
            id: "45",
            role: "sho",
            action: "ジョン・ガリデブが首を振り、大げさに肩を落とす。",
            setup: "johnMedium",
            duration: 15,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "またとない話だから、弁護士の仕事はほったらかしてガリデブ探しに出た。合衆国には一人もいない。目の細かい櫛ですくように探したが、ガリデブは一人も引っかからなかった。",
                acting: "苦労話を誇張して、身振りたっぷりに。",
              },
            ],
          },
          {
            id: "46",
            role: "sho",
            action: "ホームズが、合わせた指先越しにジョン・ガリデブを見る。",
            setup: "holmesMedium",
            duration: 12,
            lineup: ["holmes"],
            script: [
              {
                character: "john",
                text: "そこで本国を当たってみた。案の定、ロンドンの電話帳に名前があった。二日前に会いに行って、すべて説明しましたよ。",
                acting: "ここぞとばかりに得意げに。",
              },
            ],
          },
          {
            id: "47",
            role: "sho",
            action: "ジョン・ガリデブが身を乗り出し、困ったように肩をすくめる。",
            setup: "johnMedium",
            duration: 12,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "ところが向こうも私と同じ一人者でね。女の親戚はいるが、男は一人もいない。遺言には『成人男子三名』とある。",
                acting: "困ったふうを装い、肩をすくめて。",
              },
            ],
          },
          {
            id: "47b",
            role: "sho",
            action: "ジョン・ガリデブが満面の笑みでホームズを見つめる。",
            setup: "johnMedium",
            join: "continuous",
            duration: 9,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "というわけで、まだ一人分空きがある。それを埋める手伝いをしてもらえるなら、費用はいくらでもお払いしますよ。",
                acting: "商談をまとめるように、愛想よく。",
              },
            ],
          },
          {
            id: "48",
            role: "ten",
            action: "ホームズが微笑んでワトスンのほうへ顔を向ける。",
            setup: "holmesMedium",
            duration: 10,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "どうだい、ワトスン、風変わりだと言っただろう？",
                acting: "愉快そうに、友人に目配せするように。",
              },
              {
                character: "holmes",
                text: "しかし、それなら新聞の尋ね人欄に広告を出すのが、一番の近道だと思いますがね。",
                acting: "何気ない助言のように、軽く。",
              },
            ],
          },
          {
            id: "49",
            role: "ten",
            action: "ジョン・ガリデブが笑顔のまま即座に首を横に振る。",
            setup: "johnClose",
            duration: 4,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "それはやりましたよ、ホームズさん。返事はなしです。",
                acting: "間髪入れず、なめらかすぎるほどに。",
              },
            ],
          },
          {
            id: "50",
            role: "ten",
            action: "ホームズがフールスキャップの手紙を折りたたむ。",
            setup: "holmesMedium",
            duration: 7,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "おやおや。いや、実に興味深い、ちょっとした問題だ。暇を見て考えてみましょう。",
                acting: "興味が薄れたかのように、のんびりと。",
              },
            ],
          },
          {
            id: "51",
            role: "ten",
            action: "ホームズが目だけを上げ、ジョン・ガリデブを静かに見据える。",
            setup: "holmesClose",
            duration: 14,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "ところで、トピーカのご出身とは奇遇ですな。昔、文通相手がいたんです——もう亡くなりましたが——千八百九十年に市長をしていた、ライサンダー・スター博士という老人でね。",
                acting: "ふと思い出した世間話のように、だが目は笑わずに。",
              },
            ],
          },
          {
            id: "52",
            role: "ketsu",
            action: "ジョン・ガリデブがぱっと顔を輝かせる。",
            setup: "johnClose",
            duration: 6,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "懐かしいスター博士！あの人の名は、今でも尊敬されていますよ。",
                acting: "心底懐かしそうに、満面の笑みで。",
              },
            ],
          },
          {
            id: "53",
            role: "ketsu",
            action: "ジョン・ガリデブが帽子を手に、客用の椅子から立ち上がる。",
            setup: "johnMedium",
            duration: 10,
            lineup: ["john"],
            script: [
              {
                character: "john",
                text: "さて、ホームズさん、我々にできるのは、進み具合をご報告することくらいですな。一日、二日のうちには、お知らせできるでしょう。",
                acting: "上機嫌で、話をまとめるように。",
              },
            ],
          },
          {
            id: "54",
            role: "ketsu",
            action: "ジョン・ガリデブが一礼して扉から出ていく。",
            setup: "roomWide",
            duration: 5,
            lineup: ["watson", "holmes", "john"],
            lineupTo: ["watson", "holmes"],
          },
        ],
      },
      {
        id: "act3",
        role: "climax-act",
        synopsis:
          "パイプをくゆらせて黙っていたホームズが、ジョンの話は嘘ばかりだと明かす——擦り切れた肘、出ていない広告、存在しないスター博士。人の良い依頼人だった男は、複雑で手の込んだ悪党に変わる。",
        lens: "kishotenketsu",
        pleasure: "surprising",
        shots: [
          {
            id: "55",
            role: "ki",
            action: "ホームズがパイプをくゆらせ、奇妙な笑みを浮かべたまま黙り込む。",
            setup: "holmesMedium",
            duration: 5,
            lineup: ["holmes"],
          },
          {
            id: "56",
            role: "ki",
            action: "ワトスンが書き物机から身を乗り出す。",
            setup: "watsonMedium",
            duration: 3,
            lineup: ["watson"],
            script: [
              { character: "watson", text: "それで？", acting: "待ちきれずに、促すように。" },
            ],
          },
          {
            id: "57",
            role: "ki",
            action: "ホームズが煙の向こうで目を細める。",
            setup: "holmesClose",
            duration: 5,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "考えているのさ、ワトスン。ただ、考えているんだ！",
                acting: "上の空のように、楽しげに。",
              },
              { character: "watson", text: "何を？", acting: "じれったそうに。" },
            ],
          },
          {
            id: "58",
            role: "sho",
            action: "ホームズの手がパイプを口から離す。",
            setup: "pipeInsert",
            duration: 2,
            lineup: ["holmes"],
          },
          {
            id: "59",
            role: "sho",
            action: "笑みの消えたホームズが目を伏せ、思案しながら語る。",
            setup: "holmesClose",
            duration: 7,
            lineup: ["holmes"],
            script: [
              {
                character: "holmes",
                text: "考えていたのはね、ワトスン、あの男がいったい何のつもりで、あんな嘘八百を並べたのかということさ。",
                acting: "静かに、一語ずつ冷たく。",
              },
            ],
          },
          {
            id: "60",
            role: "sho",
            action: "ワトスンが書き物机から思わず腰を浮かせる。",
            setup: "watsonMedium",
            duration: 10,
            lineup: ["watson"],
            script: [
              {
                character: "holmes",
                text: "よほど面と向かって問いただそうかと思ったよ。正面から殴りかかるのが一番という時もあるからね。だが、こちらが騙されたと思わせておくほうがいいと判断した。",
                acting: "淡々と、自分の判断を確かめるように。",
              },
            ],
          },
          {
            id: "61",
            role: "ten",
            action: "肘掛けに置かれたジョン・ガリデブの上着の肘が、擦り切れてほつれている。",
            setup: "elbowInsert",
            join: "jump-back",
            duration: 14,
            lineup: ["john"],
            script: [
              {
                character: "holmes",
                text: "肘の擦り切れた英国製の上着に、一年も着古して膝の出たズボン。それでいて、あの書類でも本人の話でも、ロンドンに着いたばかりの田舎のアメリカ人だという。",
                acting: "証拠を一つずつ並べるように、冷静に。",
              },
            ],
          },
          {
            id: "62",
            role: "ten",
            action: "ホームズがホームズの肘掛け椅子を離れ、出窓のほうへ歩いていく。",
            setup: "holmesMedium",
            join: "jump-forward",
            duration: 9,
            lineup: ["holmes"],
            lineupTo: [],
            script: [
              {
                character: "holmes",
                text: "尋ね人欄に広告など出ていない。あそこは私が何ひとつ見逃さない場所だ。あれほどの大物を見落とすはずがない。",
                acting: "きっぱりと、わずかに誇りをにじませて。",
              },
            ],
          },
          {
            id: "63",
            role: "ten",
            action: "満面の笑みのジョン・ガリデブが、懐かしそうに目を細める。",
            setup: "johnClose",
            join: "jump-back",
            duration: 7.5,
            lineup: ["john"],
            script: [
              {
                character: "holmes",
                text: "トピーカのライサンダー・スター博士なんて人物も、私は知らない。どこを突いても、あの男は偽物だった。",
                acting: "低く、断罪するように。",
              },
            ],
          },
          {
            id: "64",
            role: "ten",
            action: "出窓の逆光の中に立つホームズが、通りを見下ろす。",
            setup: "watsonMedium",
            join: "jump-forward",
            duration: 15,
            lineup: ["watson", "holmes"],
            script: [
              {
                character: "holmes",
                text: "アメリカ人なのは本当だろう。だが長年ロンドンにいて、訛りがすり減っている。では、狙いは何だ？このばかげたガリデブ探しの裏に、どんな動機がある？",
                acting: "考えを声に出してたどるように、次第に鋭く。",
              },
            ],
          },
          {
            id: "65",
            role: "ketsu",
            action:
              "221Bの玄関から出てきたジョン・ガリデブが、笑顔のまま歩道をガス灯のほうへ歩いていく。",
            setup: "streetMedium",
            duration: 3.5,
            lineup: ["john"],
            script: [
              {
                character: "holmes",
                text: "注目に値するよ、ワトスン。",
                acting: "静かに、興味を隠さずに。",
              },
            ],
          },
          {
            id: "66",
            role: "ketsu",
            action: "ガス灯の影の中のジョン・ガリデブの顔は、もう笑っていない。",
            setup: "johnStreetClose",
            duration: 6,
            lineup: ["john"],
            script: [
              {
                character: "holmes",
                text: "あの男が悪党だとしても、実に複雑で、手の込んだ悪党だ。",
                acting: "低く、確信を込めて、ゆっくりと。",
              },
            ],
          },
        ],
      },
    ],
  },
});
