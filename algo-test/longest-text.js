const sentence = "Saya sangat senang mengerjakan soal algoritma"
const arrayOfSentence = sentence.split(" ")

longest(arrayOfSentence);

/**
 * @param sentence {Array<string>}
 */
function longest(sentence) {
  let finalText = "";
  let countCharacter = 0;

  for (let string of sentence) {
    if (string.length > countCharacter) {
      finalText = string;
      countCharacter = string.length;
    }
  }

  console.log(`${finalText}: ${countCharacter} character`);
}