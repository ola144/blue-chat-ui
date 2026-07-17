/* eslint-disable @typescript-eslint/no-explicit-any */
const ImageView = ({
  selectedImage,
  setSelectedImage,
}: {
  selectedImage: string | undefined;
  setSelectedImage: (image: any) => void;
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={() => setSelectedImage(null)}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow"
        >
          ✕
        </button>

        <img
          src={selectedImage}
          alt="Preview"
          className="max-w-full max-h-[85vh] rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageView;
