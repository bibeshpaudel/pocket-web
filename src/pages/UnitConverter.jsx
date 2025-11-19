import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';

const units = {
  length: {
    meters: 1,
    kilometers: 0.001,
    centimeters: 100,
    millimeters: 1000,
    miles: 0.000621371,
    yards: 1.09361,
    feet: 3.28084,
    inches: 39.3701,
  },
  weight: {
    kilograms: 1,
    grams: 1000,
    milligrams: 1000000,
    pounds: 2.20462,
    ounces: 35.274,
  },
  temperature: {
    celsius: 'c',
    fahrenheit: 'f',
    kelvin: 'k',
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [value, setValue] = useState(1);
  const [result, setResult] = useState(0);

  useEffect(() => {
    if (category === 'length') {
      setFromUnit('meters');
      setToUnit('feet');
    } else if (category === 'weight') {
      setFromUnit('kilograms');
      setToUnit('pounds');
    } else if (category === 'temperature') {
      setFromUnit('celsius');
      setToUnit('fahrenheit');
    }
  }, [category]);

  useEffect(() => {
    if (category === 'temperature') {
      convertTemperature();
    } else {
      convertStandard();
    }
  }, [value, fromUnit, toUnit, category]);

  const convertStandard = () => {
    const base = value / units[category][fromUnit];
    const converted = base * units[category][toUnit];
    setResult(converted);
  };

  const convertTemperature = () => {
    let celsius = value;
    if (fromUnit === 'fahrenheit') celsius = (value - 32) * 5/9;
    if (fromUnit === 'kelvin') celsius = value - 273.15;

    let final = celsius;
    if (toUnit === 'fahrenheit') final = (celsius * 9/5) + 32;
    if (toUnit === 'kelvin') final = celsius + 273.15;

    setResult(final);
  };

  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert between different units of measurement."
    >
      <div className="grid gap-6">
        <div className="flex justify-center mb-4">
          <div className="flex gap-2 p-1 bg-slate-900/50 border border-white/10 rounded-base">
            {Object.keys(units).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-sm font-bold capitalize transition-colors ${
                  category === cat ? 'bg-accent text-white' : 'hover:bg-white/5 text-textSecondary hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <div className="space-y-4">
            <label className="block font-bold text-textSecondary">From</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full font-mono text-lg"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full font-bold capitalize"
            >
              {Object.keys(units[category]).map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center text-4xl font-bold opacity-50">=</div>

          <div className="space-y-4">
            <label className="block font-bold text-textSecondary">To</label>
            <div className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-base font-mono text-lg text-text">
              {Number(result.toFixed(4))}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full font-bold capitalize"
            >
              {Object.keys(units[category]).map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
