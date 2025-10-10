'use client';
import React, { useCallback, SetStateAction, Dispatch } from 'react';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Input } from './input';

const PaginationCustom = ({
  currentPage,
  setCurrentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number | undefined;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      params.set('page', `${currentPage}`);
      return params.toString();
    },
    [searchParams, currentPage]
  );
  const handlePaginationCustom = (num: string) => {
    let destinationPage;
    if (totalPages && Math.ceil(parseInt(num, 10)) > totalPages) {
      destinationPage = totalPages;
    } else if (totalPages && Math.ceil(parseInt(num, 10)) < 1) {
      destinationPage = 1;
    } else {
      destinationPage = Math.ceil(parseInt(num, 10));
    }
    setCurrentPage(destinationPage);
  };
  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };
  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };
  return (
    <div className="flex items-center gap-6  mt-4">
      {/* <div className="flex items-center gap-2">
        <Button
          disabled={currentPage <= 1}
          variant="outline"
          size="sm"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4 " />
        </Button>
        <Button
          disabled={currentPage >= totalPages}
          variant="outline"
          size="sm"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div> */}
      <form>
        <div className="flex gap-3 items-center">
          <Input
            max={totalPages}
            min={1}
            type="number"
            value={currentPage}
            onChange={(e) => {
              handlePaginationCustom(e.target.value);
            }}
            className="w-[40px] text-center"
          />{' '}
          of {totalPages}
          <Button
            size="sm"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              router.push(
                pathname + '?' + createQueryString('page', `${currentPage}`)
              );
            }}
            variant="default"
          >
            Go
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaginationCustom;
