function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm font-medium text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;