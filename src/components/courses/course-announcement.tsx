interface CourseAnnouncementProps {
  message: string;
}

export function CourseAnnouncement({ message }: CourseAnnouncementProps) {
  return (
    <div className="relative bg-secondary-500 px-4 py-2.5 text-center text-sm font-medium text-white">
      <span>{message}</span>
    </div>
  );
}
