type ValidOpts = "id" | "title";

export type UrlParams = {
    readonly findBy: ValidOpts | null;
    readonly query: string | null;
}

export type Props = {
    readonly params: UrlParams,
    readonly setParams: React.Dispatch<React.SetStateAction<UrlParams>>,
}

export const is_opts = (x: unknown): x is ValidOpts => {
    return typeof x === "string" ? Array<ValidOpts>("id", "title").includes((x as any)) : false;
};
