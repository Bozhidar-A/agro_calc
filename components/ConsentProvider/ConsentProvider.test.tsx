import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { ConsentProvider } from './ConsentProvider';

describe('ConsentProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children and does not show ConsentForm when local storage has consent', async () => {
    const localstorage = require('@/lib/localstorage-util');
    localstorage.GetLocalStorageItem.mockReturnValue({
      necessary: true,
      preferences: false,
      location: false,
    });

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
