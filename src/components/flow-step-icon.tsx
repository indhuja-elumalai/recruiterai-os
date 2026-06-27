import { FileText, Brain, Send, CheckCircle, Calendar, Mail, Users, Video, Award, UserCheck, Package, XCircle, Database, Clock } from "lucide-react";

interface FlowStepIconProps {
  step?: string;
  label?: string;
}

export function FlowStepIcon({ step, label }: FlowStepIconProps) {
  const text = step || label || "";
  
  const getIcon = () => {
    if (!text) return CheckCircle;
    
    const lowerStep = text.toLowerCase();
    
    if (lowerStep.includes("application")) return FileText;
    if (lowerStep.includes("ai") && lowerStep.includes("screening")) return Brain;
    if (lowerStep.includes("screening questions")) return Send;
    if (lowerStep.includes("score")) return Award;
    if (lowerStep.includes("schedule") || lowerStep.includes("interview")) return Calendar;
    if (lowerStep.includes("email")) return Mail;
    if (lowerStep.includes("talent pool")) return Database;
    if (lowerStep.includes("video")) return Video;
    if (lowerStep.includes("accepts")) return CheckCircle;
    if (lowerStep.includes("manager")) return Users;
    if (lowerStep.includes("hire")) return UserCheck;
    if (lowerStep.includes("offer") || lowerStep.includes("welcome")) return Package;
    if (lowerStep.includes("reject")) return XCircle;
    if (lowerStep.includes("wait")) return Clock;
    if (lowerStep.includes("re-engagement")) return Mail;
    if (lowerStep.includes("fast-track")) return Award;
    
    return CheckCircle;
  };

  const Icon = getIcon();
  const isDecision = text && text.includes("?");

  return (
    <div className={`
      w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg
      ${isDecision 
        ? "bg-gradient-to-br from-[#D0BCFF] to-[#B197FC] rotate-45" 
        : "bg-gradient-to-br from-[#3B82F6] to-[#2563EB]"
      }
    `}>
      <Icon className={`w-7 h-7 text-white ${isDecision ? "-rotate-45" : ""}`} />
    </div>
  );
}