import React from 'react';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axiosMock from 'axios';
import Home from '../components/Home/Home';

it('logouts successfully', async () => {
  /* There is a bug related to localStorage testing. Hence we use this method, but changing prototype is not recommeded */

  /* localStorage Mock* */
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  Object.setPrototypeOf(global.localStorage, localStorageMock);

  /* axios Mock resolved value */
  axiosMock.post.mockResolvedValue({
    data: {},
  });
  const { getByText } = render(<Home />, {
    wrapper: MemoryRouter,
  });

  const logout = getByText('Logout');

  await act(async () => {
    await fireEvent.click(logout);
  });

  expect(axiosMock.post).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem).toBeCalledWith('token');
  expect(localStorage.removeItem).toBeCalledWith('token');
});
