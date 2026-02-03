import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * Tooltip informativo con spiegazioni al passaggio del mouse
 */
const InfoTooltip = ({ title, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center text-gray-400 hover:text-primary-600 transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <HelpCircle size={16} />
      </button>

      {isVisible && (
        <div
          className={`absolute z-[9999] ${positionClasses[position]} w-80 pointer-events-none`}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className="bg-gray-900 text-white text-sm rounded-lg shadow-2xl p-4 pointer-events-auto border-2 border-gray-700">
            {title && (
              <div className="font-bold mb-2 text-primary-300">{title}</div>
            )}
            <div className="text-gray-200 leading-relaxed">
              {children}
            </div>
            {/* Freccia del tooltip */}
            <div
              className={`absolute w-3 h-3 bg-gray-900 transform rotate-45 border-gray-700 ${
                position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2 border-b-2 border-r-2' :
                position === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2 border-t-2 border-l-2' :
                position === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2 border-t-2 border-r-2' :
                'left-[-6px] top-1/2 -translate-y-1/2 border-b-2 border-l-2'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
