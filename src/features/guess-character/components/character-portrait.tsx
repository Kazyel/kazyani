import Image from "next/image";

interface CharacterPortraitProps {
  image: string;
}

export const CharacterPortrait = async ({ image }: CharacterPortraitProps) => {
  return (
    <div>
      <Image
        src={image}
        alt="Character Portrait"
        width={200}
        height={300}
        className="h-[300px] w-[200px]"
      />
    </div>
  );
};
