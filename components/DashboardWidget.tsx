import React from 'react';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  icon?: JSX.Element;
  bgColor?: string;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, value, icon, bgColor = 'bg-neutral-800' }) => {
  return (
    <div className={`${bgColor} p-5 rounded-2xl shadow-lg flex items-center gap-4`}>
      {icon && <div className="text-3xl">{icon}</div>}
      <div>
        <p className="text-neutral-400">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    </div>
  );
};

export default DashboardWidget;
