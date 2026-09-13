export function PawIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <ellipse cx="7" cy="8.2" rx="1.7" ry="2.2" />
      <ellipse cx="12" cy="6.6" rx="1.8" ry="2.4" />
      <ellipse cx="17" cy="8.2" rx="1.7" ry="2.2" />
      <ellipse cx="20.2" cy="12.4" rx="1.4" ry="1.9" />
      <path d="M12 11.2c3 0 5.6 2.3 5.6 4.9 0 2-1.6 3.1-3.4 2.8-1-.2-1.5-.5-2.2-.5s-1.2.3-2.2.5c-1.8.3-3.4-.8-3.4-2.8 0-2.6 2.6-4.9 5.6-4.9Z" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m8.5 12.2 2.4 2.4 4.6-5.2" />
    </svg>
  );
}

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4L2.6 9.4l6.5-.9L12 2.6z" />
    </svg>
  );
}
