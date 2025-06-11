import { render, screen } from '@testing-library/react';
import SimpleIconToSVG from './SimpleIconToSVG';
import type { SimpleIcon } from 'simple-icons';

describe('SimpleIconToSVG', () => {
    const mockIcon: SimpleIcon = {
        title: 'Test Icon',
        slug: 'test-icon',
        hex: '000000',
        source: 'https://test-icon.com',
        svg: '<svg>test</svg>',
        path: 'M0 0h24v24H0z'
    };

    it('renders the SVG with correct title', () => {
        render(<SimpleIconToSVG icon={mockIcon} />);
        expect(screen.getByTitle('Test Icon')).toBeInTheDocument();
    });

    it('renders the SVG with correct path', () => {
        render(<SimpleIconToSVG icon={mockIcon} />);
        const svgPath = document.querySelector('path');
        expect(svgPath).toHaveAttribute('d', 'M0 0h24v24H0z');
    });

    it('has the correct SVG attributes', () => {
        render(<SimpleIconToSVG icon={mockIcon} />);
        const svg = screen.getByRole('img');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
        expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
        expect(svg).toHaveClass('fill-current', 'text-foreground');
    });
}); 