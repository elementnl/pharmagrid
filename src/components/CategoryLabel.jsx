export default function CategoryLabel({ category }) {
  return (
    <div className="flex flex-col items-center justify-center px-2.5 py-3 text-center min-h-20">
      <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-1">
        {category.label}
      </span>
      <span className="text-sm font-bold text-accent leading-tight wrap-break-word uppercase">
        {category.value}
      </span>
    </div>
  );
}
