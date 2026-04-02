import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export default function Pagination({ meta, page, setPage }) {
  if (!meta.last_page) return null;

  const pages = [];
  const total = meta.last_page;
  

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="isolate flex items-center gap-3">
      {/* PREVIOUS */}

      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={`relative p-2 rounded-full  ${page === 1 ? "text-gray-400" : "bg-gray-200 cursor-pointer hover:bg-red-500"}`}
      >
        <FaAngleLeft className="w-5" />
      </button>

      {/* NUMBERS */}

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={i}
            className="relative px-3 py-1 rounded-full bg-gray-200 cursor-pointer"
          >
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => setPage(p)}
            className={`relative px-3 py-1 rounded-full bg-gray-200 cursor-pointer
              ${page === p ? "bg-red-500 text-white" : "hover:bg-red-500 hover:text-white"}`}
          >
            {p}
          </button>
        ),
      )}

      {/* NEXT */}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === total}
        className={`relative p-2 rounded-full  ${page === total ? "text-gray-400" : "bg-gray-200 cursor-pointer hover:bg-red-500"}`}
      >
        <FaAngleRight className="w-5" />
      </button>
    </nav>
  );
}
