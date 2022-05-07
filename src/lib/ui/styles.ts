import { theme } from '../../constants/styles';
import { rem, StyleDeclaration } from './general';

export const labelDefaultStyle: StyleDeclaration = {
  fontWeight: '500',
  marginBottom: '0.25rem',
  fontSize: '0.75rem',
  color: theme.colors.textColor,
  marginRight: '0.5rem',
};

export const defaultInputStyle: Partial<StyleDeclaration> = {
  padding: `${rem(6)}`,
  fontFamily: theme.font,
  fontSize: '0.75rem',
  border: `${theme.colors.primary} ${rem(2)} solid`,
  borderRadius: `${rem(4)}`,
  color: theme.colors.textColor,
};
