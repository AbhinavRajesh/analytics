import { useAuth } from "hooks/useAuth";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <header className="">
      <nav className="flex items-center w-full justify-between py-[20px]">
        <h1 className="font-bold text-lg">AR Analytics</h1>
        <button
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg px-[20px] py-[8px] rounded"
          onClick={logout}
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
