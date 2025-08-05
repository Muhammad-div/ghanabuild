import { render, screen } from '@testing-library/react';
import EstimatorForm from './EstimatorForm';

test('renders EstimatorForm', () => {
  render(<EstimatorForm />);
  const linkElement = screen.getByText(/Estimator Form/i);
  expect(linkElement).toBeInTheDocument();
});
