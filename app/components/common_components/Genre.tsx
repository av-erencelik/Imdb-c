import { Link } from "@remix-run/react";

const Genre = ({ genre, length, index }: { genre: { id: string; name: string }; length: number; index: number }) => {
  return (
    <div key={genre.id}>
      <Link to={`/movies/${genre.name}`} className="remix-link">
        {genre.name}
      </Link>
      {index !== length - 1 && <span style={{ marginRight: "5px" }}>{" - "}</span>}
    </div>
  );
};

export default Genre;
