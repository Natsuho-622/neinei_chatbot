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
        question: "今日は、聞いてほしい話がある？それともただ雑談したい？"
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

  return {
    core: pick([
      "うんうん、ちゃんと聞いてるよ〜。",
      "そっか、そういう感じなんだね〜。",
      "なるほどだね。話してくれてありがとう。"
    ]),
    detail: styleDetail({
      listener: `${name}の中で、まだ言葉にしきれてないところがありそうだね。`,
      chatty: "何気ない話に見えても、今の気分がちょっと混ざってる感じがするよ。",
      coach: "今日は解決しなくても満点。まずは形を見つけるだけでいいよ。"
    }),
    question: pick([
      "それを話してみて、今の気持ちは少し変わった？",
      "その話の中で、いちばん残ってる感じはどこ？",
      "わしには、もう少し聞いてほしい？それとも一緒に名前をつけてみる？"
    ])
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
    `${name}が満足するまで聞くよ〜。今は安心がほしい？それとも言葉にしたい？`,
    "まだ言葉になってないところ、音にするとため息っぽい？泣きたい感じ？",
    `${name}のペースで大丈夫だよ。今は近くで聞いてるだけがいい？`,
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
