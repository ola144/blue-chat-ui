import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-full">
          <div className="text-6xl sm:text-[8rem] font-extrabold text-blue-600 leading-none">
            404
          </div>
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-slate-900">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Oops — the page you're looking for doesn't exist. It may have been
          moved or removed, or the link you followed is broken.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 transition"
          >
            Back
          </button>
        </div>

        <div className="mt-8 text-xs text-slate-400">
          If you think this is a mistake, contact support.
        </div>
      </div>
    </div>
  );
};

export default NotFound;
