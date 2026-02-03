import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * Tooltip informativo con spiegazioni al passaggio del mouse
 */
const InfoTooltip = ({ title, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonRect, setButtonRect] = useState(null);

  const handleMouseEnter = (e) => {
    setButtonRect(e.currentTarget.getBoundingClientRect());
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const getTooltipStyle = () => {
    if (!buttonRect) return {};
    
    const tooltipWidth = 320; // 80 * 4 (w-80)
    const offset = 8;
    
    switch(position) {
      case 'bottom':
        return {
          top: buttonRect.bottom + offset,
          left: buttonRect.left + (buttonRect.width / 2) - (tooltipWidth / 2),
        };
      case 'top':
        return {
          bottom: window.innerHeight - buttonRect.top + offset,
          left: buttonRect.left + (buttonRect.width / 2) - (tooltipWidth / 2),
        };
      case 'left':
        return {
          top: buttonRect.top + (buttonRect.height / 2),
          right: window.innerWidth - buttonRect.left + offset,
        };
      case 'right':
        return {
          top: buttonRect.top + (buttonRect.height / 2),
          left: buttonRect.right + offset,
        };
      default:
        return {};
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center text-gray-400 hover:text-primary-600 transition-colors"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsVisible(!isVisible)}
      >
        <HelpCircle size={16} />
      </button>

      {isVisible && buttonRect && (
        <div
          className="fixed z-[99999] w-80"
          style={getTooltipStyle()}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className="bg-gray-900 text-white text-sm rounded-lg shadow-2xl p-4 border-2 border-gray-700">
            {title && (
              <div className="font-bold mb-2 text-primary-300">{title}</div>
            )}
            <div className="text-gray-200 leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
