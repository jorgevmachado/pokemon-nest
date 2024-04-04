export const generateOrder = (url: string, urlDefault: string): number => {
  return Number(url.replace(urlDefault, '').replace('/', ''));
};
