import type { Meta, StoryObj } from '@storybook/react';

import WelcomeStory from './Welcome.story';

const meta = {
  component: WelcomeStory,
} satisfies Meta<typeof WelcomeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};