import { useEffect, useState } from "react";

export const useFetchApi = () => {
    const [inputValue, setInputValue] = useState<number | null>(null);
    const [apiData, setApiData] = useState<any>(null);

    const fetchApi = async (id: number) => {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/todos/${id}`,
        );
        const data = await response.json();
        console.log(data);
        return data;
    };

    useEffect(() => {
        console.log("Component did mount");
        if (inputValue !== null) {
            fetchApi(inputValue).then((data) => {
                setApiData(data);
            });
        }
    }, [inputValue]);

    return { inputValue, setInputValue, apiData };
};
