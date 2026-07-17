/* eslint-disable @typescript-eslint/no-explicit-any */

const Search = ({ searchKey, setSearchKey }: any) => {
  return (
    <div className="bg-white border-blue-500 border rounded-full w-full flex items-center justify-between sm:py-2 sm:px-4 px-2 py-1 text-blue-500 drop-shadow-blue-600 gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M226.83,221.17l-52.7-52.7a84.1,84.1,0,1,0-5.66,5.66l52.7,52.7a4,4,0,0,0,5.66-5.66ZM36,112a76,76,0,1,1,76,76A76.08,76.08,0,0,1,36,112Z"></path>
      </svg>
      <input
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        type="text"
        className="border-none outline-none w-full"
      />
    </div>
  );
};

export default Search;
