import Image from "next/image";

export default function PaginationBar({
  page,
  totalPage,
  totalCount,
  onPrev,
  onNext,
}) {
  return (
    <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

      <p className="mb-0">
        Page <strong>{page}</strong> of <strong>{totalPage}</strong>
      </p>

      <small>Total: {totalCount}</small>

      <Image
        src='./images/icons/back.svg'
        width={10}
        height={10}
        alt="prev"
        className={page === 1 ? "mute" : ""}
        style={{ cursor: page === 1 ? "not-allowed" : "pointer" }}
        onClick={onPrev}
      />

      <Image
        src='./images/icons/Arrows-right.svg'
        width={29}
        height={29}
        alt="next"
        className={page === totalPage ? "mute" : ""}
        style={{ cursor: page === totalPage ? "not-allowed" : "pointer" }}
        onClick={onNext}
      />
    </div>
  );
}
