import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loader from "./Loader.jsx";

// Function to simulate data fetching with a delay
const simulateFetch = async () => {
    return new Promise((resolve) =>
        setTimeout(() => resolve('Fetched Data'), 200000)  // 2 seconds delay
    );
};

const RegionList = () => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedRegionIds, setSelectedRegionIds] = useState([]);

    // Use query to simulate data fetching with delay
    const { data, isLoading, isError } = useQuery({
        queryKey: ['regions'],
        queryFn: simulateFetch,
    });

    // Simulating loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center">
                <p>Error loading data!</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-xl font-semibold">Region List</h1>
            <p>{data}</p>  {/* Display fetched data */}
        </div>
    );
};

export default RegionList;
