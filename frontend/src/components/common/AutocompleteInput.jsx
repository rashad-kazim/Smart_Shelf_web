// src/components/common/AutocompleteInput.jsx

import React, { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AutocompleteInput = ({
  options = [],
  selected,
  setSelected,
  disabled = false,
  placeholder = "Select an option",
}) => {
  const [query, setQuery] = useState("");
  const { isDarkMode } = useAuth();

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const inputContainerClass = `relative w-full cursor-default overflow-hidden rounded-md text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 sm:text-sm border transition-colors ${
    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
  }`;
  const inputClass = `w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0 ${
    isDarkMode ? "bg-gray-700 text-white" : "text-gray-900"
  }`;
  const optionsContainerClass = `absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-20 ${
    isDarkMode ? "bg-gray-800" : "bg-white"
  }`;

  return (
    <Combobox value={selected} onChange={setSelected} disabled={disabled}>
      <div className="relative mt-1">
        <div className={inputContainerClass}>
          {/* DÜZELTME: Combobox.Input artık tüm alanı kaplıyor ve tıklandığında listeyi açıyor */}
          <Combobox.Input
            as="input"
            className={inputClass}
            displayValue={(option) => option || ""}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown
              className={`h-5 w-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}>
          <Combobox.Options className={optionsContainerClass}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-blue-600 text-white"
                        : isDarkMode
                        ? "text-gray-200"
                        : "text-gray-900"
                    }`
                  }
                  value={option}>
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}>
                        {option}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-blue-600"
                          }`}>
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            ) : (
              <div
                className={`relative cursor-default select-none px-4 py-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-700"
                }`}>
                {query === "" ? "Type to search..." : "Nothing found."}
              </div>
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default AutocompleteInput;
