/* eslint-disable */
import React, { useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";
import SwitchStyle from "./switch.style";

const Switch = ({
  className,
  switchColor,
  checked,
  labelText,
  labelPosition,
  switchSize,
  isMaterial,
  barColor,
  onChange,
  onFocus,
  onBlur,
  handleOnChange,
  disabled,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  // Add all classs to an array
  const addAllClasses = ["reusecore__switch"];

  // Add label position class
  if (labelPosition) {
    addAllClasses.push(`label_${labelPosition}`);
  }

  // isMaterial prop checking
  if (isMaterial) {
    addAllClasses.push("is-material");
  }

  // className prop checking
  if (className) {
    addAllClasses.push(className);
  }

  handleOnChange = (event) => {
    setIsChecked(!isChecked);
    onChange(!isChecked);
  };

  useLayoutEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const LabelField = labelText && (
    <span className="reusecore__field-label">{labelText}</span>
  );

  const position = labelPosition || "top";

  return (
    <SwitchStyle
      className={addAllClasses.join(" ")}
      switchColor={switchColor}
      switchSize={switchSize}
      barColor={barColor}
      {...props}
    >
      <label>
        {position === "left" || position === "right" || position === "top"
          ? LabelField
          : ""}

        <input
          checked={isChecked}
          onChange={handleOnChange}
          onBlur={onBlur}
          onFocus={onFocus}
          className="switch"
          type="checkbox"
          value={isChecked}
          disabled={disabled}
        />
        <div>
          <div />
        </div>
        {position === "bottom" && LabelField}
      </label>
    </SwitchStyle>
  );
};

Switch.propTypes = {
  /** ClassName of the Switch */
  className: PropTypes.string,

  /** Add Material effect */
  isMaterial: PropTypes.bool,

  /** labelText of the switch field */
  labelText: PropTypes.string,

  /** switchSize control switch width and height */
  switchSize: PropTypes.string,

  /** Set label position of the switch field */
  labelPosition: PropTypes.oneOf(["top", "bottom", "left", "right"]),

  /** Switch toggle state based on isChecked prop */
  checked: PropTypes.bool,

  /** Set color for Switch */
  SwitchColor: PropTypes.string,

  /** Set material bar color for Switch */
  barColor: PropTypes.string,

  /**
   * @ignore
   */
  onBlur: PropTypes.func,

  /**
   * @ignore
   */
  onFocus: PropTypes.func,

  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value`.
   */
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

Switch.defaultProps = {
  checked: false,
  labelPosition: "top",
  onBlur: () => {},
  onFocus: () => {},
  onChange: () => {},
  disabled: false,
};

export default Switch;
