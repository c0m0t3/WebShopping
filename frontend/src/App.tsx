import { useFetchApi } from "./useFetchApi.ts";

export const App = () => {
    const { inputValue, setInputValue, apiData } = useFetchApi();
    return (
        <>
            <input
                value={inputValue ?? ""}
                onChange={(e) => {
                    setInputValue(Number(e.target.value));
                }}
            />
            <div>{inputValue === null ? "Kein Input" : `Input: ${inputValue}`}</div>
            <pre>{JSON.stringify(apiData, null, 2)}</pre>
        </>
    );
};

export default App;