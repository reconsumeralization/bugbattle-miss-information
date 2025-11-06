import React, { useState, useEffect } from 'react';
import { ChecklistItemType } from '../../types';
import { Card } from '../common/Card'; 

interface ChecklistItemProps {
  item: ChecklistItemType;
  level?: number;
  onToggle?: (id: string, checked: boolean) => void; 
  initialCheckedState?: Record<string, boolean>; 
}

const CheckboxItem: React.FC<ChecklistItemProps> = ({ item, level = 0, onToggle, initialCheckedState }) => {
  const [isChecked, setIsChecked] = useState(item.initialStatus || (initialCheckedState ? initialCheckedState[item.id] : false));

  useEffect(() => {
    if (initialCheckedState && initialCheckedState[item.id] !== undefined) {
      setIsChecked(initialCheckedState[item.id]);
    } else {
      setIsChecked(item.initialStatus || false);
    }
  }, [initialCheckedState, item.id, item.initialStatus]);


  const handleToggle = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onToggle) {
      onToggle(item.id, newCheckedState);
    }
  };

  return (
    <li className="mb-2 checklist-item" data-checklist-level={level}>
      <div className="flex items-start">
        <input
          id={'checklist-item-' + item.id}
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          className="h-4 w-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-offset-surface mt-0.5 mr-2 flex-shrink-0"
          aria-labelledby={'checklist-label-' + item.id}
        />
        <label htmlFor={'checklist-item-' + item.id} id={'checklist-label-' + item.id} className="text-sm text-on-surface select-none">
          {item.text}
        </label>
      </div>
      {item.notes && (
        <div className="ml-6 mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md">
            <p className="text-xs text-on-surface-muted whitespace-pre-wrap font-mono">{item.notes}</p>
        </div>
      )}
      {item.subItems && item.subItems.length > 0 && (
        <ul className="mt-1">
          {item.subItems.map(subItem => (
            <CheckboxItem key={subItem.id} item={subItem} level={level + 1} onToggle={onToggle} initialCheckedState={initialCheckedState}/>
          ))}
        </ul>
      )}
    </li>
  );
};


interface ChecklistDisplayProps {
  items: ChecklistItemType[];
  title?: string;
}

export const ChecklistDisplay: React.FC<ChecklistDisplayProps> = ({ items, title }) => {
  return (
    <Card title={title || "Checklist"} className="max-h-[600px] overflow-y-auto">
      {items.length === 0 ? (
        <p className="text-on-surface-muted">No checklist items available.</p>
      ) : (
        <ul className="space-y-2">
          {items.map(item => (
            <CheckboxItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </Card>
  );
};
