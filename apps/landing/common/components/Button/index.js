import React from "react";
import PropTypes from "prop-types";
import ButtonStyle from "./button.style";

const Button = ({
  type,
  title,
  icon,
  disabled,
  iconPosition,
  onClick,
  loader,
  isMaterial,
  isLoading,
  className,
  ...props
}) => {
  // Add all classs to an array
  const addAllClasses = ["reusecore__button"];

  // isLoading prop checking
  if (isLoading) {
    addAllClasses.push("is-loading");
  }

  // isMaterial prop checking
  if (isMaterial) {
    addAllClasses.push("is-material");
  }

  // className prop checking
  if (className) {
    addAllClasses.push(className);
  }

  // Checking button loading state
  const buttonIcon = icon && <span className="btn-icon">{icon}</span>;
  // set icon position
  const position = iconPosition || "left";

  return (
    <ButtonStyle
      type={type}
      className={addAllClasses.join(" ")}
      icon={icon}
      disabled={disabled || isLoading}
      icon-position={position}
      onClick={onClick}
      {...props}
    >
      {position === "left" && buttonIcon}
      {title && <span className="btn-text">{title}</span>}
      {position === "right" && buttonIcon}
    </ButtonStyle>
  );
};

Button.propTypes = {
  /** ClassName of the button */
  className: PropTypes.string,

  /** Add icon */
  type: PropTypes.oneOf(["button", "submit", "reset"]),

  /** Add icon */
  icon: PropTypes.object,

  /** Add loader */
  loader: PropTypes.object,

  /** Add Material effect */
  isMaterial: PropTypes.bool,

  /** Button Loading state */
  isLoading: PropTypes.bool,

  /** If true button will be disabled */
  disabled: PropTypes.bool,

  /** Adjust your icon and loader position [if you use loader] */
  iconPosition: PropTypes.oneOf(["left", "right"]),

  /** Variant change button shape */
  variant: PropTypes.oneOf([
    "textButton",
    "outlined",
    "fab",
    "extendedFab",
    "extenfabvdedFab",
  ]),

  /** primary || secondary || warning || error  change text and border color.
   *  And primaryWithBg || secondaryWithBg || warningWithBg || errorWithBg change text, border and background color */
  colors: PropTypes.oneOf([
    "primary",
    "secondary",
    "warning",
    "error",
    "primaryWithBg",
    "secondaryWithBg",
    "warningWithBg",
    "errorWithBg",
  ]),

  /**
   * Gets called when the user clicks on the button
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  disabled: false,
  isMaterial: false,
  isLoading: false,
  type: "button",
};

export default Button;
