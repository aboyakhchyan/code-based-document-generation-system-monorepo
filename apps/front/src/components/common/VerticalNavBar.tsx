"use client";

import { type Dispatch, type SetStateAction } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  FileUser,
  LogOut,
  MailPlus,
  UserRoundPen,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button, cn } from "../ui";

const NAV_ITEMS = [
  {
    to: "applications",
    label: "Գրանցման հայտեր",
    icon: <MailPlus size={20} />,
  },
  {
    to: "profile",
    label: "Անձնական տվյալներ",
    icon: <UserRoundPen size={20} />,
  },
  {
    to: "create/cv",
    label: "Ստեղծել ռեզյումե",
    icon: <FileUser size={20} />,
  },
];

interface IVerticalNavBar {
  navOpen: boolean;
  onToggle: Dispatch<SetStateAction<boolean>>;
}

export const VerticalNavBar: React.FC<IVerticalNavBar> = ({ navOpen, onToggle }) => {
  const handleToggle = () => {
    onToggle(!navOpen);
  };

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{ width: navOpen ? 280 : 80 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen flex flex-col  bg-gray-50 border-r-1 border-gray-200  text-white rounded-r-3xl  overflow-hidden"
    >
      <div className="flex justify-end p-4">
        <button onClick={handleToggle} className="p-2 rounded-lg transition-colors cursor-pointer text-gray-400">
          {navOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {NAV_ITEMS.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 p-2 rounded-md transition-colors duration-300 text-primary-800",
                isActive && "bg-primary-800 text-white"
              )
            }
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              {item.icon}
            </motion.div>

            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: navOpen ? 1 : 0,
                x: navOpen ? 0 : -10,
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "whitespace-nowrap text-sm font-medium overflow-hidden transition-opacity",
                !navOpen && "hidden"
              )}
            >
              {item.label}
            </motion.span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <Button variant="secondary" className="w-full">
          {navOpen ? " Դուրս գալ" : <LogOut size={20} />}
        </Button>
      </div>
    </motion.aside>
  );
};
