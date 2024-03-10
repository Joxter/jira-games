export function add(a: number, b: number) {
  return a + b;
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function lorem(len: number) {
  let res = "";
  let fullLorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio in tortor mollis suscipit. Sed id nunc vel libero aliquet volutpat. Integer nec enim at nunc lacinia aliquam. Quisque et erat nec nunc aliquam suscipit. Nulla facilisi. Sed non odio nec libero vestibulum lacinia".split(
      " ",
    );

  for (let i = 0; i < len; i++) {
    res += fullLorem[i % fullLorem.length] + " ";
  }

  return res;
}
