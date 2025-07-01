export default function Pagination({ page, total, perPage, onPage }) {
  const pages = Math.ceil(total / perPage);
  return (
    <div className="flex justify-center mt-4 gap-2">
      <button
        className="px-2 py-1 border rounded"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
      >
        ←
      </button>
      {[...Array(pages)].map((_, i) => (
        <button
          key={i}
          className={`px-3 py-1 rounded ${page === i + 1 ? "bg-purple-200" : ""}`}
          onClick={() => onPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="px-2 py-1 border rounded"
        disabled={page === pages}
        onClick={() => onPage(page + 1)}
      >
        →
      </button>
    </div>
  );
}