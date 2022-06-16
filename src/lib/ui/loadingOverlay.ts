import { addStyle, applyStyles } from './general';

export const addLoadingOverlay = (el: HTMLElement) => {
  applyStyles(el, { position: 'relative' });

  const overlay = document.createElement('div');
  overlay.classList.add('loading-overlay');

  addStyle(
    theme => `
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: ${theme.colors.textColor};
      font-family: ${theme.font};
      font-size: 4rem;
      z-index: 9999;
    }
  `,
    'styled-loading-overlay',
  );

  el.appendChild(overlay);
  return overlay;
};
