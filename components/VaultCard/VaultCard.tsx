import React from 'react';
import styles from './VaultCard.module.css';

export interface VaultCardType {
  title: string;
  subtitle?: string;
}
type VaultCardProps = VaultCardType;

function VaultCard({ title, subtitle }: VaultCardProps) {
  return (
    <div className="d-flex flex-column justify-content-between p-4 gap-3 text-center text-white gap-1 border border-white rounded-4 h-100">
      <div className="fs-3 fw-bold">Pool</div>
      <div>
        <div className="fs-1 fw-bold">{title}</div>
        {subtitle ? <div>{subtitle}</div> : null}
      </div>
      <div className="w-100 d-flex justify-content-between gap-4">
        <button
          className={
            'p-2 w-100 rounded-2 border text-white border-white bg-transparent' +
            ' ' +
            styles.button
          }
        >
          Add
        </button>
        <button
          className={
            'p-2 w-100 rounded-2 border text-white border-white bg-transparent' +
            ' ' +
            styles.button
          }
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default VaultCard;
