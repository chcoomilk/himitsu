export enum SearchOptions {
    ID,
    Title,
}

export const parseStringToSearchOptionEnum = (str: string): SearchOptions | null => {
    switch (str.toLowerCase()) {
        case "id":
            return SearchOptions.ID;
        case "title":
            return SearchOptions.Title;
        default:
            return null;
    }
};
