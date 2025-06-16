"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ShoppingCart, Check, Copy } from "lucide-react";

interface ShoppingListDialogProps {
  ingredients: Record<string, string[]>;
}

export function ShoppingListDialog({ ingredients }: ShoppingListDialogProps) {
  // Flatten all ingredients into a single array
  const allItems = Object.entries(ingredients).flatMap(([section, items]) =>
    items.map((item) => ({ section, item }))
  );
  const [checked, setChecked] = useState<boolean[]>(Array(allItems.length).fill(false));
  const [copied, setCopied] = useState(false);

  const handleCheck = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const handleCopy = () => {
    const text = allItems.map(({ item }, i) => `${checked[i] ? "[x]" : "[ ]"} ${item}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Shopping List
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping List
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ul className="space-y-2 max-h-72 overflow-y-auto">
            {allItems.map(({ section, item }, i) => (
              <li key={i} className="flex items-center gap-3">
                <button
                  aria-label={checked[i] ? "Uncheck" : "Check"}
                  onClick={() => handleCheck(i)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked[i] ? "bg-green-500 border-green-600" : "bg-background border-muted"}`}
                >
                  {checked[i] && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className={`text-base ${checked[i] ? "line-through text-muted-foreground" : "text-foreground"}`}>{item}</span>
              </li>
            ))}
          </ul>
          <Button onClick={handleCopy} variant="secondary" className="w-full flex items-center gap-2">
            {copied ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy List"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
