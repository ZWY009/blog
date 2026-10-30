import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest 未开启 globals 时，testing-library 不会自动注册清理钩子；
// 不手动清理会让上一个用例的 DOM 残留，出现「找到多个元素」的假失败。
afterEach(() => {
  cleanup();
});
