import type { ReactNode } from 'react';

export interface IButton {
  children: string | ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export enum ButtonVariant {
  Outline = 'outline',
  Contained = 'contained',
  Default = 'default',
}

export enum ButtonSize {
  Large = 'large',
  Medium = 'medium',
}
