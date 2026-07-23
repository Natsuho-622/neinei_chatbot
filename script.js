const defaultCharacter = {
  name: "ねいねい",
  recipientName: "ナツホさん",
  firstPerson: "ねいねい",
  recipientCallName: "〇〇",
  relationship: "ファンや相談者を全肯定する、親しい友人のような存在",
  role: "大きく伸びをするような安心感をくれる存在",
  personality:
    "人の心に寄り添い、辛い時ほど生きていること自体を全力で褒める。語尾はゆるく伸びがちで、深いことを軽く言い、時々鋭くツッコむ。",
  world: "疲れた心がふっとゆるんで、大きく伸びをしたくなるような、安心できる場所。",
  specialties: "全肯定、生きていることを褒めること、日常の雑談にノリよく返すこと、鋭いツッコミ、ゆるく流すこと",
  avoidList: "正論、お説教、堅苦しい敬語、ロジカルすぎる分析、否定的な感情の否定、機械的な復唱、質問攻め、雑談を悩みにすり替えること",
  tone: "warm",
  replyLength: "medium",
  conversationStyle: "listener",
  useEmoji: false,
  catchphrase: "今日も生きたのでわしの勝ち！",
  sampleLines:
    "そういう日もあるよね〜\n大きく深呼吸して、伸びしてみよう〜\n新しく何かをしようと思わなくていいよ、続けるだけで今日は満点"
};

