export interface Lesson {
  num: number;
  title: string;
  topic: string;
  link: string;
  external?: boolean;
}

export interface Project {
  title: string;
  description: string;
  link: string;
  tags: string[];
}

export interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  tags: string[];
}

export interface ContactDraft {
  name: string;
  email: string;
  message: string;
}
