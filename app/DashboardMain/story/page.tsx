import Moderation from "@/components/Story/Moderation";
import StoryTopStats from "@/components/Story/StoryTopStats";

export default function StoryPage() {
  return (
    <div className="w-full overflow-x-hidden space-y-0">
      <StoryTopStats />

      <div className="overflow-x-hidden">
        <Moderation />
      </div>

    </div>
  );
}
