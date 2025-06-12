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

// mock framer-motion to avoid animation-related issues in tests
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: new Proxy({}, {
      get: (_, element) => {
        return function MockComponent({ children, ...props }) {
          return React.createElement(element, props, children);
        };
      }
    })
  };
});

// Mock the recharts library
jest.mock('recharts', () => {
  const React = require('react');
  return {
    ResponsiveContainer: ({ children }) => React.createElement('div', {}, children),
    PieChart: ({ children }) => React.createElement('div', { 'data-testid': 'pie-chart' }, children),
    BarChart: ({ children }) => React.createElement('div', { 'data-testid': 'bar-chart' }, children),
    Pie: ({ data }) => (
      React.createElement('div', { 'data-testid': 'pie' },
        data.map((item, index) => (
          React.createElement('div', { key: index, 'data-value': item.value }, item.name)
        ))
      )
    ),
    Bar: ({ children }) => React.createElement('div', { 'data-testid': 'bar' }, children),
    Cell: () => React.createElement('div', { 'data-testid': 'chart-cell' }),
    XAxis: () => React.createElement('div', { 'data-testid': 'x-axis' }),
    YAxis: () => React.createElement('div', { 'data-testid': 'y-axis' }),
    Tooltip: () => React.createElement('div', { 'data-testid': 'tooltip' }),
    Legend: () => React.createElement('div', { 'data-testid': 'legend' })
  };
});

// Mock toast notifications
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock API calls
jest.mock('@/lib/api-util', () => ({
  APICaller: jest.fn()
}));

// Mock next/link
jest.mock('next/link', () => {
  const React = require('react');
  return ({ children, href }) => React.createElement('a', { href }, children);
});