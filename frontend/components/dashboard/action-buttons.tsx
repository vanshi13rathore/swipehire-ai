import { X, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onSwipe: () => void;
  disabled?: boolean;
}

export function ActionButtons({ onSwipe, disabled = false }: ActionButtonsProps) {
  if (disabled) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-6">
      <Button
        onClick={onSwipe}
        size="icon"
        variant="outline"
        className="w-16 h-16 rounded-full border-2 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 transition-all shadow-lg"
      >
        <X className="w-8 h-8" />
      </Button>
      <Button
        onClick={onSwipe}
        size="icon"
        variant="outline"
        className="w-14 h-14 rounded-full border-2 border-indigo-500/20 text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-500 hover:border-indigo-500 transition-all shadow-lg"
      >
        <Star className="w-7 h-7 fill-current" />
      </Button>
      <Button
        onClick={onSwipe}
        size="icon"
        variant="outline"
        className="w-16 h-16 rounded-full border-2 border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500 transition-all shadow-lg"
      >
        <Heart className="w-8 h-8 fill-current" />
      </Button>
    </div>
  );
}
