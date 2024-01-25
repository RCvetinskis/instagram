import { Spinner } from "./spinner";

export const LoadingSpinner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <Spinner />
    </div>
  );
};
