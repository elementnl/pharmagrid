export default function CategoryLabel({ category, align = "center", valign = "center" }) {
  const alignClass = align === "right" ? "items-end text-right" : "items-center text-center";
  const valignClass = valign === "end" ? "justify-end" : "justify-center";

  return (
    <div className={`flex flex-col px-1.5 sm:px-2.5 py-2 sm:py-3 ${alignClass} ${valignClass}`}>
      <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">
        {category.label}
      </span>
      <span className="text-[11px] sm:text-[13px] font-bold text-primary leading-snug uppercase wrap-break-word hyphens-auto">
        {category.value}
      </span>
    </div>
  );
}
