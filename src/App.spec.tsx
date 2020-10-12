import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('should render game field', () => {
        const { getByTestId } = render(<App />);

        expect(getByTestId('game-field')).toBeInTheDocument();
    });

    it('should render game controls', () => {
        const { getByText } = render(<App />);

        expect(getByText('Start')).toBeInTheDocument();
        expect(getByText('Reset')).toBeInTheDocument();
        expect(getByText('Increase')).toBeInTheDocument();
        expect(getByText('Decrease')).toBeInTheDocument();
        expect(getByText('Previous')).toBeInTheDocument();
        expect(getByText('Next')).toBeInTheDocument();
        expect(getByText('Glider')).toBeInTheDocument();
        expect(getByText('Pulsar')).toBeInTheDocument();
        expect(getByText('Beacon')).toBeInTheDocument();
    });
});
