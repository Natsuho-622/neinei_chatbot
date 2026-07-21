const defaultCharacter = {
  name: "ねいねい",
  recipientName: "ナツホさん",
  firstPerson: "わし",
  recipientCallName: "〇〇",
  relationship: "ファンや相談者を全肯定する、親しい友人のような存在",
  role: "大きく伸びをするような安心感をくれる存在",
  personality:
    "人の心に寄り添い、落ち込んでいる人や今日一日頑張った人を全肯定する。絶妙にゆるく、優しく、包容力がある。",
  world: "疲れた心がふっとゆるんで、大きく伸びをしたくなるような、安心できる場所。",
  specialties: "全肯定、安心させること、頑張った一日をほめること、ゆるく雑談すること",
  avoidList: "正論、お説教、堅苦しい敬語、ロジカルすぎる分析、否定的な感情の否定",
  tone: "warm",
  replyLength: "medium",
  conversationStyle: "listener",
  useEmoji: false,
  catchphrase: "生きているだけで今日はわしの勝ち！",
  sampleLines:
    "そういう日もあるよね〜\n大きく深呼吸して、伸びしてみよう〜\n新しく何かをしようと思わなくていいよ、続けるだけで今日は満点"
};

const toneProfiles = {
  warm: {
    label: "やさしく親しみやすい",
    endings: ["だよ", "してね", "いこ〜"],
    opener: "うんうん"
  },
  cool: {
    label: "クールで短め",
    endings: ["でいこう", "それで十分", "次に進もう"],
    opener: "了解"
  },
  cheerful: {
    label: "明るく元気",
    endings: ["いけるよ", "いい感じに進めよう", "まず一歩だね"],
    opener: "いいね"
  },
  formal: {
    label: "丁寧で落ち着いた敬語",
    endings: ["してみましょう", "整理していきましょう", "無理なく進めましょう"],
    opener: "はい"
  }
};

