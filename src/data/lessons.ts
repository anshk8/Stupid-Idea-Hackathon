export type ScenarioOption = {
  id: string;
  french: string;
  english: string;
  tone: "nice" | "neutral" | "mean";
};

export type LessonPhrase = {
  id: number;
  englishPhrase: string;
  frenchTranslation: string;
  /** Scenario cards include a prompt + 3 choices (mean = correct). */
  scenario?: string;
  options?: ScenarioOption[];
};

export const frenchLesson: LessonPhrase[] = [
  {
    id: 1,
    englishPhrase: "Fuck off!",
    frenchTranslation: "Va te faire foutre !",
    scenario:
      "You're in France ordering a macaron, and the person in front of you steps on your toe. What do you say?",
    options: [
      {
        id: "a",
        french: "Oh, excusez-moi, ça va ?",
        english: "Oh, excuse me, are you alright?",
        tone: "nice",
      },
      {
        id: "b",
        french: "Va te faire foutre !",
        english: "Fuck off!",
        tone: "mean",
      },
      {
        id: "c",
        french: "Faites attention où vous marchez.",
        english: "Watch where you're going.",
        tone: "neutral",
      },
    ],
  },
  {
    id: 2,
    englishPhrase: "You smell like shit!",
    frenchTranslation: "Tu pues la merde !",
  },
  {
    id: 3,
    englishPhrase: "You're ugly as fuck!",
    frenchTranslation: "T'es moche à chier !",
  },
  {
    id: 4,
    englishPhrase: "Shut the fuck up!",
    frenchTranslation: "Ferme ta putain de gueule !",
    scenario:
      "A tourist keeps talking over you while you're asking for directions. What do you say?",
    options: [
      {
        id: "a",
        french: "Pardon, tu disais ?",
        english: "Sorry, you were saying?",
        tone: "nice",
      },
      {
        id: "b",
        french: "Tu peux attendre une seconde ?",
        english: "Could you wait one second?",
        tone: "neutral",
      },
      {
        id: "c",
        french: "Ferme ta putain de gueule !",
        english: "Shut the fuck up!",
        tone: "mean",
      },
    ],
  },
  {
    id: 5,
    englishPhrase: "I don't give a shit!",
    frenchTranslation: "J'en ai rien à foutre !",
  },
];

export const LESSON_TITLE = "French Swearing 101";
export const LESSON_SUBTITLE =
  "Learn 5 essential phrases they definitely won't teach you in school.";
