import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { SvgIcon } from "./SvgIcon";
import HomeIcon from "/home.svg";
import OverviewIcon from "/overview.svg";
import InvoiceIcon from "/invoice.svg";
import BeneficiaryIcon from "/beneficiary.svg";
import HelpIcon from "/help.svg";
import SettingsIcon from "/settings.svg";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: "getting-started",
      icon: (props: any) => <SvgIcon src={HomeIcon} {...props} />,
      label: "Getting Started",
      to: "/dashboard/getting-started",
    },
    {
      id: "overview",
      icon: (props: any) => <SvgIcon src={OverviewIcon} {...props} />,
      label: "Overview",
      to: "/dashboard",
    },
    {
      id: "accounts",
      icon: (props: any) => <SvgIcon src={HomeIcon} {...props} />,
      label: "Accounts",
      to: "/dashboard/amount",
    },
    {
      id: "invoice",
      icon: (props: any) => <SvgIcon src={InvoiceIcon} {...props} />,
      label: "Invoice",
      to: "/dashboard/invoice",
    },
    {
      id: "beneficiary",
      icon: (props: any) => <SvgIcon src={BeneficiaryIcon} {...props} />,
      label: "Beneficiary Management",
      to: "/dashboard/beneficiary",
    },
    {
      id: "help",
      icon: (props: any) => <SvgIcon src={HelpIcon} {...props} />,
      label: "Help Center",
      to: "/dashboard/help",
    },
    {
      id: "settings",
      icon: (props: any) => <SvgIcon src={SettingsIcon} {...props} />,
      label: "Settings",
      to: "/dashboard/settings",
    },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" />
        </div>
        <button onClick={() => setIsOpen(true)}>
          <Menu className="w-7 h-7 text-gray-100" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden  md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" />
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.id}
                to={item.to}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? "bg-white text-gray-50 border-6 border-gray-300 rounded-full"
                    : "text-gray-100 hover:bg-gray-50 hover:text-gray-300"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className=" font-normal text-sm tracking-[0.0057em]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Sidebar (Slide-in) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 "
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Sidebar panel */}
          <div className="relative flex flex-col w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/logo.svg" />
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    onClick={() => setIsOpen(false)} // close menu on navigation
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-slate-100 text-gray-900"
                        : "text-gray-100 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
