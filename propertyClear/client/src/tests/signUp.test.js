import React from 'react';
import { render, fireEvent, screen } from "@testing-library/react";
import SignUp from "../signUp";
import { act } from "react";


global.fetch = jest.fn();

describe("SignUp Component", () => {

    beforeEach(() => {
        global.alert = jest.fn(); // Mock alert globally
    });


    afterEach(() => {
        jest.clearAllMocks();
    });


    test("should sign up a user successfully", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ message: "User signed up successfully" }),
        });

        render(<SignUp />);

        fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Test User" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
        fireEvent.change(screen.getByPlaceholderText("Role Number"), { target: { value: 1 } });

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
        });


        expect(fetch).toHaveBeenCalledWith("http://localhost:5001/api/users/register", expect.anything());
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for async updates
    });
});
