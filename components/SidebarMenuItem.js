export default function SidebarMenuItem({ text, Icon, active }) {
  return (
    <div className="hoverEffect flex items-center text-gray-700 lg:justify-center justify-start xl:justify-start text-lg space-x-3">
      <Icon className="h-7" />
      <span
        className={`${
          active && "font-bold"
        } lg:hidden xl:inline mdlg:inline hidden`}
      >
        {text}
      </span>
    </div>
  );
}