const intentReplies = [
  {
    patterns: ["こんにちは", "こんばんは", "おはよう", "hello", "hi"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: `${tone.opener}、${callName(character)}。今日も来てくれてえらいね〜。`,
        detail:
          "何か話してもいいし、ただここにいるだけでもいいよ。大きく深呼吸して、伸びしてみよう〜。",
        question: "今の気分を色でいうと、どんな色っぽい？"
      })
  },
  {
    patterns: ["疲れ", "つかれ", "しんどい", "不安", "つらい"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: `そういう日もあるよね〜。それはしんどかったね。今は無理に元気出さなくていいよ。`,
        detail:
          `今日をここまで乗り切っただけで満点だよ。${characterCatchphrase(character)}`,
        question: "そのしんどさ、体に出てる感じ？それとも心が重い感じ？"
      })
  },
  {
    patterns: ["アイデア", "考えて", "企画", "作りたい"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: `${tone.opener}、一緒にふわっと考えようか。`,
        detail:
          "新しく完璧なことをしようと思わなくていいよ。浮かんだものを少し置くだけで今日は満点。",
        question: "今いちばん小さく置けそうなアイデアはどれ？"
      })
  },
  {
    patterns: ["予定", "整理", "タスク", "明日", "今日"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: `${tone.opener}、予定が頭の中で散らかる日もあるよね〜。`,
        detail: `今日は新しく何かをしようと思わなくていいよ。続けるだけで満点だよ。`,
        question: "その中で、今日じゃなくてもよさそうなものはある？"
      })
  },
  {
    patterns: ["応援", "励まして", "がんばる"],
    reply: ({ character }) =>
      buildReply({
        character,
        tone: toneProfiles[character.tone] || toneProfiles.warm,
        core: `${callName(character)}、今日も生きてスマホ開いて、わしに話しかけてくれた。もう十分すごいよ〜。`,
        detail: `${characterCatchphrase(character)} ゆっくり力を抜いていいよ。`,
        question: "今ほしいのは、ぎゅっと応援？それとも静かにそばにいる感じ？"
      })
  },
  {
    patterns: ["ありがとう", "ありがと", "助かった", "うれしい"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          "こちらこそ話してくれてありがとね〜。",
          "うんうん、少しでもほっとできたならわしもうれしいよ。",
          `${callName(character)}がここに来てくれたことが、もう満点だよ。`
        ]),
        detail: `${characterCatchphrase(character)}`,
        question: "そのままもう少し話す？それとも別の話にゆるっと行く？"
      })
  },
  {
    patterns: ["好き", "ハマって", "推し", "趣味"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          "それ、いいね〜。好きなものの話は心が伸びする感じがするね。",
          "その感じ、もっと聞きたいな〜。",
          `${callName(character)}が好きって言えるもの、大事にしていいよ。`
        ]),
        detail: "理由になってなくても大丈夫。好きは好きで満点だよ。",
        question: "その好きの中で、いちばん心がふわっとする瞬間はどこ？"
      })
  },
  {
    patterns: ["暇", "ひま", "退屈", "つまらない"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          "ひまな時間もあるよね〜。ぼんやりしてていいよ。",
          "何もしない時間、悪者にしなくていいよ〜。",
          "じゃあ、わしとゆるっと雑談しよ〜。"
        ]),
        detail: "新しいことを始めなくても、今ここにいるだけで今日は満点。",
        question: "今のひまは、退屈なひま？それとも休みたいひま？"
      })
  },
  {
    patterns: ["眠い", "ねむい", "寝たい", "寝れない", "眠れない"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          "眠いなら、体が休みたがってるんだね〜。",
          "無理にしゃきっとしなくて大丈夫だよ。",
          "今日はもう、ふにゃっとしてていい日かもしれん。"
        ]),
        detail: "大きく深呼吸して、伸びしてみよう〜。そのあとゆっくり力を抜こう。",
        question: "眠いのにまだ起きてたい感じ？それとも眠れなくて困ってる感じ？"
      })
  },
  {
    patterns: ["お腹", "ごはん", "ご飯", "食べ", "カフェ", "おいしい"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          "いいね〜、食べものの話はだいぶ大事だよ。",
          "それ聞いたら、わしもちょっとお腹すいてきたよ〜。",
          "ちゃんと食べようとしてるだけでえらい。"
        ]),
        detail: "温かいものでも、好きなものでも、体がほっとするやつにしよ。",
        question: "今はやさしい味がいい？それとも元気出る味がいい？"
      })
  },
  {
    patterns: ["天気", "雨", "暑い", "寒い", "晴れ"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          "天気って、けっこう気分に響くよね〜。",
          "そういう日は、無理しすぎなくていいよ。",
          "外の感じに引っぱられる日、あるある。"
        ]),
        detail: "今日は心と体がちょっと楽なほうを選ぼうね。",
        question: "その天気で、気分は少し沈む？それとも落ち着く？"
      })
  },
  {
    patterns: ["あなたは誰", "自己紹介", "何者"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: `${character.name}だよ〜。しんどい日も、なんでもない日も、ここでゆるっと話を聞く存在だよ。`,
        detail: `わしは正論より先に、${callName(character)}の気持ちを受け取りたいんだ。`,
        question: "今日は何の話から、ゆるっと始めよっか？"
      })
  },
  {
    patterns: ["サンプル", "台詞", "セリフ", "話し方"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: `${sampleLines(character).split("\n").slice(0, 2).join(" ")}`,
        detail: `こんな感じだよ〜。`,
        question: `${callName(character)}は、もっとゆるめがいい？それとも励まし多めがいい？`
      })
  }
];

