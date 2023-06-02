import React from 'react';

export const CssLoader: React.FC = () => {
  return (
    <div className="w-full flex items-center">
      <div className="w-full text-center">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
