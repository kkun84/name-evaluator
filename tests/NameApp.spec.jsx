import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNameApp } from '../src/components/NameApp.js';
import { createEvaluationService } from '../src/services/evaluationService.js';
import { clearStrokeCache } from '../src/utils/strokeLookup.js';

const STUB_STROKES = {
  山: 3,
  田: 5,
  太: 4,
  郎: 9,
  花: 7,
  子: 3
};

function createFetchStub() {
  return vi.fn(async (url) => {
    const decodedChar = decodeURIComponent(url.split('/').pop());
    if (!(decodedChar in STUB_STROKES)) {
      return {
        ok: false,
        status: 404,
        json: async () => ({})
      };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ stroke_count: STUB_STROKES[decodedChar] })
    };
  });
}

describe('NameApp component', () => {
  let fetchStub;
  let evaluationService;
  let NameApp;

  beforeEach(() => {
    clearStrokeCache();
    fetchStub = createFetchStub();
    evaluationService = createEvaluationService({ strokeOptions: { fetchImpl: fetchStub } });
    NameApp = createNameApp({ React, evaluationService });
  });

  it('shows instructions before any input', () => {
    render(React.createElement(NameApp));
    expect(
      screen.getByText('苗字と名前を入力し、「結果を表示」を押すと結果が表示されます。')
    ).toBeInTheDocument();
  });

  it('renders evaluation after entering both fields', async () => {
    render(React.createElement(NameApp));
    const user = userEvent.setup();

    const surnameInput = screen.getByLabelText('苗字');
    const givenInput = screen.getByLabelText('名前');

    await act(async () => {
      await user.type(surnameInput, '山田');
      await user.type(givenInput, '太郎');
      await user.click(screen.getByRole('button', { name: '結果を表示' }));
    });

    expect(await screen.findByText('苗字の画数')).toBeInTheDocument();
    expect(await screen.findByText('名前の画数')).toBeInTheDocument();
    expect(await screen.findByText('姓名全体の画数')).toBeInTheDocument();
  });
});
