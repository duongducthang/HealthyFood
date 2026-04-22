import { useState } from 'react';

const CustomDatePicker = ({ label, value, onChange, name }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentView, setCurrentView] = useState(new Date(value || '2024-08-22'));

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const year = currentView.getFullYear();
  const month = currentView.getMonth();

  const handlePrevMonth = (e) => { e.stopPropagation(); setCurrentView(new Date(year, month - 1, 1)); };
  const handleNextMonth = (e) => { e.stopPropagation(); setCurrentView(new Date(year, month + 1, 1)); };
  const handlePrevYear = (e) => { e.stopPropagation(); setCurrentView(new Date(year - 1, month, 1)); };
  const handleNextYear = (e) => { e.stopPropagation(); setCurrentView(new Date(year + 1, month, 1)); };

  const handleDateClick = (day) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange({ target: { name, value: formattedDate } });
    setShowCalendar(false);
  };

  const renderDays = () => {
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const days = [];

    
    const prevMonthDays = daysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="p-2 text-gray-300 text-sm flex items-center justify-center">
          {prevMonthDays - i}
        </div>
      );
    }

   
    for (let d = 1; d <= totalDays; d++) {
      const isSelected = value === `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push(
        <div
          key={d}
          onClick={(e) => { e.stopPropagation(); handleDateClick(d); }}
          className={`p-2 text-sm cursor-pointer flex items-center justify-center rounded-full transition-colors
            ${isSelected 
              ? 'bg-blue-600 text-white font-bold' 
              : 'hover:bg-blue-100 text-gray-700'}`}
        >
          {d}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="relative mb-4 w-full">
      {label && <label className="block mb-1.5 text-sm font-semibold text-gray-700">{label}</label>}
      
      <div 
        className="cursor-pointer group"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <input
          type="text"
          readOnly
          value={value}
          placeholder="YYYY-MM-DD"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all group-hover:border-gray-400"
        />
      </div>

      {showCalendar && (
        <>
          
          <div className="fixed inset-0 z-40" onClick={() => setShowCalendar(false)}></div>
          
          <div className="absolute z-50 mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-xl w-[280px] left-0 top-full">
            
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <div className="flex gap-1">
                <button type="button" onClick={handlePrevYear} className="p-1 hover:bg-gray-100 rounded text-gray-600">{"<<"}</button>
                <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600">{"<"}</button>
              </div>
              
              <span className="font-bold text-gray-800">{monthNames[month]} {year}</span>
              
              <div className="flex gap-1">
                <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600">{">"}</button>
                <button type="button" onClick={handleNextYear} className="p-1 hover:bg-gray-100 rounded text-gray-600">{">>"}</button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((d, index) => (
                <div key={index} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider p-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {renderDays()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomDatePicker;