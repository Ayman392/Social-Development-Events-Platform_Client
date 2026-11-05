import { BadgeCheck, Heart, Users } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Events You Can Trust",
    description:
      "Every event shows its organizer, location, and date up front, so you know exactly where your time and effort are going.",
  },
  {
    icon: Users,
    title: "Seamless Volunteering",
    description:
      "Discover, join, and manage your volunteer activities through a simple platform that stays out of your way.",
  },
  {
    icon: Heart,
    title: "Impact Tracking",
    description:
      "Keep a list of every event you have joined and see how much you have contributed to your community.",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-24 pt-8">
      {/* Section heading */}
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">
          Why Choose Oikyo?
        </h2>
        <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400">
          A transparent, efficient, and engaging platform for people who want to
          dedicate their time to social development.
        </p>
      </div>

      {/* Three cards of equal height */}
      <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="glass-panel flex h-full flex-col items-start rounded-[2rem] p-8 transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="mb-6 rounded-2xl bg-blue-50 p-3 dark:bg-blue-900/20">
              <Icon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">{title}</h3>
            <p className="flex-grow leading-relaxed text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
