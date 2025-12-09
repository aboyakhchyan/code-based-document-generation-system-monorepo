"use client";

import React, { type Dispatch, type SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardClock,
  File,
  FileText,
  Files,
  LogOut,
  UserRoundPen,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button, cn, DynamicImage, Spinner } from "../ui";
import DoxBoxdIcon from "@assets/icons/DocBoxdBlue.png";
import { useAuth } from "@/hooks";

const NAV_ITEMS = [
  {
    to: "profile",
    label: "Անձնական տվյալներ",
    icon: <UserRoundPen size={20} />,
  },
  {
    to: "create/document",
    label: "Ստեղծել փաստաթուղթ",
    icon: <File size={20} />,
    children: [
      {
        label: "Շաբլոնների ցանկ",
        icon: <FileText size={20} />,
      },
    ],
  },
  {
    to: "my/documents",
    label: "Իմ փաստաթղթերը",
    icon: <Files size={20} />,
  },
  {
    to: "transaction/history",
    label: "Գործարքների պատմություն",
    icon: <ClipboardClock size={20} />,
  },
];

interface IVerticalNavBar {
  navOpen: boolean;
  onToggle: Dispatch<SetStateAction<boolean>>;
  onSetIsTemplatesModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const VerticalNavBar: React.FC<IVerticalNavBar> = ({ navOpen, onToggle, onSetIsTemplatesModalOpen }) => {
  const { logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split("/").slice(2).join("/");

  const handleToggle = () => {
    onToggle(!navOpen);
  };

  const handleModalsOpen = (subIndex: number) => {
    switch (subIndex) {
      case 1:
        onSetIsTemplatesModalOpen(true);
        break;
      default:
        return;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{ width: navOpen ? 300 : 80 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen flex flex-col bg-gray-50 border-r-1 border-gray-200 text-white rounded-r-3xl z-100 overflow-hidden"
    >
      <div className={cn("flex flex-row items-center justify-between gap-2 p-4", !navOpen && "flex-col-reverse")}>
        <div className="flex flex-row gap-2 items-center justify-center">
          <DynamicImage
            src={DoxBoxdIcon}
            alt={"DocBoxd"}
            className="w-10 h-10 bg-transparent"
            containerClassName="flex-shrink-0"
            lazy={true}
            objectFit="cover"
          />
          {navOpen && <h2 className="text-primary-800 font-urbanist">DocBoxd</h2>}
        </div>
        <button
          onClick={handleToggle}
          className="p-2 rounded-lg transition-colors cursor-pointer text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          aria-label={navOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {navOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {NAV_ITEMS.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = pathname === item.to || pathname.startsWith(item.to + "/");
          const isItemActive = pathname === item.to || pathname.startsWith(item.to + "/");

          return (
            <div key={index} className="flex flex-col gap-1">
              <NavLink
                to={item.to}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md transition-colors duration-300 text-primary-800 relative",
                  isItemActive && "bg-primary-800 text-white"
                )}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn("flex-shrink-0", isItemActive && "[&>svg]:text-white")}
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
                    "whitespace-nowrap text-sm font-medium overflow-hidden transition-opacity flex-1",
                    !navOpen && "hidden"
                  )}
                >
                  {item.label}
                </motion.span>

                {hasChildren && navOpen && (
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={16} className={cn("text-primary-800", isItemActive && "text-white")} />
                  </motion.div>
                )}
              </NavLink>
              {hasChildren && navOpen && (
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-1 pl-8 overflow-hidden"
                    >
                      {item.children?.map((child, subIndex) => (
                        <div
                          key={subIndex}
                          id={`sub_nav_item_${subIndex + 1}`}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-md transition-colors duration-300 text-primary-800 cursor-pointer"
                          )}
                          onClick={() => handleModalsOpen(subIndex + 1)}
                        >
                          <div className="flex-shrink-0">{child.icon}</div>
                          <span className="whitespace-nowrap text-sm font-medium">{child.label}</span>
                          <ChevronRight size={16} className="text-primary-800" />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <Button onClick={handleLogout} disabled={isLoggingOut} variant="secondary" className="w-full">
          {isLoggingOut ? <Spinner size="sm" /> : navOpen ? "Դուրս գալ" : <LogOut size={20} />}
        </Button>
      </div>
    </motion.aside>
  );
};
