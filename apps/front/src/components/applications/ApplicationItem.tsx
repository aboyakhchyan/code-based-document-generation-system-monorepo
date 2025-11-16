import { UserRole } from "@/types";
import { Button, cn, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui";
import { translateRoleToHy } from "@/utils";
import { BookmarkX, Check } from "lucide-react";
import { courses } from "@/constants/courses";
import { useState } from "react";
import { topics } from "@/constants/topics";
import React from "react";

interface IApplicationItemProps {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  age: number;
}

const ApplicationItemComponent: React.FC<IApplicationItemProps> = ({ id, fullName, email, role, age }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between p-3 rounded-md transition-colors duration-300",
        "bg-gray-50 text-primary-800"
      )}
    >
      <div className="flex flex-row items-center gap-5">
        <span className="flex-shrink-0 text-sm font-medium">#{id}</span>

        <div className="flex flex-col w-45 overflow-hidden">
          <span className="text-sm font-medium truncate">{fullName}</span>
          <span className="text-xs truncate">{email}</span>
        </div>
        <div className="flex flex-row gap-5 ">
          <span className="text-xs truncate w-25">{translateRoleToHy(role)}</span>
          <span className="text-xs truncate w-25">{age} տարեկան</span>
        </div>

        <div className="flex flex-row gap-2">
          <Select onValueChange={(value) => setSelectedCourseId(Number(value))}>
            <SelectTrigger size="sm" className="cursor-pointer">
              <SelectValue placeholder="Ընտրել դասընթաց" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {role === UserRole.LECTURER && (
            <Select onValueChange={(value) => setSelectedTopicId(Number(value))} disabled={!topics.length}>
              <SelectTrigger size="sm" className="cursor-pointer">
                <SelectValue placeholder="Ընտրել թեմա" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id.toString()}>
                    {topic.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex flex-row gap-5">
        <Button variant="success">
          Ընդունել <Check />
        </Button>
        <Button variant="error">
          Չեղարկել <BookmarkX />
        </Button>
      </div>
    </div>
  );
};

ApplicationItemComponent.displayName = "ApplicationItem";

export const ApplicationItem = React.memo(ApplicationItemComponent);
