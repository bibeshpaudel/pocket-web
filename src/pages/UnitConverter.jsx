import { useState, useEffect } from 'react';
import ToolLayout from '../components/ToolLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

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
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {Object.keys(units).map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCategory(cat)}
                className="capitalize font-bold"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center p-6">
            <div className="space-y-4">
              <label className="text-sm font-medium leading-none">From</label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="font-mono text-lg"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 capitalize font-medium"
              >
                {Object.keys(units[category]).map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center text-4xl font-bold text-muted-foreground">=</div>

            <div className="space-y-4">
              <label className="text-sm font-medium leading-none">To</label>
              <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-lg font-mono">
                {Number(result.toFixed(4))}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 capitalize font-medium"
              >
                {Object.keys(units[category]).map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
