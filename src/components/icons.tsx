import type { SVGProps } from 'react';

export function AutoFlowLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19.62 3.88a1 1 0 0 1 1.23.78l1 4a1 1 0 0 1-.58 1.24l-3.5 1.75a1 1 0 0 1-1.24-.58l-1-4A1 1 0 0 1 16.12 6Z" />
      <path d="m13.38 8.88-2.5 1.25a1 1 0 0 1-1.24-.58l-1-4A1 1 0 0 1 9.22 4h0a1 1 0 0 1 1.24.58l2.5 5.25a1 1 0 0 1-.58 1.24Z" />
      <path d="m8.38 13.88-2.5 1.25a1 1 0 0 1-1.24-.58l-1-4a1 1 0 0 1 .58-1.24l3.5-1.75a1 1 0 0 1 1.24.58l1 4a1 1 0 0 1-.58 1.24Z" />
      <path d="M12 12v1.9a1 1 0 0 1-.6.9L4 18" />
      <path d="M12 12v-2a1 1 0 0 0-.6-.9L8 7" />
      <path d="M12 12h1.9a1 1 0 0 0 .9-.6l2-4" />
      <path d="M12 12h-2a1 1 0 0 0-.9.6l-2 4" />
      <path d="m14.62 19.88.78-1.23a1 1 0 0 0-.58-1.24l-3.5-1.75a1 1 0 0 0-1.24.58l-.78 1.23a1 1 0 0 0 .58 1.24l3.5 1.75a1 1 0 0 0 1.24-.58Z" />
    </svg>
  );
}
