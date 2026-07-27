import Link from "next/link";
import type { ListedCourse } from "@/data/universities";
import { levelLabel } from "@/data/universities";

function statusLabel(status?: ListedCourse["status"]) {
  if (status === "new") return "New";
  if (status === "contact") return "Contact us";
  return "Enrolling";
}

export function CourseList({
  courses,
  emptyMessage = "No courses listed in this category right now. Contact UNIADS for current options.",
}: {
  courses: ListedCourse[];
  emptyMessage?: string;
}) {
  if (courses.length === 0) {
    return <p className="text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead className="bg-navy text-white">
          <tr>
            <th className="px-4 py-3 font-semibold">Course</th>
            <th className="px-4 py-3 font-semibold">University / College</th>
            <th className="hidden px-4 py-3 font-semibold sm:table-cell">Type</th>
            <th className="hidden px-4 py-3 font-semibold md:table-cell">Status</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={`${c.university.slug}-${c.name}`} className="border-t border-line">
              <td className="px-4 py-3 font-medium text-navy">{c.name}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/courses/${c.university.slug}`}
                  className="text-teal hover:underline"
                >
                  {c.university.shortName}
                </Link>
              </td>
              <td className="hidden px-4 py-3 text-muted sm:table-cell">
                {levelLabel(c.level)}
              </td>
              <td className="hidden px-4 py-3 text-muted md:table-cell">
                {statusLabel(c.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CourseCategoryTabs({ active }: { active: string }) {
  const tabs = [
    { href: "/courses", label: "All pathways", slug: "all" },
    { href: "/courses/foundation", label: "Foundation Year", slug: "foundation" },
    { href: "/courses/undergraduate", label: "Undergraduate", slug: "undergraduate" },
    { href: "/courses/masters", label: "Master’s", slug: "masters" },
    { href: "/courses/other", label: "Other Pathways", slug: "other" },
  ];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Course pathways">
      {tabs.map((tab) => {
        const isActive = tab.slug === active;
        return (
          <Link
            key={tab.slug}
            href={tab.href}
            role="tab"
            aria-selected={isActive}
            className={`inline-flex min-h-11 items-center rounded-md px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-navy text-white"
                : "border border-line bg-white text-navy hover:border-navy"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
