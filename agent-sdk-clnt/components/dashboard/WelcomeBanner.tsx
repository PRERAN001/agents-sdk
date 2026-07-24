interface WelcomeBannerProps {
  name: string;
}

export default function WelcomeBanner({
  name,
}: WelcomeBannerProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-bold tracking-tight">
        {greeting}, {name} 👋
      </h1>

      <p className="text-muted-foreground text-lg">
        Deploy, monitor and manage your AI agents from one place.
      </p>
    </div>
  );
}