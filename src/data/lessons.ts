export type LessonPhrase = {
  id: number;
  englishPhrase: string;
  frenchTranslation: string;
};

export const frenchLesson: LessonPhrase[] = [
  {
    id: 1,
    englishPhrase: "Fuck off!",
    frenchTranslation: "Va te faire foutre !",
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
