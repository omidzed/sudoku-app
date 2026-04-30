export const fetchSudoku = async () => {
    const res = await fetch("https://api.api-ninjas.com/v1/sudokugenerate?difficulty=medium", {
        method: "GET",
        headers: {
            "X-Api-Key": import.meta.env.VITE_API_KEY as string,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch Sudoku");
    } else { console.log("Sudoku fetched successfully") }

    return res.json();
};