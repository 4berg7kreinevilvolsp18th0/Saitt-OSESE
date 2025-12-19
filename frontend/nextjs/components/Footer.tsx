const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-oss-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-xs sm:text-sm text-white/60">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <div>
            <div className="text-white/80 font-medium text-sm sm:text-base">Объединённый совет студентов ДВФУ</div>
          </div>
          <div className="text-white/50">© {year} ОСС ДВФУ • Версия MVP</div>
        </div>
      </div>
    </footer>
  );
}