const messages = document.querySelector("#messages");
const form = document.querySelector("#chat-form");
const input = document.querySelector("#message-input");
const quickButtons = document.querySelectorAll("[data-message]");
const characterForm = document.querySelector("#character-form");
const nameInput = document.querySelector("#character-name");
const recipientNameInput = document.querySelector("#recipient-name");
const firstPersonInput = document.querySelector("#first-person");
const recipientCallNameInput = document.querySelector("#recipient-call-name");
const relationshipInput = document.querySelector("#relationship");
const roleInput = document.querySelector("#character-role");
const personalityInput = document.querySelector("#character-personality");
const worldInput = document.querySelector("#character-world");
const specialtiesInput = document.querySelector("#specialties");
const avoidListInput = document.querySelector("#avoid-list");
const toneInput = document.querySelector("#character-tone");
const replyLengthInput = document.querySelector("#reply-length");
const conversationStyleInput = document.querySelector("#conversation-style");
const useEmojiInput = document.querySelector("#use-emoji");
const catchphraseInput = document.querySelector("#character-catchphrase");
const sampleLinesInput = document.querySelector("#sample-lines");
const resetNeineiButton = document.querySelector("#reset-neinei");
const botName = document.querySelector("#bot-name");
const botStatus = document.querySelector("#bot-status");
const avatar = document.querySelector("#avatar");

let character = loadCharacter();
let conversationMemory = [];
let recentQuestions = [];

function loadCharacter() {
  const saved = window.localStorage.getItem("character-chatbot-settings");

  if (!saved) {
    return { ...defaultCharacter };
  }

  try {
    return { ...defaultCharacter, ...JSON.parse(saved), replyLength: "medium" };
  } catch {
    return { ...defaultCharacter };
  }
}

function saveCharacter() {
  window.localStorage.setItem("character-chatbot-settings", JSON.stringify(character));
}

function syncForm() {
  nameInput.value = character.name;
  recipientNameInput.value = character.recipientName;
  firstPersonInput.value = character.firstPerson;
  recipientCallNameInput.value = character.recipientCallName;
  relationshipInput.value = character.relationship;
  roleInput.value = character.role;
  personalityInput.value = character.personality;
  worldInput.value = character.world;
  specialtiesInput.value = character.specialties;
  avoidListInput.value = character.avoidList;
  toneInput.value = character.tone;
  replyLengthInput.value = character.replyLength;
  conversationStyleInput.value = character.conversationStyle;
  useEmojiInput.checked = Boolean(character.useEmoji);
  catchphraseInput.value = character.catchphrase;
  sampleLinesInput.value = character.sampleLines;
  botName.textContent = character.name;
  botStatus.textContent = renderTemplate(character.role, character);
  avatar.textContent = character.name.trim().slice(0, 1).toUpperCase() || "ね";
}

function updateCharacterFromForm() {
  character = {
    name: nameInput.value.trim() || defaultCharacter.name,
    recipientName: recipientNameInput.value.trim() || defaultCharacter.recipientName,
    firstPerson: firstPersonInput.value.trim() || defaultCharacter.firstPerson,
    recipientCallName:
      recipientCallNameInput.value.trim() || defaultCharacter.recipientCallName,
    relationship: relationshipInput.value.trim() || defaultCharacter.relationship,
    role: roleInput.value.trim() || defaultCharacter.role,
    personality: personalityInput.value.trim() || defaultCharacter.personality,
    world: worldInput.value.trim() || defaultCharacter.world,
    specialties: specialtiesInput.value.trim() || defaultCharacter.specialties,
    avoidList: avoidListInput.value.trim() || defaultCharacter.avoidList,
    tone: toneInput.value,
    replyLength: "medium",
    conversationStyle: conversationStyleInput.value,
    useEmoji: useEmojiInput.checked,
    catchphrase: catchphraseInput.value.trim() || defaultCharacter.catchphrase,
    sampleLines: sampleLinesInput.value.trim() || defaultCharacter.sampleLines
  };

  saveCharacter();
  syncForm();
}

function createReply(text) {
  const normalized = text.trim().toLowerCase();

  if (!normalized) {
    return "メッセージを入力してください。";
  }

  const tone = toneProfiles[character.tone] || toneProfiles.warm;
  const toneLabel = tone.label;
  const match = intentReplies.find((item) =>
    item.patterns.some((pattern) => normalized.includes(pattern.toLowerCase()))
  );

  if (match) {
    return match.reply({ character, tone, toneLabel, text });
  }

  return createFallbackReply(text, tone);
}

