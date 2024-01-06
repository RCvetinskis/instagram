import { Header } from "./components/header";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center flex-col  gap-5 justify-center h-full">
      <Header />
      {children}
    </div>
  );
};

export default AuthLayout;
