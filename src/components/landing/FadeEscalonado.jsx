import React from "react";

const FadeEscalonado = ({
  children,
  className = "",
  delayBase = 0,
  delayStep = 0.1,
  activo = true,
  horizontal = false,
}) => {
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <div
      className={`fade-escalonado ${horizontal ? "fade-escalonado--horizontal" : ""} ${activo ? "fade-escalonado--activo" : ""} ${className}`.trim()}
    >
      {items.map((child, index) => (
        <div
          key={index}
          className="fade-escalonado__item"
          style={{ "--fade-delay": `${delayBase + index * delayStep}s` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default FadeEscalonado;
