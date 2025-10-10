import React from "react";
import {
  ChevronRight,
  Mail,
  Package,
  CheckCircle,
  Key,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface SectionButtonsProps {
  uniqueSections?: string[];
  selectedSection: string | null;
  toggleSection: (section: string) => void;
}

const predefinedSections = [
  "email",
  "product",
  "verification_code",
  "password_reset",
];

const getIconForSection = (section: string) => {
  switch (section.toLowerCase()) {
    case "email":
      return <Mail className="w-5 h-5" />;
    case "product":
      return <Package className="w-5 h-5" />;
    case "verification_code":
      return <CheckCircle className="w-5 h-5" />;
    case "password_reset":
      return <Key className="w-5 h-5" />;
    default:
      return <HelpCircle className="w-5 h-5" />;
  }
};

const formatSectionName = (section: string): string => {
  switch (section.toLowerCase()) {
    case "email":
      return "Email";
    case "product":
      return "Product";
    case "verification_code":
      return "Verification Code";
    case "password_reset":
      return "Password Reset";
    default:
      return section
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
};

const SectionButtons: React.FC<SectionButtonsProps> = ({
  uniqueSections,
  selectedSection,
  toggleSection,
}) => {
  const sectionsToRender = uniqueSections || predefinedSections;

  return (
    <div className="w-full md:w-72 bg-white p-6 rounded-xl shadow-lg">
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2> */}
      <div className="space-y-2">
        {sectionsToRender.map((section) => (
          <motion.button
            key={section}
            className={`w-full text-left p-3 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-between ${
              selectedSection === section
                ? "bg-gray-100 text-black  shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => toggleSection(section)}
            // whileHover={{ scale: 1.02 }}
            // whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              {getIconForSection(section)}
              <span className="text-xs md:text-sm">
                {formatSectionName(section)}
              </span>
            </div>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: selectedSection === section ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight
                className={`w-4 h-4 ${
                  selectedSection === section ? "text-black" : "text-gray-400"
                }`}
              />
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SectionButtons;
