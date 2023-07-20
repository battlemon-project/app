import React from 'react';

interface CssLoaderProp {
  size?: number;
}

export const CssLoader: React.FC<CssLoaderProp> = ({ size }) => {
  size = size || 1;
  const styles = {
    width: size * 64 + 'px',
    height: size * 64 + 'px',
    margin: size * 8 + 'px',
    borderSize: size * 8 + 'px',
  };

  return (
    <div className="w-full flex items-center">
      <div className="w-full text-center">
        <div
          className="lds-ring"
          style={{ width: size * 80 + 'px', height: size * 80 + 'px' }}
        >
          <div style={styles}></div>
          <div style={styles}></div>
          <div style={styles}></div>
          <div style={styles}></div>
        </div>
      </div>
    </div>
  );
};
