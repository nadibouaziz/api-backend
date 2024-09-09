export const getEnvNumber = (
  variable: string | undefined,
): number | undefined => {
  return variable ? Number(variable) : undefined;
};
