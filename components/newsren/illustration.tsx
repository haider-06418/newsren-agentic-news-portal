type Props = {
  kind: "campus" | "network" | "policy" | "markets";
  className?: string;
};
export function Illustration({ kind, className = "" }: Props) {
  return (
    <div
      className={`illustration illustration-${kind} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 600 430" fill="none" focusable="false">
        <defs>
          <pattern
            id={`grid-${kind}-${className.replaceAll(" ", "-")}`}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path d="M28 0H0V28" stroke="currentColor" strokeOpacity=".09" />
          </pattern>
        </defs>
        <path
          fill={`url(#grid-${kind}-${className.replaceAll(" ", "-")})`}
          d="M0 0h600v430H0z"
        />
        {kind === "campus" && (
          <>
            <circle cx="350" cy="184" r="143" fill="#dce9f3" />
            <circle
              cx="350"
              cy="184"
              r="112"
              stroke="#245b8a"
              strokeOpacity=".22"
            />
            <ellipse
              cx="350"
              cy="184"
              rx="57"
              ry="112"
              stroke="#245b8a"
              strokeOpacity=".3"
            />
            <path
              d="M238 184h224M255 128h190M255 240h190M350 72v224"
              stroke="#245b8a"
              strokeOpacity=".3"
            />
            <path d="m92 243 147-70 147 70H92Z" fill="#102a43" />
            <path d="M110 253h258v90H110z" fill="#f8f6ee" />
            <path d="M91 344h296v17H91zM101 365h277v8H101z" fill="#102a43" />
            {[128, 183, 238, 293, 348].map((x) => (
              <path key={x} d={`M${x} 258h13v77h-13z`} fill="#557a9c" />
            ))}
            <path d="M109 244h260v12H109z" fill="#9eb8ce" />
            <path d="M443 291h69v49h-69z" fill="#e9d6ae" />
            <path d="m443 291 34 24 35-24" stroke="#9a4a4f" />
            <path d="m434 111 25 8-27 10 2-18Z" fill="#b4232a" />
            <path
              d="M480 91c48 29 58 81 24 113"
              stroke="#245b8a"
              strokeDasharray="5 7"
            />
            <circle cx="501" cy="209" r="4" fill="#245b8a" />
            <circle cx="193" cy="126" r="5" fill="#b4232a" />
            <path d="M141 133h24m-12-12v24" stroke="#6f8fac" />
          </>
        )}
        {kind === "network" && (
          <>
            <circle
              cx="300"
              cy="215"
              r="127"
              stroke="#707d9b"
              strokeOpacity=".3"
            />
            <circle
              cx="300"
              cy="215"
              r="84"
              stroke="#707d9b"
              strokeOpacity=".3"
            />
            <path
              d="m150 120 150 95 155-88M300 215l-130 110m130-110 137 108M300 215V72"
              stroke="#717f9e"
              strokeWidth="2"
            />
            {[
              [150, 120],
              [455, 127],
              [170, 325],
              [437, 323],
              [300, 72],
            ].map(([x, y]) => (
              <g key={x + y}>
                <circle cx={x} cy={y} r="28" fill="#e5e9f1" stroke="#7383a2" />
                <circle cx={x} cy={y} r="8" fill="#8b98b3" />
              </g>
            ))}
            <rect
              x="253"
              y="168"
              width="94"
              height="94"
              rx="12"
              fill="#4c607d"
            />
            <path
              d="M278 191h44v47h-44zM288 180v11m22-11v11m-22 47v12m22-12v12m-44-45h12m-12 22h12m44-22h12m-12 22h12"
              stroke="#d9e2ef"
              strokeWidth="3"
            />
          </>
        )}
        {kind === "policy" && (
          <>
            <circle cx="330" cy="211" r="144" fill="#e8edf2" />
            <path d="M187 100h192v244H187z" fill="#ffffff" stroke="#7e96aa" />
            <path
              d="M219 145h128m-128 24h95m-95 43h128m-128 24h128m-128 24h73"
              stroke="#7e96aa"
              strokeWidth="7"
            />
            <circle cx="375" cy="287" r="58" fill="#b4232a" />
            <path d="m350 286 18 18 33-36" stroke="#f8f0e5" strokeWidth="7" />
          </>
        )}
        {kind === "markets" && (
          <>
            <circle cx="320" cy="214" r="141" fill="#dce9f3" />
            <path d="M142 322h316M162 308V135" stroke="#6f8fac" />
            <path
              d="M197 233h35v75h-35zm62-46h35v121h-35zm62 21h35v100h-35zm62-91h35v191h-35z"
              fill="#557a9c"
            />
            <path
              d="m192 178 81-51 64 24 80-70"
              stroke="#b4232a"
              strokeWidth="4"
            />
            <path d="m398 81 19-1-1 20" stroke="#b4232a" strokeWidth="4" />
          </>
        )}
      </svg>
    </div>
  );
}
