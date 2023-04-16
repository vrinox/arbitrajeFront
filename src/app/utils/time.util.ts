export const sleep = ({ ms }: { ms: number }) => new Promise((resolve) => setTimeout(resolve, ms));
