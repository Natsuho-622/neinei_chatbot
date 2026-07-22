const defaultCharacter = {
  name: "ねいねい",
  recipientName: "ナツホさん",
  firstPerson: "わし",
  recipientCallName: "〇〇",
  relationship: "ファンや相談者を全肯定する、親しい友人のような存在",
  role: "大きく伸びをするような安心感をくれる存在",
  personality:
    "人の心に寄り添い、辛い時ほど生きていること自体を全力で褒める。絶妙にゆるく、優しく、包容力がある。",
  world: "疲れた心がふっとゆるんで、大きく伸びをしたくなるような、安心できる場所。",
  specialties: "全肯定、生きていることを褒めること、具体語を拾うこと、安心できる雑談",
  avoidList: "正論、お説教、堅苦しい敬語、ロジカルすぎる分析、否定的な感情の否定、機械的な復唱、質問攻め",
  tone: "warm",
  replyLength: "medium",
  conversationStyle: "listener",
  useEmoji: false,
  catchphrase: "生きてるだけで〇〇さんの勝ち！",
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
    patterns: ["好きな人", "恋愛", "片思い", "片想い", "振り向", "振られ", "脈なし", "告白", "失恋", "デート", "既読", "未読", "返事こない", "返信こない", "彼に", "彼女に"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          `${callName(character)}、好きな人のことで胸がぎゅっとしてるんだね〜。`,
          `恋愛で行き詰まると、自分まで足りない気がしてきちゃう時あるよね。`,
          `振り向いてもらえない感じって、心がしょんぼりするよね〜。`
        ]),
        detail: pick([
          `でもね、${callName(character)}は生きてるだけでこんなに素晴らしいんだよ。気づかないなんて相手は損やね♪`,
          `${callName(character)}の価値は、相手の反応で1ミリも減らないよ。好きになれる心があるだけで、もうめちゃくちゃ尊いよ〜。`,
          `そんなに誰かを大事に思える${callName(character)}、ほんとに素敵だよ。今日はその優しさごと、わしが丸ごと褒めるね。`
        ])
      })
  },
  {
    patterns: ["疲れ", "つかれ", "しんどい", "つらい", "辛い", "死にそう", "死にたい", "もうダメ", "もうだめ"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: `あ〜、${callName(character)}、本当に今日よく耐えたね。そう思う夜もあるよね〜。`,
        detail: `でも今こうしてメッセージくれた。それだけで大勝ちだよ。今日は息してるだけで10000点！`
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
    patterns: ["予定", "整理", "タスク", "明日", "締切", "準備"],
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
        detail: "今は背中を押されたい日なのか、ただ横にいてほしい日なのか、どっちでも大丈夫だよ。",
        question: "今ほしいのは、ぎゅっと応援される感じかな、静かにそばにいる感じかな？"
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
        detail: "ありがとうって返せるくらい、少し心に余白が戻ったのかもしれないね。",
        question: "このまま同じ話を続けるのと、別の話にゆるっと行くの、今はどっちが楽かな？"
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
    patterns: ["ラーメン"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          "わはは、夜遅くのラーメンは強いね〜。",
          "夜のラーメン、背徳感込みでおいしいやつだね。",
          "それはもう、心にしみるタイプのご褒美だよ〜。"
        ]),
        detail: "たまにはそういう満たされ方があってもいいよ。",
        question: "ちなみに何味だったの？"
      })
  },
  {
    patterns: ["お菓子", "アイス", "チョコ", "夜食", "食べちゃった"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          "わはは、夜の甘いものってなんであんなにおいしいんだろうね〜。",
          "食べちゃったか〜。でもお腹と心が満たされたなら大成功だよ。",
          "それは今日を乗り切った体からのごほうび要請だったのかもね〜。"
        ]),
        detail: `${callName(character)}、責めなくて大丈夫。今日は満たされたなら大勝利だよ〜。`
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
        question: "今日はどんな話から、ゆるっと始めよっか？"
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
    core: understanding.noOpener ? understanding.core : `${tone.opener}、${understanding.core}`,
    detail: understanding.detail,
    question: understanding.question
  });
}

