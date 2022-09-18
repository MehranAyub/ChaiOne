export const getSubquestionsLetterId = (index: number): string => {
  const lettersDict: { [key: number]: string } = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
    8: 'H',
    9: 'I',
    10: 'J',
    11: 'K',
    12: 'L',
    13: 'M',
    14: 'N',
    15: 'O',
    16: 'P',
    17: 'Q',
    18: 'R',
    19: 'S',
    20: 'T',
    21: 'U',
    22: 'V',
    23: 'W',
    24: 'X',
    25: 'Y',
    26: 'Z'
  };

  const letterIndex = index + 1;

  if (lettersDict[letterIndex]) {
    return lettersDict[letterIndex];
  }

  const firstLetterIndex = letterIndex / 26;
  const secondLetterIndex = letterIndex % 26;

  return `${firstLetterIndex}${secondLetterIndex}`;
};

export const getScaleNameById = (id: string, scalesArr: any): string => {
  if (!scalesArr) return '';

  const scale: any = scalesArr.find((s: any) => s.id === id);

  if (!scale) return '';

  return scale.name;
};


export const truncateString = (str: string, num: number = 30) => {
  if (!!str && str?.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
};

export const getAnswerId = (responseDataCollection: []) => {
  if (!!responseDataCollection && responseDataCollection?.length === 0) return '';
  const answer: null | any = responseDataCollection.find((answer: any) => answer.needsValidation);
  return answer.responseAnswerId;
};
