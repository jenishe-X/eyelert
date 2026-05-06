/** Virtual module provided when Cursor compiles `.canvas.tsx` previews. */
declare module "cursor/canvas" {
  import type { ComponentType, CSSProperties, ReactNode } from "react";

  export interface StackProps {
    gap?: number;
    children?: ReactNode;
    style?: CSSProperties;
  }
  export const Stack: ComponentType<StackProps>;

  export interface GridProps {
    columns?: number;
    gap?: number;
    children?: ReactNode;
    style?: CSSProperties;
  }
  export const Grid: ComponentType<GridProps>;

  export interface RowProps {
    gap?: number;
    children?: ReactNode;
    style?: CSSProperties;
  }
  export const Row: ComponentType<RowProps>;

  export interface TextProps {
    tone?: "secondary";
    size?: "small";
    children?: ReactNode;
    style?: CSSProperties;
  }
  export const Text: ComponentType<TextProps>;

  export interface H1Props {
    children?: ReactNode;
    style?: CSSProperties;
  }
  export const H1: ComponentType<H1Props>;
  export const H2: ComponentType<H1Props>;
  export const H3: ComponentType<H1Props>;

  export interface DividerProps {
    style?: CSSProperties;
  }
  export const Divider: ComponentType<DividerProps>;

  export interface CardProps {
    children?: ReactNode;
    style?: CSSProperties;
  }
  export const Card: ComponentType<CardProps>;

  export interface CardHeaderProps {
    title?: string;
    children?: ReactNode;
    trailing?: ReactNode;
    style?: CSSProperties;
  }
  export const CardHeader: ComponentType<CardHeaderProps>;

  export interface CardBodyProps {
    children?: ReactNode;
    padding?: number | string;
    style?: CSSProperties;
  }
  export const CardBody: ComponentType<CardBodyProps>;

  export interface PillProps {
    tone?: "info" | "warning" | "success";
    children?: ReactNode;
    style?: CSSProperties;
  }
  export const Pill: ComponentType<PillProps>;

  export interface TableProps {
    headers: string[];
    rows: string[][];
    rowTone?: Array<"warning" | "success" | "danger" | undefined>;
    style?: CSSProperties;
  }
  export const Table: ComponentType<TableProps>;

  export interface CalloutProps {
    tone?: "info" | "warning" | "success" | "danger";
    title?: string;
    children?: ReactNode;
    style?: CSSProperties;
  }
  export const Callout: ComponentType<CalloutProps>;
}

declare module "react/jsx-runtime" {
  import type { ElementType, Key, ReactElement } from "react";
  export function jsx(
    type: ElementType,
    props: unknown,
    key?: Key | null
  ): ReactElement;
  export function jsxs(
    type: ElementType,
    props: unknown,
    key?: Key | null
  ): ReactElement;
}