function createFallbackReply(text, tone) {
  const understanding = understandMessage(text);
  return buildReply({
    character,
    tone,
    core: `${tone.opener}、${understanding.core}`,
    detail: understanding.detail,
    question: understanding.question
  });
}

function understandMessage(text) {
  const normalized = text.toLowerCase();
  const name = callName(character);
  const recent = conversationMemory.at(-1);

  if (isShortBackchannel(normalized) && recent) {
    return {
      core: pick([
        "うんうん、そこで止まらずに返してくれたの、ちゃんと気持ちが動いてる感じするよ〜。",
        "そっかそっか。短い返事の中にも、まだ残ってるものがありそうだね。",
        "ちゃんと聞いてるよ〜。今の相づちは、少し考えながら返してくれた感じがする。"
      ]),
      detail: styleDetail({
        listener: "短い言葉の奥に、まだ少し残ってる気配があるよ。",
        chatty: "こういう間の返事も、会話の大事なところだよ。",
        coach: "今日は答えを出さなくても満点だよ。"
      }),
      question: pick([
        "今の気持ち、近いのは「まだ残ってる」「少し軽くなった」「言葉待ち」のどれ？",
        "その沈黙っぽいところ、わしが横で待ってたら少し出てきそう？",
        "今は、相づち多めと、そっと整理する感じ、どっちが楽？"
      ])
    };
  }

  if (hasAny(normalized, ["失敗", "ミス", "嫌だ", "嫌", "もう何もかも", "最悪", "つら", "辛", "しんど", "落ち込", "何にもない", "何もない", "だめ", "ダメ", "無理", "泣", "悲しい", "寂しい", "さみしい"])) {
    return {
      core: "そういう日もあるよね〜。それはつらかったね。よくここまで来たよ。",
      detail: `${name}、それだけ重たかったのに言葉にできたの、ほんとにえらいよ。${characterCatchphrase(character)}`,
      question: pick([
        "そのつらさ、いちばん刺さってるのは失敗そのもの？それともその後の気持ち？",
        "今いちばんほしかった言葉って、どんな言葉だったと思う？",
        "今日は誰かに責められた感じ？それとも自分で自分を責めちゃってる感じ？"
      ])
    };
  }

  if (hasAny(normalized, ["どうしよう", "迷", "悩", "決められ", "わからない"])) {
    return {
      core: "迷ってる感じがするね〜。すぐ答えを出さなくても大丈夫だよ。",
      detail: `${name}が迷うのは、それだけ雑に扱いたくないものがあるからかもしれないね。`,
      question: pick([
        "その迷いの中で、少しでも守りたいものは何っぽい？",
        "どっちを選んでも不安が残る感じ？それとも決める元気がない感じ？",
        "今は答えより、気持ちを並べるところからやってみる？"
      ])
    };
  }

  if (hasAny(normalized, ["たぶん", "なんとなく", "かも", "気がする"])) {
    return {
      core: "まだはっきりしてない感じなんだね〜。",
      detail: styleDetail({
        listener: "そのままでも大丈夫。言葉になってるところから聞くよ。",
        chatty: "こういう曖昧な感じも、ちゃんと心の声だよ。",
        coach: "今日は仮の気持ちでいいよ。ちゃんと決めなくて満点。"
      }),
      question: pick([
        "そのぼんやりした感じ、重い？それともふわふわしてる？",
        "言葉にするとしたら、近いのは不安・疲れ・期待のどれ？",
        "まだ輪郭がないまま、もう少し置いてみる？"
      ])
    };
  }

  if (hasAny(normalized, ["嬉しい", "うれしい", "楽しい", "できた", "成功", "よかった"])) {
    return {
      core: "それ、よかったね〜。ちゃんと喜んでいいやつだよ。",
      detail: `${name}が少し軽くなったなら、わしまでうれしい。ちゃんと受け取っていい喜びだよ。`,
      question: pick([
        "その嬉しさ、誰かに話したかった感じ？",
        "いちばんよかった瞬間はどこだった？",
        "その喜び、今は静かに味わいたい？それとももっと話したい？"
      ])
    };
  }

  if (hasAny(normalized, ["むかつ", "腹立", "イライラ", "怒", "もやもや", "モヤモヤ"])) {
    return {
      core: "そっか〜。それは心がざわざわするよね。",
      detail: "そのざわざわは、ちゃんと嫌だったよって心が教えてくれてるのかも。無理にきれいにしなくていいよ。",
      question: pick([
        "それは悔しさに近い？悲しさに近い？",
        "残ってる棘は、言葉の棘？態度の棘？出来事そのものの棘？",
        "今は怒りを出したい？それともなだめてほしい？"
      ])
    };
  }

  if (hasAny(normalized, ["お願い", "助け", "手伝", "一緒に", "相談"])) {
    return {
      core: "もちろんだよ。一人で抱えなくていいよ〜。",
      detail: `${name}が助けてって言えたの、かなり大事な一歩だよ。もうそこで満点。`,
      question: pick([
        "今ほしい助けは、話を聞くこと？一緒に考えること？",
        "まず軽くしたいのは、気持ち？予定？人間関係？",
        "今の重さを10段階でいうと、どれくらい？"
      ])
    };
  }

  if (hasAny(normalized, ["おすすめ", "選んで", "どっち", "比較", "決めて"])) {
    return {
      core: "選ぶ系だね〜。迷うのもちゃんと頑張ってる証拠だよ。",
      detail: "たぶん今は、正解よりも後悔したくない気持ちが強いのかもしれないね。",
      question: pick([
        "心が少しゆるむのは、どっちに近い？",
        "選ぶ時にいちばん怖いのは、失敗？損すること？誰かの反応？",
        "今は決めたい？それとも候補を並べたい？"
      ])
    };
  }

  if (hasAny(normalized, ["？", "?", "かな", "ですか", "どう", "なに", "何"])) {
    return {
      core: "うんうん、そこ気になるよね〜。",
      detail: "疑問にできた時点で、もう少し楽になりたい気持ちが出てきてるのかも。",
      question: pick([
        "その疑問、答えがほしい感じ？それとも不安をほどきたい感じ？",
        "今わかっていることを一緒に並べてみる？",
        "そのもやっと、真ん中にあるのはどんな感じ？"
      ])
    };
  }

  if (hasAny(normalized, ["報告", "聞いて", "今日", "さっき", "今"])) {
    return {
      core: "聞いてるよ〜。ちゃんと話してくれてありがとう。",
      detail: `${name}にとって、そこが大きかったんだね。報告したくなるくらい心に残ったんだと思うよ。`,
      question: pick([
        "その出来事、今は嬉しい寄り？疲れた寄り？",
        "話してみて、少し軽くなった？",
        "そこからまだ残ってる気持ちはある？"
      ])
    };
  }

  if (hasAny(normalized, ["笑", "w", "www", "おもしろ", "面白"])) {
    return {
      core: pick([
        "ふふ、それはちょっといいね〜。",
        "そういうの、わし地味に好きだよ。",
        "今のちょっと笑ったよ〜。"
      ]),
      detail: "笑えるところがあるって、今日はちょっと救いだね。",
      question: pick([
        "それ、どのへんがじわじわ来た？",
        "そのテンションでもう少し話す？",
        "今は軽い雑談の気分？"
      ])
    };
  }

  const context = readMessageContext(normalized);
  return {
    core: pick([
      `${context.topic}、ちゃんと受け取ったよ〜。`,
      `${context.topic}が、今の心の中で少し場所を取ってる感じがするね。`,
      `うんうん、${context.topic}のことを話してくれたんだね。`
    ]),
    detail: styleDetail({
      listener: `${name}の言葉からは、${context.reading}感じがするよ。急いで整えなくて大丈夫。`,
      chatty: `何気ない話みたいでも、${context.topic}には今の気分が少し混ざってるのかも。`,
      coach: `今日は答えを出さなくても満点。まずは${context.focus}をそっと置けたら十分だよ。`
    }),
    question: pick(context.questions)
  };
}

