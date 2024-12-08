import axios from "axios";
import { signup, signin, signout } from "../auth";

jest.mock("axios");

describe("Auth Module", () => {

    beforeEach(() => {
        global.alert = jest.fn(); // Mock alert globally
    });


    afterEach(() => {
        jest.clearAllMocks();
    });


    test("signup: should send a POST request to register a user", async () => {
        const mockResponse = { message: "User registered successfully" };
        axios.post.mockResolvedValueOnce({ data: mockResponse });

        const result = await signup("test@example.com", "password123", "Test User", 1);

        expect(axios.post).toHaveBeenCalledWith(
            `${process.env.REACT_APP_APP_URL}/api/users/register`,
            {
                email: "test@example.com",
                password: "password123",
                name: "Test User",
                roleNumber: 1,
            }
        );
        expect(result).toEqual(mockResponse);
    });

    test("signin: should send a POST request to log in a user", async () => {
        const mockResponse = { token: "test-token" };
        axios.post.mockResolvedValueOnce({ data: mockResponse });

        const result = await signin("test@example.com", "password123");

        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:5001/api/users/login",
            {
                email: "test@example.com",
                password: "password123",
            }
        );
        expect(result).toEqual(mockResponse);
    });

    test("signout: should send a POST request to log out the user", async () => {
        const mockResponse = { message: "Sign-out successful" };
        axios.post.mockResolvedValueOnce({ data: mockResponse });

        const result = await signout();

        expect(axios.post).toHaveBeenCalledWith("http://localhost:5001/api/users/logout");
        expect(result).toEqual(mockResponse);
    });
});