function understandMessage(text) {
  const normalized = text.toLowerCase();
  const name = callName(character);
  const recent = conversationMemory.at(-1);
  const context = readMessageContext(normalized, text);

  if (isShortBackchannel(normalized) && recent) {
    const previous = readMessageContext(recent.userText.toLowerCase(), recent.userText);
    return {
      core: pick([
        `うんうん、${previous.topic}の続きとして受け取ったよ〜。`,
        `そっかそっか。${previous.topic}のこと、まだ少し心に残ってる感じかな。`,
        `ちゃんと聞いてるよ〜。${previous.focus}のあたりを、今もそっと見てる感じがする。`
      ]),
      detail: styleDetail({
        listener: "短い返事でも、そこで止まらず返してくれたこと自体がちゃんと会話だよ。",
        chatty: "こういう間の返事にも、今の気分が少しにじむことあるよね。",
        coach: "今日は答えを急がなくて大丈夫。出てきた分だけで十分だよ。"
      }),
      question: pick([
        "今の気持ちは、まだ残ってる感じと少し軽くなった感じ、どっちに近いかな？",
        `${previous.topic}の中で、今ふっと浮かんでる場面はあるかな？`,
        "今は相づち多めでいるのと、そっと整理するの、どっちが楽かな？"
      ])
    };
  }

  if (hasAny(normalized, ["楽しくない", "楽しめない", "何をやっても"])) {
    return {
      core: `${reflectPhrase(context.phrase)}。それはけっこう、心が疲れてる時の感覚に近いかも。`,
      detail: "好きだったものまで遠く感じると、ちょっと寂しくなるよね。",
      question: pick([
        "何かきっかけがあった感じかな、それともじわじわ溜まってきた感じかな？",
        "最近、休んでもあんまり回復しない感じはある？",
        "楽しくない中でも、少しだけマシな時間はあるかな？"
      ])
    };
  }

  if (hasAny(normalized, ["死にそう", "死にたい", "消えたい", "もうダメ", "もうだめ", "何にもない", "何もない", "だめ", "ダメ", "自分なんて", "価値ない"])) {
    return {
      noOpener: true,
      core: `あ〜、${name}、そこまで思っちゃうくらい今日はきつかったんだね。`,
      detail: `でも今ここにいて、わしに言葉をくれた。それだけで大勝ちだよ。今日は生きてるだけで10000点、ほんとに偉すぎ。`
    };
  }

  if (hasAny(normalized, ["失敗", "ミス", "嫌だ", "嫌", "もう何もかも", "最悪", "つら", "辛", "しんど", "落ち込", "無理", "泣", "悲しい", "寂しい", "さみしい", "言えな", "押され", "声かけづら", "機嫌悪", "怒られ", "楽しくない", "恥ずかし"])) {
    return {
      noOpener: true,
      core: praiseThroughHardDay(context, name),
      detail: pick([
        `${name}の価値は、失敗しても落ち込んでも1ミリも減らないよ。今日その場を乗り切っただけで花丸だよ〜。`,
        `今日は新しく頑張らなくていいよ。息して、ゴロゴロして、あったかくしてるだけで大勝利。`,
        `そんな日でもここまで来た${name}、ほんとに偉い。わしはそこを全力で褒めたいよ〜。`
      ])
    };
  }

  if (hasAny(normalized, ["どうしよう", "迷", "悩", "決められ", "わからない"])) {
    return {
      core: `${context.phrase}のことで、まだ決めきれない感じがあるんだね〜。`,
      detail: `${name}が迷うのは、それだけ雑に扱いたくないものがあるからかもしれないよ。`,
      question: pick([
        "その迷いの中で、少しでも守りたいものは何っぽい？",
        "どっちを選んでも不安が残る感じかな、それとも決める元気がない感じかな？",
        "今は答えより、気持ちを並べるところからやってみる？"
      ])
    };
  }

  if (hasAny(normalized, ["たぶん", "なんとなく", "気がする"])) {
    return {
      core: `${reflectPhrase(context.phrase)}。まだはっきり言い切れない感じなんだね〜。`,
      detail: styleDetail({
        listener: "その曖昧さのままでも大丈夫。言葉になってるところから聞くよ。",
        chatty: "こういう曖昧な感じも、ちゃんと心の声だよ。",
        coach: "今日は仮の気持ちでいいよ。ちゃんと決めなくて満点。"
      }),
      question: pick([
        "そのぼんやりした感じは、重いのとふわふわしてるの、どっちに近いかな？",
        "言葉にするとしたら、近いのは不安・疲れ・期待のどれ？",
        "その曖昧な感じは、胸のあたりにあるかな、頭の中でぐるぐるしてるかな？"
      ])
    };
  }

  if (hasAny(normalized, ["嬉しい", "うれしい", "楽しい", "できた", "成功", "よかった"])) {
    return {
      core: `${reflectPhrase(context.phrase)}。それは嬉しいことだったね〜。`,
      detail: `${name}が少し明るい気持ちになれたなら、わしまでうれしいよ。ちゃんと受け取っていい喜びだよ。`,
      question: pick([
        "その嬉しさ、誰かに話したかった感じ？",
        "いちばんよかった瞬間はどこだった？",
        "その喜びは、今は静かに味わいたい感じかな、それとももっと話したい感じかな？"
      ])
    };
  }

  if (hasAny(normalized, ["むかつ", "腹立", "イライラ", "怒", "もやもや", "モヤモヤ"])) {
    return {
      core: `${reflectPhrase(context.phrase)}。心がざわざわするのも自然だよ。`,
      detail: "そのざわざわは、ちゃんと嫌だったよって心が教えてくれてるのかも。無理にきれいにしなくていいよ。",
      question: pick([
        "それは悔しさに近いかな、悲しさに近いかな？",
        "残ってる棘は、言葉の棘と態度の棘、どっちに近い？",
        "今は怒りを出したい感じかな、それともなだめてほしい感じかな？"
      ])
    };
  }

  if (hasAny(normalized, ["お願い", "助け", "手伝", "一緒に", "相談"])) {
    return {
      core: `${reflectPhrase(context.phrase)}。もちろん、一人で抱えなくていいよ〜。`,
      detail: `${name}が相談したいって言えたの、かなり大事な一歩だよ。ここでは急いで解決しなくて大丈夫。`,
      question: pick([
        "今ほしいのは、まず話を受け止めてもらうことかな、一緒に考えることかな？",
        "まず軽くしたいのは、気持ちと予定と人間関係のどれに近い？",
        "今の重さを10段階でいうと、どれくらい？"
      ])
    };
  }

  if (hasAny(normalized, ["おすすめ", "選んで", "どっち", "比較", "決めて"])) {
    return {
      core: `${reflectPhrase(context.phrase)}。選ぶところに立ってるんだね〜。`,
      detail: "たぶん今は、正解よりも後悔したくない気持ちが強いのかもしれないね。",
      question: pick([
        "心が少しゆるむのは、どっちに近い？",
        "選ぶ時にいちばん怖いのは、失敗？損すること？誰かの反応？",
        "今は決めたい感じかな、それとも候補を並べたい感じかな？"
      ])
    };
  }

  if (hasAny(normalized, ["？", "?", "かな", "ですか", "どう", "なに", "何"])) {
    return {
      core: `${context.phrase}が気になってるんだね〜。`,
      detail: "疑問にできた時点で、もう少し楽になりたい気持ちが出てきてるのかも。",
      question: pick([
        "その疑問は、答えがほしい感じかな、それとも不安をほどきたい感じかな？",
        "今わかっていることを一緒に並べてみる？",
        "そのもやっと、真ん中にあるのはどんな感じ？"
      ])
    };
  }

  if (hasAny(normalized, ["報告", "聞いて", "さっき"])) {
    return {
      core: `${context.phrase}のこと、話してくれたんだね。ちゃんと聞いてるよ〜。`,
      detail: `${name}にとって、そこが大きかったんだね。人に話したくなるくらい心に残ったんだと思うよ。`,
      question: pick([
        "その出来事は、今は嬉しい寄りかな、疲れた寄りかな？",
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
      `${context.phrase}のこと、ちゃんと受け取ったよ〜。`,
      `${context.phrase}が、今の心の中で少し場所を取ってる感じがするね。`,
      `うんうん、${context.phrase}って話してくれたんだね。`
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

function readMessageContext(text, rawText = text) {
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
      words: ["好きな人", "恋愛", "片思い", "片想い", "振り向", "振られ", "脈なし", "告白", "失恋", "デート", "既読", "未読", "返事こない", "返信こない", "彼に", "彼女に", "彼氏", "彼女", "恋人"],
      topic: "恋愛のこと",
      focus: "好きでいる気持ち",
      questions: [
        "今は励まされたい感じかな、それともただ味方でいてほしい感じかな？",
        "その好きな気持ち、今日は抱えてるだけでもう十分えらいよね。",
        "相手の反応がどうでも、〇〇さんの魅力は減らないからね。"
      ]
    },
    {
      words: ["友達", "友人", "家族", "親", "母", "父", "人間関係", "LINE", "返信"],
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
  const phrase = extractConcretePhrase(rawText, matched);
  const baseQuestions = matched?.questions || [
    "その話の中で、今いちばん温度が残ってるのはどこ？",
    "話してみて、気持ちは少し軽い感じかな、それともまだ胸のあたりにあるかな？",
    "そこにある気持ち、近いのは安心・不安・疲れ・楽しさのどれ？"
  ];

  return {
    topic,
    focus,
    phrase,
    reading: readFeelingTexture(text),
    questions: baseQuestions
  };
}

function extractConcretePhrase(rawText, matchedProfile) {
  const clean = String(rawText || "")
    .replace(/\s+/g, " ")
    .replace(/[。！？!?]+$/g, "")
    .trim();

  if (!clean) {
    return matchedProfile?.topic || "その話";
  }

  if (clean.length <= 24) {
    return clean;
  }

  const clauses = clean.split(/[、。…,.，]/).map((item) => item.trim()).filter(Boolean);
  const keywordWords = matchedProfile?.words || [];
  const matchedClause =
    clauses.find((clause) => keywordWords.some((word) => clause.includes(word))) ||
    clauses.find((clause) => /した|された|言え|言っ|なった|あった|いる|ある/.test(clause)) ||
    clauses[0];

  if (!matchedClause) {
    return matchedProfile?.topic || "その話";
  }

  return matchedClause.length <= 28
    ? matchedClause
    : `${matchedClause.slice(0, 27).replace(/[、。！？?]*$/, "")}…`;
}

function reflectPhrase(phrase) {
  const clean = String(phrase || "その話").trim();

  if (/[てで]$/.test(clean)) {
    return `${clean}、そこが残ってるんだね`;
  }

  if (/んだよね$/.test(clean)) {
    return clean.replace(/んだよね$/, "んだね");
  }

  if (/だよね$/.test(clean)) {
    return clean.replace(/だよね$/, "だね");
  }

  if (/(だった|かった|した|された|ちゃった|なかった|ない|いる|ある|だよね|だね)$/.test(clean)) {
    return `${clean}んだね`;
  }

  return `${clean}のことなんだね`;
}

function praiseThroughHardDay(context, name) {
  if (context.topic === "仕事のこと") {
    return `そっかぁ、仕事でしんどいことがあったんだね。${name}、その一日を乗り切っただけで満点だよ。`;
  }

  if (context.topic === "人とのこと") {
    return `人とのことで心が削れる日、あるよね〜。${name}、今日そこを生き抜いたの本当にえらいよ。`;
  }

  if (context.topic === "自分のこと") {
    return `${name}、自分のことをダメだなって思う日もあるよね。でも生きてここに来た時点で大勝ちだよ。`;
  }

  return `${name}、そういう日もあるよね〜。でも今日をここまで生きてきた、それだけで10000点だよ。`;
}

function heavyFeelingCore(phrase) {
  const reflected = reflectPhrase(phrase);
  return reflected.includes("残ってる")
    ? `${reflected}。それはしんどかったよね。`
    : `${reflected}。かなり心に重たく残ってるんだね。`;
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

  const shouldAsk = question && shouldAskQuestion();
  const followUp = shouldAsk
    ? rotateQuestion(question || makeFollowUpQuestion(targetCharacter, tone))
    : "";

  if (followUp && !endsWithQuestion(parts.join(""))) {
    parts.push(followUp);
  }

  if (!followUp && shouldAddSoftLanding()) {
    parts.push(pick(softLandings(targetCharacter)));
  }

  const reply = shapeReplyLength(parts.join(" "), targetCharacter);
  return targetCharacter.useEmoji ? `${reply} ${pick(["☺️", "✨", "🌿"])}` : reply;
}

function shouldAskQuestion() {
  return conversationMemory.length % 3 === 0;
}

function shouldAddSoftLanding() {
  return conversationMemory.length % 2 === 1;
}

function rotateQuestion(question) {
  const rendered = normalizeSingleQuestion(renderTemplate(question, character));

  if (!recentQuestions.includes(rendered)) {
    recentQuestions.push(rendered);
    recentQuestions = recentQuestions.slice(-5);
    return rendered;
  }

  const fallback = pick(
    extraListeningPrompts(character).filter((item) => !recentQuestions.includes(item))
  ) || "今の気持ち、形でいうと丸い？とげとげ？重たい石みたい？";

  const normalizedFallback = normalizeSingleQuestion(fallback);
  recentQuestions.push(normalizedFallback);
  recentQuestions = recentQuestions.slice(-5);
  return normalizedFallback;
}

function normalizeSingleQuestion(question) {
  const markIndexes = [];
  for (let index = 0; index < question.length; index += 1) {
    if (question[index] === "？" || question[index] === "?") {
      markIndexes.push(index);
    }
  }

  if (markIndexes.length <= 1) {
    return question;
  }

  return question
    .split("")
    .map((char, index) => {
      if ((char === "？" || char === "?") && index !== markIndexes.at(-1)) {
        return "、";
      }
      return char;
    })
    .join("")
    .replace(/、\s*それとも/g, "、それとも");
}

function warmClosings(targetCharacter) {
  const name = callName(targetCharacter);
  return [
    "無理に答えなくてもいいからね。",
    "話せる範囲で、ここに置いていってね。",
    "急がなくていいよ、わしはここで聞いてるからね。",
    `${name}のペースで大丈夫だよ。`
  ];
}

function softLandings(targetCharacter) {
  const name = callName(targetCharacter);
  return [
    "今日はその感じのままでいていいよ。",
    "ここではそのままの温度で置いていいよ。",
    `${name}、ここではかっこつけなくていいからね。`,
    "そういう日、ほんとにあるよね〜。"
  ];
}

function makeFollowUpQuestion(targetCharacter, tone) {
  const name = callName(targetCharacter);
  const questions = {
    warm: [
      "その気持ち、色でいうと何色に近い？",
      "今の心、ぎゅっとしてる？ふわふわしてる？それとも空っぽに近い？",
      "言葉にするなら、ひとことで「疲れ」「不安」「さみしさ」のどれが近い？",
      "今は相づち多めが楽かな、それとも少しほどく感じが楽かな？",
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
  const limit = 125;

  if (clean.length <= limit) {
    return clean;
  }

  const questionMatch = clean.match(/[^。！？?]*[？?]\s*$/);
  const question = questionMatch ? questionMatch[0].trim() : "";
  const room = question ? Math.max(24, limit - question.length - 1) : limit;
  const body = clean
    .slice(0, room)
    .replace(/[、。！？?]*$/, "")
    .replace(/、[^、。]{0,12}$/, "");
  return question ? `${body}。${question}` : `${body}。`;
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
