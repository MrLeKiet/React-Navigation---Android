export interface CategoryObj {
    name: string;
    images: [string];
}

export interface UpdateCategory {
    name?: string;
    images?: [string];
}