export interface PageableResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
    };
    totalElements: number;
    totalPages: number;
}