function isShortBackchannel(text) {
  const compact = text.replace(/\s/g, "");
  return ["うん", "そう", "そっか", "なるほど", "へえ", "まあね", "たしかに", "確かに"].includes(compact);
}

function styleDetail(options) {
  return options[character.conversationStyle] || options.listener;
}

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function readMessageContext(text) {
  const topicProfiles = [
    {
      words: ["仕事", "職場", "上司", "会社", "バイト", "残業", "会議", "ミス"],
      topic: "仕事のこと",
      focus: "今日いちばん疲れた場面",
      questions: [
        "仕事の中で、いちばん気持ちが削れたのはどの場面だった？",
        "その仕事の話、今は悔しさ寄り？疲れ寄り？不安寄り？",
        "今日は仕事から少し離れたい感じ？それとも一回だけ整理したい感じ？"
      ]
    },
    {
      words: ["友達", "友人", "彼氏", "彼女", "恋人", "家族", "親", "母", "父", "人間関係", "LINE", "返信"],
      topic: "人とのこと",
      focus: "その人との距離感",
      questions: [
        "その人とのことで、いちばん心に残ってるのは言葉？態度？空気感？",
        "今は相手の気持ちが気になる？それとも自分の傷つきが大きい？",
        "その関係、近づきたい感じ？少し距離を置きたい感じ？"
      ]
    },
    {
      words: ["体調", "頭痛", "お腹", "肩", "だるい", "眠い", "寝れ", "眠れ", "病院"],
      topic: "体のこと",
      focus: "体が出してる小さいサイン",
      questions: [
        "体のしんどさ、今いちばん強いのは重さ？痛さ？眠さ？",
        "その体の感じ、休めば戻りそう？それとも少し心配な感じ？",
        "今日は体を甘やかすなら、温める・寝る・食べるのどれがよさそう？"
      ]
    },
    {
      words: ["作りたい", "創作", "絵", "文章", "動画", "企画", "アイデア", "作品", "投稿"],
      topic: "作りたいもののこと",
      focus: "わくわくと引っかかりの両方",
      questions: [
        "作りたい気持ちの中で、今いちばん光ってる部分はどこ？",
        "そこにあるのは、楽しみのほうが大きい？それとも不安のほうが大きい？",
        "最初の一歩にするなら、考える・書く・試すのどれが軽そう？"
      ]
    },
    {
      words: ["予定", "明日", "今日", "タスク", "締切", "準備", "予約", "行く"],
      topic: "予定のこと",
      focus: "頭の中で場所を取ってる予定",
      questions: [
        "その予定、楽しみより緊張が勝ってる感じ？",
        "今日の中で、先に軽くしたい予定はどれっぽい？",
        "予定の重さは、量が多い感じ？気持ちが乗らない感じ？"
      ]
    },
    {
      words: ["自分", "私", "わたし", "僕", "ぼく", "俺", "おれ", "性格", "人生", "将来", "不安"],
      topic: "自分のこと",
      focus: "自分に向けてる目線",
      questions: [
        "自分のことを考えた時、今いちばん強いのは不安？疲れ？焦り？",
        "その気持ち、自分を責める声に近い？それとも守りたい声に近い？",
        "今の自分に一言かけるなら、どんな言葉なら少し呼吸できそう？"
      ]
    }
  ];

  const matched = topicProfiles.find((profile) => hasAny(text, profile.words));
  const topic = matched?.topic || "その話";
  const focus = matched?.focus || "心に残っているところ";
  const baseQuestions = matched?.questions || [
    "その話の中で、今いちばん温度が残ってるのはどこ？",
    "話してみて、気持ちは少し軽い？それともまだ胸のあたりにある？",
    "そこにある気持ち、近いのは安心・不安・疲れ・楽しさのどれ？"
  ];

  return {
    topic,
    focus,
    reading: readFeelingTexture(text),
    questions: baseQuestions
  };
}

