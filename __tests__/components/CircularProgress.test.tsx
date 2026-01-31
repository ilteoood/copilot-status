import { fireEvent, render, screen } from '@testing-library/react-native';
import { CircularProgress } from '@/components/CircularProgress';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'quota.used': 'USED',
        'quota.available': 'AVAILABLE',
        'quota.toggleToAvailable': 'Show available quota',
        'quota.toggleToUsed': 'Show used quota',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock react-native-pie-chart
jest.mock('react-native-pie-chart', () => {
  const { View } = require('react-native');
  return function MockPieChart() {
    return <View testID="mock-pie-chart" />;
  };
});

// Mock useUnistyles
jest.mock('react-native-unistyles', () => ({
  useUnistyles: () => ({
    theme: {
      colors: {
        critical: '#ff0000',
        warning: '#ff9900',
        good: '#00ff00',
        border: '#cccccc',
        text: '#000000',
        icon: '#666666',
      },
      spacing: {
        lg: 16,
      },
      typography: {
        fontWeights: {
          bold: '700',
          medium: '500',
        },
        fontSizes: {
          '5xl': 32,
        },
      },
    },
  }),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

describe('CircularProgress', () => {
  const defaultProps = {
    usedQuota: 50,
    totalQuota: 100,
    size: 200,
  };

  it('renders correctly with initial state showing used quota', () => {
    render(<CircularProgress {...defaultProps} />);

    expect(screen.getByText('50%')).toBeTruthy();
    expect(screen.getByText('USED')).toBeTruthy();
  });

  it('toggles to show available quota when pressed', () => {
    render(<CircularProgress {...defaultProps} />);

    expect(screen.getByText('50%')).toBeTruthy();
    expect(screen.getByText('USED')).toBeTruthy();

    const pressable = screen.getByRole('button');
    fireEvent.press(pressable);

    expect(screen.getByText('50%')).toBeTruthy();
    expect(screen.getByText('AVAILABLE')).toBeTruthy();
  });

  it('toggles back to used quota when pressed again', () => {
    render(<CircularProgress {...defaultProps} />);

    const pressable = screen.getByRole('button');

    fireEvent.press(pressable);
    expect(screen.getByText('AVAILABLE')).toBeTruthy();

    fireEvent.press(pressable);
    expect(screen.getByText('USED')).toBeTruthy();
  });

  it('calculates percentages correctly for different quota values', () => {
    const { rerender } = render(<CircularProgress usedQuota={75} totalQuota={100} size={200} />);

    expect(screen.getByText('75%')).toBeTruthy();

    const pressable = screen.getByRole('button');
    fireEvent.press(pressable);

    expect(screen.getByText('25%')).toBeTruthy();

    rerender(<CircularProgress usedQuota={90} totalQuota={100} size={200} />);

    expect(screen.getByText('10%')).toBeTruthy();
  });

  it('handles edge case with 0 total quota', () => {
    render(<CircularProgress usedQuota={0} totalQuota={0} size={200} />);

    expect(screen.getByText('0%')).toBeTruthy();
    expect(screen.getByText('USED')).toBeTruthy();
  });

  it('handles edge case with full quota usage', () => {
    render(<CircularProgress usedQuota={100} totalQuota={100} size={200} />);

    expect(screen.getByText('100%')).toBeTruthy();

    const pressable = screen.getByRole('button');
    fireEvent.press(pressable);

    expect(screen.getByText('0%')).toBeTruthy();
    expect(screen.getByText('AVAILABLE')).toBeTruthy();
  });
});
