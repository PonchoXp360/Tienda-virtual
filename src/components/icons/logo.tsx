export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_105_2)">
        <path
          d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
          className="fill-primary"
        />
        <path
          d="M19.1256 10.5367L19.1256 12.6331L16.2754 14.7578L16.2754 22.784L12.8744 24.8322L12.8744 8.7888L19.1256 10.5367Z"
          fill="#F97316"
        />
        <path
          d="M19.7422 9.53906L19.7422 12.1582L16.2764 14.7578L12.875 12.7109L19.7422 9.53906Z"
          className="fill-accent"
        />
      </g>
      <defs>
        <clipPath id="clip0_105_2">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