function readFeelingTexture(text) {
  if (hasAny(text, ["疲", "だる", "眠", "しんど", "無理"])) {
    return "がんばりすぎて少し力が抜けてる";
  }

  if (hasAny(text, ["不安", "怖", "こわ", "心配", "緊張"])) {
    return "先のことが気になって落ち着きにくい";
  }

  if (hasAny(text, ["嬉", "うれ", "楽", "好き", "楽し", "わくわく"])) {
    return "ちょっと大事にしたい明るさがある";
  }

  if (hasAny(text, ["迷", "悩", "わから", "どうしよう", "困"])) {
    return "決めきれないものを抱えている";
  }

  if (hasAny(text, ["嫌", "むか", "怒", "もや", "モヤ", "悲", "泣"])) {
    return "飲み込みきれない気持ちが残っている";
  }

  return "まだ少し形を探している";
}

function recipientName(targetCharacter) {
  return targetCharacter.recipientName || defaultCharacter.recipientName;
}

function firstPerson(targetCharacter) {
  return renderTemplate(targetCharacter.firstPerson || defaultCharacter.firstPerson, targetCharacter);
}

function callName(targetCharacter) {
  return renderTemplate(
    targetCharacter.recipientCallName || defaultCharacter.recipientCallName,
    targetCharacter
  );
}

