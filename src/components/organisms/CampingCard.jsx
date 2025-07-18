import { HeartIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function CampingCard({ destination }) {
  const { image, title, description, rating, reviews, link, reviewsLink } =
    destination;

  const renderStars = () => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <>
        {[...Array(full)].map((_, i) => (
          <SolidStarIcon
            key={`full-${i}`}
            className="h-4 w-4 text-yellow-400"
          />
        ))}
        {half && (
          <SolidStarIcon className="h-4 w-4 text-yellow-400 opacity-50" />
        )}
        {[...Array(empty)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </>
    );
  };

  return (
    <div className="flex-shrink-0 rounded-2xl shadow bg-white overflow-hidden">
      <div className="relative">
        <img src={image} alt={title} className="h-48 w-full object-cover" />
        <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow">
          <HeartIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="p-4">
        <Link
          to={link}
          className="block text-lg font-semibold text-gray-900 mb-1"
        >
          {title}
        </Link>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <Link
          to={reviewsLink}
          className="flex items-center text-sm text-gray-700"
        >
          <span className="mr-1">{rating.toFixed(1)}</span>
          <span className="flex items-center">{renderStars()}</span>
          <span className="ml-2 text-gray-500">({reviews})</span>
        </Link>
      </div>
    </div>
  );
}
