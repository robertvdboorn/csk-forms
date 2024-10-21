type ReplacementCharacter = '-' | '_';

function sanitizeName(name: string, replacement: ReplacementCharacter = '-'): string {
  if (!name || name.length === 0) {
    return '';
  }

  let sanitized = name.toLowerCase();

  // Replace spaces and non-alphanumeric characters with the specified replacement character
  sanitized = sanitized.replace(/[^a-z0-9]+/g, replacement);

  // Remove leading and trailing replacement characters
  sanitized = sanitized.replace(new RegExp(`^[${replacement}]+|[${replacement}]+$`, 'g'), '');

  return sanitized;
}

export { sanitizeName };
