import React from 'react';

interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

/**
 * Common Loader — used everywhere in the app for a consistent loading experience.
 * Usage: <Loader /> or <Loader text="Loading orders..." /> or <Loader fullPage />
 */
const Loader: React.FC<LoaderProps> = ({
  text = 'Loading...',
  size = 'md',
  fullPage = false,
}) => {
  const spinnerSize = size === 'sm' ? 'w-6 h-6 border-[3px]' : size === 'lg' ? 'w-14 h-14 border-[5px]' : 'w-10 h-10 border-4';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${spinnerSize} border-primary-200 border-t-primary-500 rounded-full animate-spin`}
      />
      {text && (
        <p className={`${textSize} font-semibold text-gray-400 tracking-wide`}>{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9998] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 w-full">
      {content}
    </div>
  );
};

export default Loader;
