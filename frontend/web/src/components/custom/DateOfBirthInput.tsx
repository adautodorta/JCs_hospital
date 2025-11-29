import {Input} from "@/components/ui/input";

export function DateOfBirthInput({value, onChange, disabled}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");

    if (digits.length > 8) {
      digits = digits.slice(0, 8);
    }

    let formatted = "";
    if (digits.length >= 1) {
      formatted = digits.slice(0, 2);
    }
    if (digits.length >= 3) {
      formatted += "/" + digits.slice(2, 4);
    }
    if (digits.length >= 5) {
      formatted += "/" + digits.slice(4, 8);
    }

    onChange(formatted);
  };

  return (
    <Input
      id="dateOfBirth"
      placeholder="DD/MM/AAAA"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      maxLength={10}
    />
  );
}
