export function truncate(text, maxLength = 10, suffix = '...') {
   if (text.length > maxLength) {
      return text.substring(0, maxLength) + suffix;
   }

   return text;
};
