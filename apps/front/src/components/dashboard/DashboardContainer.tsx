interface IDashboardContainer {
  children: React.ReactNode;
  navOpen: boolean;
}

export const DashboardContainer: React.FC<IDashboardContainer> = ({
  children,
  navOpen = true,
  ...props
}) => {
  return (
    <div
      className={`flex flex-col gap-10 min-h-screen  transition-all duration-400 w-full pt-10 lg:pl-30 pl-10`}
      style={{ marginLeft: navOpen ? 200 : 0 }}
      {...props}
    >
      {children}
    </div>
  );
};
