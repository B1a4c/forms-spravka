export function calculateDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
  const diffTime = e.getTime() - s.getTime();
  if (diffTime < 0) return 0;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  return diffDays;
}

export function formatRussianDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `«${day}» ${month} ${year} г.`;
}

export function numberToRussianWords(n: number): string {
  const units = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
  const teens = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
  const tens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
  const hundreds = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];

  if (n === 0) return "ноль";
  if (n < 0) return "минус " + numberToRussianWords(Math.abs(n));
  
  let parts: string[] = [];
  
  if (n >= 100) {
    parts.push(hundreds[Math.floor(n / 100)]);
    n %= 100;
  }
  
  if (n >= 20) {
    parts.push(tens[Math.floor(n / 10)]);
    n %= 10;
  } else if (n >= 10) {
    parts.push(teens[n - 10]);
    n = 0;
  }
  
  if (n > 0) {
    parts.push(units[n]);
  }
  
  return parts.filter(Boolean).join(" ");
}

export function getDaysPluralWords(days: number): string {
  const amountWords = numberToRussianWords(days);
  const lastDigit = days % 10;
  const lastTwo = days % 100;
  
  let suffix = "календарных дней";
  if (lastTwo >= 11 && lastTwo <= 19) {
    suffix = "календарных дней";
  } else if (lastDigit === 1) {
    suffix = "календарный день";
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    suffix = "календарных дня";
  }
  
  return `${days} (${amountWords}) ${suffix}`;
}

export function getLeaveTypeClause(type: "аттестация" | "диплом" | "госэкзамены"): string {
  switch (type) {
    case "аттестация":
      return "прохождения промежуточной аттестации";
    case "диплом":
      return "подготовки и защиты выпускной квалификационной работы и сдачи итоговых государственных экзаменов";
    case "госэкзамены":
      return "прохождения государственной итоговой аттестации (сдачи итоговых государственных экзаменов)";
    default:
      return "прохождения промежуточной аттестации";
  }
}

export function getLaborCodeArticle(level: string): string {
  if (level === "Среднее профессиональное") {
    return "статьей 174";
  }
  return "статьей 173";
}