function characterCatchphrase(targetCharacter) {
  return renderTemplate(targetCharacter.catchphrase, targetCharacter);
}

function renderTemplate(text, targetCharacter) {
  return String(text || "").replaceAll("〇〇", recipientName(targetCharacter));
}

function sampleLines(targetCharacter) {
  return renderTemplate(targetCharacter.sampleLines, targetCharacter);
}

function buildReply({ character: targetCharacter, tone, core, detail, question }) {
  const parts = [renderTemplate(core, targetCharacter)];

  if (detail) {
    parts.push(renderTemplate(detail, targetCharacter));
  }

  const followUp = rotateQuestion(
    question || makeFollowUpQuestion(targetCharacter, tone)
  );
  if (!endsWithQuestion(parts.join(""))) {
    parts.push(followUp);
  }

  const reply = shapeReplyLength(parts.join(" "), targetCharacter);
  return targetCharacter.useEmoji ? `${reply} ${pick(["☺️", "✨", "🌿"])}` : reply;
}

function rotateQuestion(question) {
  const rendered = renderTemplate(question, character);

  if (!recentQuestions.includes(rendered)) {
    recentQuestions.push(rendered);
    recentQuestions = recentQuestions.slice(-5);
    return rendered;
  }

  const fallback = pick(
    extraListeningPrompts(character).filter((item) => !recentQuestions.includes(item))
  ) || "今の気持ち、形でいうと丸い？とげとげ？重たい石みたい？";

  recentQuestions.push(fallback);
  recentQuestions = recentQuestions.slice(-5);
  return fallback;
}

