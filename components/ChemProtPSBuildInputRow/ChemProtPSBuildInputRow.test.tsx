import { render, screen, fireEvent } from '@testing-library/react';
import { ChemProtPSBuildInputRow } from './ChemProtPSBuildInputRow';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { ChemProtPercentFormValues } from '@/lib/interfaces';

describe('ChemProtPSBuildInputRow', () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }) => {
        const methods = useForm<ChemProtPercentFormValues>({
            defaultValues: {
                desiredPercentage: 0,
                sprayerVolume: 0,
                calculatedAmount: 0
            }
        });

        return <FormProvider {...methods}>{children}</FormProvider>;
    };

    const WrappedComponent = () => {
        const form = useFormContext<ChemProtPercentFormValues>();
        const mockProps = {
            varName: 'desiredPercentage' as keyof ChemProtPercentFormValues,
            displayName: 'Test Display',
            form,
            icon: <span>icon</span>,
            unit: 'ml',
            tourId: 'test-tour'
        };

        return <ChemProtPSBuildInputRow {...mockProps} />;
    };

    const renderComponent = () => {
        return render(
            <TestWrapper>
                <WrappedComponent />
            </TestWrapper>
        );
    };

    it('renders with correct display name', () => {
        renderComponent();
        expect(screen.getByText('Test Display')).toBeInTheDocument();
    });

    it('renders with correct unit', () => {
        renderComponent();
        expect(screen.getByText('0 ml')).toBeInTheDocument();
    });

    it('renders with correct tour ID', () => {
        renderComponent();
        const card = screen.getByTestId('test-tour');
        expect(card).toHaveAttribute('id', 'test-tour');
    });

    it('renders the icon', () => {
        renderComponent();
        expect(screen.getByText('icon')).toBeInTheDocument();
    });

    it('has correct styling classes', () => {
        renderComponent();
        const header = screen.getByTestId('test-tour').querySelector('.bg-green-700');
        expect(header).toHaveClass('bg-green-700', 'pb-2');
    });

    it('updates input value and display when changed', () => {
        renderComponent();
        const input = screen.getByRole('spinbutton');

        fireEvent.change(input, { target: { value: '42' } });

        expect(input).toHaveValue(42);
        expect(screen.getByText('42 ml')).toBeInTheDocument();
    });

    it('sets value to 0 when input is empty', () => {
        renderComponent();
        const input = screen.getByRole('spinbutton');

        fireEvent.change(input, { target: { value: '' } });

        expect(input).toHaveValue(0);
        expect(screen.getByText('0 ml')).toBeInTheDocument();
    });

    it('sets value to 0 when input is not a number', () => {
        renderComponent();
        const input = screen.getByRole('spinbutton');

        // Note: type="number" inputs typically prevent non-numeric input,
        // but we test the handler logic anyway
        fireEvent.change(input, { target: { value: 'not-a-number' } });

        expect(input).toHaveValue(0);
        expect(screen.getByText('0 ml')).toBeInTheDocument();
    });
}); 