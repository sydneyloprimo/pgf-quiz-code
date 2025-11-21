import { useSelect } from 'downshift'

import { cn } from '@/utils/cn'

type SelectOptionType = { label: string; value: string }

interface SelectProps {
  label?: string
  options: SelectOptionType[]
  onSelectedItemChange: (selectedItemValue: SelectOptionType) => void
  defaultSelectedItem: SelectOptionType
}

const Toast = ({
  label,
  options,
  defaultSelectedItem,
  onSelectedItemChange,
}: SelectProps) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    defaultSelectedItem: defaultSelectedItem,
    itemToString: (item) => (item ? item?.value : ''),
    items: options,
    onSelectedItemChange: ({ selectedItem }) =>
      onSelectedItemChange(selectedItem || defaultSelectedItem),
  })

  return (
    <div>
      <div className="w-44 flex flex-col gap-1 border border-gray-500 h-10 rounded px-3 py-2 bg-white cursor-pointer">
        {label && <label {...getLabelProps()}>{label}</label>}
        <div
          className="bg-white flex justify-between cursor-pointer"
          {...getToggleButtonProps()}
        >
          <span>{selectedItem?.label}</span>
        </div>
      </div>
      <ul
        className={`absolute w-44 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
          !isOpen && 'hidden'
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          options.map((item, index) => (
            <li
              className={cn(
                highlightedIndex === index && 'bg-blue-300',
                selectedItem === item && 'font-bold',
                'py-2 px-3 shadow-sm flex flex-col'
              )}
              key={item.value}
              {...getItemProps({ index, item })}
              data-qa="select-item"
            >
              <span>{item.label}</span>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default Toast
