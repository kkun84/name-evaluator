export class FortuneGenerator {
  constructor() {
    this.blessings = [
      '澄み渡る朝日のように、家族の笑顔が絶えません。',
      '豊かな実りが続き、願いが形になる一年となるでしょう。',
      '周囲の人々に感謝されながら、穏やかな日々が築かれます。',
      '挑戦のたびに良い縁が広がり、未来がますます輝きます。',
    ];
  }

  generate(name, strokeSummary) {
    const trimmedName = name.trim();
    const total = strokeSummary.total;
    const blessing = this.pickBlessing(total);
    return {
      title: '大吉',
      tagline: `総画数 ${total} 画 — 喜びが溢れる兆しです。`,
      description: `${trimmedName}というお名前には、調和と希望を運ぶ響きがあります。大切な人たちと喜びを分かち合いながら、ひとつひとつの瞬間が宝物となっていくでしょう。`,
      blessing,
    };
  }

  pickBlessing(total) {
    const index = total % this.blessings.length;
    return this.blessings[index];
  }
}
