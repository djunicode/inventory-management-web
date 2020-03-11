import React from 'react';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axiosMock from 'axios';
import Login from '../components/Login/Login';

afterEach(cleanup);

it('Updates the state after inputting text', () => {
  const { getAllByDisplayValue } = render(<Login />, {
    wrapper: MemoryRouter,
  });

  const inputs = getAllByDisplayValue('');
  const emailInput = inputs[0];
  const passwordInput = inputs[1];

  expect(emailInput.value).toBe('');
  expect(passwordInput.value).toBe('');

  fireEvent.change(emailInput, { target: { value: 'myemail@gmail.com' } });
  fireEvent.change(passwordInput, { target: { value: 'hunter2' } });

  expect(emailInput.value).toBe('myemail@gmail.com');
  expect(passwordInput.value).toBe('hunter2');
});

it('shows error message on submiting empty fields', () => {
  const { getAllByText, getAllByDisplayValue, getByTestId } = render(
    <Login />,
    {
      wrapper: MemoryRouter,
    }
  );

  const inputs = getAllByDisplayValue('');
  const emailInput = inputs[0];
  const passwordInput = inputs[1];

  fireEvent.change(emailInput, { target: { value: '' } });
  fireEvent.change(passwordInput, { target: { value: '' } });

  const submitBtn = getByTestId('submit');
  fireEvent.click(submitBtn);

  const errors = getAllByText('Please fill out this field');

  expect(errors.length).toBe(2);
  expect(errors[0]).toBeInTheDocument();
  expect(errors[1]).toBeInTheDocument();
});

it('shows error message on submiting an invalid email', () => {
  const { getByText, getByTestId, getAllByDisplayValue } = render(<Login />, {
    wrapper: MemoryRouter,
  });

  const inputs = getAllByDisplayValue('');
  const emailInput = inputs[0];
  fireEvent.change(emailInput, { target: { value: 'myemail' } });

  const submitBtn = getByTestId('submit');
  fireEvent.click(submitBtn);

  const error = getByText('Please enter a valid email');
  expect(error).toBeInTheDocument();
});

it('shows error message on submiting an password smaller than 5 characters', () => {
  const { getByText, getAllByDisplayValue, getByTestId } = render(<Login />, {
    wrapper: MemoryRouter,
  });

  const inputs = getAllByDisplayValue('');
  const passwordInput = inputs[1];

  fireEvent.change(passwordInput, { target: { value: 'pass' } });

  const submitBtn = getByTestId('submit');
  fireEvent.click(submitBtn);

  const error = getByText('Password should have more than 5 characters');
  expect(error).toBeInTheDocument();
});

it('shows error message on submiting invalid credentials', async () => {
  /* axios Mock rejected value */
  axiosMock.post.mockRejectedValue({
    data: {},
  });

  const { getByText, getAllByDisplayValue, getByTestId } = render(<Login />, {
    wrapper: MemoryRouter,
  });

  const submitBtn = getByTestId('submit');
  const inputs = getAllByDisplayValue('');
  const emailInput = inputs[0];
  const passwordInput = inputs[1];

  await act(async () => {
    await fireEvent.change(emailInput, {
      target: { value: 'myemail@gmail.com' },
    });
    fireEvent.change(passwordInput, { target: { value: 'hunter2' } });

    fireEvent.click(submitBtn);
  });

  const err = getByText('Invalid email or password. Please try again');

  expect(axiosMock.post).toHaveBeenCalledTimes(1);
  expect(err).toBeVisible();
});

it('successfully logs in to home page', async () => {
  /* There is a bug related to localStorage testing. Hence we use this method, but changing prototype is not recommeded */

  /* localStorage Mock* */
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.setPrototypeOf(global.localStorage, localStorageMock);

  /* axios Mock resolved value */
  axiosMock.post.mockResolvedValue({
    data: { auth_token: '49848aadad98a8c8acc8a4c84' },
  });

  const { getByText, getAllByDisplayValue, getByTestId } = render(<Login />, {
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

  const err = getByText('Invalid email or password. Please try again');

  expect(axiosMock.post).toHaveBeenCalled();
  expect(err).not.toBeVisible();
  expect(localStorage.setItem).toBeCalledWith(
    'token',
    '49848aadad98a8c8acc8a4c84'
  );
});
