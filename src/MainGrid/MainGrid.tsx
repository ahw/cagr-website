import { ReactElement, useEffect, useState } from "react";

export function InputSquare({
  el,
  onChange,
}: {
  el: EquationElement | undefined;
  onChange: (el: EquationElement) => void;
}): ReactElement {
  return (
    <div className="p-2">
      <h1>{el?.name}</h1>
      <input
        type="number"
        value={el?.value ?? ""}
        onChange={(e) => {
          onChange({
            name: el?.name as EquationVar,
            value: Number(e.target.value),
            valueRaw: e.target.value,
          });
        }}
      />
    </div>
  );
}

export type EquationVar = "rate" | "startVal" | "endVal" | "time";
export interface EquationElement {
  name: EquationVar;
  value?: number;
  valueRaw?: string;
}

export function getUpdatedElements(
  updated: EquationElement,
  elements: Map<EquationVar, EquationElement>
): Map<EquationVar, EquationElement> {
  const clone = new Map(elements);
  clone.delete(updated.name);
  clone.set(updated.name, updated);
  const firstVarName = Array.from(elements.keys())[0];

  console.log('lastVarName, ', firstVarName)

  if (clone.size === 4) {
    const startVal = clone.get("startVal")?.value ?? 0;
    const endVal = clone.get("endVal")?.value ?? 0;
    const time = clone.get("time")?.value ?? 0;
    const rate = clone.get("rate")?.value ?? 0;

    // Need to calculate a new result
    if (firstVarName === 'time') {
      clone.set("time", {
        name: "time",
        value: Math.log(endVal / startVal) / Math.log(1 + rate / 100),
      });
    } else if (firstVarName === 'rate') {
      clone.set("rate", {
        name: "rate",
        value: Math.pow(endVal / startVal, 1 / time) - 1,
      });
    }
  }

  return clone;
}

export function MainGrid(): ReactElement {
  const [elements, setElements] = useState<Map<EquationVar, EquationElement>>(
    new Map<EquationVar, EquationElement>([
      ["startVal", { name: "startVal", value: 100, valueRaw: "100" }],
      ["endVal", { name: "endVal", value: 200, valueRaw: "200" }],
      ["rate", { name: "rate", value: 7.2, valueRaw: "7.2" }],
      ["time", { name: "time" }],
    ])
  );

  return (
    <div className="h-screen w-screen grid grid-cols-2 grid-rows-2">
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
