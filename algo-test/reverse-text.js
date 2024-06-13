const text = "NEGIE1";
const numeric = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

let finalText = "";
for (let i = text.length - 1; i >= 0; i--) {
  if (!numeric.find((item) => item.toString() === text[i])) {
    finalText += text[i]
  }
}

let number = "";
for (let i = text.length - 1; i >= 0; i--) {
  const result = numeric.find((item) => item.toString() === text[i]);
  if (result) {
    number = result;
    break;
  }
}

finalText += number;

console.log(finalText)