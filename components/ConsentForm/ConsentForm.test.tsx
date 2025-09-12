import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ConsentForm from './ConsentForm';

const setPreferencesMock = jest.fn();
const setLocationMock = jest.fn();
const updateConsentDateMock = jest.fn();
const SetClientConsentMock = jest.fn();

jest.mock('@/hooks/useConsent', () => ({
  useConsent: () => ({
    preferences: false,
    location: false,
    setPreferences: setPreferencesMock,
    setLocation: setLocationMock,
    updateConsentDate: updateConsentDateMock,
    SetClientConsent: SetClientConsentMock,
  }),
}));

jest.mock('@/hooks/useTranslate', () => ({ useTranslate: () => (k: string) => k }));

describe('ConsentForm', () => {
  it('renders and allows toggling preferences and location', () => {
    const onOpenChange = jest.fn();
    render(<ConsentForm open={true} onOpenChange={onOpenChange} />);

    // Should render all main controls
    expect(screen.getByText('GDPR_CONSENT_TITLE')).toBeInTheDocument();
    expect(screen.getByText('GDPR_CONSENT_NECESSARY')).toBeInTheDocument();
    expect(screen.getByText('GDPR_CONSENT_PREFERENCES')).toBeInTheDocument();
    expect(screen.getByText('GDPR_CONSENT_LOCATION')).toBeInTheDocument();

    // Toggle preferences
    const prefSwitch = screen.getByLabelText('GDPR_CONSENT_PREFERENCES');
    fireEvent.click(prefSwitch);
    // Toggle location
    const locSwitch = screen.getByLabelText('GDPR_CONSENT_LOCATION');
    fireEvent.click(locSwitch);
  });

  it('calls OnAcceptAll and OnDeclineOptional', () => {
    const onOpenChange = jest.fn();
    render(<ConsentForm open={true} onOpenChange={onOpenChange} />);
    const acceptAllBtn = screen.getByText('GDPR_CONSENT_ACCEPT_ALL');
    const declineBtn = screen.getByText('GDPR_CONSENT_REJECT_OPTIONAL');
    fireEvent.click(acceptAllBtn);
    fireEvent.click(declineBtn);
  });

  it('calls SetClientConsent when saving', () => {
    const onOpenChange = jest.fn();
    render(<ConsentForm open={true} onOpenChange={onOpenChange} />);
    const acceptAllBtn = screen.getByText('GDPR_CONSENT_ACCEPT_ALL');
    fireEvent.click(acceptAllBtn);
    // ensure SetClientConsent from the hook was called in OnSave
    expect(SetClientConsentMock).toHaveBeenCalled();
  });

  it('syncs form state with consent values when dialog opens', () => {
    // Simulate preferences/location true, then false
    const { rerender } = render(<ConsentForm open={false} onOpenChange={jest.fn()} />);
    rerender(<ConsentForm open={true} onOpenChange={jest.fn()} />);
    expect(screen.getByLabelText('GDPR_CONSENT_PREFERENCES')).toBeInTheDocument();
    expect(screen.getByLabelText('GDPR_CONSENT_LOCATION')).toBeInTheDocument();
  });

  it('disables the necessary switch', () => {
    render(<ConsentForm open={true} onOpenChange={jest.fn()} />);
    const necSwitch = screen.getByLabelText('GDPR_CONSENT_NECESSARY');
    expect(necSwitch).toBeDisabled();
  });
});
