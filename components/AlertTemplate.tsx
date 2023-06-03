import React, { type CSSProperties } from 'react';
import { type AlertTemplateProps } from 'react-alert';

const alertStyle: CSSProperties = {
  backgroundColor: '#151515',
  color: 'white',
  padding: '10px',
  textTransform: 'uppercase',
  borderRadius: '3px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
  fontFamily: 'Arial',
  width: '300px',
  boxSizing: 'border-box',
};

const buttonStyle: CSSProperties = {
  marginLeft: '20px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: '#FFFFFF',
};

export const AlertTemplate: React.FC<AlertTemplateProps> = ({
  message,
  options,
  style,
  close,
}) => {
  const optionalStyle: CSSProperties = {};

  if (options.type === 'error') {
    optionalStyle.backgroundColor = '#c00';
  }

  return (
    <div style={{ ...alertStyle, ...style, ...optionalStyle }}>
      <span style={{ flex: 2 }}>{message as React.ReactElement}</span>
      <button onClick={close} style={buttonStyle}>
        X
      </button>
    </div>
  );
};
