interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SectionHeader = ({ children, className = '' }: SectionHeaderProps) => {
  return (
    <h2 className={`text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5 ${className}`}>
      {children}
    </h2>
  );
};

export default SectionHeader;
