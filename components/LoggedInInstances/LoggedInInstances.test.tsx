import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoggedInInstances from "./LoggedInInstances";
import { APICaller } from "@/lib/api-util";

// Mock useTranslate to return key
jest.mock("@/hooks/useTranslate", () => ({
    useTranslate: () => (key: string) => key
}));

// Use a shared push mock for router
const push = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push })
}));

const mockTokens = [
    {
        id: "token1",
        createdAt: Date.now(),
        expiresAt: Date.now() + 10000,
        userInfo: "User1 Info"
    },
    {
        id: "token2",
        createdAt: Date.now(),
        expiresAt: Date.now() + 20000,
        userInfo: "User2 Info"
    }
];

describe("LoggedInInstances", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders loading state initially", async () => {
        (APICaller as jest.Mock).mockImplementation(() => new Promise(() => { }));
        render(<LoggedInInstances userId="user123" />);
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it("renders errored state if API fails", async () => {
        (APICaller as jest.Mock).mockResolvedValueOnce({ success: false });
        render(<LoggedInInstances userId="user123" />);
        await waitFor(() => {
            expect(screen.getByTestId("error-component")).toBeInTheDocument();
        });
    });

    it("renders tokens if API succeeds", async () => {
        (APICaller as jest.Mock).mockResolvedValueOnce({ success: true, data: mockTokens });
        render(<LoggedInInstances userId="user123" />);
        await waitFor(() => {
            expect(screen.getAllByText(/User Info/i)).toHaveLength(2);
            expect(screen.getByText(/User1 Info/)).toBeInTheDocument();
            expect(screen.getByText(/User2 Info/)).toBeInTheDocument();
        });
    });

    it("shows no sessions message if tokens empty", async () => {
        (APICaller as jest.Mock).mockResolvedValueOnce({ success: true, data: [] });
        render(<LoggedInInstances userId="user123" />);
        await waitFor(() => {
            expect(screen.getByText("NO_OTHER_SESSIONS")).toBeInTheDocument();
        });
    });

    it("calls HandleKillSession and refreshes tokens", async () => {
        (APICaller as jest.Mock)
            .mockResolvedValueOnce({ success: true, data: mockTokens }) // initial fetch
            .mockResolvedValueOnce({ success: true }) // endSession
            .mockResolvedValueOnce({ success: true, data: mockTokens }); // refetch

        render(<LoggedInInstances userId="user123" />);

        await waitFor(() => {
            expect(screen.getAllByText(/User Info/i)).toHaveLength(2);
        });

        const logoutButtons = screen.getAllByRole('button', { name: /^Logout$/i });
        fireEvent.click(logoutButtons[0]);

        await waitFor(() => {
            const calls = (APICaller as jest.Mock).mock.calls;

            // Ensure the endSession POST with correct payload happened
            expect(calls).toEqual(
                expect.arrayContaining([
                    [
                        ["user", "sessions", "fetch"],
                        "/api/auth/sessions/endSession",
                        "POST",
                        { tokenId: "token1" }
                    ]
                ])
            );

            expect(calls).toEqual(
                expect.arrayContaining([
                    [["user", "sessions", "fetch"], "/api/auth/sessions/fetch", "GET"]
                ])
            );
        });
    });

    it("calls HandleKillAllSessions and redirects", async () => {
        (APICaller as jest.Mock)
            .mockResolvedValueOnce({ success: true, data: mockTokens }) // initial fetch
            .mockResolvedValueOnce({ success: true }); // endAllSessions

        render(<LoggedInInstances userId="user123" />);

        await waitFor(() => {
            expect(screen.getAllByText(/User Info/i)).toHaveLength(2);
        });

        const logoutAllBtn = screen.getByRole('button', { name: /^Logout All$/i });
        fireEvent.click(logoutAllBtn);

        await waitFor(() => {
            expect(APICaller).toHaveBeenCalledWith(
                ["user", "sessions", "fetch"],
                "/api/auth/sessions/endAllSessions",
                "GET"
            );
            expect(push).toHaveBeenCalledWith('/auth/login?updateAuthState=forceLogout');
        });
    });
});
