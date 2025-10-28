import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

const fillNameForm = async (surname: string, given: string) => {
  const surnameInput = screen.getByLabelText('姓');
  const givenInput = screen.getByLabelText('名');
  await userEvent.clear(surnameInput);
  await userEvent.clear(givenInput);
  await userEvent.type(surnameInput, surname);
  await userEvent.type(givenInput, given);
};

describe('App', () => {
  it('renders the landing instructions', () => {
    render(<App />);
    expect(screen.getByText('鑑定の流れ')).toBeInTheDocument();
  });

  it('produces a result after submitting a valid name', async () => {
    render(<App />);
    await fillNameForm('山田', '花子');
    const submitButton = screen
      .getAllByRole('button', { name: '鑑定する' })
      .find((button) => !button.hasAttribute('disabled'));
    expect(submitButton).toBeDefined();
    await userEvent.click(submitButton!);
    expect(await screen.findByText('総合結果')).toBeInTheDocument();
    expect(screen.getAllByText('総合運').length).toBeGreaterThan(0);
  });
});
