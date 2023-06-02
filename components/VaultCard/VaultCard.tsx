import React from 'react';

export interface VaultCardType {
  title: string;
  subtitle?: string;
}

interface VaultCardProps extends VaultCardType {}

export const VaultCard: React.FC<VaultCardProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col justify-between p-6 gap-6 text-center text-white border border-white rounded-2xl h-full">
      <div className="text-3xl font-bold">Pool</div>
      <div>
        <div className="text-5xl font-bold">{title}</div>
        {subtitle ? <div>{subtitle}</div> : null}
      </div>
      <div className="w-full flex justify-between gap-4">
        <button className="p-2 w-full rounded-lg border text-white border-white bg-transparent hover:bg-white hover:text-black">
          Add
        </button>
        <button className="p-2 w-full rounded-lg border text-white border-white bg-transparent hover:bg-white hover:text-black">
          Remove
        </button>
      </div>
    </div>
  );
};
