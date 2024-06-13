const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];


const finalMatchArray = [];
let text = "";
for (let string of QUERY) {
  const match = INPUT.filter((q) => q === string);
  text += `kata '${string}' terdapat ${match.length} pada INPUT, `
  finalMatchArray.push(match.length);
}

console.log(`[${finalMatchArray.toString()}] karena ${text}`);
