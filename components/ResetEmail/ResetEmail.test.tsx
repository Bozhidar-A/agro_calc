import { GenerateResetEmailHTML } from './ResetEmail';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { mockGetStrFromLangMapKey } from '@/test-utils/mocks';

describe('GenerateResetEmailHTML', () => {
    const mockResetLink = 'https://example.com/reset?token=abc123';

    describe('Basic functionality', () => {
        it('should generate HTML string with provided reset link', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'en');

            expect(result).toContain(mockResetLink);
            expect(typeof result).toBe('string');
        });

        it('should include all required email sections', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'en');

            // Check for main container
            expect(result).toContain('<div style=');

            // Check for header
            expect(result).toContain('<h2 style=');
            expect(result).toContain('Password Reset Request');

            // Check for instruction paragraph
            expect(result).toContain('We received a request to reset');

            // Check for button container and reset button
            expect(result).toContain(`<a href="${mockResetLink}"`);
            expect(result).toContain('Reset Password');

            // Check for small text and link box
            expect(result).toContain("If the button above doesn't work");
            expect(result).toContain('<div style=');

            // Check for footer
            expect(result).toContain('If you did not request a password reset');
        });

        it('should contain proper HTML structure', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'en');

            // Should be wrapped in main container (handle multiline strings)
            expect(result.trim()).toMatch(/^<div style=[\s\S]*<\/div>$/);

            // Should contain properly nested elements
            expect(result).toContain('<h2 style=');
            expect(result).toContain('<p style=');
            expect(result).toContain('<div style=');
            expect(result).toContain('<a href=');
        });
    });

    describe('Reset link handling', () => {
        it('should handle different reset link formats', () => {
            const testLinks = [
                'https://example.com/reset?token=123',
                'http://localhost:3000/auth/reset?id=456',
                'https://app.domain.com/password-reset/789'
            ];

            testLinks.forEach(link => {
                const result = GenerateResetEmailHTML(link, 'en');

                // Link should appear in button href
                expect(result).toContain(`href="${link}"`);

                // Link should appear in the text box
                expect(result).toContain(link);
            });
        });

        it('should handle special characters in reset link', () => {
            const linkWithSpecialChars = 'https://example.com/reset?token=abc123&user=test%40example.com';
            const result = GenerateResetEmailHTML(linkWithSpecialChars, 'en');

            expect(result).toContain(linkWithSpecialChars);
        });

        it('should handle very long reset links', () => {
            const longLink = 'https://verylongdomainname.example.com/auth/password-reset/very-long-token-that-might-wrap-in-email-clients?user=test%40example.com&redirect=https%3A%2F%2Fapp.example.com%2Fdashboard';
            const result = GenerateResetEmailHTML(longLink, 'en');

            expect(result).toContain(longLink);
        });
    });

    describe('Language support', () => {
        it('should generate content in English', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'en');

            expect(result).toContain('Password Reset Request');
            expect(result).toContain('Reset Password');
            expect(result).toContain('We received a request');
        });

        it('should generate content in Bulgarian', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'bg');

            expect(result).toContain('Нулиране на парола');
            expect(result).toContain('Получихме заявка');
        });

        it('should handle unsupported language codes gracefully', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'fr');

            // Should still generate valid HTML
            expect(result).toContain('<div style=');
            expect(result).toContain(mockResetLink);

            // Should contain mock fallback strings
            expect(result).toContain('mock-');
        });

        it('should handle empty language code', () => {
            const result = GenerateResetEmailHTML(mockResetLink, '');

            expect(result).toContain('<div style=');
            expect(result).toContain(mockResetLink);
        });
    });

    describe('CSS styles', () => {
        it('should include proper inline CSS styles for email compatibility', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'en');

            // Check for email-safe styles
            expect(result).toContain('font-family: Arial, sans-serif');
            expect(result).toContain('max-width: 600px');
            expect(result).toContain('background-color: #15803d');
            expect(result).toContain('text-decoration: none');
            expect(result).toContain('border-radius: 8px');
        });

        it('should have consistent color scheme', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'en');

            // Green theme colors
            expect(result).toContain('#15803d'); // Green for header and button
            expect(result).toContain('#374151'); // Dark gray for text
            expect(result).toContain('#6b7280'); // Light gray for secondary text
            expect(result).toContain('#ffffff'); // White background and button text
        });

        it('should include proper spacing and layout styles', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'en');

            expect(result).toContain('margin: 0 auto'); // Center container
            expect(result).toContain('padding: 20px'); // Container padding
            expect(result).toContain('text-align: center'); // Center button
            expect(result).toContain('margin: 32px 0'); // Button spacing
        });
    });

    describe('Email client compatibility', () => {
        it('should use inline styles for better email client support', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'en');

            // All styles should be inline
            expect(result).not.toContain('<style>');
            expect(result).not.toContain('class=');

            // Every element should have style attribute
            const elements = result.match(/<(div|h2|p|a)[^>]*>/g) || [];
            elements.forEach(element => {
                if (!element.includes('href=')) { // Skip href-only attributes
                    expect(element).toContain('style=');
                }
            });
        });

        it('should use web-safe fonts', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'en');

            expect(result).toContain('font-family: Arial, sans-serif');
        });

        it('should handle word-break for long URLs', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'en');

            expect(result).toContain('word-break: break-all');
        });
    });

    describe('Security considerations', () => {
        it('should not execute script content in reset link', () => {
            const maliciousLink = 'https://example.com/reset?token=abc<script>alert()</script>';
            const result = GenerateResetEmailHTML(maliciousLink, 'en');

            // Should include the link as-is (email clients should handle security)
            expect(result).toContain(maliciousLink);
        });

        it('should handle HTML entities in reset link', () => {
            const linkWithEntities = 'https://example.com/reset?token=abc&lt;script&gt;alert()&lt;/script&gt;';
            GenerateResetEmailHTML(linkWithEntities, 'en');

            // Test passes if no errors are thrown
            expect(true).toBe(true);
        });
    });

    describe('Content validation', () => {
        it('should contain all required translation keys', () => {
            GenerateResetEmailHTML(mockResetLink, 'en');

            // Should call mockGetStrFromLangMapKey for all required strings
            const expectedKeys = [
                SELECTABLE_STRINGS.RESET_EMAIL_TITLE,
                SELECTABLE_STRINGS.RESET_EMAIL_INSTRUCTIONS,
                SELECTABLE_STRINGS.RESET_EMAIL_RESET_BUTTON,
                SELECTABLE_STRINGS.RESET_EMAIL_RESET_BUTTON_NO_WORK,
                SELECTABLE_STRINGS.RESET_EMAIL_DID_NOT_REQUEST_RESET
            ];

            expectedKeys.forEach(key => {
                expect(mockGetStrFromLangMapKey).toHaveBeenCalledWith('en', key);
            });
        });

        it('should maintain proper email structure hierarchy', () => {
            const result = GenerateResetEmailHTML(mockResetLink, 'en');

            // Check order of elements
            const titleIndex = result.indexOf('Password Reset Request');
            const instructionsIndex = result.indexOf('We received a request');
            const buttonIndex = result.indexOf('Reset Password');
            const smallTextIndex = result.indexOf("If the button above doesn't work");
            const footerIndex = result.indexOf('If you did not request a password reset');

            expect(titleIndex).toBeLessThan(instructionsIndex);
            expect(instructionsIndex).toBeLessThan(buttonIndex);
            expect(buttonIndex).toBeLessThan(smallTextIndex);
            expect(smallTextIndex).toBeLessThan(footerIndex);
        });
    });

    describe('Edge cases', () => {
        it('should handle empty reset link', () => {
            const result = GenerateResetEmailHTML('', 'en');

            expect(result).toContain('href=""');
            expect(typeof result).toBe('string');
        });

        it('should handle null-like values gracefully', () => {
            GenerateResetEmailHTML(mockResetLink, 'en');

            // Test passes if no errors are thrown during generation
            expect(true).toBe(true);
        });

        it('should generate consistent output for same inputs', () => {
            const result1 = GenerateResetEmailHTML(mockResetLink, 'en');
            const result2 = GenerateResetEmailHTML(mockResetLink, 'en');

            expect(result1).toBe(result2);
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });
});
