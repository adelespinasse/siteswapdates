// Quick and dirty code to find dates in YYYYMMDD format that are valid siteswaps

function numBallsInSiteswap(ssw) {
  return Array.from(ssw).reduce((acc, c) => acc + Number(c), 0) / ssw.length;
}

// Helper for siteswapIsValid: checks that the right number of balls are
// landing at step n in the siteswap string (first step is 0). There should be
// 1 ball landing at each step, unless the throw is a 0, in which case there
// should be 0 balls landing at that step. Returns 2 values: boolean for
// validity, and a string containing the reason it's invalid (empty if valid).
function validAtStep(ssw, n) {
  let landingAtN = 0;
  for (let index = 0; index < ssw.length; index++) {
    const toss = Number(ssw[index]);
    if (toss !== 0 && (index + toss) % ssw.length === n) {
      landingAtN += 1;
    }
  }
  const required = ssw[n] === '0' ? 0 : 1;
  if (landingAtN === required) {
    return [true, ''];
  }
  return [false, `${landingAtN} balls landing at throw ${n}; needed ${required}`];
}

// Checks that a siteswap (as a string) is valid. Returns 3 values: a boolean
// indicated validity; a string containing the reason it's invalid (empty if
// it's valid); and the number of balls.
function siteswapIsValid(ssw) {
  const numBalls = numBallsInSiteswap(ssw);
  if (numBalls !== Math.floor(numBalls)) {
    return [false, 'Number of balls must be an integer', numBalls];
  }
  for (let index = 0; index < ssw.length; index++) {
    const [valid, message] = validAtStep(ssw, index);
    if (!valid) {
      return [false, message, numBalls];
    }
  }
  return [true, '', numBalls];
}

// Returns the canonical form of a siteswap string: it should start with the
// highest throw; if the highest throw happens more than once, the second throw
// should be as high as possible; etc. Equivalent to the form that is last in
// lexical order.
function getCanonicalForm(ssw) {
  let best = ssw;
  for (let i = 1; i < ssw.length; i++) {
    const candidate = ssw.slice(i) + ssw.slice(0, i);
    if (candidate > best) {
      best = candidate;
    }
  }
  return best;
}

// Prints out the results of testing a given siteswap.
function test(ssw) {
  const [valid, message] = siteswapIsValid(ssw);
  console.log(`${ssw}: ${valid} (${message})`);
}

// Test cases
// test('0');
// test('1');
// test('2');
// test('3');
// test('4');
// test('5');
// test('531');
// test('531531');
// test('5315315');
// test('441');
// test('423');
// test('432');
// test('20241124');
// test('20240503');
// test('52024111');
// test('20240611');


// Gunswap URLs include a JSON string encoded in base64.
const gunswapEncode = (siteswap) => {
  const settings = {
    siteswap,
    dwellPath: '(30)(10)',
    beatDuration: 0.24,
    dwellRatio: 0.8,
  };
  return btoa(JSON.stringify(settings));
}

// Find every date in this millennium that is a valid siteswap. Dump the
// results as CSV to stdout.
const firstDay = new Date('2000-01-01T12:00:00.000Z');
let time = firstDay.getTime();
let numValid = 0;
console.log('siteswap,balls,max throw,canonical form,is canonical,date,animate,gif');
while (true) {
  const date = new Date(time);
  const dateAsString = date.toISOString().slice(0, 10);
  const ssw = dateAsString.replace(/-/g, '');
  if (ssw >= '3000') {
    break;
  }
  const [valid, message, numBalls] = siteswapIsValid(ssw);
  const maxThrow = Math.max(...Array.from(ssw).map(Number));
  const canonicalForm = getCanonicalForm(ssw);
  const isCanonical = ssw === canonicalForm;
  const gunswapUrl = `https://ydgunz.github.io/gunswap/?patternSettings=${gunswapEncode(ssw)}`;
  const gifUrl = `https://jugglinglab.org/anim?${ssw}`;
  if (valid) {
    console.log(`${ssw}, ${numBalls}, ${maxThrow}, ${canonicalForm}, ${isCanonical}, ${date.toDateString()}, ${gunswapUrl}, ${gifUrl}`);
    numValid += 1;
  }
  time += 24 * 60 * 60 * 1000;
}
