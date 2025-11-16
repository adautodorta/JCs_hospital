export function isValidCPF(cpfInput: string): boolean {
  const cpf = cpfInput.replace(/\D/g, "");
  if (cpf.length !== 11) {
    return false;
  }
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(cpf[i]) * (10 - i);
  }
  let rest = sum % 11;
  const dv1 = rest < 2 ? 0 : 11 - rest;
  if (dv1 !== Number(cpf[9])) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(cpf[i]) * (11 - i);
  }
  rest = sum % 11;
  const dv2 = rest < 2 ? 0 : 11 - rest;

  return dv2 === Number(cpf[10]);
};

export const formatCPF = (d: string): string => {
  if (d.length <= 3) {
    return d;
  }
  if (d.length <= 6) {
    return `${d.slice(0, 3)}.${d.slice(3)}`;
  }
  if (d.length <= 9) {
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  }
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
};
