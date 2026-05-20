const mojibakePattern = /[ÐÑГ][\u0080-\u00ff]/;

export const fixMojibake = (value: string) => {
  if (!mojibakePattern.test(value)) return value;

  try {
    const bytes = Uint8Array.from([...value].map((char) => char.charCodeAt(0) & 0xff));
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return value;
  }
};
