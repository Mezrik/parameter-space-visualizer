import { Token } from "../types/expression";

export const createVariableTokens = (variable: string): Token => {
  return {
    type: 3,
    token: variable,
    show: variable,
    value: variable,
  };
};
