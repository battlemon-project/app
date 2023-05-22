import React from 'react';

export const CssLoader: React.FC = () => {
  return (
    <div className="w-100 d-flex align-items-center">
      <div className="w-100 text-center">
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
