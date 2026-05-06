export const awards = [
  {
    title: "Business Appreciation Award",
    organization: "Nokia",
    year: "2024",
    description:
      "Recognized alongside the lead architect as one of only two recipients for outstanding contributions to the telecommunications sales system.",
    image: "/awards/nokia-business-appreciation.jpg",
    visible: true,
    featured: true,
    order: 1,
  },
  {
    title: "Annual SPOT Award + Quarterly/Monthly Awards",
    organization: "Nokia",
    year: "2023",
    description:
      "Multiple recognition awards for exceptional technical contributions and project impact.",
    image: "/awards/spot-award.jpg",
    visible: true,
    featured: true,
    order: 2,
  },
  {
    title: "Special Recognition Awards",
    organization: "Nokia",
    year: "2023",
    description:
      "Recognized for UAT excellence, leadership, mentoring, technical reliability, and cross-system expertise.",
    image: "/awards/special-recognition.jpg",
    visible: true,
    featured: true,
    order: 3,
  },
];

export function getVisibleAwards() {
  return awards.filter((a) => a.visible).sort((a, b) => a.order - b.order);
}
