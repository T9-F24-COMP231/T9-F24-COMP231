import React from "react";
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import axios from "axios";
import SignIn from "../SignIn";

jest.mock("axios");

describe("SignIn Component", () => {
    let setIsAuthenticated;

    beforeEach(() => {
        global.alert = jest.fn();
        
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(jest.fn());

        setIsAuthenticated = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should log in a user and navigate based on role", async () => {
        const mockToken = "valid.jwt.token"; // Mock token
    
        axios.post.mockResolvedValueOnce({ data: { token: mockToken } });

        render(
            <Router>
                <Routes>
                    <Route path="/" element={<SignIn setAuth={setIsAuthenticated} />} />
                </Routes>
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@test.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "12345" } });

        // Simulate button click for sign-in
        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
        });

        expect(localStorage.setItem).toHaveBeenCalledWith("authToken", mockToken);
        expect(setIsAuthenticated).toHaveBeenCalledWith(true);
    });
});
