export function add(a: number, b: number) {
  return a + b;
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function lorem(from: number, to?: number) {
  if (to) {
    return lorem2(random(from, to));
  }
  return lorem2(from);
}

function lorem2(len: number) {
  let res = "";
  let fullLorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio in tortor mollis suscipit. Sed id nunc vel libero aliquet volutpat. Integer nec enim at nunc lacinia aliquam. Quisque et erat nec nunc aliquam suscipit. Nulla facilisi. Sed non odio nec libero vestibulum lacinia".split(
      " ",
    );

  let offest = Math.floor(Math.random() * fullLorem.length);

  for (let i = offest; i < len + offest; i++) {
    res += fullLorem[i % fullLorem.length] + " ";
  }

  return res;
}

export function random(from: number, to: number) {
  return Math.floor(Math.random() * (to - from)) + from;
}
