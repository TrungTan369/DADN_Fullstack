import * as Select from '@radix-ui/react-select';
import { ChevronDown } from "lucide-react";

export default function SelectBox({ label, value, onChange, options = [] }) {
    return (
        <div className="flex-1">
            {label && <label className="block mb-1">{label}</label>}
            <Select.Root value={value} onValueChange={onChange}>
                <Select.Trigger
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-gray-600 text-white border border-white text-sm"
                >
                    <Select.Value />
                    <Select.Icon>
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Select.Icon>

                </Select.Trigger>

                <Select.Content
                    className="w-[var(--radix-select-trigger-width)] z-50 bg-gray-700 text-white rounded-md shadow-lg"
                    position="popper"
                >
                    <Select.Viewport className="p-1">
                        {options.map((opt) => (
                            <Select.Item
                                key={opt}
                                value={opt}
                                className="px-3 py-2 rounded hover:bg-gray-500 cursor-pointer select-none"
                            >
                                <Select.ItemText>{opt}</Select.ItemText>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Root>
        </div>
    );
}
