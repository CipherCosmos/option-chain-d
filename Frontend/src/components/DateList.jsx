import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ToggleButton, TickerDropdown, Spinner } from "./Index";
import { useDispatch, useSelector } from "react-redux";
import { setExp_sid } from "../context/dataSlice";

export default function DateList() {
  const dispatch = useDispatch();

  // Theme state
  const theme = useSelector((state) => state.theme.theme);
  const dates = useSelector((state) => state.data.expDate);
  const selectedExpiry = useSelector((state) => state.data.exp_sid);  // Get the selected expiry

  useEffect(() => {
    if (dates && dates.length > 0) {
      dispatch(setExp_sid(dates[0]));
    }
  }, [dates, dispatch]);

  const formatTimestamps = (timestamps) => {
    if (!Array.isArray(timestamps)) {
      console.error('Expected timestamps to be an array but got:', timestamps);
      return [];
    }
    return timestamps.map((timestamp) => {
      try {
        const date = new Date(timestamp * 1000);
        const day = date.getUTCDate().toString().padStart(2, "0");
        const month = date.toLocaleString("en-US", {
          month: "short",
          timeZone: "UTC",
        });
        return `${day} ${month}`;
      } catch (error) {
        console.error('Error formatting timestamp:', timestamp, error);
        return 'Invalid Date';
      }
    });
  };

  const formattedDates = dates && Array.isArray(dates) ? formatTimestamps(dates) : [];
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDates = formattedDates.slice(startIndex, endIndex);

  // Function to handle date selection
  const handleDateSelect = (date, index) => {
    const selectedDate = dates[startIndex + index];
    dispatch(setExp_sid(selectedDate));
  };

  // Function to handle dropdown selection
  const handleDateDropdownSelect = (event) => {
    const selectedDate = parseInt(event.target.value);
    dispatch(setExp_sid(selectedDate));
  };

  const handleNext = () => {
    if (endIndex < formattedDates.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div
      className={`p-1 z-20 shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} flex flex-col md:flex-row items-center justify-between md:space-x-4 space-y-1 md:space-y-0`}
    >
      {dates ? (
        <>
          {/* Mobile dropdown */}
          <select
            value={selectedExpiry}
            onChange={handleDateDropdownSelect}
            className={`w-full md:hidden p-2 rounded-lg ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300"
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {dates.map((date, index) => (
              <option key={date} value={date}>
                {formatTimestamps([date])[0]}
              </option>
            ))}
          </select>

          {/* Desktop date list */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } ${
                currentPage === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex space-x-2">
              {currentDates.map((formattedDate, index) => {
                const currentDate = dates[startIndex + index];
                const isSelected = currentDate === selectedExpiry;
                return (
                  <button
                    key={currentDate}
                    onClick={() => handleDateSelect(formattedDate, index)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      theme === "dark"
                        ? isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800 hover:bg-gray-100"
                    } ${
                      isSelected
                        ? "ring-2 ring-blue-400"
                        : "border border-transparent"
                    }`}
                  >
                    {formattedDate}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(Math.ceil(dates.length / itemsPerPage) - 1, currentPage + 1))
              }
              disabled={endIndex >= formattedDates.length}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } ${
                endIndex >= formattedDates.length
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Ticker Dropdown */}
          <div className="w-40 mt-4">
            <TickerDropdown />
          </div>

          {/* Pagination and Toggle */}
          <div className="flex flex-col items-center space-x-4 mt-4 md:mt-0 sm:flex sm:items-center justify-between w-full md:w-auto">
            <ToggleButton />
          </div>
        </>
      ) : (
        <div className="w-full flex justify-center p-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}
