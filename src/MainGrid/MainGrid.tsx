import { ReactElement, useEffect, useState } from "react";

export type EquationVar = "rate" | "startVal" | "endVal" | "time";
export interface EquationElement {
  name: EquationVar;
  value?: number;
  valueRaw?: string;
  state: "free" | "fixed";
}

export function InputSquare({
  el,
  onChange,
}: {
  el: EquationElement | undefined;
  onChange: (el: EquationElement) => void;
}): ReactElement | null {
  if (!el) {
    return null;
  }

  const val =
    el.name === "rate" && el.value !== undefined
      ? 100 * el.value
      : el.value !== undefined
      ? el.value
      : 0;

  return (
    <div
      className={`p-2 border border-solid flex flex-col gap-2 ${
        el.state === "free" ? "border-blue-600" : "border-gray-400"
      }`}
    >
      <h1 className={`${el.state === "free" ? "text-blue-600" : ""}`}>
        {el.name}
      </h1>
      <div
        className={`flex-grow flex flex-nowrap items-center gap-1
            ${
              el.state === "free"
                ? "text-blue-600 before:content-['x']"
                : "before:content-['✎']"
            }

      `}
      >
        <input
          className={`text-8xl border border-solid border-gray-400 w-64`}
          type="number"
          value={val}
          onChange={(e) => {
            onChange({
              name: el.name as EquationVar,
              value: Number(e.target.value),
              valueRaw: e.target.value,
              state: el.state,
            });
          }}
        />
      </div>
    </div>
  );
}

export function getUpdatedElements(
  updated: EquationElement,
  elements: Map<EquationVar, EquationElement>
): Map<EquationVar, EquationElement> {
  const clone = new Map<EquationVar, EquationElement>(elements);
  clone.set(updated.name, updated);
  const freeVarNames = Array.from(clone.values()).filter(
    (e) => e.state === "free"
  );
  if (freeVarNames.length === 1 && updated.name === freeVarNames[0].name) {
    // There is only 1 free var and it is the one we are supposedly trying to
    // update. Can't be done.
    return elements;
  } else if (freeVarNames.length > 1) {
    return clone;
  } else {
    // Assert: there is 1 free var and we need to re-calculate it
    const varName = freeVarNames[0].name;
    const startVal = clone.get("startVal")?.value ?? 0;
    const endVal = clone.get("endVal")?.value ?? 0;
    const time = clone.get("time")?.value ?? 0;
    const rate = clone.get("rate")?.value ?? 0;

    // Need to calculate a new result
    if (varName === "time") {
      clone.set("time", {
        name: "time",
        value: Math.log(endVal / startVal) / Math.log(1 + rate),
        state: "free",
      });
    } else if (varName === "rate") {
      clone.set("rate", {
        name: "rate",
        value: Math.pow(endVal / startVal, 1 / time) - 1,
        state: "free",
      });
    }
    return clone;
  }
}

export function MainGrid(): ReactElement {
  const [elements, setElements] = useState<Map<EquationVar, EquationElement>>(
    new Map<EquationVar, EquationElement>([
      ["rate", { name: "rate", value: 0.072, valueRaw: "0.072", state: "free" }],
      ["time", { name: "time", value: 10, valueRaw: "10", state: "fixed" }],
      [
        "startVal",
        { name: "startVal", value: 100, valueRaw: "100", state: "fixed" },
      ],
      [
        "endVal",
        { name: "endVal", value: 200, valueRaw: "200", state: "fixed" },
      ],
    ])
  );

  return (
    <div className="h-screen w-screen p-2 grid grid-cols-2 grid-rows-2 gap-2">
      <InputSquare
        el={elements.get("startVal")}
        onChange={(el) => setElements(getUpdatedElements(el, elements))}
      />
      <InputSquare
        el={elements.get("endVal")}
        onChange={(el) => setElements(getUpdatedElements(el, elements))}
      />
      <InputSquare
        el={elements.get("rate")}
        onChange={(el) => setElements(getUpdatedElements(el, elements))}
      />
      <InputSquare
        el={elements.get("time")}
        onChange={(el) => setElements(getUpdatedElements(el, elements))}
      />
    </div>
  );
}
