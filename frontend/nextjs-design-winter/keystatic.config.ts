// Keystatic config - временно отключено
// TODO: Установить правильную версию @keystatic/core

// import { config, fields, collection } from '@keystatic/core';

// export default config({
//   storage: {
//     kind: 'local',
//   },
//   collections: {
//     news: collection({
//       label: 'Новости',
//       slugField: 'title',
//       path: 'content/news/*',
//       schema: {
//         title: fields.text({ label: 'Заголовок', validation: { isRequired: true } }),
//         direction: fields.select({
//           label: 'Направление',
//           options: [
//             { label: 'ОСС', value: 'oss' },
//             { label: 'Правовой', value: 'legal' },
//             { label: 'Инфраструктура', value: 'infrastructure' },
//             { label: 'Стипендии', value: 'scholarship' },
//             { label: 'Иностранные студенты', value: 'international' },
//           ],
//         }),
//         body: fields.markdoc({ label: 'Текст' }),
//         published: fields.checkbox({ label: 'Опубликовано' }),
//       },
//     }),

//     guides: collection({
//       label: 'Гайды',
//       slugField: 'title',
//       path: 'content/guides/*',
//       schema: {
//         title: fields.text({ label: 'Заголовок', validation: { isRequired: true } }),
//         direction: fields.select({
//           label: 'Направление',
//           options: [
//             { label: 'Правовой', value: 'legal' },
//             { label: 'Инфраструктура', value: 'infrastructure' },
//             { label: 'Стипендии', value: 'scholarship' },
//             { label: 'Иностранные студенты', value: 'international' },
//           ],
//         }),
//         body: fields.markdoc({ label: 'Текст' }),
//         published: fields.checkbox({ label: 'Опубликовано' }),
//       },
//     }),
//   },
// });

export default {};
