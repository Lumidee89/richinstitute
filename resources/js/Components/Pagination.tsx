import { Link } from "@inertiajs/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
export type PaginationData = {
    current: number;
    last: number;
    total: number;
    previous: string | null;
    next: string | null;
};
export default function Pagination({ data }: { data?: PaginationData | null }) {
    return data && data.last > 1 ? (
        <nav className="pagination" aria-label="Pagination">
            {data.previous ? (
                <Link
                    href={data.previous}
                    className="button small outline"
                    preserveScroll
                >
                    <ArrowLeft size={15} />
                    Previous
                </Link>
            ) : (
                <span />
            )}
            <span>
                Page {data.current} of {data.last} · {data.total} records
            </span>
            {data.next ? (
                <Link
                    href={data.next}
                    className="button small outline"
                    preserveScroll
                >
                    Next
                    <ArrowRight size={15} />
                </Link>
            ) : (
                <span />
            )}
        </nav>
    ) : null;
}
