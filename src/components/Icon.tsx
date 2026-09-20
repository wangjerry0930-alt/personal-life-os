import {
  ArrowDown,ArrowLeft,ArrowRight,ArrowUpRight,Bell,Bookmark,BookOpen,CalendarDays,CalendarPlus,Camera,ChartNoAxesCombined,Check,CheckCircle2,ChevronDown,Circle,CircleDot,CircleHelp,Clock3,Cloud,Code2,Compass,Database,Download,Eye,FileText,Flame,FolderKanban,Gift,GitBranch,GraduationCap,History,ImagePlus,Info,Languages,LayoutDashboard,Library,LibraryBig,Menu,MessageCircle,Minus,Moon,MoreHorizontal,NotebookPen,Palette,Pause,Play,PlayCircle,Plus,Quote,RefreshCw,Repeat2,Save,Search,Settings,Share2,ShieldAlert,Shuffle,SlidersHorizontal,Sparkles,Square,Star,Sun,Target,Upload,Users,Utensils,WandSparkles,Wrench,X,Zap,
  type LucideProps
} from 'lucide-react';
import type { ComponentType } from 'react';

const icons={ArrowDown,ArrowLeft,ArrowRight,ArrowUpRight,Bell,Bookmark,BookOpen,CalendarDays,CalendarPlus,Camera,ChartNoAxesCombined,Check,CheckCircle2,ChevronDown,Circle,CircleDot,CircleHelp,Clock3,Cloud,Code2,Compass,Database,Download,Eye,FileText,Flame,FolderKanban,Gift,GitBranch,GraduationCap,History,ImagePlus,Info,Languages,LayoutDashboard,Library,LibraryBig,Menu,MessageCircle,Minus,Moon,MoreHorizontal,NotebookPen,Palette,Pause,Play,PlayCircle,Plus,Quote,RefreshCw,Repeat2,Save,Search,Settings,Share2,ShieldAlert,Shuffle,SlidersHorizontal,Sparkles,Square,Star,Sun,Target,Upload,Users,Utensils,WandSparkles,Wrench,X,Zap} as const;

export type IconName=keyof typeof icons;
export default function Icon({name,...props}:{name:keyof typeof import('lucide-react')}&LucideProps){
  const Component=(icons as Record<string,ComponentType<LucideProps>>)[name]||CircleHelp;
  return <Component {...props}/>;
}