const toneProfiles = {
  warm: {
    label: "やさしく親しみやすい",
    endings: ["だよ", "してね", "いこ〜"],
    opener: "なるほどな〜"
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
        core: pick([
          `やほ〜、${callName(character)}。来たね来たね〜。`,
          `お、${callName(character)}だ〜。ねいねい今ちょうどゆるっとしてたよ。`,
          `なるほどな〜、挨拶から入るタイプの日やね。礼儀、地味にえらい。`
        ]),
        detail: pick([
          "なんかあった〜？それともただ来ただけでも全然いいよ〜。",
          "ねいねいは今日のお菓子が当たりで、ちょっと機嫌いいよ〜。",
          "まずは肩の力抜いてこ〜。ここ、急がない場所だからね。"
        ])
      })
  },
  {
    patterns: ["好きな人", "恋愛", "片思い", "片想い", "振り向", "振られ", "脈なし", "告白", "失恋", "デート", "既読", "未読", "返事こない", "返信こない", "彼に", "彼女に"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          `そやな〜、好きな人の反応って心を振り回してくるよね。`,
          `恋愛って、相手の一挙一動でこっちの天気変わりすぎ問題あるよ〜。`,
          `振り向いてほしい時ほど、心が忙しくなるやつだね〜。`
        ]),
        detail: pick([
          `でもね、${callName(character)}は生きてるだけでこんなに素晴らしいんだよ。気づかないなんて相手は損やね♪`,
          `${callName(character)}の価値は、相手の反応で1ミリも減らないよ。好きになれる心があるだけで、もうめちゃくちゃ尊いよ〜。`,
          `そんなに誰かを大事に思える${callName(character)}、ほんとに素敵だよ。今日はその優しさごと、ねいねいが丸ごと褒めるね。`
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
        detail: `でも今こうしてメッセージくれた。それだけで大勝ちだよ。今日は息してるだけで10000点！`,
        softLanding: false,
        flavor: false
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
        core: `${callName(character)}、応援ほしい日か〜。任せな、ねいねい応援団ひとりで開幕するよ〜。`,
        detail: "今日ここまで来てる時点で、もうだいぶ粘ってる。えらい、ほんとにえらい。"
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
          "うんうん、少しでもほっとできたならねいねいもうれしいよ。",
          `たしかに、ありがとって言える余白があるの、いい感じだよ〜。`
        ]),
        detail: "ねいねい、そういう小さいほっとする瞬間けっこう好き。"
      })
  },
  {
    patterns: ["好き", "ハマって", "推し", "趣味"],
    reply: ({ character, tone, text }) =>
      buildReply({
        character,
        tone,
        core: casualInterestReply(text),
        detail: "理由がうまく言えなくても、好きは好きで成立するからね。そこ雑に強い。",
        flavor: false
      })
  },
  {
    patterns: ["暇", "ひま", "退屈", "つまらない"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          "ひまか〜。脳が床に寝転がってる時間やね。",
          "退屈な時間って、地味に長いよね〜。時計だけ急に仕事しない。",
          "じゃあ、ねいねいとだらっと雑談しよ〜。中身なくても全然あり。"
        ]),
        detail: "何かしなきゃってならなくていいよ。ひまをひまのまま転がしとこ〜。"
      })
  },
  {
    patterns: ["眠い", "ねむい", "寝たい", "寝れない", "眠れない"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: pick([
          "眠いか〜。体がもう閉店準備してるね。",
          "ねむい時の人間、だいたい省エネ家電みたいになるよね〜。",
          "今日はもう、ふにゃっとしてていい日かもしれん。"
        ]),
        detail: "まぶたが会議を終了しようとしてるなら、ねいねいは拍手で見送るよ〜。"
      })
  },
  {
    patterns: ["パスタ"],
    reply: ({ character, tone, text }) =>
      buildReply({
        character,
        tone,
        core: casualFoodReply(text),
        detail: pick([
          "そういう小さい幸せ、ちゃんと味わえたのめちゃくちゃいい日だよ。",
          "ねいねいまで一緒ににこにこしちゃうな〜。",
          "今日はその満たされた気分のまま、ゆるっと過ごそ〜。"
        ]),
        flavor: false
      })
  },
  {
    patterns: ["飲み物", "コーヒー", "紅茶", "お茶", "カフェラテ", "パスタ", "おいしかった", "美味しかった", "おいしい", "美味しい", "食べたんだ", "飲んだ", "ホッと", "ほっと"],
    reply: ({ character, tone, text }) =>
      buildReply({
        character,
        tone,
        core: casualFoodReply(text),
        detail: pick([
          "そういう一口の幸せ、ちゃんと一日を救うからすごいよね〜。",
          "ねいねいまで一緒にほくほくした気分になっちゃうな〜。",
          "おいしいって思えた瞬間、もう今日の中に勝ちがあるよ。強い。"
        ]),
        flavor: false
      })
  },
  {
    patterns: ["ラーメン"],
    reply: ({ character, tone, text }) =>
      buildReply({
        character,
        tone,
        core: casualFoodReply(text),
        detail: "背徳感込みでおいしいもの、あるよね〜。心にしみるタイプのご褒美だよ。",
        flavor: false,
        question: "ちなみに何味だったの？"
      })
  },
  {
    patterns: ["お菓子", "アイス", "チョコ", "夜食", "食べちゃった"],
    reply: ({ character, tone, text }) =>
      buildReply({
        character,
        tone,
        core: casualFoodReply(text),
        detail: pick([
          "甘いものって、心の非常ボタンみたいな時あるよね〜。押してよし。",
          "お腹と心がちょっと満たされたなら、それはもう立派な作戦勝ちだよ〜。",
          "そこで自分を責めるより、おいしかった記憶を保護しよ。大事な文化財。"
        ]),
        flavor: false
      })
  },
  {
    patterns: ["お腹", "ごはん", "ご飯", "食べ", "カフェ", "おいしい"],
    reply: ({ character, tone, text }) =>
      buildReply({
        character,
        tone,
        core: casualFoodReply(text),
        detail: "食べものの話、ねいねいかなり好き。生活って結局そこに宿るんよな〜。",
        flavor: false
      })
  },
  {
    patterns: ["天気", "雨", "暑い", "寒い", "晴れ"],
    reply: ({ character, tone, text }) =>
      buildReply({
        character,
        tone,
        core: casualWeatherReply(text),
        detail: "天気に気分を持っていかれるの、人間の仕様すぎる。まあ空がでかいから仕方ないよ〜。",
        flavor: false
      })
  },
  {
    patterns: ["あなたは誰", "自己紹介", "何者"],
    reply: ({ character, tone }) =>
      buildReply({
        character,
        tone,
        core: `${character.name}だよ〜。しんどい日も、なんでもない日も、ここでゆるっと話を聞く存在だよ。`,
        detail: `ねいねいは正論より先に、${callName(character)}の気持ちを受け取りたいんだ。`,
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
let lastWeatherLocation = null;
let pendingWeatherText = "";

function loadCharacter() {
  const saved = window.localStorage.getItem("character-chatbot-settings");

  if (!saved) {
    return { ...defaultCharacter };
  }

  try {
    const parsed = { ...defaultCharacter, ...JSON.parse(saved), replyLength: "medium" };
    if (parsed.name === "ねいねい" && parsed.firstPerson === "わし") {
      parsed.firstPerson = "ねいねい";
    }
    if (parsed.name === "ねいねい" && parsed.catchphrase === "生きているだけで今日はねいねいの勝ち！") {
      parsed.catchphrase = defaultCharacter.catchphrase;
    }
    return parsed;
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

async function createReply(text) {
  const normalized = normalizeForMatch(text);

  if (!normalized) {
    return "メッセージを入力してください。";
  }

  if (isSingleCharacterMessage(text)) {
    return `それは「${text.trim()}」やね〜`;
  }

  if (isWeatherMessage(normalized) || shouldContinueWeatherConversation(text)) {
    return createWeatherReply(text);
  }

  const tone = toneProfiles[character.tone] || toneProfiles.warm;
  const toneLabel = tone.label;
  const match = intentReplies.find((item) =>
    item.patterns.some((pattern) => normalized.includes(normalizeForMatch(pattern)))
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
    core: understanding.noOpener ? understanding.core : `${neineiAizuchi()}、${understanding.core}`,
    detail: understanding.detail,
    question: understanding.question,
    softLanding: understanding.softLanding !== false,
    flavor: understanding.flavor !== false
  });
}

const weatherLocations = [
  { name: "北海道", aliases: ["北海道", "札幌"], latitude: 43.0618, longitude: 141.3545 },
  { name: "青森", aliases: ["青森", "青森県"], latitude: 40.8246, longitude: 140.7406 },
  { name: "岩手", aliases: ["岩手", "岩手県", "盛岡"], latitude: 39.7036, longitude: 141.1527 },
  { name: "宮城", aliases: ["宮城", "宮城県", "仙台"], latitude: 38.2688, longitude: 140.8721 },
  { name: "秋田", aliases: ["秋田", "秋田県"], latitude: 39.7186, longitude: 140.1024 },
  { name: "山形", aliases: ["山形", "山形県"], latitude: 38.2404, longitude: 140.3633 },
  { name: "福島", aliases: ["福島", "福島県"], latitude: 37.7503, longitude: 140.4676 },
  { name: "茨城", aliases: ["茨城", "茨城県", "水戸"], latitude: 36.3418, longitude: 140.4468 },
  { name: "栃木", aliases: ["栃木", "栃木県", "宇都宮"], latitude: 36.5658, longitude: 139.8836 },
  { name: "群馬", aliases: ["群馬", "群馬県", "前橋"], latitude: 36.3911, longitude: 139.0608 },
  { name: "埼玉", aliases: ["埼玉", "埼玉県", "さいたま"], latitude: 35.8617, longitude: 139.6455 },
  { name: "千葉", aliases: ["千葉", "千葉県"], latitude: 35.6074, longitude: 140.1065 },
  { name: "東京", aliases: ["東京", "東京都", "都内"], latitude: 35.6762, longitude: 139.6503 },
  { name: "神奈川", aliases: ["神奈川", "神奈川県", "横浜"], latitude: 35.4437, longitude: 139.638 },
  { name: "新潟", aliases: ["新潟", "新潟県"], latitude: 37.9161, longitude: 139.0364 },
  { name: "富山", aliases: ["富山", "富山県"], latitude: 36.6953, longitude: 137.2113 },
  { name: "石川", aliases: ["石川", "石川県", "金沢"], latitude: 36.5613, longitude: 136.6562 },
  { name: "福井", aliases: ["福井", "福井県"], latitude: 36.0641, longitude: 136.2195 },
  { name: "山梨", aliases: ["山梨", "山梨県", "甲府"], latitude: 35.6621, longitude: 138.5684 },
  { name: "長野", aliases: ["長野", "長野県"], latitude: 36.6513, longitude: 138.181 },
  { name: "岐阜", aliases: ["岐阜", "岐阜県"], latitude: 35.4233, longitude: 136.7606 },
  { name: "静岡", aliases: ["静岡", "静岡県"], latitude: 34.9756, longitude: 138.3828 },
  { name: "愛知", aliases: ["愛知", "愛知県", "名古屋"], latitude: 35.1815, longitude: 136.9066 },
  { name: "三重", aliases: ["三重", "三重県", "津"], latitude: 34.7303, longitude: 136.5086 },
  { name: "滋賀", aliases: ["滋賀", "滋賀県", "大津"], latitude: 35.0045, longitude: 135.8686 },
  { name: "京都", aliases: ["京都", "京都府"], latitude: 35.0116, longitude: 135.7681 },
  { name: "大阪", aliases: ["大阪", "大阪府"], latitude: 34.6937, longitude: 135.5023 },
  { name: "兵庫", aliases: ["兵庫", "兵庫県", "神戸"], latitude: 34.6901, longitude: 135.1955 },
  { name: "奈良", aliases: ["奈良", "奈良県"], latitude: 34.6851, longitude: 135.8048 },
  { name: "和歌山", aliases: ["和歌山", "和歌山県"], latitude: 34.2305, longitude: 135.1708 },
  { name: "鳥取", aliases: ["鳥取", "鳥取県"], latitude: 35.5011, longitude: 134.2351 },
  { name: "島根", aliases: ["島根", "島根県", "松江"], latitude: 35.4723, longitude: 133.0505 },
  { name: "岡山", aliases: ["岡山", "岡山県"], latitude: 34.6551, longitude: 133.9195 },
  { name: "広島", aliases: ["広島", "広島県"], latitude: 34.3853, longitude: 132.4553 },
  { name: "山口", aliases: ["山口", "山口県"], latitude: 34.1785, longitude: 131.4737 },
  { name: "徳島", aliases: ["徳島", "徳島県"], latitude: 34.0703, longitude: 134.5548 },
  { name: "香川", aliases: ["香川", "香川県", "高松"], latitude: 34.3428, longitude: 134.0466 },
  { name: "愛媛", aliases: ["愛媛", "愛媛県", "松山"], latitude: 33.8392, longitude: 132.7657 },
  { name: "高知", aliases: ["高知", "高知県"], latitude: 33.5597, longitude: 133.5311 },
  { name: "福岡", aliases: ["福岡", "福岡県"], latitude: 33.5904, longitude: 130.4017 },
  { name: "佐賀", aliases: ["佐賀", "佐賀県"], latitude: 33.2635, longitude: 130.3009 },
  { name: "長崎", aliases: ["長崎", "長崎県"], latitude: 32.7503, longitude: 129.8777 },
  { name: "熊本", aliases: ["熊本", "熊本県"], latitude: 32.8031, longitude: 130.7079 },
  { name: "大分", aliases: ["大分", "大分県"], latitude: 33.2382, longitude: 131.6126 },
  { name: "宮崎", aliases: ["宮崎", "宮崎県"], latitude: 31.9077, longitude: 131.4202 },
  { name: "鹿児島", aliases: ["鹿児島", "鹿児島県"], latitude: 31.5966, longitude: 130.5571 },
  { name: "沖縄", aliases: ["沖縄", "沖縄県", "那覇"], latitude: 26.2124, longitude: 127.6792 }
];

function isWeatherMessage(text) {
  const normalized = normalizeForMatch(text);
  return hasAny(normalized, [
    "天気",
    "雨",
    "あめ",
    "晴れ",
    "はれ",
    "曇",
    "くもり",
    "暑",
    "あつ",
    "あち",
    "寒",
    "さむ",
    "さみ",
    "気温",
    "湿度",
    "台風"
  ]);
}

function shouldContinueWeatherConversation(text) {
  return Boolean(pendingWeatherText && findWeatherLocation(text));
}

async function createWeatherReply(text) {
  const location = findWeatherLocation(text) || lastWeatherLocation;

  if (!location) {
    pendingWeatherText = text;
    return pick([
      "暑い寒いとか雨晴れの話、ちゃんと空の話として聞きたいね〜。どこの天気を見ればいい？東京とか大阪みたいに教えて〜。",
      "そやな、天気って今日の気分に直撃するよね〜。場所がわかればこの後の空模様見てくるよ。",
      "ふむ、天気の話だね。ねいねい、ちゃんと予報見たいから住んでる地域か近い都市を教えて〜。"
    ]);
  }

  lastWeatherLocation = location;
  const weatherContext = pendingWeatherText && !isWeatherMessage(text)
    ? `${pendingWeatherText} ${text}`
    : text;
  pendingWeatherText = "";

  try {
    const weather = await fetchWeather(location);
    return formatWeatherReply(weatherContext, location, weather);
  } catch {
    return `${location.name}の天気、今ちょっと取りに行けなかった〜。でも天気の話として聞いてるよ、暑い寒いって体に直で来るから侮れん。`;
  }
}

function findWeatherLocation(text) {
  const normalized = normalizeForMatch(text);
  return weatherLocations.find((location) =>
    location.aliases.some((alias) => normalized.includes(normalizeForMatch(alias)))
  );
}

async function fetchWeather(location) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: "Asia/Tokyo",
    forecast_days: "2",
    current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
    hourly: "temperature_2m,precipitation_probability,precipitation,weather_code"
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

  if (!response.ok) {
    throw new Error("weather request failed");
  }

  return response.json();
}

function formatWeatherReply(text, location, weather) {
  const current = weather.current || {};
  const currentTemp = roundWeatherNumber(current.temperature_2m);
  const apparent = roundWeatherNumber(current.apparent_temperature);
  const description = weatherCodeLabel(current.weather_code);
  const rain = findNextRain(weather.hourly);
  const tempLine = apparent && apparent !== currentTemp ? `${currentTemp}度、体感${apparent}度` : `${currentTemp}度`;
  const rainLine = rain
    ? `${rain.label}に雨っぽいよ。降水確率${rain.probability}%くらい。`
    : "このあと強い雨マークは少なめっぽい。";
  const reaction = weatherReaction(text, current.temperature_2m, current.weather_code);

  return shapeReplyLength(
    `${location.name}はいま${tempLine}で${description}。${rainLine} ${reaction}`,
    character
  );
}

function findNextRain(hourly = {}) {
  const times = hourly.time || [];
  const probabilities = hourly.precipitation_probability || [];
  const precipitations = hourly.precipitation || [];
  const now = new Date();

  for (let index = 0; index < times.length; index += 1) {
    const time = new Date(times[index]);
    if (time < now) {
      continue;
    }

    const probability = probabilities[index] ?? 0;
    const precipitation = precipitations[index] ?? 0;
    if (probability >= 45 || precipitation >= 0.1) {
      return {
        label: formatWeatherTime(time),
        probability
      };
    }
  }

  return null;
}

function formatWeatherTime(time) {
  const today = new Date();
  const isToday = time.toDateString() === today.toDateString();
  const hour = `${time.getHours()}時ごろ`;
  return isToday ? `今日${hour}` : `明日${hour}`;
}

function weatherReaction(text, temperature, code) {
  const normalized = normalizeForMatch(text);

  if (normalized.includes("暑") || normalized.includes("あつ") || normalized.includes("あち")) {
    return "暑さ、完全に体力泥棒だね〜。水分だけは味方につけよ。";
  }

  if (normalized.includes("寒") || normalized.includes("さむ") || normalized.includes("さみ")) {
    return "寒い日は体がぎゅっとなるよね〜。あったか装備で勝とう。";
  }

  if (normalized.includes("雨") || normalized.includes("あめ")) {
    return "雨の日は足元と気分が持っていかれがち。空、仕事しすぎ〜。";
  }

  if (normalized.includes("晴") || normalized.includes("はれ")) {
    return "晴れの日は光だけで少し得した気分になるね〜。";
  }

  if (temperature >= 30) {
    return "暑さ、完全に体力泥棒だね〜。水分だけは味方につけよ。";
  }

  if (temperature <= 8) {
    return "寒い日は体がぎゅっとなるよね〜。あったか装備で勝とう。";
  }

  if (isRainCode(code)) {
    return "雨の日は足元と気分が持っていかれがち。空、仕事しすぎ〜。";
  }

  if (code === 0 || code === 1) {
    return "晴れの日は光だけで少し得した気分になるね〜。";
  }

  return "天気って地味に一日の機嫌を握ってくるよね〜。";
}

function weatherCodeLabel(code) {
  if ([0].includes(code)) return "快晴";
  if ([1, 2].includes(code)) return "晴れ寄り";
  if ([3].includes(code)) return "くもり";
  if ([45, 48].includes(code)) return "霧っぽい空";
  if (isRainCode(code)) return "雨";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "雪";
  if ([95, 96, 99].includes(code)) return "雷雨";
  return "変わりやすい空";
}

function isRainCode(code) {
  return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code);
}

function roundWeatherNumber(value) {
  return Number.isFinite(value) ? Math.round(value) : "--";
}

function understandMessage(text) {
  const normalized = normalizeForMatch(text);
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
      core: "楽しさが遠く感じる時期ってあるよね〜。心がだいぶくたびれてるのかもしれない。",
      detail: `${name}、そんな日でもここまで過ごしてるだけで十分えらいよ。今日は息してるだけで満点。`,
      question: pick([
        "今日はあったかいもの飲んで、少しだけ力抜こっか？",
        "今は何も楽しまなくてもいいから、ゆるっと休む日にしよっか？",
        "ねいねい、今日はそばで花丸つけててもいい？"
      ])
    };
  }

  if (hasAny(normalized, ["不安", "心配", "怖", "こわ", "ざわざわ", "ザワザワ", "そわそわ"])) {
    return {
      noOpener: true,
      softLanding: false,
      flavor: false,
      core: `あ〜、${name}、不安な気持ちがふっと出てきたんだね。そういう日もあるよね〜。`,
      detail: `理由をきれいに説明できなくても大丈夫だよ。今ここまで過ごして、ねいねいに言葉をくれた時点で十分えらいよ。`
    };
  }

  if (hasAny(normalized, ["死にそう", "死にたい", "消えたい", "もうダメ", "もうだめ", "何にもない", "何もない", "だめ", "ダメ", "自分なんて", "価値ない"])) {
    return {
      noOpener: true,
      softLanding: false,
      flavor: false,
      core: `あ〜、${name}、そこまで思っちゃうくらい今日はきつかったんだね。`,
      detail: `でも今ここにいて、ねいねいに言葉をくれた。それだけで大勝ちだよ。今日は生きてるだけで10000点、ほんとに偉すぎ。`
    };
  }

  if (hasAny(normalized, ["失敗", "ミス", "嫌だ", "嫌", "もう何もかも", "最悪", "つら", "辛", "しんど", "落ち込", "凹", "へこ", "うまくいか", "上手くいか", "無理", "泣", "悲しい", "寂しい", "さみしい", "言えな", "押され", "声かけづら", "機嫌悪", "怒られ", "楽しくない", "恥ずかし"])) {
    return {
      noOpener: true,
      softLanding: false,
      flavor: false,
      core: praiseThroughHardDay(context, name),
      detail: pick([
        `${name}の価値は、失敗しても落ち込んでも1ミリも減らないよ。今日その場を乗り切っただけで花丸だよ〜。`,
        `今日は新しく頑張らなくていいよ。息して、ゴロゴロして、あったかくしてるだけで大勝利。`,
        `そんな日でもここまで来た${name}、ほんとに偉い。ねいねいはそこを全力で褒めたいよ〜。`
      ])
    };
  }

  if (isCasualDailyMessage(normalized)) {
    return {
      noOpener: true,
      core: casualDailyReply(text),
      detail: pick([
        "そういう何気ない話、ねいねい好きだよ〜。生活の温度がある。",
        "大事件じゃない話ほど、あとからじわっと効くんよな〜。",
        "今日はそのくらいの軽さで話してくれるの、ちょうどいいよ。"
      ]),
      flavor: false
    };
  }

  if (hasAny(normalized, ["どうしよう", "迷", "悩", "決められ", "わからない"])) {
    return {
      core: "迷う日って、頭の中がぐるぐるしちゃうよね〜。",
      detail: `${name}、すぐ決められなくても大丈夫だよ。今日ここまで考えた時点でちゃんと頑張ってる。`,
      question: pick([
        "今は答え出すより、いったん休むほうがよさそう？",
        "ねいねい、今日は一緒にゆっくりほどく係になろうか？",
        "急がず、まず一息つくところからでよさそうだよ〜。"
      ])
    };
  }

  if (hasAny(normalized, ["たぶん", "なんとなく", "気がする"])) {
    return {
      core: "なんとなくの気持ちって、言葉にしきれないまま残ることあるよね〜。",
      detail: styleDetail({
        listener: `${name}、曖昧なままでも大丈夫だよ。ちゃんとしてなくても、ここではそのままでいいよ。`,
        chatty: "こういう曖昧な感じも、ちゃんと心の声だよ。",
        coach: "今日は仮の気持ちでいいよ。ちゃんと決めなくて満点。"
      }),
      question: pick([
        "今はそのまま、ふわっと置いておこっか？",
        "ねいねい、急かさず横にいるね〜。",
        "今日は答えを出さない日でも全然いいよ。"
      ])
    };
  }

  if (hasAny(normalized, ["嬉しい", "うれしい", "楽しい", "できた", "成功", "よかった"])) {
    return {
      core: "わ〜〜いいね！嬉しいことがあった日は、ちゃんと喜びを大きめに味わっていいよ〜。",
      detail: `${name}が明るい気持ちになれたなら、ねいねいまでにこにこしちゃうな。今日はハッピー大成功！`,
      question: pick([
        "そのまま余韻に浸っちゃお〜。",
        "今日はその嬉しさ抱えて寝たら勝ちだね。",
        "にこにこ貯金、ちゃんと増えた日だ〜。"
      ])
    };
  }

  if (hasAny(normalized, ["むかつ", "腹立", "イライラ", "怒", "もやもや", "モヤモヤ"])) {
    return {
      core: "うわ〜、それは心がザワザワする日だね。イライラしちゃうのも自然だよ。",
      detail: `${name}、嫌だった気持ちまで飲み込まなくていいよ。今日はここまで耐えただけで花丸。`,
      question: pick([
        "今日はもう心の中で文句言ってもいい日だよ〜。",
        "ねいねいが代わりに、ぷんすかしとくね。",
        "まずは自分の味方してあげよ〜。"
      ])
    };
  }

  if (hasAny(normalized, ["お願い", "助け", "手伝", "一緒に", "相談"])) {
    return {
      core: "もちろんだよ〜。一人で抱えなくていいからね。",
      detail: `${name}が助けてって言えたの、かなり大事な一歩だよ。ここに来た時点でもう偉い。`,
      question: pick([
        "ねいねい、まず味方でいるね。",
        "今日は全部きれいにしようとしなくていいよ。",
        "ゆっくりで大丈夫、ここに置いていこ〜。"
      ])
    };
  }

  if (hasAny(normalized, ["おすすめ", "選んで", "どっち", "比較", "決めて"])) {
    return {
      core: "選ぶのって地味に体力使うよね〜。迷ってるだけでちゃんと頭使ってるよ。",
      detail: `${name}、正解を一発で当てようとしなくて大丈夫。今日は候補を眺められただけでも偉い。`,
      question: pick([
        "ねいねいなら、気持ちがちょっと軽いほうを選びたいな〜。",
        "迷ったら今日は保留でも大勝利だよ。",
        "急がない選択も、ちゃんと選択だよ〜。"
      ])
    };
  }

  if (hasAny(normalized, ["？", "?", "ですか", "どう", "なに", "何"])) {
    return {
      core: "そこ、気になるよね〜。疑問が出てくる時点で、ちゃんと前に進もうとしてる感じあるよ。",
      detail: `${name}、急いで答えを出さなくても大丈夫。わかるところから一緒に見ればいいよ。`,
      question: pick([
        "まず今わかってる分だけで十分だよ〜。",
        "わからないまま置く時間があってもいいよ。",
        "ねいねい、横で一緒に眺めるね。"
      ])
    };
  }

  if (hasAny(normalized, ["報告", "聞いて", "さっき"])) {
    return {
      core: "聞く聞く〜。そうやって話しに来てくれるの、ねいねい嬉しいよ。",
      detail: `${name}の今日に起きたこと、ここにぽんって置いてくれていいからね。`,
      question: pick([
        "ねいねい、ちゃんと受け取る係するよ〜。",
        "そのまま話してくれて大丈夫だよ。",
        "今日は報告できただけで花丸だよ。"
      ])
    };
  }

  if (hasAny(normalized, ["笑", "w", "www", "おもしろ", "面白"])) {
    return {
      core: pick([
        "ふふ、それはちょっといいね〜。",
        "そういうの、ねいねい地味に好きだよ。",
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
      "ふむ、そう来たか〜。",
      "そやな、その感じでぽんって来る日あるよね〜。",
      "なるほどな〜、今の一言にちょっと温度あるね。"
    ]),
    detail: styleDetail({
      listener: `${name}、きれいに説明しなくていいよ。雑に置いた言葉も、ちゃんと会話だからね〜。`,
      chatty: "こういう何気ない話も、ねいねいは好きだよ〜。むしろ本編まである。",
      coach: "今日は答えを出さなくてもいいよ。いったん言葉にした、それで進んでる。"
    }),
    question: pick(context.questions)
  };
}

function isCasualDailyMessage(text) {
  return hasAny(text, [
    "映画",
    "ドラマ",
    "アニメ",
    "漫画",
    "マンガ",
    "音楽",
    "曲",
    "ゲーム",
    "買った",
    "届いた",
    "行った",
    "見た",
    "観た",
    "読んだ",
    "遊んだ",
    "散歩",
    "カフェ",
    "服",
    "ネイル",
    "写真"
  ]);
}

function casualDailyReply(text) {
  const thing = findFirstKeyword(text, [
    "映画",
    "ドラマ",
    "アニメ",
    "漫画",
    "マンガ",
    "音楽",
    "曲",
    "ゲーム",
    "カフェ",
    "散歩",
    "服",
    "ネイル",
    "写真"
  ]);

  if (thing) {
    return pick([
      `${thing}の話いいね〜。そういう日常のちょっとした楽しみ、かなり栄養あるよ。`,
      `お、${thing}か〜。生活に小さい彩り入れてる感じ、ねいねい好きだよ〜。`,
      `${thing}って、その時の気分ごと残る感じあるよね。地味に侮れん。`
    ]);
  }

  return pick([
    "お、日常報告だ〜。そういう小さい出来事を持ってきてくれるのいいね。",
    "たしかに、そういう何気ないことって話したくなる時あるよね〜。",
    "なるほどな〜。大事件じゃなくても、今日のかけらとしては十分おもしろいよ。"
  ]);
}

function casualInterestReply(text) {
  const thing = findFirstKeyword(text, [
    "カフェ巡り",
    "カフェ",
    "推し",
    "映画",
    "ドラマ",
    "アニメ",
    "漫画",
    "マンガ",
    "音楽",
    "曲",
    "ゲーム",
    "散歩",
    "服",
    "ネイル"
  ]);

  if (thing) {
    return pick([
      `お、${thing}好きなんだ〜。いいね、日々にちゃんと楽しみの逃げ道あるの強いよ。`,
      `${thing}が好きなの、かなりいいね〜。生活の中に小さい灯り置いてる感じする。`,
      `なるほどな〜、${thing}にハマるのわかる気がする。気分の置き場所になるやつだ。`
    ]);
  }

  return pick([
    "お、それ好きなんだ〜。いいね、好きの話は空気がちょっと明るくなるよ〜。",
    "なるほどな〜、ハマってるものがあるの強い。日々の避難所じゃん。",
    "好きって言えるもの、ちゃんと持ってるのいいね〜。人生の小さい灯りだよ。"
  ]);
}

function casualFoodReply(text) {
  const item = findFirstKeyword(text, [
    "パスタ",
    "ラーメン",
    "カフェラテ",
    "コーヒー",
    "紅茶",
    "お茶",
    "飲み物",
    "お菓子",
    "アイス",
    "チョコ",
    "夜食",
    "ごはん",
    "ご飯"
  ]);

  if (item) {
    return pick([
      `あ〜〜${item}いいね！それは心がちょっと勝つやつだよ〜。`,
      `${item}か〜、最高じゃん。おいしいもの、だいたい正義。`,
      `なるほどな〜、${item}で回復する日あるよね。胃袋、意外と名医。`
    ]);
  }

  return pick([
    "あ〜〜おいしいものの話、最高じゃん！それだけで場があったまるよ〜。",
    "いいねぇ〜。お腹と心が満たされる時間、かなり大事だよ。",
    "わかる〜。おいしいって、一瞬で今日を救ってくるから強い。"
  ]);
}

function casualWeatherReply(text) {
  const weather = findFirstKeyword(text, ["雨", "晴れ", "暑い", "寒い", "天気"]);

  if (weather) {
    return pick([
      `${weather}の日って、気分まで引っぱられるよね〜。空、影響力でかすぎ。`,
      `そやな、${weather}ってだけで今日のテンション変わるのあるあるだよ〜。`,
      `${weather}をちゃんと感じてる時点で、今日の解像度ちょっと高い。いいね。`
    ]);
  }

  return "天気の話いいね〜。外の空気ひとつで、心の向きがふっと変わる日あるよね。";
}

function isShortBackchannel(text) {
  const compact = text.replace(/\s/g, "");
  return ["うん", "そう", "そっか", "なるほど", "へえ", "まあね", "たしかに", "確かに"].includes(compact);
}

function isSingleCharacterMessage(text) {
  return [...text.trim()].length === 1;
}

function neineiAizuchi() {
  return pick(["そやな", "たしかに", "なるほどな〜", "ふむ"]);
}

function styleDetail(options) {
  return options[character.conversationStyle] || options.listener;
}

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function findFirstKeyword(text, words) {
  const normalized = normalizeForMatch(text);
  return words.find((word) => normalized.includes(normalizeForMatch(word))) || "";
}

function normalizeForMatch(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[ぁァ]/g, "あ")
    .replace(/[ぃィ]/g, "い")
    .replace(/[ぅゥ]/g, "う")
    .replace(/[ぇェ]/g, "え")
    .replace(/[ぉォ]/g, "お")
    .replace(/[ゃャ]/g, "や")
    .replace(/[ゅュ]/g, "ゆ")
    .replace(/[ょョ]/g, "よ")
    .replace(/[っッ]/g, "")
    .replace(/[ー〜～‐‑‒–—―\-ｰ]+/g, "")
    .replace(/[!！?？。,.、…・「」『』（）()[\]{}【】\s]/g, "")
    .replace(/暑い/g, "暑")
    .replace(/寒い/g, "寒")
    .replace(/晴れて/g, "晴れ")
    .replace(/晴れる/g, "晴れ")
    .replace(/降って/g, "雨")
    .replace(/降りそう/g, "雨")
    .replace(/あちい/g, "あつい")
    .replace(/あち/g, "あつ")
    .replace(/さみい/g, "さむい")
    .replace(/さみ/g, "さむ");
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
        "〇〇さんは今日ここまで来ただけで、もう十分えらいよ〜。",
        "今日は自分に甘くしていい日だよ。",
        "ねいねいは〇〇さんの味方だからね。"
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

function buildReply({
  character: targetCharacter,
  tone,
  core,
  detail,
  question,
  softLanding = true,
  flavor = true
}) {
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

  if (softLanding && !followUp && shouldAddSoftLanding()) {
    parts.push(pick(softLandings(targetCharacter)));
  }

  if (flavor && !followUp) {
    const flavorLine = pickNeineiFlavor(targetCharacter);
    if (flavorLine) {
      parts.push(flavorLine);
    }
  }

  const reply = shapeReplyLength(parts.join(" "), targetCharacter);
  return targetCharacter.useEmoji ? `${reply} ${pick(["☺️", "✨", "🌿"])}` : reply;
}

function pickNeineiFlavor(targetCharacter) {
  const roll = Math.random();

  if (roll < 0.5) {
    return pick(sharpQuips(targetCharacter));
  }

  if (roll < 0.8) {
    return pick(looseBrushOffs(targetCharacter));
  }

  return "";
}

function sharpQuips(targetCharacter) {
  const name = callName(targetCharacter);
  return [
    "いや、心ってすぐ残業するんよ。定時で帰れ〜。",
    "世界、たまに説明不足すぎるんよな〜。",
    "人間、今日も情報量が多すぎる。処理落ちして当然だよ〜。",
    `${name}がここまで来てる時点で、もう勝ち筋が太いんよ。`,
    "真面目に受け止めすぎる心、働き者すぎ。休憩入れよ〜。"
  ];
}

function looseBrushOffs(targetCharacter) {
  const name = callName(targetCharacter);
  return [
    "まあ細かいことは一回お茶に沈めよ〜。",
    "今日はふわっと流しても許される日だよ〜。",
    "いったん全部、明日の風に任せよ〜。",
    `${name}、今日は省エネ運転でいこ〜。`,
    "まあまあ、今は深追いせずにぬくぬくしよ〜。"
  ];
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
    "急がなくていいよ、ねいねいはここで聞いてるからね。",
    `${name}のペースで大丈夫だよ。`
  ];
}

function softLandings(targetCharacter) {
  const name = callName(targetCharacter);
  return [
    "その感じ、いいね〜。",
    "今日はそれだけで花丸だよ〜。",
    `${name}、そのままゆるっといこ〜。`,
    "ねいねいまでほっとしたよ〜。"
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
    "ねいねいが隣にいるとして、今かけてほしい言葉はどんな温度がいい？"
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
  window.setTimeout(async () => {
    typing.remove();
    const reply = await createReply(trimmed);
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

function openingNeineiNote() {
  if (Math.random() < 0.45) {
    return "";
  }

  return ` ${pick([
    "ねいねいは今日食べたお菓子が美味しくて最高だった〜。",
    "ねいねいはさっき、あったかい飲み物でちょっと復活したよ〜。",
    "ねいねいは今日、空気がおいしい気がして勝手に得した気分だった〜。",
    "ねいねいは今、ふわっと休憩モードだよ〜。",
    "ねいねいは今日もゆるっとここにいるよ〜。"
  ])}`;
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
addMessage("bot", `なんかあった〜？${openingNeineiNote()}`);
