import { useState } from 'react';

export function useWarnings() {
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  function AddWarning(field: string, message: string) {
    setWarnings((prev) => ({ ...prev, [field]: message }));
  }

  function RemoveWarning(field: string) {
    setWarnings((prev) => {
      const newWarnings = { ...prev };
      delete newWarnings[field];
      return newWarnings;
    });
  }

  function CountWarnings() {
    return Object.keys(warnings).length;
  }

  return {
    warnings,
    AddWarning,
    RemoveWarning,
    CountWarnings,
  };
}
