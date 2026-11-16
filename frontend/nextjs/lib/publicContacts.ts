export const TELEGRAM_CHANNEL = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL || 'oss_dvfu';
export const TELEGRAM_CHANNEL_URL = `https://t.me/${TELEGRAM_CHANNEL.replace(/^@/, '')}`;

// Контакт для связи указан в описании канала ОСС.
export const TELEGRAM_CONTACT = 'herman_east';
export const TELEGRAM_CONTACT_URL = `https://t.me/${TELEGRAM_CONTACT}`;
