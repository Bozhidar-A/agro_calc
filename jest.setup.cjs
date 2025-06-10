require('@testing-library/jest-dom');
require('./test-utils/mocks.ts');

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => { };

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

window.ResizeObserver = ResizeObserver;

//fix for redux persist
jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }) => children,
}));

//mock for lucide-react since its esm and not supported by jest
jest.mock('lucide-react', () => {
  const React = require('react');

  //proxy to mock the icons
  return new Proxy({}, {
    get: (_, iconName) => {
      return function MockIcon(props) {
        return React.createElement('svg', {
          'data-testid': `${String(iconName).toLowerCase()}-icon`,
          'aria-label': String(iconName),
          ...props
        });
      };
    }
  });
});