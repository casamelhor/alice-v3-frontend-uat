import Image from "next/image";

const TOTAL_STARS = 5;
export default function StarRating({ rating = 0 }) {
// const StarRating = ({ rating = 0 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = TOTAL_STARS - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <ul className="d-flex ps-0 gap-2 mb-0">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <li key={`full-${i}`}>
          <Image
            src="/images/icons/Star.svg"
            width={14}
            height={14}
            alt="star"
          />
        </li>
      ))}

      {/* Half star (optional – only if you have an icon) */}
      {hasHalfStar && (
        <li>
          <Image
            src="/images/icons/half-star.svg" // optional
            width={14}
            height={14}
            alt="half star"
          />
        </li>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <li key={`empty-${i}`}>
          <Image
            src="/images/icons/star-light.svg"
            width={14}
            height={14}
            alt="star"
          />
        </li>
      ))}
    </ul>
  );
};

