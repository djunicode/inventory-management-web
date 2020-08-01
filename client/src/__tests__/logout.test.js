import React from 'react';
import {
  render,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axiosMock from 'axios';
import NavBar from '../components/NavBar/NavBar';

it('logouts successfully', async () => {
  /* There is a bug related to localStorage testing. 
  Hence we use this method, but changing prototype is not recommeded */

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
  const setMobileOpen = jest.fn();
  const setTabletOpen = jest.fn();
  const mobileOpen = false;
  const tabletOpen = false;

  render(
    <NavBar
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      tabletOpen={tabletOpen}
      setTabletOpen={setTabletOpen}
    />,
    {
      wrapper: MemoryRouter,
    }
  );

  const logout = screen.getByRole('button', { name: /logout/i });

  fireEvent.click(logout);
  const agree = await screen.findByRole('button', { name: /^agree/i });
  fireEvent.click(agree);

  await waitForElementToBeRemoved(() =>
    screen.getByText(/Are you sure you wish to logout?/i)
  );

  expect(axiosMock.post).toHaveBeenCalledTimes(1);
  expect(localStorage.removeItem).toBeCalledWith('token');
  expect(localStorage.removeItem).toBeCalledWith('isStaff');
});
