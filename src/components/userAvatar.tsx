import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type UserAvatarProps = {
  name: string;
  src?: string;
  className?: string;
};

export function UserAvatar({ name, src, className }: UserAvatarProps) {
  return (
    <Avatar className={className || "size-7 md:size-10"}>
      <AvatarImage src={src} alt="User avatar" />
      <AvatarFallback>{name.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
