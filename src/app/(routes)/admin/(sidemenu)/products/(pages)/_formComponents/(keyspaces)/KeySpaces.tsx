import React, { useState, useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { formSchema } from "../../add/page";
import { z } from "zod";
import { Pencil, X, Save, Trash2, Plus } from "lucide-react";

const KeySpaces = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { control, setValue } = form;

  // Watching 'keySpecs' field for the changes
  const keySpecs = useWatch({ control, name: "keySpecs" }) || [];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState<string>("");
  const handleDelete = (index: number) => {
    const newKeySpecs = [...keySpecs];
    newKeySpecs.splice(index, 1);
    setValue("keySpecs", newKeySpecs);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValues([...(keySpecs[index].value || [])]);
  };

  const saveEditing = () => {
    if (editingIndex !== null) {
      const newKeySpecs = [...keySpecs];
      newKeySpecs[editingIndex] = {
        ...newKeySpecs[editingIndex],
        value: editValues,
      };
      setValue("keySpecs", newKeySpecs);
      setEditingIndex(null);
    }
  };

  const updateEditValue = (valueIndex: number, newValue: string) => {
    const newValues = [...editValues];
    newValues[valueIndex] = newValue;
    setEditValues(newValues);
  };

  const removeEditValue = (valueIndex: number) => {
    const newValues = [...editValues];
    newValues.splice(valueIndex, 1);
    setEditValues(newValues);
  };

  const addNewValue = () => {
    if (newValue) {
      setEditValues([...editValues, newValue]);
      setNewValue(""); // Clear the input after adding
    }
  };

  return (
    <div className="w-full mt-8 rounded-md p-4 border">
      <h3 className="font-semibold text-xl mb-3">Key Specs</h3>

      {keySpecs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keySpecs.map((keySpace, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-md border relative"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Key Specs #{index + 1}</p>
                <div className="flex gap-2">
                  {editingIndex === index ? (
                    <button
                      type="button" // Prevent form submission on click
                      onClick={saveEditing}
                      className="p-1 bg-blue-100 rounded-full hover:bg-blue-200"
                      aria-label="Save"
                    >
                      <Save size={16} />
                    </button>
                  ) : (
                    <button
                      type="button" // Prevent form submission on click
                      onClick={() => startEditing(index)}
                      className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  <button
                    type="button" // Prevent form submission on click
                    onClick={() => handleDelete(index)}
                    className="p-1 bg-red-100 rounded-full hover:bg-red-200"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-base text-gray-700">
                Key:{" "}
                <span className="font-medium">
                  {keySpace.key || "Not selected"}
                </span>
              </p>

              {editingIndex === index ? (
                <div className="mt-2">
                  <p className="text-sm text-gray-700 mb-1">Values:</p>
                  <div className="space-y-2">
                    {editValues.map((value, vIndex) => (
                      <div key={vIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => {
                            e.preventDefault();
                            updateEditValue(vIndex, e.target.value);
                          }}
                          className="flex-1 text-sm border rounded px-2 py-1"
                        />
                        <button
                          type="button" // Prevent form submission on click
                          onClick={(e) => {
                            e.preventDefault();
                            removeEditValue(vIndex);
                          }}
                          className="p-1 bg-red-100 rounded-full hover:bg-red-200"
                          aria-label="Remove value"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="flex-1 text-sm border rounded px-2 py-1"
                        placeholder="Add new value"
                      />
                      <button
                        type="button" // Prevent form submission on click
                        onClick={addNewValue}
                        className="p-1 bg-green-200 rounded-full hover:bg-green-200"
                        aria-label="Add new value"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {keySpace.value && keySpace.value.length > 0 ? (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">Values:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {keySpace.value.map((value, vIndex) => (
                          <span
                            key={vIndex}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      No values selected
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No key spaces added yet</p>
      )}
    </div>
  );
};

export default KeySpaces;
