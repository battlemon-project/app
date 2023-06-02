import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';

interface GemItemCardProp {
  id: string;
  imageURL: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const GemItemCard: React.FC<GemItemCardProp> = ({
  id,
  imageURL,
  isActive,
  onClick,
}) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(false);

  const onMouseEnter = () => {
    setIsHovered(true);
  };
  const onMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="w-full relative flex items-center justify-center rounded-2xl bg-white bg-opacity-20 border border-white border-opacity-50 h-36 p-5 cursor-pointer"
      key={id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div
        className={classNames(
          { 'opacity-100': isHovered || isActive },
          'absolute w-4/5 h-4/5 opacity-0 left-1/2 top-2/3 bg-blue blur-xl rounded-2xl -translate-x-1/2 -translate-y-1/2 transition-all'
        )}
      ></div>
      <Image
        className="relative z-10"
        width={80}
        height={80}
        src={imageURL}
        alt={id}
      />
    </div>
  );
};
