import { screen } from '@testing-library/react';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { renderWithRedux } from '@/test-utils/render';
import SowingOutput from './SowingOutput';

// Mock the SowingMeasurementSwitcher component
jest.mock('../SowingMeasurementSwitcher/SowingMeasurementSwitcher', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-measurement-switcher">Measurement Switcher</div>,
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Leaf: () => <svg data-testid="leaf-icon" aria-label="Leaf" />,
}));

describe('SowingOutput', () => {
  const mockData = {
    userId: 'test-user',
    plantId: 'test-plant',
    plantLatinName: SELECTABLE_STRINGS.PISUM_SATIVUM,
    internalRowHeightCm: 12.5,
    isDataValid: true,
    sowingRateSafeSeedsPerMeterSquared: 100,
    sowingRatePlantsPerAcre: 200,
    usedSeedsKgPerAcre: 50,
    totalArea: 0,
  };

  const preloadedState = {
    local: {
      lang: 'bg',
      unitOfMeasurementLength: 'hectares',
    },
    auth: { user: null, token: null, isAuthenticated: false },
  };

  beforeEach(() => {
    initializeMockTranslate(preloadedState);
    jest.clearAllMocks();
  });

  it('renders with correct initial values', () => {
    renderWithRedux(() => <SowingOutput dataToBeSaved={mockData} />, { preloadedState });

    //check title (should be in the header)
    const title = mockTranslateFunction(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_SOWING_RATE);
    const titleElements = screen.getAllByText(title);
    expect(titleElements).toHaveLength(2); //one in header, one in content

    // Find the parent div with bg-green-700 class
    const headerDiv = titleElements[0].closest('div')?.parentElement;
    expect(headerDiv).toHaveClass('bg-green-700');

    // Check seeds per m2 value and unit
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(
      screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.SEEDS_PER_M2))
    ).toBeInTheDocument();

    // Check row spacing value and unit
    expect(screen.getByText('12.5')).toBeInTheDocument();
    expect(screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.CM))).toBeInTheDocument();

    // Check suggestion text
    expect(
      screen.getByText(mockTranslateFunction(SELECTABLE_STRINGS.SOWING_RATE_THIS_IS_SUGGESTED))
    ).toBeInTheDocument();
  });

  it('renders measurement switcher component', () => {
    renderWithRedux(() => <SowingOutput dataToBeSaved={mockData} />, { preloadedState });

    expect(screen.getByTestId('mock-measurement-switcher')).toBeInTheDocument();
  });

  it('applies responsive classes correctly', () => {
    renderWithRedux(() => <SowingOutput dataToBeSaved={mockData} />, { preloadedState });

    // Check responsive text classes
    const title = mockTranslateFunction(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_SOWING_RATE);
    const titleElement = screen.getAllByText(title)[0];
    const titleContainer = titleElement.closest('.text-lg.sm\\:text-xl');
    expect(titleContainer).toHaveClass('text-lg', 'sm:text-xl');

    // Check responsive spacing classes
    const cardHeader = titleElement.closest('div[class*="pb-3"]');
    expect(cardHeader).toHaveClass('pb-3', 'sm:pb-4');
  });

  it('displays leaf icon', () => {
    renderWithRedux(() => <SowingOutput dataToBeSaved={mockData} />, { preloadedState });

    const leafIcon = screen.getByTestId('leaf-icon');
    expect(leafIcon).toBeInTheDocument();
  });

  it('handles different data values correctly', () => {
    const differentData = {
      ...mockData,
      sowingRateSafeSeedsPerMeterSquared: 150,
      internalRowHeightCm: 15,
    };

    renderWithRedux(() => <SowingOutput dataToBeSaved={differentData} />, { preloadedState });

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('maintains layout structure', () => {
    renderWithRedux(() => <SowingOutput dataToBeSaved={mockData} />, { preloadedState });

    // Check card structure
    const card = screen.getByTestId('visualizationSection');
    expect(card).toHaveAttribute('id', 'visualizationSection');

    // Check sections are present
    const sections = screen
      .getAllByRole('generic')
      .filter((el) => el.classList.contains('border-b'));
    expect(sections).toHaveLength(3); // Sowing rate, measurement switcher, row spacing sections
  });
});
