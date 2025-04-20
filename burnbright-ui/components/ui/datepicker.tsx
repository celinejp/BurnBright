'use client';
import * as React from 'react';
import { Calendar } from './calendar';

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, onDateChange }) => {
  return (
    <div className="w-fit">
      <Calendar
        mode="single"
        selected={date ?? new Date()} // fallback
        onSelect={(d) => onDateChange(d ?? new Date())} // ensure valid Date
      />
    </div>
  );
};
