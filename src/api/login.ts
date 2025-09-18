import type { LoginRequest, LoginResponse } from '../types/index.ts';

const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch('https://api.redseam.redberryinternship.ge/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Login failed: ' + (errorData.message || response.statusText));
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Login failed: ' + error.message);
    }
    throw new Error('Login failed: Unknown error');
  }
};

export default loginUser;