import type { RegisterRequest, RegisterResponse } from '../types/index.ts';

const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('password_confirmation', data.password_confirmation);
  if (data.avatar) {
    formData.append('avatar', data.avatar);
  }

  try {
    const response = await fetch('https://api.redseam.redberryinternship.ge/api/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unknown error');
  }
};

export default registerUser;
