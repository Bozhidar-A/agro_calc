require('@testing-library/jest-dom');
const { mockTranslateFunction } = require('./test-utils/mocks');

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
    LineChart: ({ children }) => React.createElement('div', { 'data-testid': 'line-chart' }, children),
    Line: ({ dataKey, name }) => React.createElement('div', { 'data-testid': 'line', 'data-name': name }, typeof dataKey === 'function' ? 'transformed-data' : dataKey),
    Pie: ({ data, dataKey, nameKey }) => (
      React.createElement('div', { 'data-testid': 'pie' },
        data?.map((item, index) => {
          const name = typeof nameKey === 'function' ? nameKey(item) : item[nameKey];
          const value = typeof dataKey === 'function' ? dataKey(item) : item[dataKey];
          return React.createElement('div', { key: index, 'data-name': name, 'data-value': value }, name);
        })
      )
    ),
    Bar: ({ dataKey, name }) => React.createElement('div', { 'data-testid': 'bar', 'data-name': name }, typeof dataKey === 'function' ? 'transformed-data' : dataKey),
    Cell: () => React.createElement('div', { 'data-testid': 'chart-cell' }),
    XAxis: ({ dataKey }) => React.createElement('div', { 'data-testid': 'x-axis' }, typeof dataKey === 'function' ? 'transformed-data' : dataKey),
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

jest.mock('@/components/Errored/Errored', () => {
  const React = require('react');
  return ({ children }) => React.createElement('div', { 'data-testid': 'error-component' }, children);
})

//mock useTranslate hook
jest.mock('@/hooks/useTranslate', () => ({
  useTranslate: () => mockTranslateFunction
}));

//mock useWarnings hook
jest.mock('@/hooks/useWarnings', () => ({
  useWarnings: () => ({
    warnings: {},
    AddWarning: jest.fn(),
    RemoveWarning: jest.fn(),
    CountWarnings: jest.fn()
  })
}));