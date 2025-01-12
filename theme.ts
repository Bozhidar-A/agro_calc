'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  components: {
    ActionIcon: {
      defaultProps: {
        color: 'light-dark(var(--mantine-color-black), var(--mantine-color-white))'
      }
    }
  }
});
