export function typeBg(types: string[]) {
  if (!types.length) return "bg-white/10";
  if (types.length === 1) return `bg-type-${types[0]}`;
  return `bg-gradient-to-r from-type-${types[0]} to-type-${types[1]}`;
}
