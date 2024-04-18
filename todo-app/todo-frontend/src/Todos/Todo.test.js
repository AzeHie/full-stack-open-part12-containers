import React from 'react';
import { render, screen } from '@testing-library/react';
import Todo from './Todo';

describe('Todo component', () => {
  it('renders todo', () => {
    const todo = { text: 'TEST TODO', done: false };
    const onClickComplete = jest.fn();
    const onClickDelete = jest.fn();

    render(
      <Todo
        todo={todo}
        onClickComplete={onClickComplete}
        onClickDelete={onClickDelete}
      />
    );

    const element = screen.getByText('TEST TODO');
    expect(element).toBeDefined();
  });
});
