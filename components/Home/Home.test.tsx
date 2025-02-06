import { renderWithProviders, screen, userEvent, waitFor } from '@/test-utils';
import HomePage from '@/components/Home/Home';

// Mock next/router
import Link from "next/link";
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { wrap } from 'module';

describe("HomePage Component", () => {
    beforeEach(() => {
        mockRouter.setCurrentUrl("/"); // Start from home page
    });

    it("renders the heading", () => {
        renderWithProviders(<HomePage />);
        expect(screen.getByText(/Agro-Calc/i)).toBeInTheDocument();
    });

    it("renders the description text", () => {
        renderWithProviders(<HomePage />);
        expect(
            screen.getByText(/Your trusted agricultural calculator/i)
        ).toBeInTheDocument();
    });

    it("renders the Get Started button", () => {
        renderWithProviders(<HomePage />);
        const button = screen.getByRole("button", { name: /get started/i });
        expect(button).toBeInTheDocument();
    });

    it("renders the motion animations", () => {
        renderWithProviders(<HomePage />);
        const heading = screen.getByText(/Agro-Calc/i);
        expect(heading).toHaveClass("text-6xl font-bold");
    });

    it("Get Started button navigates", async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomePage />, {
            wrapper: MemoryRouterProvider,
        });

        // Find and click the link
        const getStartedLink = screen.getByRole("link", { name: /get started/i });
        await user.click(getStartedLink);

        // Verify the router was called with the correct path
        expect(mockRouter.asPath).toBe("/idk");
    });
});