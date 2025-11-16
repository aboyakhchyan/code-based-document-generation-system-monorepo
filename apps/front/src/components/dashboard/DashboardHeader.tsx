interface IDashboardHeader {
  children: React.ReactNode;
}

export const DashboardHeader: React.FC<IDashboardHeader> = ({
  children,
  ...props
}) => {
  return (
    <div className="flex flex-row justify-between items-center item bg-gray-50 rounded-3xl border-1 border-gray-200 h-30 p-5" {...props}>
      {children}
    </div>
  );
};
