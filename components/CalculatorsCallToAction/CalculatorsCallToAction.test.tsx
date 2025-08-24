import { screen } from '@testing-library/react';
import { initializeMockTranslate, mockTranslateFunction } from '@/test-utils/mocks';
import { renderWithRedux } from '@/test-utils/render';
import CalculatorsCallToAction from './CalculatorsCallToAction';

describe('CalculatorsCallToAction', () => {
  const preloadedState = {
    local: { lang: 'bg' },
    auth: { user: null, token: null, isAuthenticated: false },
  };

  beforeEach(() => {
    initializeMockTranslate(preloadedState);
    renderWithRedux((mockProps) => <CalculatorsCallToAction {...mockProps} />, {
      preloadedState,
      mockProps: {},
    });
    jest.clearAllMocks();
  });

  it('renders the main title and description', () => {
    const title = screen.getByText(mockTranslateFunction('AGRICULTURAL_CALCULATORS'));
    const description = screen.getByText(mockTranslateFunction('SELECT_CALCULATOR'));

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('renders all calculator cards', () => {
    // Check for all calculator titles
    const sowingCalc = screen.getByText(mockTranslateFunction('SOWING_RATE_CALC_TITLE'));
    const combinedCalc = screen.getByText(mockTranslateFunction('COMBINED_CALC_TITLE'));
    const workingSolutionCalc = screen.getByText(
      mockTranslateFunction('CHEM_PROT_WORKING_SOLUTION_CALC_TITLE')
    );
    const percentSolutionCalc = screen.getByText(
      mockTranslateFunction('CHEMICAL_PROTECTION_PERCENT_SOLUTION_CALC_TITLE')
    );

    expect(sowingCalc).toBeInTheDocument();
    expect(combinedCalc).toBeInTheDocument();
    expect(workingSolutionCalc).toBeInTheDocument();
    expect(percentSolutionCalc).toBeInTheDocument();
  });

  it('renders calculator descriptions', () => {
    // Check for all calculator descriptions
    const sowingDesc = screen.getByText(mockTranslateFunction('SOWING_RATE_CALC_DESCRIPTION'));
    const combinedDesc = screen.getByText(mockTranslateFunction('COMBINED_CALC_DESCRIPTION'));
    const workingSolutionDesc = screen.getByText(
      mockTranslateFunction('CHEM_PROT_WORKING_SOLUTION_CALC_DESCRIPTION')
    );
    const percentSolutionDesc = screen.getByText(
      mockTranslateFunction('CHEMICAL_PROTECTION_CALC_DESCRIPTION')
    );

    expect(sowingDesc).toBeInTheDocument();
    expect(combinedDesc).toBeInTheDocument();
    expect(workingSolutionDesc).toBeInTheDocument();
    expect(percentSolutionDesc).toBeInTheDocument();
  });

  it('renders calculator icons', () => {
    // Check for specific icons using the mock's data-testid format
    expect(screen.getByTestId('leaf-icon')).toBeInTheDocument(); // Sowing calculator
    expect(screen.getByTestId('calculator-icon')).toBeInTheDocument(); // Combined calculator
    expect(screen.getAllByTestId('flaskroundicon-icon')).toHaveLength(2); // Both chemical protection calculators
    expect(screen.getAllByTestId('arrowright-icon')).toHaveLength(4); // One arrow for each calculator
  });

  it('renders correct links for each calculator', () => {
    const links = screen.getAllByRole('link');
    const expectedPaths = [
      '/calculators/sowing',
      '/calculators/combined',
      '/calculators/chemical-protection/working-solution',
      '/calculators/chemical-protection/percent-solution',
    ];

    expect(links).toHaveLength(4);
    links.forEach((link, index) => {
      expect(link).toHaveAttribute('href', expectedPaths[index]);
    });
  });

  it('renders "Open Calculator" buttons for each card', () => {
    const openCalculatorText = mockTranslateFunction('OPEN_CALCULATOR');
    const buttons = screen.getAllByText(openCalculatorText);
    expect(buttons).toHaveLength(4);

    buttons.forEach((button) => {
      expect(button.closest('button')).toHaveClass('bg-green-700');
    });
  });

  it('has correct styling classes', () => {
    // Check main container
    const container = screen.getByTestId('calculators-section');
    expect(container).toHaveClass('container', 'mx-auto', 'py-16', 'px-4', 'w-full');

    // Check main card header
    const header = screen.getByTestId('main-header');
    expect(header).toHaveClass('text-center', 'bg-green-700');

    // Check grid layout
    const grid = screen.getByTestId('calculators-grid');
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-2',
      'gap-8',
      'sm:gap-10'
    );
  });
});
