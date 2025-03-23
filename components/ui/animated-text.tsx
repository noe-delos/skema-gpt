import { FC, ReactNode } from 'react';

interface ShimmeringTitleProps {
  children: ReactNode;
  className?: string;
}

const ShimmeringTitle: FC<ShimmeringTitleProps> = ({ children, className = '' }) => {
  return (
    <div className="size-fit flex justify-center items-center overflow-hidden">
      <h1>
        <a
          className={`
             text-md inline-block relative
            [-webkit-mask-image:linear-gradient(-75deg,rgba(0,0,0,.3)_30%,#000_50%,rgba(0,0,0,.3)_70%)]
            [-webkit-mask-size:200%]
            animate-shine
            ${className}
          `}
        >
          {children}
        </a>
      </h1>
    </div>
  );
};

export default ShimmeringTitle;
