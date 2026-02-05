export const getInitials = (fullName?: string): string => {
  if (!fullName) return 'U';

  return fullName
    .trim()
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};
