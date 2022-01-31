interface Props {
  children: string | JSX.Element | JSX.Element[] | (string | JSX.Element)[];
  extraClasses?: string;
}

const Layout = ({ children, extraClasses = "" }: Props) => {
  return (
    <div
      className={`max-w-[1440px] mx-auto text-white px-[16px] ${extraClasses}`}
    >
      {children}
    </div>
  );
};

export default Layout;
