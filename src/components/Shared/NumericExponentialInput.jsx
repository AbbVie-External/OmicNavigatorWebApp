import React, { useState, useCallback, useEffect, useRef } from 'react';
// import NumericInput from 'react-numeric-input';
// import './NumericExponentialInput.scss';

function clamp(x, lower = -Infinity, upper = Infinity) {
  return Math.min(upper, Math.max(lower, x));
}
export default function NumericExponentialInput({
  onChange,
  min,
  max,
  defaultValue,
}) {
  const [numberProps, { power, base, numberValue }] = useExponentialInput({
    defaultValue,
    min,
    max,
    onChange,
  });

  return (
    // <div className="NumericExponentialInputDiv">
    <input
      spellCheck="false"
      id="NetworkSliderNodeInput"
      className="NetworkSliderInput"
      {...numberProps}
    />
    // <div className="NumericExponentialInputDiv">
    //   <input className="NumericExponentialInput" {...numberProps} />
    // </div>
  );
}

const useExponentialInput = ({ onChange, min, max, defaultValue }) => {
  const [power, setPower] = useState(() => {
    debugger;
    return +(defaultValue || 0).toExponential(0).split('e')[1];
  });
  const [base, setBase] = useState(() => {
    return +(defaultValue || 0).toExponential(0).split('e')[0];
  });
  const [fakeValue, setFakeValue] = useState(null);
  const handleChange = useCallback(
    evt => {
      let val = evt.currentTarget.value;
      if (val >= Number.MAX_VALUE || val <= -Number.MAX_VALUE) {
        let newBase = base + Math.sign(val);
        let newPower = power;
        if (newBase <= 0) {
          newBase = 9;
          newPower = power - 1;
        } else if (newBase >= 10) {
          newBase = 1;
          newPower = power + 1;
        }
        const newValue = +`${newBase}E${newPower}`;
        if (
          newValue <= (max ?? Number.MAX_VALUE) &&
          newValue >= (min ?? Number.MIN_VALUE)
        ) {
          setPower(newPower);
          setBase(newBase);
          setFakeValue(null);
          return;
        } else {
          val = clamp(newValue, min, max)
            .toExponential(0)
            .replace('+', '')
            .toUpperCase();
        }
      }
      if (!Number.isNaN(+val)) {
        const [base, power] = (+val).toExponential(0).split('e');
        setBase(+base);
        setPower(+power);
      }
      setFakeValue(val);
    },
    [base, power, min, max],
  );
  const value = `${base}E${power}`;
  const numberValue = clamp(+value, min, max);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    if (onChangeRef.current && !Number.isNaN(+fakeValue)) {
      onChangeRef.current(numberValue);
    }
  }, [numberValue, fakeValue]);
  return [
    {
      onChange: handleChange,
      value:
        fakeValue ??
        (numberValue < 1e-3
          ? numberValue.toExponential(0)
          : numberValue.toPrecision(1)),
      step: Number.MAX_VALUE,
      type: 'number',
    },
    { power, base, numberValue },
  ];
};
