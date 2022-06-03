type ValidOpts = "id" | "title";

export type UrlParams = {
    readonly findBy: ValidOpts | null;
    readonly query: string | null;
}

export type Props = {
    readonly params: UrlParams,
    readonly setParams: React.Dispatch<React.SetStateAction<UrlParams>>,
}

const allKeys = <T extends ValidOpts[]>(
    ...array: T & ([ValidOpts] extends [T[number]] ? unknown : 'Missing some key(s)')
) => array;

export const is_opts = (x: unknown): x is ValidOpts => {
    return typeof x === "string" ? allKeys("id", "title").includes((x as any)) : false;
};
