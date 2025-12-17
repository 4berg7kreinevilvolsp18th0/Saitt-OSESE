export type ColorKey =
  | 'oss'
  | 'legal'
  | 'infrastructure'
  | 'scholarship'
  | 'international'
  | 'neutral';

export function accentClass(colorKey: ColorKey): string {
  switch (colorKey) {
    case 'legal':
      return 'text-legal border-legal';
    case 'infrastructure':
      return 'text-infrastructure border-infrastructure';
    case 'scholarship':
      return 'text-scholarship border-scholarship';
    case 'international':
      return 'text-international border-international';
    case 'neutral':
      return 'text-neutral border-neutral';
    case 'oss':
    default:
      return 'text-oss-red border-oss-red';
  }
}

export function accentBg(colorKey: ColorKey): string {
  switch (colorKey) {
    case 'legal':
      return 'bg-legal';
    case 'infrastructure':
      return 'bg-infrastructure';
    case 'scholarship':
      return 'bg-scholarship';
    case 'international':
      return 'bg-international';
    case 'neutral':
      return 'bg-neutral';
    case 'oss':
    default:
      return 'bg-oss-red';
  }
}
