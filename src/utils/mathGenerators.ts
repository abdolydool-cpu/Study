import { DifficultyLevel } from '../types';

export interface GeneratedMathQuestion {
  prompt: string;
  answer: string;
  distractors: string[];
  explanation: string;
  accepted?: string[];
  interaction?: 'mc' | 'type';
  skill?: string;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function simplifyFraction(n: number, d: number): string {
  const g = gcd(n, d);
  const num = n / g;
  const den = d / g;
  if (den === 1) return `${num}`;
  return `${num}/${den}`;
}

function fmtTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function toRoman(num: number): string {
  const map: [string, number][] = [
    ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
    ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]
  ];
  let out = "";
  for (const [r, v] of map) {
    while (num >= v) {
      out += r;
      num -= v;
    }
  }
  return out;
}

export const MATH_GENERATORS: Record<string, (diff?: DifficultyLevel) => GeneratedMathQuestion> = {
  "multiples-factors": (diff = 'medium') => {
    if (diff === 'hard') {
      // Highest Common Factor or larger 3-digit factors
      const isHcf = Math.random() > 0.5;
      if (isHcf) {
        const a = choice([36, 48, 60, 72, 84, 96]);
        const b = choice([24, 36, 48, 60, 72].filter(x => x !== a));
        const ans = gcd(a, b);
        const distractors = [ans * 2, Math.max(2, Math.floor(ans / 2)), ans + 4].filter(x => x !== ans);
        while (distractors.length < 3) distractors.push(ans + distractors.length + 3);
        return {
          prompt: `What is the Highest Common Factor (HCF) of ${a} and ${b}?`,
          answer: `${ans}`,
          distractors: distractors.slice(0, 3).map(String),
          explanation: `The largest integer dividing both ${a} and ${b} without remainder is ${ans}.`,
          accepted: [`${ans}`]
        };
      } else {
        const n = choice([72, 84, 96, 108, 120, 144, 180]);
        const fs: number[] = [];
        for (let i = 6; i < n / 2; i++) if (n % i === 0) fs.push(i);
        const ans = choice(fs.length ? fs : [12, 18]);
        const distractors = [ans + 1, ans + 5, Math.max(2, ans - 3)].filter(x => n % x !== 0);
        while (distractors.length < 3) distractors.push(ans + distractors.length + 7);
        return {
          prompt: `Which of the following numbers is a factor of ${n}?`,
          answer: `${ans}`,
          distractors: distractors.slice(0, 3).map(String),
          explanation: `${ans} divides ${n} exactly (${n} ÷ ${ans} = ${n / ans}).`,
          accepted: [`${ans}`]
        };
      }
    }

    if (diff === 'easy') {
      // Friendly small factor numbers
      const n = choice([12, 16, 18, 20, 24]);
      const fs = [2, 3, 4, 5, 6].filter(x => n % x === 0);
      const ans = choice(fs);
      const distractors = [ans + 1, ans + 3, 7].filter(x => n % x !== 0);
      while (distractors.length < 3) distractors.push(ans + distractors.length + 5);
      return {
        prompt: `Which of these numbers is a factor of ${n}?`,
        answer: `${ans}`,
        distractors: distractors.slice(0, 3).map(String),
        explanation: `${ans} is a factor because ${n} ÷ ${ans} = ${n / ans} with no remainder.`,
        accepted: [`${ans}`]
      };
    }

    // Standard Medium
    const isFactorMode = Math.random() > 0.5;
    if (isFactorMode) {
      const n = choice([18, 24, 28, 32, 36, 42, 48, 56, 60]);
      const fs: number[] = [];
      for (let i = 2; i < n; i++) if (n % i === 0) fs.push(i);
      const ans = choice(fs);
      const distractors = [ans + 1, ans + 3, Math.max(2, ans - 2)].filter(x => n % x !== 0);
      while (distractors.length < 3) distractors.push(ans + distractors.length + 4);
      return {
        prompt: `Which of the following numbers is a factor of ${n}?`,
        answer: `${ans}`,
        distractors: distractors.slice(0, 3).map(String),
        explanation: `${ans} divides ${n} exactly with no remainder (${n} ÷ ${ans} = ${n / ans}).`,
        accepted: [`${ans}`]
      };
    } else {
      const a = choice([3, 4, 6, 8, 9]);
      const b = choice([4, 6, 8, 10, 12].filter(x => x !== a));
      const mult = lcm(a, b);
      return {
        prompt: `What is the lowest common multiple (LCM) of ${a} and ${b}?`,
        answer: `${mult}`,
        distractors: [`${a * b}`, `${mult + a}`, `${Math.max(2, mult - b)}`],
        explanation: `Multiples of ${a} and ${b} meet first at ${mult}.`,
        accepted: [`${mult}`]
      };
    }
  },

  primes: (diff = 'medium') => {
    if (diff === 'easy') {
      const smallPrimes = [2, 3, 5, 7, 11, 13, 17, 19];
      const evens = [4, 6, 8, 10, 12, 14, 16, 18];
      const prime = choice(smallPrimes);
      const distractors = shuffle(evens).slice(0, 3);
      return {
        prompt: "Which of the following numbers is a prime number?",
        answer: `${prime}`,
        distractors: distractors.map(String),
        explanation: `${prime} is prime because it can only be divided by 1 and ${prime}.`,
        accepted: [`${prime}`]
      };
    }

    if (diff === 'hard') {
      // Challenging 2-digit primes and tricky odd pseudo-primes (e.g. 51, 57, 87, 91)
      const trickyPrimes = [53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
      const trickyComposites = [51, 57, 69, 77, 87, 91, 93, 119];
      const prime = choice(trickyPrimes);
      const distractors = shuffle(trickyComposites).slice(0, 3);
      return {
        prompt: "Identify the prime number from this list of numbers:",
        answer: `${prime}`,
        distractors: distractors.map(String),
        explanation: `${prime} has exactly two factors (1 and ${prime}). Numbers like 51 (3×17), 57 (3×19), and 91 (7×13) are composite.`,
        accepted: [`${prime}`]
      };
    }

    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const composites = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49];
    if (Math.random() > 0.5) {
      const prime = choice(primes.slice(4));
      const compOptions = [choice(composites), choice(composites), choice(composites)].filter((v, i, a) => a.indexOf(v) === i);
      while (compOptions.length < 3) compOptions.push(compOptions[0] + 2);
      return {
        prompt: "Which of the following numbers is a prime number?",
        answer: `${prime}`,
        distractors: compOptions.map(String),
        explanation: `${prime} is prime because it has exactly two distinct factors: 1 and ${prime}.`,
        accepted: [`${prime}`]
      };
    } else {
      const comp = choice(composites);
      return {
        prompt: `Why is ${comp} considered a composite number, not a prime number?`,
        answer: `It has more than two factors`,
        distractors: [
          `It is an odd number`,
          `It cannot be divided by 2`,
          `It is smaller than 50`
        ],
        explanation: `${comp} has factors other than 1 and itself, making it composite.`
      };
    }
  },

  "time-calculations": (diff = 'medium') => {
    if (diff === 'easy') {
      const startHour = rand(9, 15);
      const duration = choice([15, 30, 45, 60]);
      const totalMin = startHour * 60 + duration;
      const ans = fmtTime(totalMin);
      return {
        prompt: `A film starts at ${fmtTime(startHour * 60)} and lasts ${duration} minutes. What time does it finish?`,
        answer: ans,
        distractors: [fmtTime(totalMin + 15), fmtTime(totalMin - 15), fmtTime(totalMin + 30)],
        explanation: `Add ${duration} minutes to ${fmtTime(startHour * 60)} to reach ${ans}.`,
        accepted: [ans]
      };
    }

    if (diff === 'hard') {
      // 2-leg journey crossing evening/midnight
      const departHour = choice([19, 20, 21, 22]);
      const departMin = rand(15, 45);
      const leg1 = rand(45, 75);
      const wait = rand(15, 35);
      const leg2 = rand(30, 60);
      const totalMin = (departHour * 60 + departMin + leg1 + wait + leg2) % (24 * 60);
      const ans = fmtTime(totalMin);
      return {
        prompt: `A train departs at ${fmtTime(departHour * 60 + departMin)}. Leg 1 takes ${leg1} mins, followed by a ${wait}-min connection wait, and Leg 2 takes ${leg2} mins. What time does the train arrive?`,
        answer: ans,
        distractors: [
          fmtTime((totalMin + 20) % (24 * 60)),
          fmtTime((totalMin - 15 + 24 * 60) % (24 * 60)),
          fmtTime((totalMin + 45) % (24 * 60))
        ],
        explanation: `Total journey time = ${leg1} + ${wait} + ${leg2} = ${leg1 + wait + leg2} minutes. Adding to ${fmtTime(departHour * 60 + departMin)} gives ${ans}.`,
        accepted: [ans]
      };
    }

    const startHour = rand(8, 14);
    const startMin = choice([0, 10, 15, 20, 30, 40, 45, 50]);
    const duration = choice([25, 35, 45, 55, 65, 75, 80, 90]);
    const totalMin = startHour * 60 + startMin + duration;
    const ans = fmtTime(totalMin);
    const distractors = [
      fmtTime(totalMin + 15),
      fmtTime(totalMin - 10),
      fmtTime(totalMin + 30)
    ];
    return {
      prompt: `A science examination starts at ${fmtTime(startHour * 60 + startMin)} and lasts ${duration} minutes. What time does it finish?`,
      answer: ans,
      distractors,
      explanation: `Adding ${duration} minutes to ${fmtTime(startHour * 60 + startMin)} gives ${ans}.`,
      accepted: [ans]
    };
  },

  "decimals-order": (diff = 'medium') => {
    if (diff === 'easy') {
      const base = rand(2, 8);
      const d1 = Number((base + 0.2).toFixed(1));
      const d2 = Number((base + 0.6).toFixed(1));
      const d3 = Number((base + 0.9).toFixed(1));
      const sorted = [d1, d2, d3].sort((a, b) => a - b);
      const ans = sorted.join(", ");
      return {
        prompt: `Arrange these decimals in ascending order: ${[d2, d1, d3].join(", ")}`,
        answer: ans,
        distractors: [
          [...sorted].reverse().join(", "),
          [d2, d1, d3].join(", "),
          [d3, d2, d1].join(", ")
        ],
        explanation: `Comparing whole numbers and tenths: ${ans}.`,
        accepted: [ans]
      };
    }

    if (diff === 'hard') {
      // 3 decimal places with tricky leading zeros and negatives
      const d1 = choice([-0.75, -0.05, 0.045, 0.405, 0.054]);
      const d2 = choice([0.005, 0.504, 0.45, -0.5, 0.54]);
      const d3 = choice([0.04, 0.05, 0.4, -0.04, -0.7]);
      const nums = [d1, d2, d3];
      const sorted = [...nums].sort((a, b) => a - b);
      const ans = sorted.join(", ");
      return {
        prompt: `Which sequence shows these numbers in ascending order (smallest to largest): ${[d2, d1, d3].join(", ")}?`,
        answer: ans,
        distractors: [
          [...sorted].reverse().join(", "),
          [d2, d1, d3].join(", "),
          [d3, d1, d2].join(", ")
        ],
        explanation: `Carefully compare place values (negative numbers first, then thousandths and hundredths) to get: ${ans}.`,
        accepted: [ans]
      };
    }

    const base = rand(2, 6);
    const d1 = Number((base + rand(1, 4) * 0.1 + rand(1, 9) * 0.01).toFixed(2));
    const d2 = Number((base + rand(4, 7) * 0.1 + rand(1, 9) * 0.01).toFixed(2));
    const d3 = Number((base + rand(7, 9) * 0.1 + rand(1, 9) * 0.01).toFixed(2));
    const sorted = [d1, d2, d3].sort((a, b) => a - b);
    const ans = sorted.join(", ");
    return {
      prompt: `Which sequence shows these decimals in ascending order (smallest to largest): ${[d2, d1, d3].join(", ")}?`,
      answer: ans,
      distractors: [
        [...sorted].reverse().join(", "),
        [d2, d1, d3].join(", "),
        [d3, d2, d1].join(", ")
      ],
      explanation: `Comparing the tenths digit first gives ${ans}.`,
      accepted: [ans]
    };
  },

  rounding: (diff = 'medium') => {
    if (diff === 'easy') {
      const val = rand(15, 89);
      const ans = Math.round(val / 10) * 10;
      return {
        prompt: `Round ${val} to the nearest 10.`,
        answer: `${ans}`,
        distractors: [`${ans + 10}`, `${Math.max(10, ans - 10)}`, `${ans + 5}`],
        explanation: `Look at the units digit: ${val % 10} tells us to round ${val % 10 >= 5 ? 'up' : 'down'} to ${ans}.`,
        accepted: [`${ans}`]
      };
    }

    if (diff === 'hard') {
      // Rounding to 2 significant figures or 3 decimal places
      const num = rand(1054, 9876) / 10000; // e.g. 0.3842
      const ans = Number(num.toPrecision(2));
      return {
        prompt: `Round ${num} to 2 significant figures.`,
        answer: `${ans}`,
        distractors: [`${(ans + 0.01).toFixed(2)}`, `${(ans - 0.01).toFixed(2)}`, `${Number(num.toPrecision(3))}`],
        explanation: `The first significant figure is the first non-zero digit. Counting 2 significant figures gives ${ans}.`,
        accepted: [`${ans}`]
      };
    }

    const isTens = Math.random() > 0.5;
    if (isTens) {
      const val = rand(145, 894);
      const ans = Math.round(val / 10) * 10;
      return {
        prompt: `Round ${val} to the nearest 10.`,
        answer: `${ans}`,
        distractors: [`${ans + 10}`, `${Math.max(10, ans - 10)}`, `${Math.floor(val / 100) * 100}`],
        explanation: `The units digit (${val % 10}) determines whether to round up or down, giving ${ans}.`,
        accepted: [`${ans}`]
      };
    } else {
      const whole = rand(3, 19);
      const dec = rand(11, 89);
      const num = Number(`${whole}.${dec}`);
      const ans = num.toFixed(1);
      const roundedDown = (Math.floor(num * 10) / 10).toFixed(1);
      const roundedUp = (Math.ceil(num * 10) / 10).toFixed(1);
      const other = (num + 0.2).toFixed(1);
      return {
        prompt: `Round ${num} to 1 decimal place.`,
        answer: ans,
        distractors: [ans === roundedDown ? roundedUp : roundedDown, other, `${Math.round(num)}`],
        explanation: `Look at the hundredths digit to decide whether to round the tenths place up or keep it.`,
        accepted: [ans]
      };
    }
  },

  "fraction-add-sub": (diff = 'medium') => {
    if (diff === 'easy') {
      // Identical small denominators
      const den = choice([4, 5, 6, 8]);
      const a = rand(1, den - 2);
      const b = rand(1, den - a - 1);
      const sum = a + b;
      const ans = `${sum}/${den}`;
      return {
        prompt: `Calculate: ${a}/${den} + ${b}/${den}`,
        answer: ans,
        distractors: [`${sum}/${den * 2}`, `${Math.abs(a - b)}/${den}`, `${sum + 1}/${den}`],
        explanation: `Keep the common denominator ${den} and add the numerators: ${a} + ${b} = ${sum}/${den}.`,
        accepted: [ans]
      };
    }

    if (diff === 'hard') {
      // Unlike coprime denominators requiring LCM calculation
      const d1 = choice([3, 4, 5, 7]);
      const d2 = choice([2, 5, 6].filter(x => x !== d1));
      const n1 = rand(1, d1 - 1);
      const n2 = rand(1, d2 - 1);
      const commonDen = lcm(d1, d2);
      const numSum = n1 * (commonDen / d1) + n2 * (commonDen / d2);
      const ans = simplifyFraction(numSum, commonDen);
      return {
        prompt: `Calculate: ${n1}/${d1} + ${n2}/${d2}. Give your answer in simplest form.`,
        answer: ans,
        distractors: [
          `${n1 + n2}/${d1 + d2}`,
          simplifyFraction(Math.abs(n1 * (commonDen / d1) - n2 * (commonDen / d2)), commonDen),
          `${numSum + 1}/${commonDen}`
        ],
        explanation: `Find LCM of ${d1} and ${d2} (${commonDen}): (${n1 * (commonDen / d1)} + ${n2 * (commonDen / d2)})/${commonDen} = ${ans}.`,
        accepted: [ans, `${numSum}/${commonDen}`]
      };
    }

    const isAdd = Math.random() > 0.5;
    const den = choice([6, 8, 9, 10, 12]);
    if (isAdd) {
      const a = rand(1, Math.floor(den / 2) - 1);
      const b = rand(1, Math.floor(den / 2) - 1);
      const sum = a + b;
      const ans = simplifyFraction(sum, den);
      return {
        prompt: `Calculate ${a}/${den} + ${b}/${den}. Simplify your answer where possible.`,
        answer: ans,
        distractors: [`${a + b}/${den * 2}`, `${Math.abs(a - b)}/${den}`, `${(a * b)}/${den}`],
        explanation: `Keep the common denominator ${den} and add numerators (${a} + ${b} = ${sum}), then simplify to ${ans}.`,
        accepted: [ans, `${sum}/${den}`]
      };
    } else {
      const a = rand(4, den - 1);
      const b = rand(1, a - 1);
      const diffVal = a - b;
      const ans = simplifyFraction(diffVal, den);
      return {
        prompt: `Calculate ${a}/${den} - ${b}/${den}. Simplify your answer where possible.`,
        answer: ans,
        distractors: [`${diffVal}/${den * 2}`, `${a + b}/${den}`, `${(a * b)}/${den}`],
        explanation: `Keep denominator ${den} and subtract numerators (${a} - ${b} = ${diffVal}), giving ${ans}.`,
        accepted: [ans, `${diffVal}/${den}`]
      };
    }
  },

  "negative-numbers": (diff = 'medium') => {
    if (diff === 'easy') {
      const a = rand(-8, -1);
      const b = rand(2, 9);
      const ans = a + b;
      return {
        prompt: `Calculate: ${a} + ${b}`,
        answer: `${ans}`,
        distractors: [`${ans - 2}`, `${ans + 3}`, `${a - b}`],
        explanation: `Start at ${a} and move right ${b} units = ${ans}.`,
        accepted: [`${ans}`]
      };
    }

    if (diff === 'hard') {
      // Double negative or negative multiplication
      const isMult = Math.random() > 0.5;
      if (isMult) {
        const a = rand(-9, -3);
        const b = rand(-8, -2);
        const ans = a * b;
        return {
          prompt: `Calculate: (${a}) × (${b})`,
          answer: `${ans}`,
          distractors: [`${-ans}`, `${a + b}`, `${ans - 6}`],
          explanation: `A negative multiplied by a negative gives a positive result: (${a}) × (${b}) = ${ans}.`,
          accepted: [`${ans}`]
        };
      } else {
        const a = rand(-15, -4);
        const b = rand(-12, -3);
        const ans = a - b; // e.g. -7 - (-12) = 5
        return {
          prompt: `Calculate: (${a}) - (${b})`,
          answer: `${ans}`,
          distractors: [`${a + b}`, `${-(Math.abs(ans))}`, `${ans + 4}`],
          explanation: `Subtracting a negative is the same as adding: ${a} - (${b}) = ${a} + ${Math.abs(b)} = ${ans}.`,
          accepted: [`${ans}`]
        };
      }
    }

    const a = rand(-14, -2);
    const b = rand(3, 16);
    const sum = a + b;
    return {
      prompt: `Calculate: ${a} + ${b}`,
      answer: `${sum}`,
      distractors: [`${a - b}`, `${Math.abs(sum)}`, `${b - Math.abs(a) - 2}`],
      explanation: `Starting at ${a} on the number line and moving right by ${b} lands at ${sum}.`,
      accepted: [`${sum}`]
    };
  },

  "roman-numerals": (diff = 'medium') => {
    if (diff === 'easy') {
      const vals = [4, 9, 11, 14, 16, 19, 21, 25];
      const n = choice(vals);
      const roman = toRoman(n);
      return {
        prompt: `What is the value of the Roman numeral ${roman}?`,
        answer: `${n}`,
        distractors: [`${n + 1}`, `${Math.max(1, n - 2)}`, `${n + 5}`],
        explanation: `${roman} equals ${n}.`,
        accepted: [`${n}`]
      };
    }

    if (diff === 'hard') {
      const vals = [148, 194, 246, 289, 345, 399, 444];
      const n = choice(vals);
      const roman = toRoman(n);
      return {
        prompt: `Convert the Roman numeral ${roman} into an Arabic number:`,
        answer: `${n}`,
        distractors: [`${n + 10}`, `${n - 20}`, `${n + 50}`],
        explanation: `${roman} translates into ${n} (remember C = 100, CD = 400).`,
        accepted: [`${n}`]
      };
    }

    const vals = [14, 19, 24, 29, 34, 39, 44, 48, 54, 67, 74, 89, 94];
    const n = choice(vals);
    const roman = toRoman(n);
    return {
      prompt: `What is the value of the Roman numeral ${roman}?`,
      answer: `${n}`,
      distractors: [`${n + 1}`, `${n - 2}`, `${n + 10}`],
      explanation: `${roman} translates into standard numbers as ${n}.`,
      accepted: [`${n}`]
    };
  },

  "mixed-improper": (diff = 'medium') => {
    if (diff === 'easy') {
      const whole = rand(1, 3);
      const den = choice([2, 3, 4]);
      const num = 1;
      const improperNum = whole * den + num;
      const ans = `${improperNum}/${den}`;
      return {
        prompt: `Convert ${whole} ${num}/${den} into an improper fraction.`,
        answer: ans,
        distractors: [`${whole + num}/${den}`, `${whole * num}/${den}`, `${improperNum + 1}/${den}`],
        explanation: `(${whole} × ${den}) + ${num} = ${improperNum}/${den}.`,
        accepted: [ans]
      };
    }

    if (diff === 'hard') {
      // Reverse: convert improper fraction to mixed number with simplification
      const whole = rand(4, 8);
      const den = choice([4, 6, 8]);
      const num = choice([1, 3, 5].filter(x => x < den));
      const improper = whole * den + num;
      const ans = `${whole} ${num}/${den}`;
      return {
        prompt: `Convert the improper fraction ${improper}/${den} into a mixed number:`,
        answer: ans,
        distractors: [`${whole - 1} ${num}/${den}`, `${whole} ${num + 1}/${den}`, `${whole + 1} 1/${den}`],
        explanation: `${improper} ÷ ${den} = ${whole} with a remainder of ${num}, so ${improper}/${den} = ${ans}.`,
        accepted: [ans]
      };
    }

    const whole = rand(2, 6);
    const den = choice([3, 4, 5, 6, 7]);
    const num = rand(1, den - 1);
    const improperNum = whole * den + num;
    const ans = `${improperNum}/${den}`;
    return {
      prompt: `Convert the mixed number ${whole} ${num}/${den} into an improper fraction.`,
      answer: ans,
      distractors: [`${whole + num}/${den}`, `${whole * num}/${den}`, `${improperNum - 1}/${den}`],
      explanation: `Multiply the whole number by the denominator (${whole} × ${den} = ${whole * den}) and add the numerator (+ ${num} = ${improperNum}), giving ${ans}.`,
      accepted: [ans]
    };
  },

  fdp: (diff = 'medium') => {
    const easyTable = [
      { f: "1/2", d: "0.5", p: "50%" },
      { f: "1/4", d: "0.25", p: "25%" },
      { f: "3/4", d: "0.75", p: "75%" },
      { f: "1/10", d: "0.1", p: "10%" }
    ];
    const medTable = [
      { f: "1/5", d: "0.2", p: "20%" },
      { f: "2/5", d: "0.4", p: "40%" },
      { f: "3/5", d: "0.6", p: "60%" },
      { f: "7/10", d: "0.7", p: "70%" },
      { f: "1/8", d: "0.125", p: "12.5%" }
    ];
    const hardTable = [
      { f: "3/8", d: "0.375", p: "37.5%" },
      { f: "5/8", d: "0.625", p: "62.5%" },
      { f: "7/8", d: "0.875", p: "87.5%" },
      { f: "1/3", d: "0.33", p: "33.3%" },
      { f: "2/3", d: "0.67", p: "66.7%" }
    ];
    const table = diff === 'easy' ? easyTable : diff === 'hard' ? hardTable : medTable;
    const item = choice(table);
    return {
      prompt: `Convert the fraction ${item.f} into an equivalent percentage.`,
      answer: item.p,
      distractors: [`${parseFloat(item.d) * 10}%`, `${100 - parseInt(item.p)}%`, `${parseInt(item.p) + 15}%`],
      explanation: `${item.f} is equivalent to decimal ${item.d}, which multiplied by 100 gives ${item.p}.`,
      accepted: [item.p, item.p.replace('%', '')]
    };
  },

  "percentage-amounts": (diff = 'medium') => {
    if (diff === 'easy') {
      const pct = choice([10, 50, 25]);
      const amount = choice([40, 60, 80, 100, 120]);
      const ans = (amount * pct) / 100;
      return {
        prompt: `Find ${pct}% of £${amount}.`,
        answer: `£${ans}`,
        distractors: [`£${ans + 5}`, `£${Math.max(2, ans - 5)}`, `£${amount - ans}`],
        explanation: `${pct}% of £${amount} is £${ans}.`,
        accepted: [`£${ans}`, `${ans}`]
      };
    }

    if (diff === 'hard') {
      // Percentage increase or discount
      const orig = choice([80, 120, 140, 160, 200]);
      const pct = choice([15, 20, 35]);
      const isDiscount = Math.random() > 0.5;
      const diffVal = (orig * pct) / 100;
      const ans = isDiscount ? orig - diffVal : orig + diffVal;
      const action = isDiscount ? "discounted by" : "increased by";
      return {
        prompt: `A winter coat originally costs £${orig}. In a seasonal sale, the price is ${action} ${pct}%. What is the new price?`,
        answer: `£${ans}`,
        distractors: [`£${orig}`, `£${diffVal}`, `£${isDiscount ? orig + diffVal : orig - diffVal}`],
        explanation: `${pct}% of £${orig} = £${diffVal}. New price = £${orig} ${isDiscount ? '-' : '+'} £${diffVal} = £${ans}.`,
        accepted: [`£${ans}`, `${ans}`]
      };
    }

    const pct = choice([10, 20, 25, 50, 75]);
    const amount = choice([40, 60, 80, 120, 160, 200, 240]);
    const ans = (amount * pct) / 100;
    return {
      prompt: `Find ${pct}% of £${amount}.`,
      answer: `£${ans}`,
      distractors: [`£${ans + 10}`, `£${Math.max(5, ans - 10)}`, `£${amount - ans}`],
      explanation: `${pct}% means ${pct}/100. So (${amount} × ${pct}) ÷ 100 = £${ans}.`,
      accepted: [`£${ans}`, `${ans}`]
    };
  },

  "fraction-amounts": (diff = 'medium') => {
    const den = diff === 'easy' ? choice([2, 4, 5]) : diff === 'hard' ? choice([7, 8, 9]) : choice([3, 4, 5, 6, 8]);
    const num = rand(1, den - 1);
    const mult = diff === 'easy' ? rand(2, 6) : diff === 'hard' ? rand(8, 15) : rand(4, 12);
    const amount = den * mult;
    const ans = mult * num;
    return {
      prompt: `Calculate ${num}/${den} of ${amount}.`,
      answer: `${ans}`,
      distractors: [`${mult}`, `${ans + den}`, `${Math.max(1, ans - mult)}`],
      explanation: `Divide by denominator (${amount} ÷ ${den} = ${mult}), then multiply by numerator (${mult} × ${num} = ${ans}).`,
      accepted: [`${ans}`]
    };
  },

  "percentage-compare": (diff = 'medium') => {
    const total = diff === 'easy' ? choice([10, 20, 50, 100]) : diff === 'hard' ? choice([40, 60, 80]) : choice([20, 25, 50, 80, 100]);
    const pct = diff === 'easy' ? choice([10, 20, 50]) : diff === 'hard' ? choice([15, 35, 45, 65]) : choice([10, 20, 25, 40, 50, 75]);
    const part = (total * pct) / 100;
    return {
      prompt: `In a school assessment, a student scored ${part} marks out of ${total}. What percentage is this?`,
      answer: `${pct}%`,
      distractors: [`${pct + 10}%`, `${100 - pct}%`, `${Math.max(5, pct - 15)}%`],
      explanation: `(${part} ÷ ${total}) × 100 = ${pct}%.`,
      accepted: [`${pct}%`, `${pct}`]
    };
  },

  "ratio-simplify": (diff = 'medium') => {
    const a = diff === 'easy' ? rand(1, 4) : diff === 'hard' ? rand(4, 9) : rand(2, 6);
    const b = diff === 'easy' ? rand(2, 5) : diff === 'hard' ? rand(5, 11) : rand(2, 7);
    const k = diff === 'easy' ? 2 : diff === 'hard' ? rand(6, 12) : rand(2, 5);
    const origA = a * k;
    const origB = b * k;
    return {
      prompt: `Simplify the ratio ${origA} : ${origB} to its simplest form.`,
      answer: `${a} : ${b}`,
      distractors: [`${origA} : ${b}`, `${a} : ${origB}`, `${b} : ${a}`],
      explanation: `Divide both numbers by their highest common factor ${k} to get ${a} : ${b}.`,
      accepted: [`${a}:${b}`, `${a} : ${b}`]
    };
  },

  "ratio-sharing": (diff = 'medium') => {
    if (diff === 'hard') {
      // 3-way ratio sharing
      const a = 2;
      const b = 3;
      const c = 5;
      const onePart = rand(8, 20);
      const total = (a + b + c) * onePart;
      const ans = b * onePart;
      return {
        prompt: `Share £${total} among three charities in the ratio 2 : 3 : 5. How much does the second charity receive?`,
        answer: `£${ans}`,
        distractors: [`£${a * onePart}`, `£${c * onePart}`, `£${onePart}`],
        explanation: `Total parts = 2 + 3 + 5 = 10. One part = £${total} ÷ 10 = £${onePart}. Second share = 3 × £${onePart} = £${ans}.`,
        accepted: [`£${ans}`, `${ans}`]
      };
    }

    const a = diff === 'easy' ? 1 : rand(1, 4);
    const b = diff === 'easy' ? rand(2, 3) : rand(2, 5);
    const parts = a + b;
    const onePart = diff === 'easy' ? rand(5, 10) : rand(5, 15);
    const total = parts * onePart;
    const shareA = a * onePart;
    return {
      prompt: `Share £${total} in the ratio ${a} : ${b}. What is the first person's share?`,
      answer: `£${shareA}`,
      distractors: [`£${b * onePart}`, `£${onePart}`, `£${total - shareA}`],
      explanation: `Total parts = ${a} + ${b} = ${parts}. Value of 1 part = £${total} ÷ ${parts} = £${onePart}. First share = ${a} × £${onePart} = £${shareA}.`,
      accepted: [`£${shareA}`, `${shareA}`]
    };
  },

  "direct-proportion": (diff = 'medium') => {
    const itemQty = diff === 'easy' ? 2 : rand(2, 5);
    const unitPrice = diff === 'easy' ? rand(2, 4) : rand(3, 8);
    const cost = itemQty * unitPrice;
    const targetQty = diff === 'easy' ? 4 : diff === 'hard' ? rand(9, 16) : rand(6, 12);
    const totalCost = targetQty * unitPrice;
    return {
      prompt: `If ${itemQty} exercise books cost £${cost}, how much will ${targetQty} exercise books cost at the same rate?`,
      answer: `£${totalCost}`,
      distractors: [`£${totalCost + unitPrice}`, `£${totalCost - unitPrice * 2}`, `£${cost * 2}`],
      explanation: `1 book costs £${cost} ÷ ${itemQty} = £${unitPrice}. Therefore, ${targetQty} books cost ${targetQty} × £${unitPrice} = £${totalCost}.`,
      accepted: [`£${totalCost}`, `${totalCost}`]
    };
  },

  sequences: (diff = 'medium') => {
    const start = diff === 'easy' ? rand(2, 10) : diff === 'hard' ? rand(25, 90) : rand(3, 15);
    const isDecreasing = diff === 'hard' && Math.random() > 0.5;
    const step = diff === 'easy' ? rand(2, 4) : diff === 'hard' ? rand(6, 14) : rand(3, 8);
    const diffVal = isDecreasing ? -step : step;
    const t1 = start;
    const t2 = start + diffVal;
    const t3 = start + diffVal * 2;
    const t4 = start + diffVal * 3;
    const nextTerm = start + diffVal * 4;
    return {
      prompt: `What is the next term in this sequence: ${t1}, ${t2}, ${t3}, ${t4}, ...?`,
      answer: `${nextTerm}`,
      distractors: [`${nextTerm + diffVal}`, `${nextTerm - (isDecreasing ? -2 : 2)}`, `${nextTerm + (isDecreasing ? 3 : -1)}`],
      explanation: `The common difference is ${diffVal >= 0 ? '+' : ''}${diffVal}. ${t4} + (${diffVal}) = ${nextTerm}.`,
      accepted: [`${nextTerm}`]
    };
  },

  "pattern-sequences": (diff = 'medium') => {
    const coeff = diff === 'easy' ? 2 : diff === 'hard' ? rand(4, 7) : rand(2, 5);
    const constant = diff === 'easy' ? 1 : rand(1, 6);
    const pos = diff === 'easy' ? 5 : diff === 'hard' ? rand(15, 30) : rand(6, 12);
    const ans = coeff * pos + constant;
    return {
      prompt: `The number of tiles in pattern n is given by the formula ${coeff}n + ${constant}. How many tiles are in pattern ${pos}?`,
      answer: `${ans}`,
      distractors: [`${coeff * pos}`, `${ans + coeff}`, `${(coeff + constant) * pos}`],
      explanation: `Substitute n = ${pos}: (${coeff} × ${pos}) + ${constant} = ${coeff * pos} + ${constant} = ${ans}.`,
      accepted: [`${ans}`]
    };
  },

  "simplify-expressions": (diff = 'medium') => {
    if (diff === 'hard') {
      // Expanding single bracket and collecting terms: e.g. 3(2x + 4) - 2x
      const k = rand(2, 4);
      const innerX = rand(2, 4);
      const innerC = rand(2, 5);
      const subX = rand(1, 3);
      const totalX = k * innerX - subX;
      const totalC = k * innerC;
      return {
        prompt: `Expand and simplify the algebraic expression: ${k}(${innerX}x + ${innerC}) - ${subX}x`,
        answer: `${totalX}x + ${totalC}`,
        distractors: [`${k * innerX}x + ${totalC}`, `${totalX}x - ${totalC}`, `${totalX + 2}x + ${innerC}`],
        explanation: `Expand bracket: ${k * innerX}x + ${totalC}. Then subtract ${subX}x: (${k * innerX} - ${subX})x + ${totalC} = ${totalX}x + ${totalC}.`,
        accepted: [`${totalX}x + ${totalC}`, `${totalX}x+${totalC}`]
      };
    }

    const a = diff === 'easy' ? rand(1, 4) : rand(2, 7);
    const b = diff === 'easy' ? rand(1, 4) : rand(2, 8);
    const c = rand(1, 9);
    const sumX = a + b;
    return {
      prompt: `Simplify the expression: ${a}x + ${b}x + ${c}`,
      answer: `${sumX}x + ${c}`,
      distractors: [`${sumX + c}x`, `${a * b}x + ${c}`, `${sumX}x - ${c}`],
      explanation: `Collect like terms: (${a} + ${b})x + ${c} = ${sumX}x + ${c}.`,
      accepted: [`${sumX}x + ${c}`, `${sumX}x+${c}`]
    };
  },

  substitution: (diff = 'medium') => {
    if (diff === 'hard') {
      // Negative substitution or x squared: if x = -3, find 2x² + 5
      const x = choice([-4, -3, -2, 3]);
      const a = rand(2, 4);
      const b = rand(3, 9);
      const ans = a * (x * x) + b;
      return {
        prompt: `If x = ${x}, evaluate the expression: ${a}x² + ${b}`,
        answer: `${ans}`,
        distractors: [`${-ans}`, `${a * x + b}`, `${ans - 4}`],
        explanation: `Substitute x = ${x}: ${x}² = ${x * x}. Then ${a} × ${x * x} = ${a * x * x}, + ${b} = ${ans}.`,
        accepted: [`${ans}`]
      };
    }

    const x = diff === 'easy' ? rand(2, 4) : rand(2, 7);
    const m = diff === 'easy' ? 2 : rand(3, 6);
    const c = rand(2, 9);
    const ans = m * x + c;
    return {
      prompt: `If x = ${x}, what is the value of ${m}x + ${c}?`,
      answer: `${ans}`,
      distractors: [`${m * (x + c)}`, `${ans + m}`, `${m + x + c}`],
      explanation: `Substitute x = ${x}: (${m} × ${x}) + ${c} = ${m * x} + ${c} = ${ans}.`,
      accepted: [`${ans}`]
    };
  },

  equations: (diff = 'medium') => {
    if (diff === 'hard') {
      // Unknowns on both sides: 5x + 3 = 2x + 18
      const x = rand(3, 8);
      const bLeft = rand(2, 6);
      const bRight = rand(15, 30);
      // We want (aLeft - aRight) * x = bRight - bLeft
      const diffX = rand(2, 3);
      const aRight = rand(2, 4);
      const aLeft = aRight + diffX;
      const bR = bLeft + diffX * x;
      return {
        prompt: `Solve for x: ${aLeft}x + ${bLeft} = ${aRight}x + ${bR}`,
        answer: `${x}`,
        distractors: [`${x + 1}`, `${x - 1}`, `${x + 2}`],
        explanation: `Subtract ${aRight}x from both sides: ${diffX}x + ${bLeft} = ${bR}. Subtract ${bLeft}: ${diffX}x = ${diffX * x}. So x = ${x}.`,
        accepted: [`${x}`, `x=${x}`, `x = ${x}`]
      };
    }

    const x = diff === 'easy' ? rand(2, 5) : rand(3, 9);
    const a = diff === 'easy' ? 2 : rand(2, 5);
    const b = rand(3, 10);
    const rhs = a * x + b;
    return {
      prompt: `Solve for x: ${a}x + ${b} = ${rhs}`,
      answer: `${x}`,
      distractors: [`${x + 1}`, `${x - 1}`, `${x + 2}`],
      explanation: `Subtract ${b} from both sides: ${a}x = ${rhs - b}. Then divide by ${a}: x = ${x}.`,
      accepted: [`${x}`, `x=${x}`, `x = ${x}`]
    };
  },

  averages: (diff = 'medium') => {
    const mean = diff === 'easy' ? rand(4, 8) : rand(5, 15);
    const d1 = rand(1, 4);
    const d2 = rand(1, 3);
    const nums = [mean - d1, mean + d1, mean - d2, mean + d2];
    return {
      prompt: `Find the mean of the numbers: ${nums.join(", ")}.`,
      answer: `${mean}`,
      distractors: [`${mean + 2}`, `${Math.max(1, mean - 1)}`, `${Math.max(...nums)}`],
      explanation: `Sum = ${nums.reduce((acc, v) => acc + v, 0)}. Mean = ${nums.reduce((acc, v) => acc + v, 0)} ÷ 4 = ${mean}.`,
      accepted: [`${mean}`]
    };
  },

  "pie-chart-angles": (diff = 'medium') => {
    const pct = diff === 'easy' ? choice([25, 50]) : diff === 'hard' ? choice([15, 35, 45]) : choice([10, 25, 50, 20]);
    const ans = (pct / 100) * 360;
    return {
      prompt: `A category represents ${pct}% of people surveyed in a pie chart. What angle should its sector be?`,
      answer: `${ans}°`,
      distractors: [`${pct}°`, `${ans / 2}°`, `${360 - ans}°`],
      explanation: `A full circle is 360°. So ${pct}% of 360° = (${pct} ÷ 100) × 360 = ${ans}°.`,
      accepted: [`${ans}°`, `${ans}`, `${ans} degrees`]
    };
  },

  "interpret-pie": (diff = 'medium') => {
    const total = diff === 'easy' ? choice([100, 200]) : choice([120, 200, 360, 400]);
    const fractionName = choice(["one-quarter", "half", "one-fifth", "three-quarters"]);
    const fractionMap: Record<string, number> = { "one-quarter": 0.25, "half": 0.5, "one-fifth": 0.2, "three-quarters": 0.75 };
    const ans = total * fractionMap[fractionName];
    return {
      prompt: `A pie chart surveys ${total} students. The sector for 'Bus travel' covers ${fractionName} of the chart. How many students travel by bus?`,
      answer: `${ans}`,
      distractors: [`${total / 2}`, `${Math.max(10, ans - 20)}`, `${ans + 30}`],
      explanation: `${fractionName} of ${total} = ${total} × ${fractionMap[fractionName]} = ${ans} students.`,
      accepted: [`${ans}`]
    };
  },

  "line-graphs": (diff = 'medium') => {
    const v1 = rand(15, 30);
    const increase = rand(10, 25);
    const v2 = v1 + increase;
    return {
      prompt: `A temperature line graph records 9:00 AM at ${v1}°C and 12:00 PM at ${v2}°C. What was the temperature increase?`,
      answer: `${increase}°C`,
      distractors: [`${increase + 5}°C`, `${v2}°C`, `${Math.max(2, increase - 4)}°C`],
      explanation: `Increase = final temperature minus starting temperature: ${v2} - ${v1} = ${increase}°C.`,
      accepted: [`${increase}°C`, `${increase}`]
    };
  },

  "probability-language": () => {
    return {
      prompt: "Rolling a number greater than 6 on a standard 6-sided dice is:",
      answer: "Impossible",
      distractors: ["Unlikely", "Even chance", "Certain"],
      explanation: "A standard die only contains faces 1 through 6, so rolling a number greater than 6 can never happen."
    };
  },

  "probability-fraction": (diff = 'medium') => {
    const red = diff === 'easy' ? 2 : rand(2, 6);
    const blue = diff === 'easy' ? 4 : rand(3, 8);
    const total = red + blue;
    const ans = simplifyFraction(red, total);
    return {
      prompt: `A bag holds ${red} red marbles and ${blue} blue marbles. What is the probability of picking a red marble at random?`,
      answer: ans,
      distractors: [`${blue}/${total}`, `${red}/${blue}`, `${simplifyFraction(red + 1, total)}`],
      explanation: `Probability = (favourable outcomes) / (total outcomes) = ${red}/${total} = ${ans}.`,
      accepted: [ans, `${red}/${total}`]
    };
  },

  perimeter: (diff = 'medium') => {
    const l = diff === 'easy' ? rand(4, 8) : diff === 'hard' ? rand(15, 35) : rand(6, 14);
    const w = diff === 'easy' ? rand(2, 5) : diff === 'hard' ? rand(8, 20) : rand(3, 9);
    const ans = 2 * (l + w);
    return {
      prompt: `What is the perimeter of a rectangle measuring ${l} cm long and ${w} cm wide?`,
      answer: `${ans} cm`,
      distractors: [`${l * w} cm`, `${l + w} cm`, `${2 * l + w} cm`],
      explanation: `Perimeter = 2 × (length + width) = 2 × (${l} + ${w}) = 2 × ${l + w} = ${ans} cm.`,
      accepted: [`${ans} cm`, `${ans}`]
    };
  },

  "angle-types": () => {
    const angle = choice([35, 60, 90, 115, 145, 180, 220]);
    let ans = "Acute";
    if (angle === 90) ans = "Right angle";
    else if (angle < 90) ans = "Acute";
    else if (angle < 180) ans = "Obtuse";
    else if (angle === 180) ans = "Straight angle";
    else ans = "Reflex";

    const allTypes = ["Acute", "Right angle", "Obtuse", "Reflex"].filter(t => t !== ans);
    return {
      prompt: `How is an angle measuring ${angle}° classified?`,
      answer: ans,
      distractors: allTypes.slice(0, 3),
      explanation: `Angles between 0° and 90° are acute; exactly 90° is right; between 90° and 180° is obtuse; greater than 180° is reflex.`
    };
  },

  coordinates: (diff = 'medium') => {
    const x = diff === 'easy' ? choice([1, 2, 3, 4, 5]) : choice([-5, -3, -2, 2, 3, 5]);
    const y = diff === 'easy' ? choice([1, 2, 3, 4]) : choice([-4, -2, 2, 4]);
    return {
      prompt: `Which coordinate point lies at x = ${x} and y = ${y}?`,
      answer: `(${x}, ${y})`,
      distractors: [`(${y}, ${x})`, `(${-x}, ${y})`, `(${x}, ${-y})`],
      explanation: `Coordinates are always given in alphabetical order: (x, y) = (${x}, ${y}).`,
      accepted: [`(${x}, ${y})`, `(${x},${y})`]
    };
  },

  "area-rectangles": (diff = 'medium') => {
    if (diff === 'hard') {
      // Compound L-shape rectangle
      const w1 = rand(4, 7);
      const h1 = rand(6, 10);
      const w2 = rand(3, 6);
      const h2 = rand(2, 4);
      const ans = w1 * h1 + w2 * h2;
      return {
        prompt: `An L-shaped lawn is composed of two adjoining rectangles: one measuring ${w1} m by ${h1} m, and another measuring ${w2} m by ${h2} m. What is the total area of the lawn?`,
        answer: `${ans} m²`,
        distractors: [`${w1 * h1} m²`, `${ans + 12} m²`, `${(w1 + w2) * (h1 + h2)} m²`],
        explanation: `Sum the areas of the two rectangles: (${w1} × ${h1}) + (${w2} × ${h2}) = ${w1 * h1} + ${w2 * h2} = ${ans} m².`,
        accepted: [`${ans} m²`, `${ans} m2`, `${ans}`]
      };
    }

    const l = diff === 'easy' ? rand(3, 7) : rand(5, 12);
    const w = diff === 'easy' ? rand(2, 5) : rand(3, 8);
    const ans = l * w;
    return {
      prompt: `Find the area of a rectangle with length ${l} cm and width ${w} cm.`,
      answer: `${ans} cm²`,
      distractors: [`${2 * (l + w)} cm²`, `${l + w} cm²`, `${ans * 2} cm²`],
      explanation: `Area of a rectangle = length × width = ${l} × ${w} = ${ans} cm².`,
      accepted: [`${ans} cm²`, `${ans} cm2`, `${ans}`]
    };
  },

  "area-triangles": (diff = 'medium') => {
    const b = diff === 'easy' ? choice([4, 6, 8]) : choice([4, 6, 8, 10, 12, 14]);
    const h = diff === 'easy' ? rand(2, 5) : rand(3, 9);
    const ans = (b * h) / 2;
    return {
      prompt: `Calculate the area of a triangle with base ${b} cm and perpendicular height ${h} cm.`,
      answer: `${ans} cm²`,
      distractors: [`${b * h} cm²`, `${b + h} cm²`, `${ans * 2 + 2} cm²`],
      explanation: `Area of triangle = (base × height) ÷ 2 = (${b} × ${h}) ÷ 2 = ${b * h} ÷ 2 = ${ans} cm².`,
      accepted: [`${ans} cm²`, `${ans} cm2`, `${ans}`]
    };
  },

  "volume-cubes": (diff = 'medium') => {
    const l = diff === 'easy' ? 2 : rand(2, 6);
    const w = diff === 'easy' ? rand(2, 4) : rand(2, 5);
    const h = diff === 'easy' ? rand(2, 3) : rand(2, 5);
    const ans = l * w * h;
    return {
      prompt: `Find the volume of a cuboid measuring ${l} cm long, ${w} cm wide and ${h} cm high.`,
      answer: `${ans} cm³`,
      distractors: [`${2 * (l + w + h)} cm³`, `${l * w} cm³`, `${ans + 12} cm³`],
      explanation: `Volume = length × width × height = ${l} × ${w} × ${h} = ${ans} cm³.`,
      accepted: [`${ans} cm³`, `${ans} cm3`, `${ans}`]
    };
  },

  transformations: () => {
    const x = rand(-3, 3);
    const y = rand(-3, 3);
    const dx = choice([-3, -2, 2, 3]);
    const dy = choice([-2, 1, 2, 3]);
    const ansX = x + dx;
    const ansY = y + dy;
    return {
      prompt: `Translate point (${x}, ${y}) by vector (${dx}, ${dy}). What are the new coordinates?`,
      answer: `(${ansX}, ${ansY})`,
      distractors: [`(${x - dx}, ${y - dy})`, `(${ansY}, ${ansX})`, `(${x + dy}, ${y + dx})`],
      explanation: `Add the vector coordinates: (${x} + ${dx}, ${y} + ${dy}) = (${ansX}, ${ansY}).`,
      accepted: [`(${ansX}, ${ansY})`, `(${ansX},${ansY})`]
    };
  },

  "missing-angles": (diff = 'medium') => {
    if (diff === 'hard') {
      // Missing angle in a triangle: angles are A, B, and x
      const a = rand(30, 80);
      const b = rand(30, 75);
      const ans = 180 - (a + b);
      return {
        prompt: `Two angles in a triangle measure ${a}° and ${b}°. What is the size of the third angle x?`,
        answer: `${ans}°`,
        distractors: [`${ans + 10}°`, `${180 - a}°`, `${360 - (a + b)}°`],
        explanation: `Angles in a triangle sum to 180°. So x = 180° - (${a}° + ${b}°) = ${ans}°.`,
        accepted: [`${ans}°`, `${ans}`, `${ans} degrees`]
      };
    }

    const known = rand(35, 145);
    const ans = 180 - known;
    return {
      prompt: `Two angles on a straight line are ${known}° and x. What is the value of x?`,
      answer: `${ans}°`,
      distractors: [`${known}°`, `${90 - (known % 90)}°`, `${360 - known}°`],
      explanation: `Angles on a straight line sum to 180°. So x = 180° - ${known}° = ${ans}°.`,
      accepted: [`${ans}°`, `${ans}`, `${ans} degrees`]
    };
  },

  "radius-diameter": (diff = 'medium') => {
    const r = diff === 'easy' ? rand(2, 6) : rand(3, 14);
    const d = 2 * r;
    return {
      prompt: `A circle has a radius of ${r} cm. What is its diameter?`,
      answer: `${d} cm`,
      distractors: [`${r / 2} cm`, `${r * r} cm`, `${d + 2} cm`],
      explanation: `Diameter is twice the radius: 2 × ${r} = ${d} cm.`,
      accepted: [`${d} cm`, `${d}`]
    };
  },

  circumference: (diff = 'medium') => {
    const d = diff === 'easy' ? 10 : choice([5, 10, 20]);
    const ans = (3.14 * d).toFixed(1);
    return {
      prompt: `Taking π ≈ 3.14, find the circumference of a circle with diameter ${d} cm.`,
      answer: `${ans} cm`,
      distractors: [`${(3.14 * d * 2).toFixed(1)} cm`, `${(3.14 * (d / 2)).toFixed(1)} cm`, `${(d * d).toFixed(1)} cm`],
      explanation: `Circumference = π × diameter = 3.14 × ${d} = ${ans} cm.`,
      accepted: [`${ans} cm`, `${ans}`]
    };
  }
};
