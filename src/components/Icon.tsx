import React from "react";

export type IconName =
  | "back"
  | "eye"
  | "eye-off"
  | "search"
  | "scan"
  | "plus"
  | "check"
  | "camera"
  | "chevron-right"
  | "chevron-left"
  | "chevron-down"
  | "wifi-off"
  | "lock"
  | "copy"
  | "whatsapp"
  | "pencil"
  | "box"
  | "user"
  | "truck"
  | "credit-card"
  | "dots-horizontal"
  | "arrow-right"
  | "torch"
  | "close"
  | "share"
  | "qr"
  | "home"
  | "settings"
  | "file-text"
  | "layers"
  | "map-pin"
  | "building"
  | "crown"
  | "sparkles"
  | "mic"
  | "download"
  | "history"
  | "send"
  | "printer"
  | "trash";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  className = "",
  color = "currentColor",
}) => {
  const strokeWidth = 1.75;

  const renderPath = () => {
    switch (name) {
      case "back":
        return <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />;
      case "eye":
        return (
          <>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" />
          </>
        );
      case "eye-off":
        return (
          <>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "search":
        return (
          <>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "scan":
        return (
          <>
            <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M4 16v3a1 1 0 0 0 1 1h3M16 20h3a1 1 0 0 0 1-1v-3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="7" y1="12" x2="17" y2="12" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "plus":
        return <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />;
      case "check":
        return <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />;
      case "camera":
        return (
          <>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="4" />
          </>
        );
      case "chevron-right":
        return <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />;
      case "chevron-left":
        return <polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round" />;
      case "chevron-down":
        return <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />;
      case "wifi-off":
        return (
          <>
            <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" strokeLinecap="round" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" strokeLinecap="round" />
            <path d="M10.71 16.71a4.9 4.9 0 0 1 2.58-.71c.73 0 1.42.16 2.05.45" strokeLinecap="round" />
            <circle cx="12" cy="20" r="1" fill={color} />
          </>
        );
      case "lock":
        return (
          <>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "copy":
        return (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "whatsapp":
        return (
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "pencil":
        return (
          <path
            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "box":
        return (
          <>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="22.08" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "user":
        return (
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" />
          </>
        );
      case "truck":
        return (
          <>
            <rect x="1" y="3" width="15" height="13" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </>
        );
      case "credit-card":
        return (
          <>
            <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "dots-horizontal":
        return (
          <>
            <circle cx="12" cy="12" r="1" fill={color} />
            <circle cx="19" cy="12" r="1" fill={color} />
            <circle cx="5" cy="12" r="1" fill={color} />
          </>
        );
      case "arrow-right":
        return <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />;
      case "torch":
        return (
          <>
            <path d="M18 6h-4l-2 4h6l-3 8 7-9h-5l1-3z" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "close":
        return <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" strokeLinejoin="round" />;
      case "share":
        return (
          <>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "qr":
        return (
          <>
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="15" y="15" width="3" height="3" fill={color} />
          </>
        );
      case "home":
        return (
          <path
            d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "settings":
        return (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "file-text":
        return (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="10" y1="9" x2="8" y2="9" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "layers":
        return (
          <>
            <polygon points="12 2 2 7 12 12 22 7 12 2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="2 17 12 22 22 17" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="2 12 12 17 22 12" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "map-pin":
        return (
          <>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="10" r="3" />
          </>
        );
      case "building":
        return (
          <>
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22v-4h6v4" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="6" x2="8.01" y2="6" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="6" x2="16.01" y2="6" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="6" x2="12.01" y2="6" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="10" x2="8.01" y2="10" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="10" x2="16.01" y2="10" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="10" x2="12.01" y2="10" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "crown":
        return (
          <path
            d="M2 4l3 12h14l3-12-5 6-5-6-5 6-5-6z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "sparkles":
        return (
          <>
            <path
              d="M12 3l1.9 5.3L19.2 10l-5.3 1.9L12 17.2l-1.9-5.3L4.8 10l5.3-1.7L12 3z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case "mic":
        return (
          <>
            <path
              d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 10v2a7 7 0 0 1-14 0v-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
            <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
          </>
        );
      case "download":
        return (
          <>
            <path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="7 10 12 15 17 10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
          </>
        );
      case "history":
        return (
          <>
            <path
              d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline points="3 3 3 8 8 8" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="12 7 12 12 15 15" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "send":
        return (
          <>
            <line x1="22" y1="2" x2="11" y2="13" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "printer":
        return (
          <>
            <polyline points="6 9 6 2 18 2 18 9" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="6" y="14" width="12" height="8" rx="1" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case "trash":
        return (
          <>
            <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {renderPath()}
    </svg>
  );
};
