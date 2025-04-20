'use client';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface CalendarProps {
  mode: 'single';
  selected: Date;
  onSelect: (date: Date | undefined) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ mode, selected, onSelect }) => {
  return (
    <div className="p-2 border rounded-md bg-white">
      <DayPicker mode={mode} selected={selected} onSelect={onSelect} />
    </div>
  );
};
