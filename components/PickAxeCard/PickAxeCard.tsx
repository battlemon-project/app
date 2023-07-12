import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { StaticImageData } from 'next/image';

interface PickAxeCardProp {
  id: string;
  image: StaticImageData;
  isActive?: boolean;
  onClick?: () => void;
}

export const PickAxeCard: React.FC<PickAxeCardProp> = ({
  id,
  image,
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
      className="w-full relative flex items-center justify-center rounded-2xl bg-white bg-opacity-20 border border-white border-opacity-50 h-24 cursor-pointer"
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
        width={60}
        height={60}
        src={image}
        alt={id}
      />
    </div>
  );
};
