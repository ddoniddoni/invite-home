import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmptyState } from '../empty-state';
import { ErrorBanner } from '../error-banner';
import { LoadingView } from '../loading-view';

describe('shared status views', () => {
  it('로딩과 빈 상태를 접근 가능한 문구로 노출한다', async () => {
    const loadingView = await render(<LoadingView message="집을 불러오는 중이에요." />);

    expect(
      screen.getByRole('progressbar', { name: '집을 불러오는 중이에요.' }),
    ).toBeTruthy();

    await loadingView.unmount();
    await render(<EmptyState title="메모가 없어요" description="첫 메모를 기다리고 있어요." />);

    expect(
      screen.getByLabelText('메모가 없어요. 첫 메모를 기다리고 있어요.'),
    ).toBeTruthy();
  });

  it('오류 배너의 재시도 동작을 제공한다', async () => {
    const onRetry = jest.fn();

    await render(<ErrorBanner onRetry={onRetry} />);
    await fireEvent.press(screen.getByRole('button', { name: '다시 시도' }));

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
