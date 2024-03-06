import chevron from "./chevron.png";

export function ChevronIcon({
  isOpen,
  size,
}: {
  isOpen?: boolean;
  size?: number;
}) {
  return (
    <img
      src={chevron}
      alt=""
      style={{
        transform: `rotate(${isOpen ? -180 : 0}deg)`,
        height: `${size || 24}px`,
        width: `${size || 24}px`,
        // transition: "transform 0.2s",
      }}
    />
  );
}
