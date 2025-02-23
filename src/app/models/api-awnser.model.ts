export class Answer {
  filename: /**/ string;
  good:     /**/ string[];
  bad:      /**/ string[];
  neutral:  /**/ string[];
  available:/**/ string[] = [
    'O Tom', 'O Ritmo', 'A Letra', 'A Voz', 'Os Instrumentos'
  ];

  constructor(filename: string, good: string[] = [], bad: string[] = [], neutral: string[] = []) {
    this.filename = filename;
    this.good = good;
    this.bad = bad;
    this.neutral = neutral;

    const used = new Set([...good, ...bad, ...neutral]);
    this.available = this.available.filter(item => !used.has(item));
  }
}
