import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const DELTA = 1;
const DOTS = "...";

const getCurrentPages = (page, total) => {
  if (total < 6) {
    return Array.from({ length: total }, (item, index) => index + 1);
  }

  const left = Math.max(2, page - DELTA);
  const right = Math.min(total - 1, page + DELTA);
  const pages = [1];

  if (left > 2) {
    pages.push(DOTS);
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < total - 1) {
    pages.push(DOTS);
  }
  pages.push(total);

  return pages;
};

const Pagination = ({
  page,
  pageLimit,
  totalPage,
  limitOptions,
  onChangePage,
  onChangeLimit,
}) => {
  const limitDropdownRef = useRef(null);
  const [isOpenDropdownLimit, setIsOpenDropdownLimit] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        limitDropdownRef.current &&
        !limitDropdownRef.current.contains(event.target)
      ) {
        setIsOpenDropdownLimit(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (page > totalPage && totalPage > 0) {
      onChangePage(1);
    }
  }, [page, totalPage, onChangePage]);

  const pages = useMemo(() => {
    const safePage = page > totalPage ? 1 : page;
    return getCurrentPages(safePage, totalPage);
  }, [page, totalPage]);

  if (totalPage <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 w-full select-none">
      {/* Right side: Limit select and controls */}
      <div className="flex items-center gap-3">
        {/* Limit Selection Dropdown */}
        <div className="relative" ref={limitDropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpenDropdownLimit((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-xs font-semibold border transition-all cursor-pointer ${
              isOpenDropdownLimit
                ? "border-violet-500/40 bg-violet-500/10 text-violet-300 shadow-[0_0_8px_rgba(124,58,237,0.15)]"
                : "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white"
            }`}
          >
            <span className="font-semibold text-violet-400">{pageLimit}</span>
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 text-gray-500 ${
                isOpenDropdownLimit ? "rotate-180 text-violet-400" : ""
              }`}
            />
          </button>

          {isOpenDropdownLimit && (
            <div className="absolute bottom-full mb-1.5 left-0 min-w-[3.5rem] w-full bg-[#120d1e]/95 backdrop-blur-md border border-white/[0.08] p-1 rounded-[6px] shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col gap-0.5 z-[50] animate-fade-in">
              {limitOptions.map((op, index) => {
                const isActive = op === pageLimit;

                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      if (isActive) return;
                      onChangeLimit(op);
                      setIsOpenDropdownLimit(false);
                    }}
                    className={`w-full text-center px-2 py-1.5 rounded-[4px] text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-violet-500/15 text-violet-300 font-bold border border-violet-500/25"
                        : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {op}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Page Navigation Controls */}
        <div className="flex items-center gap-1">
          {/* Previous page */}
          <button
            type="button"
            onClick={() => {
              if (page > 1) {
                onChangePage(page - 1);
              }
            }}
            disabled={page === 1}
            className={`flex items-center justify-center w-8 h-8 rounded-[6px] border transition-all ${
              page === 1
                ? "border-white/[0.03] bg-transparent text-gray-600 cursor-not-allowed opacity-40"
                : "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:bg-white/[0.06] hover:text-white hover:border-violet-500/30 active:scale-95 cursor-pointer"
            }`}
          >
            <ChevronLeft size={14} />
          </button>

          {/* Page items */}
          {pages.map((item, index) => {
            if (item === DOTS) {
              return (
                <span
                  key={index}
                  className="flex items-center justify-center w-8 h-8 text-gray-500 font-medium select-none text-xs"
                >
                  {item}
                </span>
              );
            }

            const isActive = item === page;
            return (
              <button
                type="button"
                key={index}
                onClick={() => {
                  if (!isActive) onChangePage(item);
                }}
                className={`flex items-center justify-center min-w-[2rem] h-8 px-1.5 rounded-[6px] text-xs font-medium transition-all ${
                  isActive
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-[0_0_8px_rgba(124,58,237,0.15)] cursor-default"
                    : "border border-white/[0.06] bg-white/[0.02] text-gray-400 hover:bg-white/[0.06] hover:text-white hover:border-violet-500/30 active:scale-95 cursor-pointer"
                }`}
              >
                {item}
              </button>
            );
          })}

          {/* Next page */}
          <button
            type="button"
            onClick={() => {
              if (page < totalPage) {
                onChangePage(page + 1);
              }
            }}
            disabled={page === totalPage}
            className={`flex items-center justify-center w-8 h-8 rounded-[6px] border transition-all ${
              page === totalPage
                ? "border-white/[0.03] bg-transparent text-gray-600 cursor-not-allowed opacity-40"
                : "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:bg-white/[0.06] hover:text-white hover:border-violet-500/30 active:scale-95 cursor-pointer"
            }`}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