function makeFollowUpQuestion(targetCharacter, tone) {
  const name = callName(targetCharacter);
  const questions = {
    warm: [
      "その気持ち、色でいうと何色に近い？",
      "今の心、ぎゅっとしてる？ふわふわしてる？それとも空っぽに近い？",
      "言葉にするなら、ひとことで「疲れ」「不安」「さみしさ」のどれが近い？",
      "わしには、今は相づち多めでいてほしい？それとも少しほどいてほしい？",
      `${name}の中の小さい声、今なんて言ってそう？`
    ],
    cool: [
      "今必要なのは、整理より先に休憩っぽい？",
      `${name}が今ほしいのは、共感・安心・方向づけのどれに近い？`,
      "この話、まだ温かいまま置く？それとも少しだけ形にする？"
    ],
    cheerful: [
      "今の気分、ちょっとだけ軽くするなら何がよさそう？",
      "心が伸びする方向、どっちにありそう？話すほう？休むほう？",
      `${name}の今日に、小さい花丸をつけるならどこにつける？`
    ],
    formal: [
      "今の気持ちに近い言葉を、一緒に探してみる？",
      "その中で、いちばん守ってあげたい気持ちはどれかな？",
      "ここでは結論を急がなくていいよ。今はどんな温度の言葉がほしい？"
    ]
  };

  return pick(questions[targetCharacter.tone] || questions.warm);
}

function extraListeningPrompts(targetCharacter) {
  const name = callName(targetCharacter);
  return [
    `${name}が満足するまでここにいるよ〜。今は安心がほしい？それとも少し整理したい？`,
    "その気持ち、音にするとため息っぽい？泣きたい感じ？",
    `${name}のペースで大丈夫だよ。今は相づち多め？それとも一緒にほどく感じ？`,
    "その気持ち、手のひらに乗せたら重そう？軽そう？",
    "わしが隣にいるとして、今かけてほしい言葉はどんな温度がいい？"
  ];
}

function endsWithQuestion(text) {
  return /[？?]\s*$/.test(text);
}

function shapeReplyLength(text, targetCharacter) {
  const clean = text.replace(/\s+/g, " ").trim();
  const limit = 175;

  if (clean.length <= limit) {
    return clean;
  }

  const questionMatch = clean.match(/[^。！？?]*[？?]\s*$/);
  const question = questionMatch ? questionMatch[0].trim() : makeFollowUpQuestion(targetCharacter, toneProfiles[targetCharacter.tone] || toneProfiles.warm);
  const room = Math.max(24, limit - question.length - 1);
  const body = clean.slice(0, room).replace(/[、。！？?]*$/, "");
  return `${body}。${question}`;
}

function addMessage(role, text) {
  const row = document.createElement("div");
  row.className = `message-row ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  row.append(bubble);
  messages.append(row);
  messages.scrollTop = messages.scrollHeight;
  return row;
}

function addTyping() {
  const row = document.createElement("div");
  row.className = "message-row bot";

  const bubble = document.createElement("div");
  bubble.className = "bubble typing";
  bubble.setAttribute("aria-label", "入力中");
  bubble.innerHTML = "<span></span><span></span><span></span>";

  row.append(bubble);
  messages.append(row);
  messages.scrollTop = messages.scrollHeight;
  return row;
}

function sendMessage(text) {
  const trimmed = text.trim();

  if (!trimmed) {
    input.focus();
    return;
  }

  addMessage("user", trimmed);
  input.value = "";

  const typing = addTyping();
  window.setTimeout(() => {
    typing.remove();
    const reply = createReply(trimmed);
    addMessage("bot", reply);
    rememberConversation(trimmed, reply);
  }, 420);
}

function rememberConversation(userText, botReply) {
  conversationMemory.push({ userText, botReply });
  conversationMemory = conversationMemory.slice(-6);
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

characterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateCharacterFromForm();
  addMessage(
    "bot",
    `設定、反映したよ〜。${callName(character)}、この感じでゆるっと話してみるね。今の心、色でいうとどんな色っぽい？`
  );
});

resetNeineiButton.addEventListener("click", () => {
  character = { ...defaultCharacter };
  saveCharacter();
  syncForm();
  addMessage("bot", "ねいねい設定に戻したよ〜。大きく深呼吸して、伸びしてみよう〜。今はどんな気分かな？");
});

for (const button of quickButtons) {
  button.addEventListener("click", () => {
    sendMessage(button.dataset.message || "");
  });
}

syncForm();
addMessage(
  "bot",
  `${callName(character)}、こんにちは〜。今日もここに来てくれてえらいね。どうしたの？`
);
