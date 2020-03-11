import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axiosMock from 'axios';
import App from './App';
import Home from './components/Home/Home';

it('opens homepage after successful login', async () => {
  axiosMock.post.mockResolvedValue({
    data: { auth_token: '49848aadad98a8c8acc8a4c84' },
  });
  const { getByText, getAllByDisplayValue, getByTestId } = render(<App />, {
    wrapper: MemoryRouter,
  });
  const submitBtn = getByTestId('submit');
  const inputs = getAllByDisplayValue('');
  const emailInput = inputs[0];
  const passwordInput = inputs[1];
  await act(async () => {
    await fireEvent.change(emailInput, {
      target: { value: 'admin@admin.com' },
    });
    fireEvent.change(passwordInput, { target: { value: 'admin' } });

    fireEvent.click(submitBtn);
  });

  expect(axiosMock.post).toHaveBeenCalled();
  const homepage = getByText('Inventory Management Home');
  expect(homepage).toBeInTheDocument();
});
