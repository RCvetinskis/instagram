import Image from "next/image";
export const Header = () => {
  return (
    <header>
      <Image
        alt="logo"
        height={48}
        width={48}
        className="mx-auto w-auto my-1"
        src={"/insta_logo.png"}
      />
      <h1 className="text-3xl font-bold">Instagram Application</h1>
    </header>
  );
};
