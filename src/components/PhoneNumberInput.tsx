import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneNumberInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

const PhoneNumberInput = ({ 
  value = "", 
  onChange, 
  placeholder = "0000-0000", 
  required = false,
  id = "phone"
}: PhoneNumberInputProps) => {
  const [firstPart, setFirstPart] = useState("");
  const [secondPart, setSecondPart] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const parts = value.replace(/^010-/, '').split('-');
      if (parts.length === 2) {
        setFirstPart(parts[0]);
        setSecondPart(parts[1]);
      }
    }
  }, [value]);

  // Update parent component when parts change
  useEffect(() => {
    const fullNumber = `010-${firstPart}-${secondPart}`;
    onChange?.(fullNumber);
  }, [firstPart, secondPart, onChange]);

  // Handle first part input
  const handleFirstPartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFirstPart(input);
    
    // Auto-focus to second input when first part is complete
    if (input.length === 4) {
      secondInputRef.current?.focus();
    }
  };

  // Handle second part input
  const handleSecondPartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 4);
    setSecondPart(input);
  };

  // Handle backspace navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isFirst: boolean) => {
    if (e.key === 'Backspace' && e.currentTarget.value === '' && !isFirst) {
      firstInputRef.current?.focus();
    }
  };

  // Validate phone number format
  const isValid = firstPart.length === 4 && secondPart.length === 4;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-700 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
            010
          </span>
          <span className="text-gray-400">-</span>
          <Input
            ref={firstInputRef}
            type="tel"
            value={firstPart}
            onChange={handleFirstPartChange}
            onKeyDown={(e) => handleKeyDown(e, true)}
            placeholder="0000"
            maxLength={4}
            className={`w-20 text-center transition-colors ${
              firstPart && firstPart.length !== 4 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          <span className="text-gray-400">-</span>
          <Input
            ref={secondInputRef}
            type="tel"
            value={secondPart}
            onChange={handleSecondPartChange}
            onKeyDown={(e) => handleKeyDown(e, false)}
            placeholder="0000"
            maxLength={4}
            className={`w-20 text-center transition-colors ${
              secondPart && secondPart.length !== 4 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
        </div>
      </div>
      
      {firstPart && secondPart && !isValid && (
        <p className="text-sm text-red-500">
          각각 4자리씩 입력해주세요
        </p>
      )}
      {isValid && (
        <p className="text-sm text-green-600">
          ✓ 올바른 형식입니다 (010-{firstPart}-{secondPart})
        </p>
      )}
    </div>
  );
};

export default PhoneNumberInput;
