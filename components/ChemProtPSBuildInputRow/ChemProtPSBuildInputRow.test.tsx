import { screen, fireEvent } from '@testing-library/react';
import { ChemProtPSBuildInputRow } from './ChemProtPSBuildInputRow';
import { ChemProtPercentFormValues } from '@/lib/interfaces';
import { renderWithReduxAndForm } from '@/test-utils/render';

describe('ChemProtPSBuildInputRow', () => {
    const defaultValues = {
        desiredPercentage: 0,
        sprayerVolume: 0,
        calculatedAmount: 0
    };

    const renderComponent = () => {
        return renderWithReduxAndForm<ChemProtPercentFormValues>(
            (props) => (
                <ChemProtPSBuildInputRow
                    varName="desiredPercentage"
                    displayName="Test Display"
                    form={props.form}
                    icon={<span>icon</span>}
                    unit="ml"
                    tourId="test-tour"
                />
            ),
            { reactFormDefaultValues: defaultValues }
        );
    };

    beforeEach(() => {
        renderComponent();
    });

    it('renders with correct display name', () => {
        expect(screen.getByText('Test Display')).toBeInTheDocument();
    });

    it('renders with correct unit', () => {
        expect(screen.getByText('0 ml')).toBeInTheDocument();
    });

    it('renders with correct tour ID', () => {
        const card = screen.getByTestId('test-tour');
        expect(card).toHaveAttribute('id', 'test-tour');
    });

    it('renders the icon', () => {
        expect(screen.getByText('icon')).toBeInTheDocument();
    });

    it('has correct styling classes', () => {
        const header = screen.getByTestId('test-tour').querySelector('.bg-green-700');
        expect(header).toHaveClass('bg-green-700', 'pb-2');
    });

    it('updates input value and display when changed', () => {
        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '42' } });
        expect(input).toHaveValue(42);
        expect(screen.getByText('42 ml')).toBeInTheDocument();
    });

    it('sets value to 0 when input is empty', () => {
        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '' } });
        expect(input).toHaveValue(0);
        expect(screen.getByText('0 ml')).toBeInTheDocument();
    });

    it('sets value to 0 when input is not a number', () => {
        const input = screen.getByRole('spinbutton');
        // Note: type="number" inputs typically prevent non-numeric input,
        // but we test the handler logic anyway
        fireEvent.change(input, { target: { value: 'not-a-number' } });
        expect(input).toHaveValue(0);
        expect(screen.getByText('0 ml')).toBeInTheDocument();
    });
}); 