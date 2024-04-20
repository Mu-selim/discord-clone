import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  src?: string;
  className?: string;
};

export function UserAvatar({ name, src, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("size-7 md:size-10", className)}>
      <AvatarImage src={src} alt="User avatar" />
      <AvatarFallback>{name.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
