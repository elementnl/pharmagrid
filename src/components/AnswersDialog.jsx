import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function toTitleCase(str) {
  return str.replace(
    /\b\w+/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function AnswersDialog({ validDrugs, rowCategory, colCategory, onClose }) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Valid Answers</DialogTitle>
          <DialogDescription>
            Drugs matching both categories
          </DialogDescription>
        </DialogHeader>

        {/* Category reminder — show label: value for context */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{rowCategory.label}:</span>
            <span className="text-sm font-semibold text-primary uppercase">{rowCategory.value}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{colCategory.label}:</span>
            <span className="text-sm font-semibold text-primary uppercase">{colCategory.value}</span>
          </div>
        </div>

        {/* Drug list */}
        <ul className="flex flex-col gap-2">
          {validDrugs.slice(0, 6).map((drug) => (
            <li
              key={drug.generic_name}
              className="flex items-baseline justify-between px-3 py-2 bg-muted rounded-lg"
            >
              <span className="font-semibold text-sm text-foreground">
                {toTitleCase(drug.generic_name)}
              </span>
              <span className="text-xs text-muted-foreground italic">
                {capitalize(drug.brand_name)}
              </span>
            </li>
          ))}
        </ul>

        {validDrugs.length > 6 && (
          <p className="text-xs text-muted-foreground text-center">
            +{validDrugs.length - 6} more
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
