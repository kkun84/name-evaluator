import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createNameApp } from '../src/components/NameApp.js';

function createStubEvaluationService() {
  const evaluate = vi.fn(async ({ surname, given }) => {
    const buildMetrics = (text) => {
      const characters = Array.from(text || '');
      const breakdown = characters.map((char, index) => ({
        char,
        strokes: index + 1
      }));
      const total = breakdown.reduce((sum, item) => sum + item.strokes, 0);
      return { breakdown, total };
    };

    const surnameMetrics = buildMetrics(surname);
    const givenMetrics = buildMetrics(given);
    const total = surnameMetrics.total + givenMetrics.total;

    return {
      surnameMetrics,
      givenMetrics,
      total,
      fortune: { label: '大吉', tone: 'success', accent: '#d9333f' }
    };
  });

  return {
    evaluate,
    fortunes: [{ label: '大吉', key: 'excellent', tone: 'success', accent: '#d9333f' }]
  };
}

const evaluationService = createStubEvaluationService();
const NameApp = createNameApp({ React, evaluationService });

describe('NameApp component', () => {
  it('shows instructions before any input', () => {
    render(React.createElement(NameApp));
    expect(
      screen.getByText('苗字と名前を入力すると結果が表示されます。')
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
    });

    expect(await screen.findByText('苗字の画数')).toBeInTheDocument();
    expect(await screen.findByText('名前の画数')).toBeInTheDocument();
    expect(await screen.findByText('姓名全体の画数')).toBeInTheDocument();
  });
});
