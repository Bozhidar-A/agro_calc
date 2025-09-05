import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock ConsentForm once at top-level to a simple element that reflects the `open` prop
// jest.mock('@/components/ConsentForm/ConsentForm', () => ({
//     __esModule: true,
//     default: (props: any) => {
//         const React = require('react');
//         return React.createElement(
//             'div',
//             { 'data-testid': 'consent-mock' },
//             React.createElement('span', { 'data-testid': 'consent-open' }, String(props.open)),
//             React.createElement(
//                 'button',
//                 { 'data-testid': 'consent-close', onClick: () => props.onOpenChange?.(false) },
//                 'close'
//             )
//         );
//     },
// }));

import { ConsentProvider } from './ConsentProvider';

describe('ConsentProvider', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders children and does not show ConsentForm when local storage has consent', async () => {
        const localstorage = require('@/lib/localstorage-util');
        localstorage.GetLocalStorageItem.mockReturnValue({ necessary: true, preferences: false, location: false });

        render(
            <ConsentProvider>
                <div data-testid="child">child</div>
            </ConsentProvider>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('consent-mock')).toBeNull();
        });
    });

    it('shows ConsentForm when local storage missing', async () => {
        const localstorage = require('@/lib/localstorage-util');
        localstorage.GetLocalStorageItem.mockReturnValue(null);

        render(
            <ConsentProvider>
                <div data-testid="child">child</div>
            </ConsentProvider>
        );

        const consent = await screen.findByTestId('consent-form');
        expect(consent).toBeInTheDocument();
    });
});